function Env(name) {
  // 判断当前环境是否为 Loon
  const isLoon = typeof $loon !== "undefined";
  // 判断当前环境是否为 Surge
  const isSurge = typeof $httpClient !== "undefined" && !isLoon;
  // 判断当前环境是否为 QuantumultX
  const isQX = typeof $task !== "undefined";

  // 定义 read 方法，用于读取数据
  const read = (key) => {
    if (isLoon || isSurge) return $persistentStore.read(key);
    if (isQX) return $prefs.valueForKey(key);
  };

  // 定义 write 方法，用于写入数据
  const write = (key, value) => {
    if (isLoon || isSurge) return $persistentStore.write(key, value);
    if (isQX) return $prefs.setValueForKey(key, value);
  };

  // 定义 notify 方法，用于发送通知
  const notify = (title = "XiaoMao", subtitle = "", message = "", url = "",url2 = url) => {
    if (isLoon) $notification.post(title, subtitle, message, url);
    if (isSurge) $notification.post(title, subtitle, message, { url });
    if (isQX) $notify(title, subtitle, message, { "open-url": url, "media-url": url2 });
  };

  // 定义 get 方法，用于发送 GET 请求
  const get = (url, callback) => {
    if (isLoon || isSurge) $httpClient.get(url, callback);
    if (isQX) {
      url.method = `GET`;
      $task.fetch(url).then((resp) => callback(null, {}, resp.body));
    }
  };

  // 定义 post 方法，用于发送 POST 请求
  const post = (url, callback) => {
    if (isLoon || isSurge) $httpClient.post(url, callback);
    if (isQX) {
      url.method = `POST`;
      $task.fetch(url).then((resp) => callback(null, {}, resp.body));
    }
  };

  // 定义 put 方法，用于发送 PUT 请求
  const put = (url, callback) => {
    if (isLoon || isSurge) $httpClient.put(url, callback);
    if (isQX) {
      url.method = "PUT";
      $task.fetch(url).then((resp) => callback(null, {}, resp.body));
    }
  };

  // 定义 toObj 方法，用于将字符串转为对象
  const toObj = (str) => JSON.parse(str);

  // 定义 toStr 方法，用于将对象转为字符串
  const toStr = (obj) => JSON.stringify(obj);

  // 定义 queryStr 方法，用于将对象转为可以请求的字符串
  const queryStr = (obj) => {
    return Object.keys(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join("&");
  };

  // 定义 log 方法，用于输出日志
  const log = (message) => console.log(message);

  // 定义 done 方法，用于结束任务
  const done = (value = {}) => $done(value);

  // 返回包含所有方法的对象
  return {
    name,
    read,
    write,
    notify,
    get,
    post,
    put,
    toObj,
    toStr,
    queryStr,
    log,
    done,
  };
}

var $XiaoMaoSvip = new Env("DaGongRen");

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

// 年剩余
let yearRemaining =
  getTimeDifference(
    todayTimes,
    "23:59",
    "0",
    new Date(),
    new Date(new Date().getFullYear() + "/12/31")
  ).dayTimeTotal / 24;

// 获取 YYYY/MM/DD 格式时间
function getDateString(d = new Date()) {
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let dateString = year + "/" + month + "/" + day;
  return dateString;
}

// 获取 当天总工作时长与时间差
function getTimeDifference(t1, t2, t3, t4 = new Date(), t5 = new Date()) {
  let Time1 = new Date(getDateString(t4) + " " + t1);
  let Time2 = new Date(getDateString(t5) + " " + t2);
  let dayTimeTotal = (Time2.getTime() - Time1.getTime()) / 60 / 60 / 1000;
  let dateTimeWork = dayTimeTotal - parseInt(t3);
  return {
    dayTimeTotal: dayTimeTotal < 0 ? 0 : dayTimeTotal,
    dateTimeWork: dateTimeWork < 0 ? 0 : dateTimeWork,
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
        ((dayTimeObj.dayTimeTotal - todayRemaining.dayTimeTotal < 0
          ? 0
          : dayTimeObj.dayTimeTotal - todayRemaining.dayTimeTotal) /
          dayTimeObj.dayTimeTotal)
      ).toFixed(2) + "元",
    "💵本月已赚":
      (parseInt(moneyTotal) * (todayDay / MonthTotal)).toFixed(2) + "元",
    "💳本年已赚":
      (moneyTotal * 12 * ((365 - yearRemaining) / 365)).toFixed(2) + "元",
    "⌛️今日进度":
      (
        ((dayTimeObj.dayTimeTotal - todayRemaining.dayTimeTotal < 0
          ? 0
          : dayTimeObj.dayTimeTotal - todayRemaining.dayTimeTotal) /
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
    "⌛️本年进度": (((365 - yearRemaining) / 365) * 100).toFixed(2) + "%",
    "🤔本年剩余": yearRemaining.toFixed(2) + "天",
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
  $XiaoMaoSvip.notify("🧑‍💻XiaoMao_打工人进度", "", text);
  $.log(text);
}

getWorkTime();
setTimeout(() => {
  $done({});
}, 2000);
