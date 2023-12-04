/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-07-01
 *
 * 


\每\日\新\闻\6\0\s\
\每\天\早\上\1\0\点\，\推\送\新\闻\了\解\世\界\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

0 0 10 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoNews.js, tag=📰XiaoMao_每日新闻60s, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute1/1689251.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoNews.js

********************************/

const $ = new Env("XiaoMaoNews");

let url = "https://www.5fm.cn/" + (488 + restDate("2023/06/18")) + ".html";
let option = {
  url: encodeURI(url),
  method: "GET",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
  },
};
let option_standby = {
  url: encodeURI("https://api.vvhan.com/api/60s?type=json"),
  method: "GET",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
  },
};
function restDate(date) {
  const target = +new Date(date);
  const today = +new Date();
  const A_DAY = 1000 * 60 * 60 * 24;
  const diff = target - today;
  const restDays = Math.floor(diff / A_DAY);
  return Math.abs(restDays + 1);
}
$.get(option, (err, resp, response) => {
  if (response) {
    let obj = response.replace(/\s*/g, "").toString();
    let resultText = "🛟 每天60s读懂世界新闻，每天六十秒看懂世界频道" + "\n\n";
    let img =
      "https://www.5fm.cn/60s/" +
      new Date().getDay() +
      "/" +
      parseInt(Math.random() * 9) +
      ".jpg";
    if (obj.indexOf("未找到页面")) {
      $.get(option_standby, (err, resp, res_sta) => {
        if (res_sta) {
          let res_sta_return = JSON.parse(res_sta);
          if (res_sta_return.success) {
            let list = res_sta_return.data;
            if (list.length) {
              list.forEach((el, index) => {
                resultText =
                  resultText +
                  (index == list.length - 1 ? "📙" : "🔖 ") +
                  el +
                  "\n\n";
              });
              $.notify("📰XiaoMao_每日新闻60s❗️", "", resultText, img);
              $.log(resultText);
              return;
            }
          } else {
            getError();
            return;
          }
        } else {
          getError();
          return;
        }
      });
    } else {
      let result = obj.split("<pdata-pid=");
      let result_finally = result.slice(
        4,
        result.findIndex((el) => el.indexOf("微语") != -1) + 1
      );
      let list = [];
      result_finally.forEach((el) => {
        let start = el.indexOf(">");
        let end = el.indexOf("<");
        list.push(el.substring(start + 1, end));
      });
      if (result.length) {
        list.forEach((el, index) => {
          resultText =
            resultText +
            (index == list.length - 1 ? "📙" : "🔖 ") +
            el +
            "\n\n";
        });
        $.notify("📰XiaoMao_每日新闻60s❗️", "", resultText, img);
        $.log(resultText);
      } else {
        $.notify(
          "🚨XiaoMao_每日新闻60s数据抓取失败❗️",
          "",
          "🚧建议设定于每日早9点或10点后运行此脚本❗️",
          "https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg"
        );
      }
    }
  } else {
    getError();
  }
});

function getError() {
  $.notify(
    "🚨XiaoMao_每日新闻60s推送失败❗️",
    "",
    "🚧请稍后再试❗️",
    "https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg"
  );
}
setTimeout(() => {
  $done({});
}, 2000);

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
  const notify = (title = "XiaoMao", subtitle = "", message = "", url = "") => {
    if (isLoon) $notification.post(title, subtitle, message, url);
    if (isSurge) $notification.post(title, subtitle, message, { url });
    if (isQX) $notify(title, subtitle, message, { "open-url": url });
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
