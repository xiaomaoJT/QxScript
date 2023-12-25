/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-09-14
 *
 * 


\中\国\福\利\彩\票\最\新\开\奖\结\果\
\双\色\球\ \福\彩\3\d\ \快\乐\8\ \七\乐\彩\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 21 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWelfareLottery.js, tag=🎟XiaoMao_福彩查询, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Cryptocurrency_2.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWelfareLottery.js

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
const $ = new Env("XiaoMaoWelfareLottery");

let wf1 = new Promise((resolve, reject) => {
  let url = encodeURI(
    "http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=1&week=&systemType=PC"
  );
  $.get({ url: url }, (err, resp, response) => {
    if (response) {
      let obj = JSON.parse(response);
      resolve(obj);
    } else {
      getError("_error_1" + "获取失败，请稍后再试❗️");
    }
  });
});
let wf2 = new Promise((resolve, reject) => {
  let url = encodeURI(
    "http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=kl8&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=1&week=&systemType=PC"
  );
  $.get({ url: url }, (err, resp, response) => {
    if (response) {
      let obj = JSON.parse(response);
      resolve(obj);
    } else {
      getError("_error_1" + "获取失败，请稍后再试❗️");
    }
  });
});
let wf3 = new Promise((resolve, reject) => {
  let url = encodeURI(
    "http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=3d&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=1&week=&systemType=PC"
  );
  $.get({ url: url }, (err, resp, response) => {
    if (response) {
      let obj = JSON.parse(response);
      resolve(obj);
    } else {
      getError("_error_1" + "获取失败，请稍后再试❗️");
    }
  });
});
let wf4 = new Promise((resolve, reject) => {
  let url = encodeURI(
    "http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=qlc&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=1&week=&systemType=PC"
  );
  $.get({ url: url }, (err, resp, response) => {
    if (response) {
      let obj = JSON.parse(response);
      resolve(obj);
    } else {
      getError("_error_1" + "获取失败，请稍后再试❗️");
    }
  });
});
Promise.all([wf1, wf2, wf3, wf4])
  .then((result) => {
    let returnText = "中国福利彩票最新开奖结果公示" + "\n\n";
    if (result.length != 4) {
      returnText = returnText + "获取数据结果出错，请稍后再试～";
    } else {
      result.forEach((el, index) => {
        switch (index) {
          case 0:
            returnText =
              returnText +
              "🏓【" +
              el.result[0].name +
              "】" +
              "[期号：" +
              el.result[0].code +
              "_" +
              el.result[0].date +
              "] " +
              "\n" +
              "🔴 " +
              el.result[0].red.replace(/,/g, " ") +
              "  🔵 " +
              el.result[0].blue.replace(/,/g, " ") +
              "\n\n";
            break;
          case 1:
            returnText =
              returnText +
              "🎱【" +
              el.result[0].name +
              "】" +
              "[期号：" +
              el.result[0].code +
              "_" +
              el.result[0].date +
              "] " +
              "\n" +
              "🔴 " +
              el.result[0].red.replace(/,/g, " ") +
              "\n\n";
            break;
          case 2:
            returnText =
              returnText +
              "🏈【" +
              el.result[0].name +
              "】" +
              "[期号：" +
              el.result[0].code +
              "_" +
              el.result[0].date +
              "] " +
              "\n" +
              "🔴 " +
              el.result[0].red.replace(/,/g, " ") +
              "\n\n";
            break;
          case 3:
            returnText =
              returnText +
              "⚽️【" +
              el.result[0].name +
              "】" +
              "[期号：" +
              el.result[0].code +
              "_" +
              el.result[0].date +
              "] " +
              "\n" +
              "🔴 " +
              el.result[0].red.replace(/,/g, " ") +
              " 🔵 " +
              el.result[0].blue.replace(/,/g, " ") +
              "\n\n";
            break;
          default:
            break;
        }
      });
    }
    $.notify(
      "🎟XiaoMao_福彩查询",
      "福彩数据获取成功，点击查看详情～",
      returnText
    );
    $.log(returnText);
  })
  .catch((error) => {
    console.log(error);
    getError("_error_1");
  });
function getError(params = "") {
  $.notify(
    "🎟XiaoMao_福彩查询",
    "",
    "🚧" + params,
    "https://i.pixiv.re/img-original/img/2020/08/27/18/55/26/83968563_p0.jpg"
  );
}
setTimeout(() => {
  $done({});
}, 3000);
