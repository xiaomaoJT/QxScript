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

var $XiaoMaoInfo = new Env("Horoscope");
var appName = `🌌XiaoMao_星座运势`;
var XiaoMaoHoroscopeList = [];
var XiaoMaoHoroscopeTimeList = [];
var typeList = [
  {
    name: "\u2648\ufe0f\u767d\u7f8a\u5ea7",
    type: "baiyang",
    params: "aries",
  },
  {
    name: "\u2649\ufe0f\u91d1\u725b\u5ea7",
    type: "jinniu",
    params: "taurus",
  },
  {
    name: "\u264a\ufe0f\u53cc\u5b50\u5ea7",
    type: "shuangzi",
    params: "gemini",
  },
  {
    name: "\u264b\ufe0f\u5de8\u87f9\u5ea7",
    type: "juxie",
    params: "cancer",
  },
  {
    name: "\u264c\ufe0f\u72ee\u5b50\u5ea7",
    type: "shizi",
    params: "leo",
  },
  {
    name: "\u264d\ufe0f\u5904\u5973\u5ea7",
    type: "chunv",
    params: "virgo",
  },
  {
    name: "\u264e\ufe0f\u5929\u79e4\u5ea7",
    type: "tiancheng",
    params: "libra",
  },
  {
    name: "\u264f\ufe0f\u5929\u874e\u5ea7",
    type: "tianxie",
    params: "scorpio",
  },
  {
    name: "\u2650\ufe0f\u5c04\u624b\u5ea7",
    type: "sheshou",
    params: "sagittarius",
  },
  {
    name: "\u2651\ufe0f\u6469\u7faf\u5ea7",
    type: "mojie",
    params: "capricorn",
  },
  {
    name: "\u2652\ufe0f\u6c34\u74f6\u5ea7",
    type: "shuiping",
    params: "aquarius",
  },
  {
    name: "\u2653\ufe0f\u53cc\u9c7c\u5ea7",
    type: "shuangyu",
    params: "pisces",
  },
];
var timeList = [
  {
    name: "\u4eca\u65e5\u8fd0\u52bf",
    type: "D",
    params: "today",
  },
  {
    name: "\u660e\u65e5\u8fd0\u52bf",
    type: "T",
    params: "nextday",
  },
  {
    name: "\u672c\u5468\u8fd0\u52bf",
    type: "W",
    params: "week",
  },
  {
    name: "\u672c\u6708\u8fd0\u52bf",
    type: "M",
    params: "month",
  },
  {
    name: "\u672c\u5e74\u8fd0\u52bf",
    type: "Y",
    params: "year",
  },
];
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
    console.log(appName + "星座运势数据获取成功");
    setTimeout(() => {
      $XiaoMaoInfo.done();
    }, 5000);
  });

