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

var $XiaoMaoInfo = new Env("YouJia");
var appName = `⛽️XiaoMao_每日油价`;
var XiaoMaoProvince = "";
var XiaoMaoCity = "";
var XiaoMaoArea = "";
var XiaoMaoAreaInfo = "";

!(async () => {
  await XiaoMaoFunction();
})()
  .catch((err) => {
    $XiaoMaoInfo.log(err);
    setTimeout(() => {
      $XiaoMaoInfo.done();
    }, 3000);
  })
  .finally(() => {
    console.log(appName + "油价地区数据获取成功");
    setTimeout(() => {
      $XiaoMaoInfo.done();
    }, 5000);
  });
function XiaoMaoFunction() {
  if ($XiaoMaoInfo.read("YouJiaProvince")) {
    if (!$XiaoMaoInfo.read("YouJiaCity") && $XiaoMaoInfo.read("YouJiaArea")) {
      XiaoMaoProvince = $XiaoMaoInfo.read("YouJiaProvince")
        ? "/" + $XiaoMaoInfo.read("YouJiaProvince")
        : "/guangdong";
      $XiaoMaoInfo.notify(
        appName + "地区数据获取失败❗️",
        "🚦当前默认获取省级行政区数据",
        "🚧油价地区信息不可跨行政区填写，请前往XiaoMaoBoxJS修正！"
      );
      return;
    } else {
      XiaoMaoProvince = $XiaoMaoInfo.read("YouJiaProvince")
        ? "/" + $XiaoMaoInfo.read("YouJiaProvince")
        : "/guangdong";
      XiaoMaoCity = $XiaoMaoInfo.read("YouJiaCity")
        ? "/" + $XiaoMaoInfo.read("YouJiaCity")
        : "";
      XiaoMaoArea = $XiaoMaoInfo.read("YouJiaArea")
        ? "/" + $XiaoMaoInfo.read("YouJiaArea")
        : "";
    }
  } else {
    XiaoMaoProvince = "/guangdong";
    $XiaoMaoInfo.notify(
      appName + "地区数据获取失败❗️",
      "🚦当前默认获取广东油价信息",
      "🚧油价地区信息未填写或获取失败，请前往XiaoMaoBoxJS填写！"
    );
  }
  XiaoMaoAreaInfo = XiaoMaoProvince + XiaoMaoCity + XiaoMaoArea;
  let url = "http://www.qiyoujiage.com" + XiaoMaoAreaInfo + ".shtml";
  let option = {
    url: encodeURI(url),
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
    },
  };
  $XiaoMaoInfo.get(option, (err, resp, response) => {
    if (response) {
      let obj = response.replace(/\s*/g, "").toString();
      let startIndex = obj.indexOf('<divclass="info">');
      let endIndex = obj.indexOf('<divid="contAd"');
      let subContent = obj.substring(startIndex, endIndex);
      let areaIndex = subContent.indexOf("</div>");
      let areaTitle =
        subContent
          .substring(17, areaIndex)
          .replace("每日即时更新单位:元/升", "")
          .replace("(汽油跟柴油价格)", "")
          .replace("）", "）") || "每日油价";
      let areaList = subContent.split("<dl>");
      let areaContentList = [];
      if (areaList.length) {
        areaList.forEach((el, index) => {
          if (index != 0) {
            let end1 = el.indexOf("</dt>");
            let type = el.substring(4, end1);
            let end2 = el.indexOf("</dd>");
            let price = el.substring(end1 + 9, end2);
            areaContentList.push({ type: type, price: price + "(元/升)" });
          }
        });
      }
      let subContent2 = subContent.substring(
        subContent.lastIndexOf("</dl>") + 20,
        subContent.length
      );
      let changeStart = subContent2.indexOf(">");
      let changeEnd = subContent2.indexOf("<br/>");
      let changeText = subContent2.substring(changeStart + 1, changeEnd) || "";
      let subContent3 = subContent2.substring(
        changeEnd + 5,
        subContent2.length
      );
      let changeInfoStart = subContent3.indexOf(">");
      let changeInfoEnd = subContent3.indexOf("</span>");
      let changeInfoTem = subContent3.substring(
        changeInfoStart + 1,
        changeInfoEnd
      );
      let changeInfo =
        changeInfoTem.substring(0, changeInfoTem.lastIndexOf("，")) || "";
      let resultText = "🛟 " + areaTitle + "\n\n";
      if (areaContentList.length) {
        areaContentList.forEach((el, index) => {
          resultText =
            resultText +
            (index != 3
              ? "⛽️ " + el.type + "：" + el.price
              : "🛢 " + el.type + "  ：" + el.price) +
            "\n";
        });
        resultText =
          resultText +
          "\n\n" +
          (changeText ? "📈 本轮油价调整时间：" + changeText : "") +
          "\n\n" +
          (changeInfo ? "📣 本轮油价调整幅度：" + changeInfo : "");
        $XiaoMaoInfo.notify("⛽️XiaoMao_每日油价❗️", "", resultText);
      } else {
        $XiaoMaoInfo.notify(
          "🚨XiaoMao_每日油价❗️",
          "",
          "🚧获取失败，请检查XiaoMaoBoxJS地区设置❗️",
          "https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg"
        );
      }
    } else {
      $XiaoMaoInfo.notify(
        "🚨XiaoMao_每日油价❗️",
        "",
        "🚧获取失败，请稍后再试❗️",
        "https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg"
      );
    }
  });
}
setTimeout(() => {
  $done({});
}, 2000);
