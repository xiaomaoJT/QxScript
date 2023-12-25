/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-04-10
 *
 * 

\年\度\节\日\信\息\推\送\+\b\i\n\g\每\日\图\片\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

0 0 8 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHoliday.js, tag=💢年度节日自动推送, img-url=https://raw.githubusercontent.com/shoujiqiyuan/PokemonGOforQuanX/master/IconSet/Z002.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHoliday.js

********************************/

const $ = new Env("XiaoMaoHoliday");
let year = new Date().getFullYear().toString();
let nowMonth = (new Date().getMonth() + 1).toString().padStart(2, 0);
let nowDay = new Date().getDate().toString().padStart(2, 0);
let time = new Date().getTime() / 1000;
let dateTime = year + nowMonth + nowDay;
let option = {
  url: encodeURI(
    "https://pan.baidu.com/api/getholiday?vip=0&version=11.34.5&queryfree=2&network_type=wwan&freeisp=0&activestatus=0&time=" +
      time +
      "&clienttype=1&status=0&date=" +
      year
  ),
};
$.get(option, (err, resp, response) => {
  if (response) {
    let obj = JSON.parse(response);
    if (obj.errno == 0 && obj.data.hasOwnProperty(dateTime)) {
      $.notify(
        "💢节日推送·" +
          obj.data[dateTime].name +
          "·" +
          obj.data[dateTime].tag || "💢节日推送",
        "",
        obj.data[dateTime].info || "",
        "https://apis.jxcxin.cn/api/Bing"
      );
      $.log(obj.data[dateTime].info);
    } else {
      $.notify(
        "早上好",
        "",
        "今天是" + year + "年" + nowMonth + "月" + nowDay + "日",
        "https://apis.jxcxin.cn/api/Bing"
      );
    }
  } else {
    $.notify(
      "XiaoMao提示",
      "",
      "节日信息获取失败!",
      "https://i.pixiv.re/img-original/img/2023/01/08/00/35/11/104329217_p0.jpg"
    );
  }
});
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
