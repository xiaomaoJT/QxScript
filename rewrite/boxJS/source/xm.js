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
var obj = JSON.parse($response.body);
var $XiaoMaoSvip = new Env("XMind");
var appName = `XiaoMao-XMindvip`;
var XiaoMaoSvip = "";
let XiaoMaoEndTime = null;
let SvipDate = null;

!(async () => {
  await XiaoMaoFunction();
})()
  .catch((err) => {
    $XiaoMaoSvip.log(err);
    setTimeout(() => {
      $XiaoMaoSvip.done();
    }, 3000);
  })
  .finally(() => {
    console.log(appName + "设置成功");
    setTimeout(() => {
      $XiaoMaoSvip.done();
    }, 5000);
  });

function XiaoMaoFunction() {
  if (
    $XiaoMaoSvip.read("XMindVipYear") &&
    $XiaoMaoSvip.read("XMindVipMonth") &&
    $XiaoMaoSvip.read("XMindVipDay")
  ) {
    SvipDate = new Date(
      $XiaoMaoSvip.read("XMindVipYear") +
        "/" +
        $XiaoMaoSvip.read("XMindVipMonth") +
        "/" +
        $XiaoMaoSvip.read("XMindVipDay")
    ).getTime();
    if (!SvipDate) {
      $XiaoMaoSvip.notify(
        appName,
        "",
        "会员日期设置错误，请输入正确的日期范围!"
      );
      XiaoMaoSvip = getGoneDay(-1);
    } else {
      XiaoMaoSvip =
        $XiaoMaoSvip.read("XMindVipYear") +
        "/" +
        $XiaoMaoSvip.read("XMindVipMonth") +
        "/" +
        $XiaoMaoSvip.read("XMindVipDay");
    }
  } else {
    XiaoMaoSvip = getGoneDay(-365);
  }

  XiaoMaoEndTime = new Date(XiaoMaoSvip).getTime();
}

var obj = JSON.parse($response.body);
if ($response.body) {
  let requestUrl = $request.url;
  if (
    /^https:\/\/www\.xmind(\.net|\.cn|\.app)\/\_res\/devices?/.test(requestUrl)
  ) {
    obj.hasOwnProperty("license")
      ? ((obj.license.status = "sub"),
        (obj.license.expireTime = XiaoMaoEndTime))
      : "";
  } else if (
    /^https:\/\/www\.xmind(\.net|\.cn|\.app)\/\_res\/profile\/.+\/?/.test(
      requestUrl
    )
  ) {
    obj.hasOwnProperty("sub")
      ? ((obj.sub.ios.status = "sub"),
        (obj.sub.ios.expireTime = XiaoMaoEndTime))
      : "";
  }
  $done({ body: JSON.stringify(obj) });
} else {
  $done({});
}
