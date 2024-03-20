/**
 *  @XiaoMao
 *  TG通知频道：https://t.me/xiaomaoJT
 * 
 * 刷激励部分来源于@Yu9191
 * https://raw.githubusercontent.com/Yu9191/Rewrite/main/Huohuotu/huohuotu.js
 * 



获取授权 -- 点击页面广告解锁按钮激活
————————————————————————————
[mitm]
hostname = api.cloud.alilo.com.cn
[rewrite_local]
https:\/\/api\.cloud\.alilo\.com\.cn\/api\/v4\/user-activation\/check-sowing url script-request-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/hht.js



\刷\广\告\激\励\
——————————————————————————————
[task_local]
0 0 9 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/hht.js, tag=🐰XiaoMao_火火兔刷激励, img-url=https://raw.githubusercontent.com/Toperlock/Quantumult/main/icon/Doraemon/Doraemon-1099.png, enabled=false


 * 
 * 
 * 
 * 
 * 
 */

let $ = new Env("HuoHuoTu");
if ($request) {
  let requestUrl = $request;
  let hht_token = requestUrl.headers.token;
  let hht_id = JSON.parse(requestUrl.body).userId.toString();
  let hht_album_id = JSON.parse(requestUrl.body).albumId;
  $.write(hht_token, "hht_token");
  $.write(hht_id, "hht_id");
  $.write(hht_album_id, "hht_album_id");
  $.notify(
    "XiaoMao_火火兔 执行成功！",
    "",
    "用户授权获取成功！" +
      "\n" +
      "Token：" +
      hht_token +
      "\n" +
      "UserId：" +
      hht_id +
      "\n" +
      "AlbumId：" +
      hht_album_id,
    ""
  );
  $done({});
} else {
  // 文章id albumid
  const myAlbumId = $.read("hht_album_id");
  // 用户id userId
  const myUserId = $.read("hht_id");

  // 这个一般不会变
  const myToken = $.read("hht_token");
  // 一般只需要填写一次
  const myCookie = "UM_dist792";

  // 准备请求的数据
  const url = `https://api.cloud.alilo.com.cn/api/v4/user-activation/trigger-excitation`;
  const method = `POST`;
  const headers = {
    "Accept-Encoding": `gzip, deflate, br`,
    Cookie: myCookie,
    Connection: `keep-alive`,
    "Content-Type": `application/json`,
    Accept: `*/*`,
    Host: `api.cloud.alilo.com.cn`,
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 15_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/20) uni-app`,
    version: `5.2.006`,
    token: myToken,
    "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
  };
  function prepareBody(userId, albumId) {
    return `{"policyId":20,"userId":${userId},"albumId":"${albumId}","pricingId":2,"resType":40,"platform":20,"openId":"","channelId":102}`;
  }
  // 发送请求的函数
  function sendRequest(attempt) {
    // console.log(`发起第${attempt}次请求...`);
    const myRequest = {
      url: url,
      method: method,
      headers: headers,
      body: prepareBody(myUserId, myAlbumId),
    };
    $task.fetch(myRequest).then(
      (response) => {
        let obj = JSON.parse(response.body);
        if(obj.info == '可解锁'){
          console.log(
            `请求 ${attempt}: ${obj.info} \n`
          );
        }else{
          console.log(
            `请求 ${attempt}: ${obj.info} \n 解锁所需分数：${obj.data.albumUnlockedPrice} \n 当前拥有分数：${obj.data.userUnlockedPrice}`
          );
        }
        
        if (obj.data.userUnlockedPrice < obj.data.albumUnlockedPrice) {
          // 继续发送下一次请求
          sendRequest(attempt + 1);
        } else {
          console.log(`共发起 ${attempt} 次请求，已刷满！`);
          $done();
        }
      },
      (reason) => {
        console.log(`第 ${attempt} 请求错误: ${reason.error}`);
        $done();
      }
    );
  }
  // 开始发送第一次请求
  sendRequest(1);
}
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
