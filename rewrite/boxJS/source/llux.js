//------ 请于此处替换抓包关键数据 -------
let AppName = "XiaoMaoLeicaLUX"; // 软件名称
let entId = "pro"; // 软件权限ID - 抓包获取数据 entitlements
let subType = "lux_7999_1y_2w0"; //软件订阅类型 - 抓包获取数据 subscriptions
//------ 请于此处替换抓包关键数据 -------

let body = JSON.parse(
  (typeof $response != "undefined" && $response.body) || null
);
let headers = $request && $request.headers;
let obj = {};
let requestUrl = $request.url;
let $ = new Env(AppName);
if (
  /^https:\/\/api\.revenuecat\.com\/v1\/(subscribers|receipts)?/.test(
    requestUrl
  )
) {
  if (typeof $response == "undefined") {
    delete headers["x-revenuecat-etag"];
    delete headers["X-RevenueCat-ETag"];
    obj.headers = headers;
  } else if (body && body.subscriber) {
    let subscriberData = {
      original_purchase_date: "2024-06-07T10:19:12Z",
      purchase_date: "2024-06-07T10:19:12Z",
      expires_date: "2222-02-02T02:02:02Z",
      store: "app_store",
      ownership_type: "PURCHASED",
    };
    body.subscriber.subscriptions[subType] = subscriberData;
    body.subscriber.entitlements[entId] = subscriberData;
    body.subscriber.entitlements[entId].product_identifier = subType;
    body.subscriber.original_purchase_date = "2024-06-07T10:19:12Z";

    obj.body = JSON.stringify(body);
    $.notify(
      "XiaoMao_" + AppName + " 执行成功！",
      "",
      "Nice!已解锁成功，可关掉此脚本。",
      "https://i.pixiv.re/img-original/img/2022/12/19/00/06/12/103718184_p0.png"
    );
  }
}
$done(obj);

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
