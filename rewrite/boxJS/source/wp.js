function ENV() {
  const e = "function" == typeof require && "undefined" != typeof $jsbox;
  return {
    isQX: "undefined" != typeof $task,
    isLoon: "undefined" != typeof $loon,
    isSurge: "undefined" != typeof $httpClient && "undefined" == typeof $loon,
    isBrowser: "undefined" != typeof document,
    isNode: "function" == typeof require && !e,
    isJSBox: e,
    isRequest: "undefined" != typeof $request,
    isScriptable: "undefined" != typeof importModule,
  };
}
function HTTP(e = { baseURL: "" }) {
  function t(t, a) {
    a = "string" == typeof a ? { url: a } : a;
    const h = e.baseURL;
    h && !d.test(a.url || "") && (a.url = h ? h + a.url : a.url),
      a.body &&
        a.headers &&
        !a.headers["Content-Type"] &&
        (a.headers["Content-Type"] = "application/x-www-form-urlencoded"),
      (a = { ...e, ...a });
    const c = a.timeout,
      l = {
        onRequest: () => {},
        onResponse: (e) => e,
        onTimeout: () => {},
        ...a.events,
      };
    let f, y;
    if ((l.onRequest(t, a), s)) f = $task.fetch({ method: t, ...a });
    else if (o || n)
      f = new Promise((e, s) => {
        $httpClient[t.toLowerCase()](a, (t, o, n) => {
          t
            ? s(t)
            : e({
                statusCode: o.status || o.statusCode,
                headers: o.headers,
                body: n,
              });
        });
      });
    else if (r) {
      const e = require("got"),
        s = require("iconv-lite");
      f = new Promise((o, n) => {
        e[t.toLowerCase()](a)
          .then((e) =>
            o({
              statusCode: e.statusCode,
              headers: e.headers,
              body: s.decode(e.rawBody, "utf-8"),
            })
          )
          .catch(n);
      });
    } else if (i) {
      const e = new Request(a.url);
      (e.method = t),
        (e.headers = a.headers),
        (e.body = a.body),
        (f = new Promise((t, s) => {
          e.loadString()
            .then((s) => {
              t({
                statusCode: e.response.statusCode,
                headers: e.response.headers,
                body: s,
              });
            })
            .catch((e) => s(e));
        }));
    } else
      u &&
        (f = new Promise((e, s) => {
          fetch(a.url, { method: t, headers: a.headers, body: a.body })
            .then((e) => e.json())
            .then((t) =>
              e({ statusCode: t.status, headers: t.headers, body: t.data })
            )
            .catch(s);
        }));
    const p = c
      ? new Promise((e, s) => {
          y = setTimeout(
            () => (
              l.onTimeout(), s(`${t}URL:${a.url}exceeds the timeout ${c}ms`)
            ),
            c
          );
        })
      : null;
    return (
      p ? Promise.race([p, f]).then((e) => (clearTimeout(y), e)) : f
    ).then((e) => l.onResponse(e));
  }
  const {
      isQX: s,
      isLoon: o,
      isSurge: n,
      isScriptable: i,
      isNode: r,
      isBrowser: u,
    } = ENV(),
    a = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    d =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    h = {};
  return a.forEach((e) => (h[e.toLowerCase()] = (s) => t(e, s))), h;
}
function API(e = "untitled", t = !1) {
  const {
    isQX: s,
    isLoon: o,
    isSurge: n,
    isNode: i,
    isJSBox: r,
    isScriptable: u,
  } = ENV();
  return new (class {
    constructor(e, t) {
      (this.name = e),
        (this.debug = t),
        (this.http = HTTP()),
        (this.env = ENV()),
        (this.node = (() => {
          if (i) {
            const e = require("fs");
            return { fs: e };
          }
          return null;
        })()),
        this.initCache();
      const s = (e, t) =>
        new Promise(function (s) {
          setTimeout(s.bind(null, t), e);
        });
      Promise.prototype.delay = function (e) {
        return this.then(function (t) {
          return s(e, t);
        });
      };
    }
    initCache() {
      if (
        (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")),
        (o || n) &&
          (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")),
        i)
      ) {
        let e = "root.json";
        this.node.fs.existsSync(e) ||
          this.node.fs.writeFileSync(
            e,
            JSON.stringify({}),
            { flag: "wx" },
            (e) => console.log(e)
          ),
          (this.root = {}),
          (e = `${this.name}.json`),
          this.node.fs.existsSync(e)
            ? (this.cache = JSON.parse(
                this.node.fs.readFileSync(`${this.name}.json`)
              ))
            : (this.node.fs.writeFileSync(
                e,
                JSON.stringify({}),
                { flag: "wx" },
                (e) => console.log(e)
              ),
              (this.cache = {}));
      }
    }
    persistCache() {
      const e = JSON.stringify(this.cache, null, 2);
      s && $prefs.setValueForKey(e, this.name),
        (o || n) && $persistentStore.write(e, this.name),
        i &&
          (this.node.fs.writeFileSync(
            `${this.name}.json`,
            e,
            { flag: "w" },
            (e) => console.log(e)
          ),
          this.node.fs.writeFileSync(
            "root.json",
            JSON.stringify(this.root, null, 2),
            { flag: "w" },
            (e) => console.log(e)
          ));
    }
    write(e, t) {
      if ((this.log(`SET ${t}`), -1 !== t.indexOf("#"))) {
        if (((t = t.substr(1)), n || o)) return $persistentStore.write(e, t);
        if (s) return $prefs.setValueForKey(e, t);
        i && (this.root[t] = e);
      } else this.cache[t] = e;
      this.persistCache();
    }
    read(e) {
      return (
        this.log(`READ ${e}`),
        -1 === e.indexOf("#")
          ? this.cache[e]
          : ((e = e.substr(1)),
            n || o
              ? $persistentStore.read(e)
              : s
              ? $prefs.valueForKey(e)
              : i
              ? this.root[e]
              : void 0)
      );
    }
    delete(e) {
      if ((this.log(`DELETE ${e}`), -1 !== e.indexOf("#"))) {
        if (((e = e.substr(1)), n || o)) return $persistentStore.write(null, e);
        if (s) return $prefs.removeValueForKey(e);
        i && delete this.root[e];
      } else delete this.cache[e];
      this.persistCache();
    }
    notify(e, t = "", a = "", d = {}) {
      const h = d["open-url"],
        c = d["media-url"];
      if (
        (s && $notify(e, t, a, d),
        n &&
          $notification.post(e, t, a + `${c ? "\n多媒体:" + c : ""}`, {
            url: h,
          }),
        o)
      ) {
        let s = {};
        h && (s.openUrl = h),
          c && (s.mediaUrl = c),
          "{}" === JSON.stringify(s)
            ? $notification.post(e, t, a)
            : $notification.post(e, t, a, s);
      }
      if (i || u) {
        const s = a + (h ? `\n点击跳转:${h}` : "") + (c ? `\n多媒体:${c}` : "");
        if (r) {
          const o = require("push");
          o.schedule({ title: e, body: (t ? t + "\n" : "") + s });
        } else console.log(`${e}\n${t}\n${s}\n\n`);
      }
    }
    log(e) {
      this.debug && console.log(`[${this.name}]LOG:${this.stringify(e)}`);
    }
    info(e) {
      console.log(`[${this.name}]INFO:${this.stringify(e)}`);
    }
    error(e) {
      console.log(`[${this.name}]ERROR:${this.stringify(e)}`);
    }
    wait(e) {
      return new Promise((t) => setTimeout(t, e));
    }
    done(e = {}) {
      s || o || n
        ? $done(e)
        : i &&
          !r &&
          "undefined" != typeof $context &&
          (($context.headers = e.headers),
          ($context.statusCode = e.statusCode),
          ($context.body = e.body));
    }
    stringify(e) {
      if ("string" == typeof e || e instanceof String) return e;
      try {
        return JSON.stringify(e, null, 2);
      } catch (e) {
        return "[object Object]";
      }
    }
  })(e, t);
}

var $XiaoMaoSvip = "";
$XiaoMaoSvip = API("XiaoMao");

// 开始时间
let startWorkTime = $XiaoMaoSvip.read("startWorkTime") || "09:00";
// 结束时间
let endWorkTime = $XiaoMaoSvip.read("endWorkTime") || "18:00";
// 休息时间
let restWorkTime = $XiaoMaoSvip.read("restWorkTime") || "2";
// 月休类型 1 单休周六 2 单休周日 3 双休 4 不休
let restMonthType = $XiaoMaoSvip.read("restMonthType") || "3";
// 月收入
let moneyTotal = $XiaoMaoSvip.read("moneyTotal") || "3000";

let todayDate = new Date();
let weekDay = todayDate.getDay();
let MonthTotal = getMonthDayTotal();
let dayTimeObj = getTimeDifference(startWorkTime, endWorkTime, restWorkTime);
let dayWeekObj = getWeekend(parseInt(restMonthType));

// 获取本月数组
let monthArr = Array.from({ length: MonthTotal }, (_, i) => i + 1);

// 当天日期
let todayDay = todayDate.getDate();
// 当天时间
let todayTimes = todayDate.getHours() + ":" + todayDate.getMinutes();
let todayRemaining = getTimeDifference(todayTimes, endWorkTime, 0);

// 本月剩余
let monthDayRemaining = getRemainingWeek(monthArr, todayDay, dayWeekObj);

// 每日金钱
let dayMoneys = getMoneyData(
  dayWeekObj.saturday.len + dayWeekObj.sunday.len,
  MonthTotal,
  moneyTotal
);

// 获取 YYYY/MM/DD 格式时间
function getDateString(d = new Date()) {
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let dateString = year + "/" + month + "/" + day;
  return dateString;
}

// 获取 当天总工作时长与时间差
function getTimeDifference(t1, t2, t3) {
  let Time1 = new Date(getDateString() + " " + t1);
  let Time2 = new Date(getDateString() + " " + t2);
  let dayTimeTotal = (Time2.getTime() - Time1.getTime()) / 60 / 60 / 1000;
  let dateTimeWork = dayTimeTotal - parseInt(t3);
  return {
    dayTimeTotal: dayTimeTotal || 0,
    dateTimeWork: dateTimeWork || 0,
  };
}

// 获取当月天数
function getMonthDayTotal() {
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let nextMonthFirstDay = new Date(
    currentDate.getFullYear(),
    currentMonth + 1,
    1
  );
  let currentMonthLastDay = new Date(nextMonthFirstDay.getTime() - 1);
  let daysInCurrentMonth = currentMonthLastDay.getDate();
  return daysInCurrentMonth;
}

function getRemainingWeek(all = [], now = 0, dayWeekObj) {
  let overArr = all.slice(0, now);
  let remainingArr = all.slice(now, all.length);

  let satArr = [];
  let sunArr = [];
  let satLen = 0;
  let sunLen = 0;
  if (dayWeekObj.saturday.length != 0) {
    satArr = dayWeekObj.saturday.arr;
    satLen = remainingArr.filter((value) => satArr.includes(value)).length;
  }
  if (dayWeekObj.sunday.length != 0) {
    sunArr = dayWeekObj.sunday.arr;
    sunLen = remainingArr.filter((value) => sunArr.includes(value)).length;
  }
  return {
    overArr: overArr,
    remainingArr: remainingArr,
    weekRemaining: satLen + sunLen,
  };
}

// 获取每日金钱
function getMoneyData(restDays, monthTotal, money) {
  return parseInt(money) / (monthTotal - restDays);
}

// 获取周末天数
// 1 单休周六 2 单休周日 3 双休 4 不休
function getWeekend(type = 3) {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let allDay = new Date(year, month + 1, 0).getDate();
  let saturday = [];
  let sunday = [];
  for (let i = 1; i <= allDay; i++) {
    let week = new Date(year, month, i).getDay();
    let str = i;
    if (week === 0) {
      sunday.push(str);
    } else if (week === 6) {
      saturday.push(str);
    }
  }
  let computedData = {
    saturday: {
      arr: saturday,
      len: 0,
    },
    sunday: {
      arr: sunday,
      len: 0,
    },
  };
  switch (type) {
    case 1:
      computedData.sunday.len = 0;
      computedData.saturday.len = saturday.length;
      break;
    case 2:
      computedData.saturday.len = 0;
      computedData.sunday.len = sunday.length;
      break;
    case 3:
      computedData.saturday.len = saturday.length;
      computedData.sunday.len = sunday.length;
      break;
    case 4:
      computedData.saturday.len = 0;
      computedData.sunday.len = 0;
      break;
    default:
      break;
  }
  return computedData;
}

// 获取周几
function getWeekDate() {
  var date = new Date();
  var day = date.getDay();
  var names = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return names[day];
}

function getWorkTime() {
  let daysObj = {
    "📆今日日期": getDateString() + " " + getWeekDate(),
    "⏰现在时间": todayTimes,
    "💰今日已赚":
      (
        dayMoneys *
        ((dayTimeObj.dayTimeTotal - todayRemaining.dayTimeTotal) /
          dayTimeObj.dayTimeTotal)
      ).toFixed(2) + "元",
    "💵本月已赚":
      (parseInt(moneyTotal) * (todayDay / MonthTotal)).toFixed(2) + "元",
    "⌛️今日进度":
      (
        ((dayTimeObj.dayTimeTotal - todayRemaining.dayTimeTotal) /
          dayTimeObj.dayTimeTotal) *
        100
      ).toFixed(2) + "%",
    "‼️今日剩余":
      todayRemaining.dayTimeTotal > 1
        ? todayRemaining.dayTimeTotal.toFixed(2) + "小时"
        : (todayRemaining.dayTimeTotal * 60).toFixed(2) + "分钟",

    "⏳本月进度": ((todayDay / MonthTotal) * 100).toFixed(2) + "%",
    "😵‍💫本月天数": MonthTotal + "天",
    "😇本月剩余": MonthTotal - todayDay + "天",
    "🏠假期天数": dayWeekObj.saturday.len + dayWeekObj.sunday.len + "天",
    "😩假期余额": monthDayRemaining.weekRemaining + "天",
  };

  let weekStatus = false;

  if (restMonthType == 1 && weekDay == 6) {
    weekStatus = true;
  } else if (restMonthType == 2 && weekDay == 0) {
    weekStatus = true;
  } else if (restMonthType == 3 && (weekDay == 0 || weekDay == 6)) {
    weekStatus = true;
  }

  let arr = Object.keys(daysObj);
  if (weekStatus) {
    arr = arr.filter((el) => el != "⌛️今日进度" && el != "‼️今日剩余");
  }
  let hr = "======================================";
  let br = "\n";
  let text =
    (weekStatus
      ? "🌹今天休息，记得好好放松下哟～"
      : "🌾今天也是辛勤劳动的一天呐～") +
    "\n\n" +
    hr;
  arr.forEach((el) => {
    text = text + br + el + "：" + daysObj[el] + br + hr;
  });
  $notify("🧑‍💻XiaoMao_打工人进度", "", text);
}

getWorkTime();
setTimeout(() => {
  $done({});
}, 2000);
