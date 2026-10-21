/**
 * @Author: XiaoMao
 * 每日早报
 * 天气 + 节假日倒计时 + 摸鱼进度 + 每日一句
 *
 * [task_local]
 * 30 8 * * * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/daily_brief.js, tag=每日早报, enabled=true
 *
 * 说明：
 * 1. 零依赖，直接可用，修改下方 CONFIG 即可
 * 2. 天气多源兜底，失败自动降级，不影响其余内容
 * 3. holidays 里春节/端午/中秋为农历节日，每年需手动更新日期
 *
 */

const CONFIG = {
  city: '北京', // 城市，如：上海、广州、深圳、成都
  showWeather: true, // 天气
  showHoliday: true, // 节假日倒计时
  showMoyu: true, // 摸鱼进度
  showQuote: true, // 每日一句

  // 法定节假日 [名称, 日期]，过期的自动忽略
  holidays: [
    ['元旦', '2027-01-01'],
    ['春节', '2027-02-06'],
    ['清明节', '2027-04-05'],
    ['劳动节', '2027-05-01'],
    ['端午节', '2027-06-09'],
    ['中秋节', '2027-09-15'],
    ['国庆节', '2027-10-01'],
  ],

  workStart: 9, // 工作开始时间，用于计算摸鱼进度
  workEnd: 18, // 工作结束时间
};

//-------------------- 工具 -------------------------------------

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function fmtDate(d) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function dayDiff(target, from) {
  const a = new Date(fmtDate(from) + 'T00:00:00');
  const b = new Date(fmtDate(target) + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}

// 带超时的 GET，避免单次任务超过 QX 10 秒上限
function httpGet(url, timeout) {
  return new Promise((resolve, reject) => {
    let done = false;
    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        reject(new Error('timeout'));
      }
    }, timeout || 6000);
    $task
      .fetch({ url: url, method: 'GET', opts: { redirection: true } })
      .then((r) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve(r);
      })
      .catch((e) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        reject(e);
      });
  });
}

function bar(pct, len) {
  len = len || 10;
  pct = Math.max(0, Math.min(100, pct));
  const filled = Math.round((pct / 100) * len);
  return '█'.repeat(filled) + '░'.repeat(len - filled) + ' ' + Math.floor(pct) + '%';
}

//-------------------- 天气 -------------------------------------

async function getWeather(city) {
  const sources = [
    async () => {
      const r = await httpGet(
        'https://api.vvhan.com/api/weather?city=' + encodeURIComponent(city)
      );
      const j = JSON.parse(r.body);
      if (j && j.code === 200 && j.data) {
        return {
          type: j.data.type || j.data.weather || '',
          low: String(j.data.low || '').replace(/[^\d-]/g, ''),
          high: String(j.data.high || '').replace(/[^\d-]/g, ''),
          tip: j.data.tip || '',
          fx: j.data.fengxiang || '',
          fl: j.data.fengli || '',
        };
      }
      return null;
    },
    async () => {
      const r = await httpGet(
        'https://wttr.in/' + encodeURIComponent(city) + '?format=j1'
      );
      const j = JSON.parse(r.body);
      const c = j.current_condition && j.current_condition[0];
      if (!c) return null;
      const desc =
        c.lang_zh && c.lang_zh[0] ? c.lang_zh[0].value : c.weatherDesc[0].value;
      return {
        type: desc,
        low: j.weather[0].mintempC,
        high: j.weather[0].maxtempC,
        tip: '',
        fx: c.winddir16Point,
        fl: c.windspeedKmph + 'km/h',
      };
    },
  ];

  for (const fn of sources) {
    try {
      const res = await fn();
      if (res && res.type) return res;
    } catch (e) {
      console.log('天气源失败：' + e);
    }
  }
  return null;
}

//-------------------- 节假日 -------------------------------------

function getNextHoliday() {
  const now = new Date();
  const today = new Date(fmtDate(now) + 'T00:00:00');
  let best = null;
  for (const h of CONFIG.holidays) {
    const d = new Date(h[1] + 'T00:00:00');
    if (d >= today && (!best || d < best.date)) {
      best = { name: h[0], date: d };
    }
  }
  return best;
}

