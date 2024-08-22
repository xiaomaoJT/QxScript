/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-08-22
 *
 * 


\实\时\线\报\ \羊\毛\活\动\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加以下代码即可 或 于自动任务栏(三横杠按钮)，右上角加号，以文本方式添加以下代码即可。

0 0/20 0,1,2,3,7,8,9,10,11,12,13,14,15,17,18,19,20,21,23 * * ?  https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoYangMao.js, tag=🐑XiaoMao_实时线报, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute1/1689356.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoYangMao.js



须知：
默认每天7点到次日3点，每20分钟运行一次。


********************************/

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
const $ = new Env("XiaoMaoYangMao");

let url = "http://www.0818tuan.com/list-1-0.html";
let option = {
  url: encodeURI(url),
  method: "GET",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
  },
};
$.get(option, (err, resp, response) => {
  if (response) {
    let obj = response.replace(/\s*/g, "").toString();
    let startIndex = obj.indexOf('<divclass="list-group"');
    let endIndex = obj
      .substring(startIndex, obj.length)
      .indexOf('<divclass="pagerlist_page">');
    let subContent = obj.substring(startIndex, startIndex + endIndex);
    let temArr = subContent.split("<a");
    let subArr = temArr.slice(4, temArr.length);
    let subObjArr = [];
    let resultText = "";
    if (subArr.length) {
      let adReg = /\d+\./;
      let shopReg = /猫超|包邮|付|拍|秒杀|斤|加购|叠|凑|券|买\d件|拍\d件/;
      subArr.forEach((el) => {
        let textUrlStart = el.indexOf('href="');
        let textUrlEnd = el.indexOf('"target');
        let textTitleStart = el.indexOf('title="');
        let textTitleEnd = el.indexOf('"class=');
        let textTimeStart = el.indexOf('successred">');
        let textTimeEnd = el.indexOf("</span>");
        let url =
          "http://www.0818tuan.com" +
          el.substring(textUrlStart + 6, textUrlEnd);
        let title = el.substring(textTitleStart + 7, textTitleEnd);
        let time = el.substring(textTimeStart + 12, textTimeEnd);
        if (!adReg.test(title) && !shopReg.test(title))
          subObjArr.push({ url: url, title: title, time: time });
      });
      resultText =
        "🛟最新线报活动获取成功，" +
        "数据最新更新时间（" +
        subObjArr[0].time +
        "）,共获取到" +
        subObjArr.length +
        "条数据。" +
        "\n\n";
      subObjArr.forEach((el, i) => {
        resultText =
          resultText +
          "🏷[" +
          (i + 1) +
          "] " +
          "[" +
          el.time +
          "] " +
          el.title +
          "\n" +
          "🔗原文链接：" +
          el.url +
          "\n\n";
      });
      $.notify("🐑XiaoMao_实时线报❗️", "", resultText);
      $.log(resultText);
    } else {
      $.notify(
        "🚨XiaoMao_实时线报❗️",
        "",
        "🚧获取失败(error_1)，请稍后再试❗️",
        "https://i.pixiv.re/img-original/img/2014/02/01/21/15/37/41323022_p0.jpg"
      );
    }
  } else {
    $.notify(
      "🚨XiaoMao_实时线报❗️",
      "",
      "🚧获取失败(error_2)，请稍后再试❗️",
      "https://i.pixiv.re/img-original/img/2014/02/01/21/15/37/41323022_p0.jpg"
    );
  }
});

setTimeout(() => {
  $done({});
}, 2000);
