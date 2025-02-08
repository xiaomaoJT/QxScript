/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2025-02-08
 *
 * 


\猫\眼\票\房\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、⚠️ QX > 请求列表(三横杠按钮) > 右上角加号 > 文本方式添加代码

0 0 2 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoMaoYanPiaoFang.js, tag=🍿XiaoMao_猫眼票房, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute1/1814233.png, enabled=true




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
const $ = new Env("XiaoMaoMaoYanPiaoFang");

// 核心函数
let option = {
  url: encodeURI(
    `https://piaofang.maoyan.com/dashboard-ajax/movie?orderType=0&timeStamp=${new Date().getTime()}&channelId=40009&sVersion=2&WuKongReady=h5`
  ),
  method: "GET",
};

const getRankEmoji = (index) => {
  let rankEmoji = (index + 1).toString().padStart(2, "0") + " ";
  switch (index) {
    case 0:
      rankEmoji = "🥇";
      break;
    case 1:
      rankEmoji = "🥈";
      break;
    case 2:
      rankEmoji = "🥉";
      break;
    default:
      break;
  }
  return rankEmoji;
};
const padToChars = (input, Length = 9) => {
  const targetLength = Length;
  const paddingChar = " ";
  const currentLength = input.length;
  if (currentLength < targetLength) {
    const paddingLength = targetLength - currentLength;
    const paddedString = "" + paddingChar.repeat(paddingLength) + " ";
    return input + paddedString;
  }
  return input + " ";
};

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

$.get(option, (error1, resp1, response) => {
  if (response) {
    let res = JSON.parse(response)?.movieList;
    let list = res?.list;
    let returnText =
      "🍿电影票房（" +
      formatTime(res.updateInfo.updateTimestamp) +
      "）" +
      "\n" +
      `${
        "总出票：" +
        res.nationBoxInfo.viewCountDesc +
        "  " +
        "总场次：" +
        padToChars(res.nationBoxInfo.showCountDesc, 9)
      }` +
      "\n\n\n";
    if (list?.length) {
      list.map((el, index) => {
        returnText =
          returnText +
          `${getRankEmoji(index) + el.movieInfo.movieName}(${
            el.movieInfo.releaseInfo
          })\n` +
          `${
            padToChars("总票房", 7) +
            padToChars("分账票房", 7) +
            padToChars("票房占比", 5) +
            padToChars("排片占比", 5) +
            padToChars("排片场次", 5)
          }\n` +
          `${
            padToChars(el.sumBoxDesc, 8) +
            padToChars(el.sumSplitBoxDesc, 9) +
            padToChars(el.boxRate, 7) +
            padToChars(el.showCountRate, 8) +
            padToChars(el.showCount, 6)
          }\n\n`;
      });
      $.notify(
        "🍿猫眼实时电影票房",
        "票房数据获取成功，点击查看详情～",
        returnText
      );
    }
    $done({});
  } else {
    getError("请求内容失败");
  }
});

function getError(err) {
  $.notify(
    "🍿XiaoMao_猫眼票房❗️",
    err,
    "🚧信息错误，请稍后再试❗️",
    "https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg"
  );
  $done({});
}

setTimeout(() => {
  getError("请求超时，请稍后再试～");
}, 10000);
