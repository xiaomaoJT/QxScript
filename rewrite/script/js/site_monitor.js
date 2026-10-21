/**
 * @Author: XiaoMao
 * 网站宕机监控
 * 定时探测网站可用性，故障时主动报警，恢复时通知
 *
 * [task_local]
 * *\/10 * * * * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/site_monitor.js, tag=网站监控, enabled=true
 *
 * 说明：
 * 1. 零依赖，修改下方 SITES 即可
 * 2. 判定失败：网络异常 / 超时 / 状态码 >= 400 / 页面缺失关键词
 * 3. 连续失败 failThreshold 次才报警，避免网络抖动误报
 * 4. 恢复时会发一条通知，故障时长一并给出
 * 5. 依赖 QX 定时任务，需保持 App 在后台存活
 *
 */

const SITES = [
  // name 名称 / url 地址 / keyword 页面必须包含的关键词（可留空，防劫持用）
  { name: '博客', url: 'https://blog.example.com', keyword: 'example' },
  { name: '自建服务', url: 'https://status.example.com', keyword: '' },
];

const CONFIG = {
  failThreshold: 2, // 连续失败几次才判定宕机（避免抖动误报）
  timeout: 6000, // 单次请求超时（毫秒），注意 QX 单任务 10 秒上限
  notifyRecover: true, // 恢复时是否通知
  quietHours: [1, 6], // 免打扰时段 [开始, 结束]，此区间内不推送（仅记录）
};

//-------------------- 工具 -------------------------------------

const STORE_KEY = 'siteMonitorState';

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function fmtTime(ts) {
  const d = new Date(ts);
  return (
    d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
    ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
  );
}

function durationStr(ms) {
  const m = Math.floor(ms / 60000);
  if (m < 60) return m + ' 分钟';
  const h = Math.floor(m / 60);
  return h + ' 小时 ' + (m % 60) + ' 分';
}

function inQuietHours() {
  const h = new Date().getHours();
  const a = CONFIG.quietHours[0];
  const b = CONFIG.quietHours[1];
  if (a === b) return false;
  if (a < b) return h >= a && h < b;
  return h >= a || h < b; // 跨午夜
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

// 带超时的探测
function probe(site) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (r) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(r);
    };
    const timer = setTimeout(() => finish({ ok: false, reason: '超时 ' + CONFIG.timeout + 'ms' }), CONFIG.timeout);

    $task
      .fetch({ url: site.url, method: 'GET', opts: { redirection: true } })
      .then((r) => {
        if (settled) return;
        const code = r.statusCode || (r.response && r.response.status) || 0;
        if (code >= 400) {
          finish({ ok: false, reason: 'HTTP ' + code });
          return;
        }
        if (site.keyword) {
          const body = String(r.body || '');
          if (body.indexOf(site.keyword) < 0) {
            finish({ ok: false, reason: '页面内容异常（疑似被劫持）' });
            return;
          }
        }
        finish({ ok: true, code: code });
      })
      .catch((e) => {
        finish({ ok: false, reason: String(e && e.message ? e.message : e).slice(0, 40) });
      });
  });
}

//-------------------- 主流程 -------------------------------------

(async () => {
  const state = readState();
  const now = Date.now();
  const events = [];
  let changed = false;

  for (const site of SITES) {
    if (!site || !site.url) continue;
    const key = site.url;
    const st = state[key] || { fail: 0, down: false, downSince: 0, lastOk: now };
    const r = await probe(site);

    if (r.ok) {
      st.lastOk = now;
      if (st.down) {
        st.down = false;
        events.push({
          type: 'recover',
          name: site.name,
          url: site.url,
          downSince: st.downSince,
        });
      }
      st.fail = 0;
      st.downSince = 0;
    } else {
      st.fail = (st.fail || 0) + 1;
      if (st.fail >= CONFIG.failThreshold && !st.down) {
        st.down = true;
        st.downSince = now;
        events.push({
          type: 'down',
          name: site.name,
          url: site.url,
          reason: r.reason,
        });
      }
    }
    state[key] = st;
    changed = true;
  }

  if (changed) writeState(state);

  if (!events.length) {
    $done();
    return;
  }

  const quiet = inQuietHours();
  const downs = events.filter((e) => e.type === 'down');
  const recovers = events.filter((e) => e.type === 'recover');

  if (quiet) {
    // 免打扰时段只记录日志，不推送
    console.log(
      '网站监控：' +
        JSON.stringify(events.map((e) => e.name + ' ' + e.type))
    );
    $done();
    return;
  }

  const lines = [];
  downs.forEach((e) => {
    lines.push('🔴 ' + e.name + ' 可能已宕机');
    lines.push('   ' + e.url);
    lines.push('   原因：' + e.reason);
    lines.push('');
  });
  recovers.forEach((e) => {
    lines.push('🟢 ' + e.name + ' 已恢复');
    lines.push('   ' + e.url);
    lines.push('   故障时长：' + durationStr(Date.now() - e.downSince));
    lines.push('');
  });

  $notify(
    '网站监控',
    downs.length ? downs.length + ' 个故障' : recovers.length + ' 个恢复',
    lines.join('\n').trim()
  );
  $done();
})().then(() => $done()).catch((e) => {
  $notify('网站监控', '', '执行出错：' + e);
  $done();
});
