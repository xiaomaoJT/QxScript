/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-07-24
 *
 * 

\每\日\随\机\图\片\（\风\景\｜\二\次\元\｜\福\利\姬\）\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 0/4 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoPicView.js, tag=🖼️多元图片推送, img-url=https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/icon/pic.png, enabled=true


2、可通过boxjs设置指定类型
图片类型：1为风景,2为二次元,3为福利姬（电脑）,4为福利姬（手机），默认为随机输出。


单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoPicView.js

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

const $ = new Env("XiaoMaoPicView");
let picTypeList = {
  1: { label: "风景", value: "views" },
  2: { label: "二次元", value: "acg" },
  3: { label: "福利姬(电脑)", value: "pcGirl" },
  4: { label: "福利姬(手机)", value: "mobileGirl" },
};
let picType = Math.floor(Math.random() * 4) + 1;
$.read("picType") ? (picType = $.read("picType")) : "";
let option = {
  url: encodeURI(
    `https://api.vvhan.com/api/wallpaper/${picTypeList[picType].value}?type=json`
  ),
};
const getImgUrl = () => {
  $.get(option, (err, resp, response) => {
    if (response) {
      let obj = JSON.parse(response);
      if (obj.url) {
        let picture = obj.url.replace(".webp", ".png").replace(".jpg", ".png");
        checkImgExists(picture)
          .then(() => {
            $.notify(
              "🖼️多元图片推送",
              "",
              "图片类型:" + picTypeList[picType].label,
              picture
            );
            $.log("图片地址:" + picture);
            $done({});
          })
          .catch(() => {
            getImgUrl();
          });
      }
    } else {
      getError();
    }
  });
};
const checkImgExists = (imgUrl) => {
  return new Promise(function (resolve, reject) {
    var ImgObj = new Image();
    ImgObj.src = imgUrl;
    ImgObj.onload = function (res) {
      resolve(res);
    };
    ImgObj.onerror = function (err) {
      reject(err);
    };
  });
};
const getError = () => {
  $.notify(
    "XiaoMao提示",
    "",
    "本次图片获取失败!",
    "https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg"
  );
  $done({});
};
getImgUrl();
setTimeout(() => {
  getError();
}, 10000);
