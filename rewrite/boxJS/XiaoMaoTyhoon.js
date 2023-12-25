/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-08-18
 *
 * 


\实\时\台\风\信\息\播\报\
\支\持\多\台\风\监\测\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 9 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoTyhoon.js, tag=🌀XiaoMao_台风监测, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Blackhole.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoTyhoon.js

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
const $ = new Env("XiaoMaoTyhoon");

let tfDetails,
  tfInfo = "";
let tfDetailsList = [];
let url2 = encodeURI(
  "https://typhoon.slt.zj.gov.cn/Api/TyphoonList/" + new Date().getFullYear()
);
let option3 = {
  url: url2,
};
$.get(option3, (err, resp, response) => {
  if (response) {
    let obj = JSON.parse(response);
    if (obj.length) {
      obj.forEach((el) => {
        if (el.isactive == "1") {
          getDetail(el.tfid);
        }
      });
    }
  } else {
    getError("_error_1" + "获取失败，请稍后再试❗️");
  }
});

setTimeout(() => {
  let option = {
    url: encodeURI("https://typhoon.slt.zj.gov.cn/Api/TyhoonActivity"),
  };
  $.get(option, (err, resp, response) => {
    if (response) {
      let obj = JSON.parse(response);
      if (obj.length) {
        let objLength = obj.length;
        let returnText = "";

        obj.forEach((el, index) => {
          tfInfo =
            "[" +
            el.timeformate +
            "] " +
            el.tfid.substring(0, 4) +
            "年第" +
            el.tfid.substring(4, 6) +
            "号" +
            el.strong +
            el.name +
            "(" +
            el.enname +
            ")" +
            "\n" +
            "💨 当前风速：" +
            el.speed +
            "米/秒" +
            "\n" +
            "🪁 移速移向：" +
            el.movespeed +
            "公里/小时、" +
            el.movedirection +
            "\n" +
            "🎐 中心位置：东经" +
            el.lng +
            "°、北纬" +
            el.lat +
            "°" +
            "\n" +
            "🫧 中心气压：" +
            el.pressure +
            "百帕" +
            "\n" +
            "🌊 中心风力：" +
            el.power +
            "级" +
            "\n\n" +
            tfDetailsList[index] +
            "\n\n";

          returnText =
            returnText +
            (objLength < 2 ? "" : "[第" + (index + 1) + "条]") +
            tfInfo;
        });

        $.notify(
          "🌀XiaoMao_台风监测",
          "监测到" + objLength + "条台风数据",
          returnText
        );
        $.log(returnText);
      } else {
        getError("_err_2" + "获取失败或当前无台风❗️");
      }
    } else {
      getError("_err_3" + "获取失败，请稍后再试❗️");
    }
  });
}, 5000);

function getDetail(tfid) {
  let url = `https://typhoon.slt.zj.gov.cn/Api/TyphoonInfo/` + tfid;
  let option2 = {
    url: encodeURI(url),
  };
  $.get(option2, (err, resp, response) => {
    if (response) {
    } else {
      let obj2 = JSON.parse(response);
      if (obj2.points.length) {
        let tf_D = obj2.points.at(-1);
        let radius7,
          radius10,
          radius12 = "";
        if (tf_D.radius7) {
          let a = tf_D.radius7;
          if (a != "") {
            let b = a.split("|");
            let startNum = Math.min(...b);
            let endNum = Math.max(...b);
            if (startNum == endNum) {
              radius7 = "🕖 七级半径：" + startNum + "公里" + "\n";
            } else {
              radius7 =
                "🕖 七级半径：" + startNum + "~" + endNum + "公里" + "\n";
            }
          }
        }
        if (tf_D.radius10) {
          let a = tf_D.radius10;
          if (a != "") {
            let b = a.split("|");
            let startNum = Math.min(...b);
            let endNum = Math.max(...b);
            if (startNum == endNum) {
              radius10 = "🕙 十级半径：" + startNum + "公里" + "\n";
            } else {
              radius10 =
                "🕙 十级半径：" + startNum + "~" + endNum + "公里" + "\n";
            }
          }
        }
        if (tf_D.radius12) {
          let a = tf_D.radius12;
          if (a != "") {
            let b = a.split("|");
            let startNum = Math.min(...b);
            let endNum = Math.max(...b);
            if (startNum == endNum) {
              radius12 = "🕛 十二级半径：" + startNum + "公里" + "\n";
            } else {
              radius12 =
                "🕛 十二级半径：" + startNum + "~" + endNum + "公里" + "\n";
            }
          }
        }

        tfDetails =
          (radius7 || "") +
          (radius10 || "") +
          (radius12 || "") +
          "\n" +
          (tf_D.ckposition
            ? "🗼 参考位置：" + tf_D.ckposition.replace(/\s+/g, "") + "\n"
            : "") +
          (tf_D.jl ? "🎢 未来趋势：" + tf_D.jl.replace(/\s+/g, "") + "\n" : "");

        tfDetailsList.unshift(tfDetails || "");
      }
    }
  });
}

function getError(params = "") {
  $.notify(
    "🌀XiaoMao_台风监测",
    "",
    "🚧" + params,
    "https://i.pixiv.re/img-original/img/2021/01/01/21/42/56/86736781_p0.jpg"
  );
}
setTimeout(() => {
  $done({});
}, 8000);
