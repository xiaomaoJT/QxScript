let requestUrl = $request.url;
let status = isJSON($response.body);
if ($response.body == "false") {
  $response.body = "true";
}
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"isFree\":\w+/g, '"isFree":true')
        .replace(/\"isNormal\":\w+/g, '"isNormal":true')
        .replace(/\"isVip\":\w+/g, '"isVip":true')
        .replace(/\"isLight\":\w+/g, '"isLight":true')
        .replace(/\"isMonthly\":\w+/g, '"isMonthly":true')
        .replace(/\"isWxt\":\w+/g, '"isWxt":true')
        .replace(/\"isPlus\":\w+/g, '"isPlus":true')
        .replace(/\"isPreviewed\":\w+/g, '"isPreviewed":true')
        .replace(/\"isFullPreview\":\w+/g, '"isFullPreview":true')
        .replace(/\"previewTimes\":\w+/g, '"previewTimes":10000')
        .replace(/\"hasOnlinePlay\":\w+/g, '"hasOnlinePlay":true')
        .replace(/\"hasAttention\":\w+/g, '"hasAttention":true')
        .replace(/\"resourcePackageFree\":\w+/g, '"resourcePackageFree":true')
        .replace(/\"voucherFree\":\w+/g, '"voucherFree":true')
        .replace(/\"wxtFree\":\w+/g, '"wxtFree":true')
        .replace(/\"albumFree\":\w+/g, '"albumFree":true')
        .replace(/\"documentFree\":\w+/g, '"documentFree":true')
        .replace(/\"hasConsume\":\w+/g, '"hasConsume":true')
        .replace(/\"savePrice\":\w+/g, '"savePrice":0')
        .replace(/\"inTimePrice\":\w+/g, '"inTimePrice":0')
        .replace(/\"normalInTimePrice\":\w+/g, '"normalInTimePrice":0')
        .replace(/\"normalPrice\":\w+/g, '"normalPrice":0')
    )
  : $response.body;
let $ = new Env("XKW");

if (/^https:\/\/c\.xkw\.com\/api\/v1\/student\/user\/info?/.test(requestUrl)) {
  obj.vipStatus.isVip = true;
  obj.endTime = "2222-02-02";
  obj.download = 1009;
  obj.vipExpireDays = 365;
  obj.vipStatus.download = 1009;
  obj.vipStatus.endTime = "2222-02-02";
  obj.vipStatus.vipExpireDays = 365;
} else if (
  /^https:\/\/c\.xkw\.com\/api\/v1\/student\/document\/img-preview?/.test(
    requestUrl
  )
) {
  let text =
    "抓取到试卷图片，共" +
    obj.pageCount +
    "张，已成功捕获" +
    obj.images.length +
    "张" +
    "\n\n";
  let textDetail = "";
  if (obj.images.length) {
    obj.images.forEach((el, index) => {
      textDetail = textDetail + "第" + (index + 1) + "张：" + el + "\n";
    });
    $.notify("学科网-学生端", "", text + textDetail, "");
  }
} else if (
  /^https:\/\/mapi\.xkw\.com\/api\/v3\/document\/preview?/.test(requestUrl)
) {
  let textDetail = "";
  let numTotal = 0;
  if (obj.hasOwnProperty("result") && obj.result.length) {
    obj.result.forEach((el, index) => {
      numTotal = numTotal + el.images.length;
      textDetail =
        textDetail +
        (index == 0 ? "" : "\n\n") +
        "第" +
        (index + 1) +
        "套：" +
        el.fileName +
        "，共" +
        el.pageCount +
        "张，已成功捕获" +
        el.previewCount +
        "张" +
        "\n";
      if (el.images.length) {
        el.images.forEach((e, i) => {
          textDetail = textDetail + "第" + (i + 1) + "张：" + e + "\n";
        });
      }
    });
    let text =
      "抓取到试卷图片，共" +
      obj.result.length +
      "套" +
      numTotal +
      "张" +
      "\n\n";
    $.notify("学科网-教师端", "", text + textDetail, "");
  }
} else if (
  /^https:\/\/mapi\.xkw\.com\/api\/v1\/user\/userinfo?/.test(requestUrl)
) {
  obj.status = 1;
  obj.endTime = "2222-02-02";
  obj.vipExpireDays = 365;
  obj.userAsset.userRmb = 100000;
  obj.userAsset.userAdvPoint = 11;
  obj.userAsset.userRmbIncome = 12;
  obj.userAsset.userPoint = 13;
} else if (
  /^https:\/\/mapi\.xkw\.com\/api\/v1\/user\/behavior\/statistics?/.test(
    requestUrl
  )
) {
  obj = {
    impact: 200000,
    money: 100000,
    voucher: 300000,
    download: 800000,
    favor: 400000,
    learnBean: 50000,
  };
} else if (
  /^https:\/\/mapi\.xkw\.com\/api\/v3\/user\/info-with-vip-status?/.test(
    requestUrl
  )
) {
  obj.identity = {
    isLight: true,
    isMonthly: true,
    isWxt: true,
    isPlus: true,
    balance: {
      money: {
        balance: 300000,
      },
      learnShell: {
        balance: 200000,
      },
    },
    isVip: true,
  };
}
$done({ body: status ? JSON.stringify(obj) : obj });

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