function XiaoMaoFunction() {
  if (
    $XiaoMaoInfo.read("HoroscopeList") &&
    $XiaoMaoInfo.read("HoroscopeTime")
  ) {
    XiaoMaoHoroscopeList = $XiaoMaoInfo.read("HoroscopeList").split("+");
    XiaoMaoHoroscopeTimeList = $XiaoMaoInfo.read("HoroscopeTime").split("+");
    if (XiaoMaoHoroscopeList.length && XiaoMaoHoroscopeTimeList.length) {
      XiaoMaoHoroscopeList.forEach((type) => {
        XiaoMaoHoroscopeTimeList.forEach((time) => {
          let typeObj = typeList.find((e) => e.type == type);
          let timeObj = timeList.find((e) => e.type == time);
          let timeObjName = timeObj.name.slice(0, 2);
          if (typeObj && timeObj) {
            let option = {
              url: encodeURI(
                "https://api.vvhan.com/api/horoscope?type=" +
                  typeObj.params +
                  "&time=" +
                  timeObj.params
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
                if (obj.success) {
                  let resultText =
                    typeObj.name +
                    "- " +
                    obj.data.type +
                    "（" +
                    obj.data.time +
                    "）" +
                    "\n\n";
                  if (obj.data.hasOwnProperty("todo")) {
                    resultText =
                      resultText +
                      timeObjName +
                      "吉凶宜忌：" +
                      "\n" +
                      "✅适宜动作：" +
                      (obj.data.todo.yi || "- ") +
                      "\n" +
                      "❎忌讳动作：" +
                      (obj.data.todo.ji || "- ") +
                      "\n" +
                      "🔢幸运数字：" +
                      (obj.data.luckynumber || "- ") +
                      "\n" +
                      "🎨幸运颜色：" +
                      (obj.data.luckycolor || "- ") +
                      "\n" +
                      "❤️速配星座：" +
                      (obj.data.luckyconstellation || "- ") +
                      "\n" +
                      "💔提防星座：" +
                      (obj.data.badconstellation || "- ") +
                      "\n" +
                      "💮运势短评：" +
                      (obj.data.shortcomment || "- ") +
                      "\n\n";
                  }
                  if (obj.data.hasOwnProperty("fortune")) {
                    let starIndex = "🌟🌟🌟🌟🌟";
                    resultText =
                      resultText +
                      timeObjName +
                      "运势：" +
                      "\n" +
                      "🈴综合运势：" +
                      starIndex.slice(0, 2 * parseInt(obj.data.fortune.all)) +
                      "\n" +
                      "💞爱情运势：" +
                      starIndex.slice(0, 2 * parseInt(obj.data.fortune.love)) +
                      "\n" +
                      "📖事业运势：" +
                      starIndex.slice(0, 2 * parseInt(obj.data.fortune.work)) +
                      "\n" +
                      "💰财富运势：" +
                      starIndex.slice(0, 2 * parseInt(obj.data.fortune.money)) +
                      "\n" +
                      "💪健康运势：" +
                      starIndex.slice(
                        0,
                        2 * parseInt(obj.data.fortune.health)
                      ) +
                      "\n\n";
                  }
                  if (obj.data.hasOwnProperty("index")) {
                    resultText =
                      resultText +
                      timeObjName +
                      "指数：" +
                      "\n" +
                      "🈴综合运势：" +
                      obj.data.index.all +
                      "\n" +
                      "💞爱情运势：" +
                      obj.data.index.love +
                      "\n" +
                      "📖事业运势：" +
                      obj.data.index.work +
                      "\n" +
                      "💰财富运势：" +
                      obj.data.index.money +
                      "\n" +
                      "💪健康运势：" +
                      obj.data.index.health +
                      "\n\n";
                  }
                  if (obj.data.hasOwnProperty("fortunetext")) {
                    resultText =
                      resultText +
                      timeObjName +
                      "运势解析：" +
                      "\n" +
                      "🈴综合运势：" +
                      obj.data.fortunetext.all +
                      "\n" +
                      "💞爱情运势：" +
                      obj.data.fortunetext.love +
                      "\n" +
                      "📖事业运势：" +
                      obj.data.fortunetext.work +
                      "\n" +
                      "💰财富运势：" +
                      obj.data.fortunetext.money +
                      "\n" +
                      "💪健康运势：" +
                      obj.data.fortunetext.health +
                      "\n" +
                      "😮‍💨解压秘诀：" +
                      (obj.data.fortunetext.decompression || "- ") +
                      "\n" +
                      "😄开运秘诀：" +
                      (obj.data.fortunetext.openluck || "- ") +
                      "\n\n";
                  }
                  $XiaoMaoInfo.notify("🌌XiaoMao_星座运势", "", resultText);
                }
              })
              .catch((err) => {
                getError(typeObj.name + "_error_1");
              });
          }
        });
      });
    }
  } else {
    $XiaoMaoInfo.notify(
      appName,
      "🚦数据获取失败❗️",
      "🚧星座默认参数未正确填写或获取失败，请前往XiaoMaoBoxJS填写！https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHoroscope.js"
    );
  }
}
function getError(params) {
  $XiaoMaoInfo.notify(
    "🌌XiaoMao_星座运势",
    "",
    "🚧" + params + "获取失败，请稍后再试❗️",
    "https://i.pixiv.re/img-original/img/2022/04/21/04/04/09/97769134_p0.png"
  );
}
setTimeout(() => {
  $done({});
}, 2000);
