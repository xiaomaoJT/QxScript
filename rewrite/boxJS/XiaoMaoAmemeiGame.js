/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-08-16
 *
 * 


\X\i\a\o\M\a\o\A\m\e\m\e\i\G\a\m\e\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、、⚠️ 配置文件 [task_local] 标签添加

0 0 1 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoAmemeiGame.js, tag=🎮XiaoMao_Amemei游戏列表, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute1/1818309.png, enabled=false



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
const $ = new Env("XiaoMaoAmemeiGame");

// 获取内容
function extractLinksAndText(htmlString) {
  // 创建一个虚拟的DOM元素，用来解析HTML字符串
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  // 选择所有的 <a> 标签
  const links = doc.querySelectorAll("a");
  // 提取每个 <a> 标签的 href 属性和文本内容并放入数组
  const linksAndText = [];
  links.forEach((link) => {
    linksAndText.push({
      href: link.href,
      text: link.textContent.trim(),
    });
  });
  return linksAndText;
}

// 核心函数
let option = {
  url: encodeURI("https://amemei-lists.top/posts/49e03169/"),
  method: "GET",
};
$.get(option, (error1, resp1, response) => {
  if (response) {
    let text = response.substring(
      response.indexOf("遊戲清單"),
      response.length
    );
    let textSource = text.substring(
      text.indexOf("<ul>"),
      text.indexOf("</ul>") + 5
    );
    let gameList = extractLinksAndText(textSource);
    if (gameList.length) {
      let returnText =
        `🎮遊戲清單「共${gameList.length}款」` +
        "\n" +
        "{数据来源于amemei-lists.top}" +
        "\n" +
        "{网络不畅建议开启代理，游戏进度保存于浏览器缓存，请勿使用无痕模式!}" +
        "\n\n";
      gameList.map((el, i) => {
        returnText =
          returnText +
          "🕹️" +
          (i + 1).toString().padStart(2, "0") +
          "  " +
          el.text +
          "\n" +
          el.href +
          "\n\n";
      });
      $.notify(
        "🎮XiaoMao_Amemei游戏列表",
        `游戏列表成功，共${gameList.length}款，点击查看详情`,
        returnText
      );
      $.log(returnText);
      $done({});
    } else {
      getError("内容为空");
    }
  } else {
    getError("5001");
  }
});

function getError(err) {
  $.notify(
    "🎮XiaoMao_Amemei游戏列表❗️",
    "",
    "🚧系统错误，请稍后再试❗️" + err,
    "https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg"
  );
  $done({});
}
