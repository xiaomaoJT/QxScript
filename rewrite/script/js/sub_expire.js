/**
 * @Author: XiaoMao
 * 订阅到期管家
 * 域名 / 服务器 / 各类会员到期提醒，防止忘续费导致服务中断
 *
 * [task_local]
 * 0 9 * * * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/sub_expire.js, tag=订阅提醒, enabled=true
 *
 * 说明：
 * 1. 零依赖，修改下方 SUBS 即可
 * 2. 阶梯提醒：自定义天数 + 7/3/1/0 天，过期后每 7 天提醒一次
 * 3. 同一天同一进度只提醒一次，不会反复打扰
 * 4. 每年 12 月 1 日自动推送年度订阅汇总
 *
 */

const SUBS = [
  // name 名称 / expire 到期日(YYYY-MM-DD) / warnDays 提前几天开始提醒 / price 年费(元) / note 备注
  { name: '域名 xxxx.com', expire: '2027-03-15', warnDays: 14, price: 75, note: '腾讯云' },
  { name: '服务器 A', expire: '2026-12-01', warnDays: 14, price: 300, note: '阿里云 ECS' },
  { name: '域名 2 yyyy.com', expire: '2027-08-20', warnDays: 30, price: 60, note: 'Cloudflare' },
  { name: '视频会员', expire: '2026-11-20', warnDays: 3, price: 238, note: '自动续费，记得关' },
  { name: 'iCloud+', expire: '2027-01-10', warnDays: 7, price: 816, note: '' },
];

const CONFIG = {
  yearlySummary: true, // 12 月 1 日推送年度汇总
  showOkList: false, // 提醒时是否顺带列出「还早」的订阅
};

//-------------------- 工具 -------------------------------------

const STORE_KEY = 'subExpireState';

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function fmtDate(d) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function readState() {
  try {
    const raw = $prefs.valueForKey(STORE_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw);
    return o && typeof o === 'object' ? o : {};
  } catch (e) {
    return {};
  }
}

function writeState(s) {
  try {
    $prefs.setValueForKey(JSON.stringify(s), STORE_KEY);
  } catch (e) {
    console.log('写入状态失败：' + e);
  }
}

// 今天是否已就某个进度提醒过
function alreadyNotified(state, name, daysLeft) {
  const stamp = fmtDate(new Date()) + ':' + daysLeft;
  return state[name] === stamp;
}

function markNotified(state, name, daysLeft) {
  state[name] = fmtDate(new Date()) + ':' + daysLeft;
}

//-------------------- 主流程 -------------------------------------

(function () {
  const now = new Date();
  const today = new Date(fmtDate(now) + 'T00:00:00');
  const state = readState();
  const urgent = [];
  const soon = [];
  const ok = [];
  let changed = false;

  SUBS.forEach((s) => {
    if (!s.name || !s.expire) return;
    const exp = new Date(s.expire + 'T00:00:00');
    const daysLeft = Math.round((exp - today) / 86400000);

    const item = {
      name: s.name,
      expire: s.expire,
      daysLeft: daysLeft,
      note: s.note || '',
      price: s.price || 0,
      warnDays: s.warnDays || 7,
    };

    if (daysLeft < 0) {
      item.expired = true;
      urgent.push(item);
    } else if (daysLeft === 0) {
      item.today = true;
      urgent.push(item);
    } else if (daysLeft <= item.warnDays) {
      urgent.push(item);
    } else if (daysLeft <= 60) {
      soon.push(item);
    } else {
      ok.push(item);
    }
  });

  // 决定哪些需要真的推送（关键节点 + 去重）
  const KEY_DAYS = [0, 1, 3, 7, 14, 30];
  const toPush = [];

  urgent.forEach((it) => {
    let hit = false;
    if (it.expired) {
      // 过期后每 7 天提醒一次
      hit = Math.abs(it.daysLeft) % 7 === 0;
    } else {
      // 关键天数，或距离用户设定的预警线只差 1 天内
      hit = KEY_DAYS.indexOf(it.daysLeft) >= 0 || it.daysLeft === it.warnDays;
    }
    if (hit && !alreadyNotified(state, it.name, it.daysLeft)) {
      toPush.push(it);
      markNotified(state, it.name, it.daysLeft);
      changed = true;
    }
  });

  if (changed) writeState(state);

  // 12 月 1 日年度汇总
  if (CONFIG.yearlySummary && now.getMonth() === 11 && now.getDate() === 1) {
    const key = 'yearlySummary_' + now.getFullYear();
    if (state[key] !== fmtDate(now)) {
      state[key] = fmtDate(now);
      writeState(state);
      const total = SUBS.reduce((sum, s) => sum + (s.price || 0), 0);
      const lines = [];
      lines.push('订阅总数：' + SUBS.length + ' 个');
      lines.push('年度支出合计：¥' + total.toFixed(2));
      lines.push('');
      SUBS.slice()
        .sort((a, b) => (a.expire < b.expire ? -1 : 1))
        .forEach((s) => {
          const d = Math.round(
            (new Date(s.expire + 'T00:00:00') - today) / 86400000
          );
          lines.push(
            '· ' + s.name + '  ¥' + (s.price || 0) + '  ' + (d < 0 ? '已过期' : '剩 ' + d + ' 天')
          );
        });
      $notify('订阅年度汇总 ' + now.getFullYear(), '', lines.join('\n'));
      $done();
      return;
    }
  }

  if (!toPush.length) {
    // 没有需要提醒的，静默结束（不打扰）
    $done();
    return;
  }

  // 组装通知
  const lines = [];
  toPush.forEach((it) => {
    let tag;
    if (it.expired) tag = '已过期 ' + Math.abs(it.daysLeft) + ' 天';
    else if (it.today) tag = '今天到期';
    else tag = '还有 ' + it.daysLeft + ' 天';
    lines.push((it.expired ? '🔴 ' : '⚠️ ') + it.name);
    lines.push('   ' + tag + '（' + it.expire + '）');
    if (it.note) lines.push('   ' + it.note);
    if (it.price) lines.push('   ¥' + it.price.toFixed(2));
    lines.push('');
  });

  if (CONFIG.showOkList && ok.length) {
    lines.push('其他 ' + ok.length + ' 项暂不需要处理');
  }

  $notify('订阅到期提醒', toPush.length + ' 项待处理', lines.join('\n').trim());
  $done();
})();
