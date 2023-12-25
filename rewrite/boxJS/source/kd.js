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
const $ = new Env("XiaoMaoKD");

let requestUrl = $request.url;
if (
  /^http:\/\/kd02-1253445850\.file\.myqcloud\.com\/scanimg?/.test(requestUrl)
) {
  $.notify("捕获到当前图片链接❗️", "", "点击跳转浏览器查看❗️", requestUrl);
  $done(JSON.stringify($request));
}
var obj = JSON.parse(
  $response.body
    .replace(/\"status\":0/g, '"status":1')
    .replace(/\"vipStatus\":0/g, '"vipStatus":1')
    .replace(/\"usedCount\":0/g, '"usedCount":1')
    .replace(/\"restCount\":0/g, '"restCount":1')
    .replace(/\"totalCount\":0/g, '"totalCount":1')
    .replace(/\"isVip\":0/g, '"isVip":1')
    .replace(/\"isShow\":0/g, '"isShow":1')
    .replace(/\"startTime\":0/g, '"startTime":1697376016000')
    .replace(/\"stopTime\":0/g, '"stopTime":1729006176000')
    .replace(/\"endTime\":0/g, '"endTime":1729006176000')
    .replace(/false/g, "true")
);
if (
  /^https:\/\/www\.kuaiduizuoye\.com\/codesearch\/sale\/viptabmain?/.test(
    requestUrl
  )
) {
  obj.data.vipInfo.status = 1;
  obj.data.vipInfo.planId = 1;
  obj.data.vipInfo.openButtonText = "VIP";
} else if (
  /^https:\/\/www\.kuaiduizuoye\.com\/codesearch\/popup\/userinfovip?/.test(
    requestUrl
  )
) {
  obj.data.isVip = 1;
} else if (
  /^https:\/\/apivip\.kuaiduizuoye\.com\/vipols\/app\/salepackagev1?/.test(
    requestUrl
  )
) {
  obj.data.vipInfo.status = 1;
  obj.data.vipInfo.monthlyPayment = 12;
  obj.data.vipInfo.monthlyPaymentNum = 12;
  obj.data.vipInfo.startTime = 1697376016000;
  obj.data.vipInfo.stopTime = 1729006176000;
  obj.data.vipInfo.experience = 10000;
  obj.data.kdABviphuaxian = 1;
  obj.data.kdABVipLabel = 1;
  obj.data.kdABVipVideoMask = 1;
} else if (
  /^https:\/\/www\.kuaiduizuoye\.com\/codesearch\/newexam\/detail?/.test(
    requestUrl
  )
) {
  if (obj.data.info.pdfUrl || null) {
    $.notify(
      "捕获到当前PDF链接❗️",
      obj.data.info.title,
      "点击跳转浏览器查看❗️",
      obj.data.info.pdfUrl
    );
  }
}
$done({ body: JSON.stringify(obj) });
