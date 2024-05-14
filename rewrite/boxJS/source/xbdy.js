let status = isJSON($response.body);
let requestUrl = $request.url;
let $ = new Env("XiaoMaoXiaoBaiDaYin");
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"isLifetimeVipMember\":\w+/g, '"isLifetimeVipMember":true')
        .replace(/\"isLifetimeSvipMember\":\w+/g, '"isLifetimeSvipMember":true')
        .replace(/\"isZulinVipMember\":\w+/g, '"isZulinVipMember":true')
        .replace(/\"isShareGiveMember\":\w+/g, '"isShareGiveMember":true')
        .replace(/\"isSchoolAgeMember\":\w+/g, '"isSchoolAgeMember":true')
        .replace(/\"isPreschoolMember\":\w+/g, '"isPreschoolMember":true')
        .replace(/\"isLifetimeMember\":\w+/g, '"isLifetimeMember":true')
        .replace(
          /\"isLifetimeVipProMember\":\w+/g,
          '"isLifetimeVipProMember":true'
        )
        .replace(/\"isNormalMember\":\w+/g, '"isNormalMember":true')
    )
  : $response.body;
if (/^https:\/\/cdn-h\.gongfudou\.com\/.+\.(jpg|png)?/.test(requestUrl)) {
  if (
    $request.headers["User-Agent"].includes(
      "%E5%B0%8F%E7%99%BD%E5%AD%A6%E4%B9%A0%E7%9B%92%E5%AD%90"
    ) &&
    !requestUrl.includes("x-image-process")
  ) {
    $.notify(
      "XiaoMao_小白学习打印！",
      "点击跳转",
      "成功捕获到图片资源！" + "\n" + requestUrl,
      requestUrl
    );
  }
  $done();
}
$done({ body: status ? JSON.stringify(obj) : obj });

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

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

function removeExtraSpaces(jsonString) {
  var jsonObj = JSON.parse(jsonString);
  return JSON.stringify(jsonObj, function (key, value) {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  });
}
