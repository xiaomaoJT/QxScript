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

var $XiaoMaoInfo = new Env("HotList");
var appName = `🔥XiaoMao_实时热榜`;
var XiaoMaoHotList = [];
var typeList = [
  { name: "\u864e\u6251\u70ed\u699c", type: "hp", params: "huPu" },
  { name: "\u77e5\u4e4e\u70ed\u699c", type: "zh", params: "zhihuHot" },
  { name: "36\u6c2a\u70ed\u699c", type: "36", params: "36Ke" },
  { name: "\u767e\u5ea6\u70ed\u699c", type: "bd", params: "baiduRD" },
  { name: "B\u7ad9\u70ed\u699c", type: "bz", params: "bili" },
  { name: "\u8d34\u5427\u70ed\u699c", type: "tb", params: "baiduRY" },
  { name: "\u5fae\u535a\u70ed\u699c", type: "wb", params: "wbHot" },
  { name: "\u6296\u97f3\u70ed\u699c", type: "dy", params: "douyinHot" },
  { name: "\u8c46\u74e3\u70ed\u699c", type: "db", params: "douban" },
  { name: "\u5fae\u4fe1\u70ed\u699c", type: "wx", params: "wxHot" },
  { name: "\u5c11\u6570\u6d3e\u70ed\u699c", type: "ss", params: "ssPai" },
  { name: "IT\u8d44\u8baf\u70ed\u699c", type: "it", params: "itInfo" },
  { name: "IT\u8d44\u8baf\u65b0\u699c", type: "itn", params: "itNews" },
  {
    name: "\u5386\u53f2\u4e0a\u7684\u4eca\u5929",
    type: "ls",
    params: "history",
  },
  { name: "\u5fae\u4fe1\u7f8e\u98df\u699c", type: "ms", params: "wxFood" },
  { name: "\u5fae\u4fe1\u641e\u7b11\u699c", type: "gx", params: "wxJoke" },
  { name: "\u5fae\u4fe1\u8d22\u7ecf\u699c", type: "cj", params: "wxMoney" },
  { name: "\u5fae\u4fe1\u79d1\u6280\u699c", type: "kj", params: "wxKeJi" },
  { name: "\u5fae\u4fe1\u516b\u5366\u699c", type: "bg", params: "wxBaGua" },
  { name: "\u5fae\u4fe1\u661f\u5ea7\u699c", type: "xz", params: "wxXingZuo" },
  { name: "\u5fae\u4fe1\u65c5\u6e38\u699c", type: "ly", params: "wxLvYou" },
];
var showUrl = true;
var showLength = 100;

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
    console.log(appName + "实时热榜数据获取成功");
    setTimeout(() => {
      $XiaoMaoInfo.done();
    }, 5000);
  });

function XiaoMaoFunction() {
  if ($XiaoMaoInfo.read("HotUrl")) {
    showUrl = $XiaoMaoInfo.read("HotUrl") == "0" ? false : true;
  }
  if ($XiaoMaoInfo.read("HotLength")) {
    showLength = parseInt($XiaoMaoInfo.read("HotLength"));
  }
  if ($XiaoMaoInfo.read("HotList")) {
    XiaoMaoHotList = $XiaoMaoInfo.read("HotList").split("+");
    if (XiaoMaoHotList.length) {
      XiaoMaoHotList.forEach((el) => {
        let typeObj = typeList.find((e) => e.type == el);
        if (typeObj) {
          let option = {
            url: encodeURI(
              "https://api.vvhan.com/api/hotlist/" + typeObj.params
            ),
            method: "GET",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
            },
          };
          $task
            .fetch(option)
            .then((response) => {
              let obj = JSON.parse(response.body);
              if (obj.success && obj.data.length) {
                let resultText =
                  "♨️ " +
                  typeObj.name +
                  "\n" +
                  "⏰ 更新时间：" +
                  obj.update_time +
                  "\n\n";
                let list = obj.data.slice(0, showLength);
                list.forEach((item, i) => {
                  resultText =
                    resultText +
                    "[" +
                    item.index +
                    "] " +
                    (item.hasOwnProperty("hot")
                      ? (i < 5 ? "[🔥" : "[") +
                        "热度：" +
                        item.hot
                          .toString()
                          .replace("热度", "")
                          .replace("万", "w")
                          .replace("千", "k") +
                        "] "
                      : "") +
                    item.title +
                    (showUrl ? "\n" + "原文地址：" + item.mobilUrl : "") +
                    "\n\n";
                });
                $XiaoMaoInfo.notify("🔥XiaoMao_实时热榜", "", resultText);
              } else {
                getError(typeObj.name + "_error_2");
              }
            })
            .catch((err) => {
              getError(typeObj.name + "_error_1");
            });
        }
      });
    }
  } else {
    $XiaoMaoInfo.notify(
      appName,
      "🚦数据获取失败❗️",
      "🚧热榜默认参数未填写或获取失败，请前往XiaoMaoBoxJS填写！https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHot.js"
    );
  }
}
function getError(params) {
  $XiaoMaoInfo.notify(
    "🔥XiaoMao_实时热榜",
    "",
    "🚧" + params + "获取失败，请稍后再试❗️",
    "https://i.pixiv.re/img-original/img/2022/01/08/17/30/22/95384359_p0.jpg"
  );
}
setTimeout(() => {
  $done({});
}, 2000);
