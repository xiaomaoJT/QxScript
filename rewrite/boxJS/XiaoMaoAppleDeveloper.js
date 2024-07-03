/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-07-03
 *
 * 


\获\取\a\p\p\l\e\更\新\信\息\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoAppleDeveloper.js

(访问 https://developer.apple.com/download ，或根据自动任务脚本通知来获取Cookie)


2、⚠️ 配置文件 [task_local] 标签添加

0 0 1 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoAppleDeveloper.js, tag=XiaoMao_Beta更新, img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Social_Media/Apple.png, enabled=true


[mitm]
hostname = developer.apple.com

[rewrite_local]
https:\/\/developer\.apple\.com\/download url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoAppleDeveloper.js


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
const $ = new Env("XiaoMaoAppleBeta");
try {
  let cookie = $request.headers.Cookie;
  $.write(cookie, "betaCookie");
  $.notify(
    "XiaoMao_Beta更新",
    "Cookie获取成功，可关闭Cookie捕获脚本！",
    `Cookie:` + $.read("betaCookie"),
    "https://i.pixiv.re/img-original/img/2023/03/07/18/30/03/105999326_p0.jpg"
  );
  $done({});
} catch (e) {}

// 获取内容
function getBetaInfo(params) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(params, "text/html");
  const sectionDownloads = doc.querySelector(".section.section-downloads");
  const results = [];
  if (sectionDownloads) {
    const columnDivs = sectionDownloads.querySelectorAll(
      ".column.large-9.medium-8.small-12"
    );
    columnDivs.forEach((div) => {
      const h3 = div.querySelector("h3");
      const p = div.querySelector("p");
      const ul = div.querySelector("ul");
      // 创建一个对象来存储该div的内容
      const content = {
        h3: h3 ? h3.textContent.trim() : "",
        p: p ? p.textContent.trim() : "",
        ul: ul
          ? Array.from(ul.querySelectorAll("li")).map((li) =>
              li.textContent.trim()
            )
          : [],
      };
      results.push(content);
    });
  }
  return results;
}

let url = "https://developer.apple.com/download";
// 核心函数
let option = {
  url: encodeURI(url),
  method: "GET",
  headers: {
    Cookie: $.read("betaCookie") ?? "",
  },
};
$.get(option, (error1, resp1, response) => {
  if (response) {
    let list = getBetaInfo(response);
    if (list.length) {
      let betaText = "";
      list.map((item, index) => {
        betaText =
          betaText +
          `⚙️版本类型：${item.h3 ?? ""}` +
          "\n" +
          `🎟版本编号：${item.ul[1] ?? ""}` +
          "\n" +
          `⏰发布时间：${item.ul[0].replace("Released", "") ?? ""}` +
          "\n" +
          `🎞️版本描述：${item.p ?? ""}` +
          "\n\n";
      });
      $.notify(
        "Beta更新",
        `数据获取成功，共${list.length}项更新，点击查看详情`,
        betaText
      );
      $.notify(
        "Beta更新",
        `共${list.length}项更新信息，点击跳转Apple Developer`,
        "",
        "https://developer.apple.com/download"
      );
      $done({});
    } else {
      $.notify(
        "Beta更新",
        "数据获取失败❗️Cookie失效❗️请重新获取❗️",
        "登陆失效，请点击通知跳转浏览器重新登录，并获取Cookie！",
        "https://developer.apple.com/download"
      );
      $done({});
    }
  } else {
    getError("5001");
  }
});

function getError(err) {
  $.notify(
    "XiaoMao_Beta更新❗️",
    "",
    "🚧系统错误，请稍后再试❗️" + err,
    "https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg"
  );
  $done({});
}
