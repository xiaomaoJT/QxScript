/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-11-23
 *
 * 

\和\包\银\联\红\包\商\品\种\类\查\询\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

0 0 0/4 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHeBao.js, tag=🎁XiaoMao_和包银联红包查询, img-url=https://raw.githubusercontent.com/Toperlock/Quantumult/main/icon/Doraemon/Doraemon-1037.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHeBao.js

********************************/

const $ = new Env("XiaoMaoHeBao");

const url = "https://m.jf.10086.cn/cmcc-hepay-shop/search/query";
const method = "POST";
const headers = {
  Connection: "keep-alive",
  "Accept-Encoding": "gzip, deflate, br",
  "Content-Type": "application/json",
  Origin: "https://m.jf.10086.cn",
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 Hebao/9.15.42/com.cmpay.CMPayClient /sa-sdk-ios/sensors-verify/uba.cmpay.com?production ",
  Host: "m.jf.10086.cn",
  Referer: "https://m.jf.10086.cn/",
  "Accept-Language": "zh-CN,zh-Hans;q=0.9",
  Accept: "*/*",
};
const body =
  '{"sortColumn":"default","sortType":"desc","pageSize":20,"pageNum":1,"firstKeyword":"银联","integral":820,"userPhoneNo":"10000000000","province":"jx"}';
const myRequest = { url: url, method: method, headers: headers, body: body };

$.post(myRequest, (err, resp, response) => {
  let returnText = "";
  if (response) {
    let body = JSON.parse(response);
    let returnText = "";
    let searchLen = body.resultJson.searchList.length;
    if (searchLen) {
      returnText =
        "✅银联红包商品查询成功！" + "\n\n" + "共" + searchLen + "款商品：";

      let hotList =
        "\n\n" +
        "🔥热门商品清单：" +
        "\n\n" +
        " 5元红包：" +
        (body.resultJson.searchList.some(
          (e) => e.name.indexOf("银联红包5元") != -1
        )
          ? "✅"
          : "🈚️") +
        "\n" +
        "10元红包：" +
        (body.resultJson.searchList.some(
          (e) => e.name.indexOf("银联红包10元") != -1
        )
          ? "✅"
          : "🈚️") +
        "\n" +
        "20元红包：" +
        (body.resultJson.searchList.some(
          (e) => e.name.indexOf("银联红包20元") != -1
        )
          ? "✅"
          : "🈚️") +
        "\n" +
        "30元红包：" +
        (body.resultJson.searchList.some(
          (e) => e.name.indexOf("银联红包30元") != -1
        )
          ? "✅"
          : "🈚️") +
        "\n" +
        "50元红包：" +
        (body.resultJson.searchList.some(
          (e) => e.name.indexOf("银联红包50元") != -1
        )
          ? "✅"
          : "🈚️") +
        "\n\n" +
        "快去和包商场兑换吧～";

      returnText =
        returnText +
        body.resultJson.searchList.map((e) => e.name).toString() +
        "\n\n" +
        hotList;

      $.log(returnText);
    } else {
      returnText = "❌查询失败，请稍后再试～";
    }
    $.notify("🎁XiaoMao_和包银联红包查询", "", returnText);
  } else {
    returnText = "❌查询失败，请稍后再试～";
    $.notify("🎁XiaoMao_和包银联红包查询", "", "❌查询失败，请稍后再试～");
  }
});

setTimeout(() => {
  $done();
}, 3000);

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
