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
  const notify = (
    title = "XiaoMao",
    subtitle = "",
    message = "",
    url = "",
    url2 = url
  ) => {
    if (isLoon) $notification.post(title, subtitle, message, url);
    if (isSurge) $notification.post(title, subtitle, message, { url });
    if (isQX)
      $notify(title, subtitle, message, { "open-url": url, "media-url": url2 });
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
let status = isJSON($response.body);
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"remain\":\w+/g, '"remain":100')
        .replace(/\"subscription_remain\":\w+/g, '"subscription_remain":100')
        .replace(/\"subscription_quota\":\w+/g, '"subscription_quota":50')
        .replace(/\"addition_remain\":\w+/g, '"addition_remain":100')
        .replace(
          /\"subscription_quota_end_time\":\w+/g,
          '"subscription_quota_end_time":100'
        )
        .replace(/\"free_remain\":\w+/g, '"free_remain":100')
        .replace(/\"free_quota\":\w+/g, '"free_quota":50')
        .replace(/\"switch\":\w+/g, '"switch":false')
    )
  : $response.body;

let $XiaoMaoSvip = new Env("CaiYun");
let appName = `XiaoMao-彩云天气Svip`;
let XiaoMaoSvip = "";
let XiaoMaoEndTime = null;
let SvipDate = "";

function getGoneDay(n = 0, yearFlag = true) {
  let myDate = new Date();
  myDate.setDate(myDate.getDate() - n);
  let month = myDate.getMonth() + 1;
  let day = myDate.getDate();
  let result =
    "" +
    (yearFlag ? myDate.getFullYear() : "") +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    (day < 10 ? "0" + day : day);
  return result;
}

function XiaoMaoFunction() {
  if (
    $XiaoMaoSvip.read("CaiYunSvipYear") &&
    $XiaoMaoSvip.read("CaiYunSvipMonth") &&
    $XiaoMaoSvip.read("CaiYunSvipDay")
  ) {
    SvipDate = new Date(
      $XiaoMaoSvip.read("CaiYunSvipYear") +
        "/" +
        $XiaoMaoSvip.read("CaiYunSvipMonth") +
        "/" +
        $XiaoMaoSvip.read("CaiYunSvipDay")
    ).getTime();
    if (!SvipDate) {
      $XiaoMaoSvip.notify(
        appName,
        "",
        "会员日期设置错误，请输入正确的日期范围!"
      );
      XiaoMaoSvip = getGoneDay(-10);
    } else {
      XiaoMaoSvip =
        $XiaoMaoSvip.read("CaiYunSvipYear") +
        "/" +
        $XiaoMaoSvip.read("CaiYunSvipMonth") +
        "/" +
        $XiaoMaoSvip.read("CaiYunSvipDay");
    }
  } else {
    XiaoMaoSvip = getGoneDay(-10);
  }
  XiaoMaoEndTime = new Date(XiaoMaoSvip).getTime() / 1000;
}

XiaoMaoFunction();
if ($response.body) {
  let requestUrl = $request.url;
  if (
    /^https?:\/\/biz\.(caiyunapp|cyapi)\.(com|cn)\/(membership_rights|v2\/user)?/.test(
      requestUrl
    )
  ) {
    if (obj?.result) {
      obj.result.is_vip = true;
      obj.result.vip_type = "s";
      obj.result.svip_given = 365;
      obj.result.wt.svip_given = 365;
      obj.result.is_primary = false;
      obj.result.is_visitor = false;
      obj.result.is_xy_vip = true;
      obj.result.vip_expired_at = XiaoMaoEndTime;
      obj.result.xy_svip_expire = XiaoMaoEndTime;
      obj.result.xy_vip_expire = XiaoMaoEndTime;
      obj.result.wt.vip.expired_at = XiaoMaoEndTime;
      obj.result.svip_expired_at = XiaoMaoEndTime;
      obj.result.wt.vip.svip_expired_at = XiaoMaoEndTime;
    }
  }

  if (
    /^https:\/\/(wrapper|api)\.(cyapi|caiyunapp)\.(cn|com)\/v1\/activity?/.test(
      requestUrl
    )
  ) {
    if (obj.hasOwnProperty("activities")) {
      obj.activities = obj.activities.filter(
        (el) => !(el && el.name && el.name.includes("ai"))
      );
    }
  }

  if (/^https:\/\/biz\.cyapi\.cn\/api\/v1\/user_detail?/.test(requestUrl)) {
    obj.vip_info.vip.is_auto_renewal = false;
    obj.vip_info.vip.expires_time = XiaoMaoEndTime;
    obj.vip_info.svip.is_auto_renewal = false;
    obj.vip_info.svip.expires_time = XiaoMaoEndTime;
    obj.vip_info.trial_svip.is_auto_renewal = false;
    obj.vip_info.trial_svip.is_recharge_vip = false;
    // obj.vip_info.trial_svip.received_time = new Date().getTime();
    obj.vip_info.trial_svip.expires_time = XiaoMaoEndTime;
  }

  if (/^https:\/\/biz\.cyapi\.cn\/p\/v1\/vip_info?/.test(requestUrl)) {
    obj.vip.is_auto_renewal = false;
    obj.vip.expires_time = XiaoMaoEndTime;
    obj.svip.is_auto_renewal = false;
    obj.svip.expires_time = XiaoMaoEndTime;
    obj.trial_svip.is_auto_renewal = false;
    obj.trial_svip.is_recharge_vip = false;
    // obj.trial_svip.received_time = new Date().getTime();
    obj.trial_svip.expires_time = XiaoMaoEndTime;
  }
  $done({ body: JSON.stringify(obj) });
}

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function removeExtraSpaces(jsonString) {
  var jsonObj = JSON.parse(jsonString);
  return JSON.stringify(jsonObj, function (key, value) {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  });
}
