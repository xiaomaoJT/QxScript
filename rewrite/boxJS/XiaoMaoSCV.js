/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-06-28
 *
 * 

\1\8\🈲️\采\精\车\

仅供学习参考，请于下载后24小时内删除
请注意劳逸结合，控制车速

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加 或 于自动任务栏(三横杠按钮)，右上角加号，以文本方式添加以下代码即可

0 0 0,1,2,20,21,22,23 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoSCV.js, tag=🚗XiaoMao学习车, img-url=https://raw.githubusercontent.com/LovedGM/Quantumult-X-TuBiao/main/zishi-cs/zs3.png, enabled=true


运行无反应解决方案（需代理环境下运行）：
1⃣️ 添加本地分流
[filter_local]
host,missav.com,proxy
2⃣️ 兜底分流选择代理
3⃣️ 使用全局模式
4⃣️ 放弃


单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoSCV.js

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
const $ = new Env("XiaoMaoSCV");

let url =
  "https://missav.com/random/" + (Math.random() * 100).toFixed(0).toString();
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
    let obj = response;
    const regExp = /<img[^>]+src=['"]([^'"]+)['"]+/g;
    const regExp2 = /<a[^>]+href=['"]([^'"]+)['"]+/g;
    const regExp3 = /<img[^>]+alt=['"]([^'"]+)['"]+/g;
    const result = [],
      result2 = [],
      result3 = [];
    let temp;
    while ((temp = regExp.exec(obj)) != null) {
      result.push(temp[1]);
    }
    while ((temp = regExp2.exec(obj)) != null) {
      if (!result2.includes(temp[1])) {
        result2.push(temp[1]);
      }
    }
    while ((temp = regExp3.exec(obj)) != null) {
      result3.push(temp[1]);
    }
    let list = [];
    let img = "";
    let resultText =
      "🛟 复制感兴趣的地址前往浏览器查看吧，请注意劳逸结合哟～" + "\n\n";
    if (result.length) {
      result.forEach((el, index) => {
        list.push({
          imgUrl: el,
          videoUrl: result2 && result2[index],
          title: result3 && result3[index],
        });
      });
      list.forEach((el, index) => {
        if (index == 0) {
          img = el.imgUrl;
        }
        resultText =
          resultText +
          "⛽️第" +
          (index + 1) +
          "车：" +
          el.title +
          "\n" +
          "📀视频地址：" +
          el.videoUrl +
          "\n\n\n";
      });
      $.notify(
        "🚗XiaoMao_采精车发车成功❗️",
        "🚧请注意控制车速❗️",
        resultText,
        img
      );
      $.log(resultText);
    }
  } else {
    $.notify(
      "🚨XiaoMao_采精车发车失败❗️",
      "",
      "🚧抛锚了，请尝试重新点火❗️",
      "https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg"
    );
  }
});

setTimeout(() => {
  $done({});
}, 2000);