//-------------------- 摸鱼 -------------------------------------

function getMoyu() {
  const now = new Date();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;

  let toWeekend;
  if (isWeekend) toWeekend = 0;
  else toWeekend = 6 - day;

  const mStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const mEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthPct = ((now - mStart) / (mEnd - mStart)) * 100;

  const yStart = new Date(now.getFullYear(), 0, 1);
  const yEnd = new Date(now.getFullYear() + 1, 0, 1);
  const yearPct = ((now - yStart) / (yEnd - yStart)) * 100;

  const dStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayPct = ((now - dStart) / 86400000) * 100;

  const wStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), CONFIG.workStart, 0, 0);
  const wEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), CONFIG.workEnd, 0, 0);
  let workPct;
  if (now < wStart) workPct = 0;
  else if (now > wEnd) workPct = 100;
  else workPct = ((now - wStart) / (wEnd - wStart)) * 100;

  let offWork;
  if (isWeekend) offWork = '周末模式，尽情摸 🐟';
  else if (now > wEnd) offWork = '已下班';
  else {
    const left = Math.floor((wEnd - now) / 60000);
    offWork = '距下班 ' + Math.floor(left / 60) + ' 小时 ' + (left % 60) + ' 分';
  }

  return {
    isWeekend: isWeekend,
    toWeekend: toWeekend,
    monthPct: monthPct,
    yearPct: yearPct,
    dayPct: dayPct,
    workPct: workPct,
    offWork: offWork,
  };
}

//-------------------- 每日一句 -------------------------------------

async function getQuote() {
  const sources = [
    async () => {
      const r = await httpGet(
        'https://v1.hitokoto.cn/?encode=json&charset=utf-8'
      );
      const j = JSON.parse(r.body);
      if (j && j.hitokoto) {
        return { text: j.hitokoto, from: j.from || j.from_who || '' };
      }
      return null;
    },
  ];
  for (const fn of sources) {
    try {
      const res = await fn();
      if (res && res.text) return res;
    } catch (e) {}
  }
  return null;
}

//-------------------- 主流程 -------------------------------------

(async () => {
  const now = new Date();
  const lines = [];

  lines.push(
    now.getMonth() + 1 + '月' + now.getDate() + '日 周' + '日一二三四五六'.charAt(now.getDay())
  );

  if (CONFIG.showWeather) {
    const w = await getWeather(CONFIG.city);
    if (w) {
      const range = w.low && w.high ? ' ' + w.low + '~' + w.high + '℃' : '';
      lines.push('');
      lines.push('【天气】' + CONFIG.city + ' ' + w.type + range);
      if (w.fx) lines.push('  ' + w.fx + ' ' + w.fl);
      if (w.tip) lines.push('  ' + w.tip);
    }
  }

  if (CONFIG.showHoliday) {
    const h = getNextHoliday();
    if (h) {
      const d = dayDiff(h.date, now);
      lines.push('');
      lines.push('【假期】距' + h.name + '还有 ' + d + ' 天');
      if (d > 0 && d <= 3) lines.push('  快了快了，再坚持一下');
      if (d === 0) lines.push('  就是今天！节日快乐');
    }
  }

  if (CONFIG.showMoyu) {
    const m = getMoyu();
    lines.push('');
    lines.push('【摸鱼】' + m.offWork);
    lines.push('  本月 ' + bar(m.monthPct));
    lines.push('  本年 ' + bar(m.yearPct));
    lines.push('  今日 ' + bar(m.dayPct));
    if (!m.isWeekend) lines.push('  工作 ' + bar(m.workPct));
    if (m.toWeekend > 0) lines.push('  距周末 ' + m.toWeekend + ' 天');
  }

  if (CONFIG.showQuote) {
    const q = await getQuote();
    if (q) {
      lines.push('');
      lines.push('【一句】' + q.text);
      if (q.from) lines.push('  —— ' + q.from);
    }
  }

  $notify('每日早报', '', lines.join('\n'));
})()
  .then(() => $done())
  .catch((e) => {
    $notify('每日早报', '', '执行出错：' + e);
    $done();
  });
