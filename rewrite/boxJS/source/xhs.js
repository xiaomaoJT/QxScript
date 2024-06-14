let status = isJSON($response.body);
let requestUrl = $request.url;
let names = "XiaoHongShu";
let $ = new Env(names);
var obj = status
  ? JSON.parse(removeExtraSpaces($response.body))
  : $response.body;

let typeObj = {
  1: {
    label: "原始分辨率",
    value: "imageView2/0/format/png",
  },
  2: {
    label: "高质量压缩",
    value: "imageMogr2/format/png/quality/100",
  },
  3: {
    label: "高像素输出",
    value: "imageView2/2/w/1920/h/1080/format/png",
  },
  4: {
    label: "平衡配置",
    value: "imageMogr2/thumbnail/!50p/quality/100/format/png",
  },
};
let HighType = 1;
$.read("HighType") ? (HighType = $.read("HighType")) : "";

if (
  /^https:\/\/edith\.xiaohongshu\.com\/api\/sns\/v2\/note\/widgets?/.test(
    requestUrl
  )
) {
  if (
    obj.data.hasOwnProperty("image_stickers") &&
    obj.data.image_stickers.length
  ) {
    obj.data.image_stickers.map((el, index) => {
      $.notify(
        "🏅️小红书高清图片捕获成功",
        "捕获模式：" + typeObj[HighType].label,
        `共捕获图片${obj.data.image_stickers.length}张，当前第${index + 1}张`,
        `http://sns-img-bd.xhscdn.com/${el.fileid}?${typeObj[HighType].value}`
      );
    });
  }
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

function removeExtraSpaces(jsonString) {
  var jsonObj = JSON.parse(jsonString);
  return JSON.stringify(jsonObj, function (key, value) {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  });
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
