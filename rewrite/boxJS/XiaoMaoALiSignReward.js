/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-08-08
 *
 * 

\阿\里\云\盘\签\到\+\奖\励\领\取\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoALiSignReward.js

2、签到奖励手动领取一次后触发自动领取「自动从第一天领取到当天」「领取完可关闭脚本」

3、⚠️ 配置文件 [task_local] 标签添加
// 每日签到
0 8 * * * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/ali_sign_auto2.js, tag=阿里云签到, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/AliYunDrive.png, enabled=true


********************************

[mitm]
hostname = member.aliyundrive.com,auth.alipan.com,aliyundrive.alipan.com

[rewrite_local]
// 获取签到Token
https:\/\/member\.aliyundrive\.com\/v1\/activity\/sign_in_reward url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoALiSignReward.js

// 获取账号Token
^https:\/\/(auth|aliyundrive)\.alipan\.com\/v2\/account\/token url script-request-body https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.js


********************************/

let $ = new Env("AliSignReward");
let headers = $request && $request.headers;
let requestUrl = $request && $request.url;

// 当天
const getGoneDay = (n = 0, yearFlag = true) => {
  let myDate = new Date();
  myDate.setDate(myDate.getDate() - n);
  let month = myDate.getMonth() + 1;
  let day = myDate.getDate();
  let result =
    "" +
    (yearFlag ? myDate.getFullYear() : "") +
    "/" +
    month +
    "/" +
    (day < 10 ? "0" + day : day);
  return result;
};

// 领取主奖励
const getMainReword = (signInCount) => {
  try {
    let mainOption = {
      url: "https://member.aliyundrive.com/v1/activity/sign_in_reward",
      method: "POST",
      headers: {
        Host: "member.aliyundrive.com",
        Cookie: $.read("Cookie"),
        "User-Agent":
          "AliApp(AYSD/5.8.1) com.alicloud.smartdrive/5.8.1 Version/17.6.1 Channel/201200 Language/zh-Hans-CN /iOS Mobile/iPhone16,2",
        "x-timestamp": $.read("x-timestamp"),
        Referer: "https://aliyundrive.com/",
        "X-Canary": "client=web,app=other,version=v0.1.0",
        "x-sgext": $.read("x-sgext"),
        "x-device-id": $.read("x-device-id"),
        "Content-Length": 17,
        Connection: "keep-alive",
        "x-signature": $.read("x-signature"),
        "x-sign": $.read("x-sign"),
        "x-mini-wua": $.read("x-mini-wua"),
        Authorization: $.read("Authorization"),
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "x-umt": $.read("x-umt"),
        Accept: "*/*",
        "Content-Type": "application/json; charset=UTF-8",
        "x-signature-v2": $.read("x-signature-v2"),
        "Accept-Encoding": "gzip, deflate, br",
        "x-nonce": $.read("x-nonce"),
      },
      body: JSON.stringify({
        signInDay: parseInt(signInCount),
      }),
    };
    $.post(mainOption, (err, resp, responseJSON) => {
      let response = JSON.parse(responseJSON);
      if (
        response.hasOwnProperty("code") &&
        (response.code == "Forbidden" ||
          response.code == "InvalidSignature" ||
          response.code == "ExchangeFailed")
      ) {
        let { message } = response;
        console.log(`❌第${signInCount}天主奖励: ${message}`);
        $.notify(
          "XiaoMao阿里云盘",
          "云盘临时Token已失效，请前往App手动领取一次奖励进行激活！",
          message,
          ""
        );
        $.done({});
      } else if (response.hasOwnProperty("result")) {
        let { result } = response;
        console.log(
          `🎉第${signInCount}天主奖励: ${result.description}领取成功!`
        );
      } else {
        getError("1");
      }
    });
  } catch (e) {
    getError("2");
    throw e;
  }
};
//领取备份奖励
const getReword = (signInCount) => {
  try {
    let mainOption = {
      url: "https://member.aliyundrive.com/v2/activity/sign_in_task_reward?_rx-s=mobile",
      method: "POST",
      headers: {
        Host: "member.aliyundrive.com",
        Cookie: $.read("Cookie"),
        "User-Agent":
          "AliApp(AYSD/5.8.1) com.alicloud.smartdrive/5.8.1 Version/17.6.1 Channel/201200 Language/zh-Hans-CN /iOS Mobile/iPhone16,2",
        "x-timestamp": $.read("x-timestamp"),
        Referer: "https://aliyundrive.com/",
        "X-Canary": "client=web,app=other,version=v0.1.0",
        "x-sgext": $.read("x-sgext"),
        "x-device-id": $.read("x-device-id"),
        "Content-Length": 17,
        Connection: "keep-alive",
        "x-signature": $.read("x-signature"),
        "x-sign": $.read("x-sign"),
        "x-mini-wua": $.read("x-mini-wua"),
        Authorization: $.read("Authorization"),
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "x-umt": $.read("x-umt"),
        Accept: "*/*",
        "Content-Type": "application/json; charset=UTF-8",
        "x-signature-v2": $.read("x-signature-v2"),
        "Accept-Encoding": "gzip, deflate, br",
        "x-nonce": $.read("x-nonce"),
      },
      body: JSON.stringify({
        signInDay: parseInt(signInCount),
      }),
    };
    $.post(mainOption, (err, resp, responseJSON) => {
      let response = JSON.parse(responseJSON);
      if (
        response.hasOwnProperty("code") &&
        (response.code == "Forbidden" ||
          response.code == "ExchangeFailed" ||
          response.code == "InvalidSignature")
      ) {
        let { message } = response;
        console.log(`❌第${signInCount}天备份奖励: ${message}`);
      } else if (response.hasOwnProperty("result")) {
        let { result } = response;
        console.log(
          `🎉第${signInCount}天备份奖励: ${result.description}领取成功!`
        );
      } else {
        getError("3");
      }
    });
  } catch (e) {
    getError("4");
    throw e;
  }
};

let doneIndex = 0;
let nowDay = getGoneDay();
let nowDayNum = parseInt(nowDay.substr(nowDay.lastIndexOf("/") + 1, 2));

const timeMagic = async (index) => {
  return new Promise((reslove) => {
    setTimeout(async () => {
      await getMainReword((index + 1).toString());
      // await getReword((index + 1).toString());
      reslove();
    }, 300 + parseInt(Math.random() * 10 * index));
  });
};

//获取奖励
const getAllReward = async () => {
  if (!$.read("Cookie")) {
    $.notify(
      "XiaoMao阿里云盘",
      "Token获取失败，请先去获取临时Token吧",
      "前往App手动领取一次奖励获取Token",
      ""
    );
    $.done({});
  }
  for (let index = 0; index < nowDayNum; index++) {
    doneIndex++;
    await timeMagic(index);
  }
  if (doneIndex == nowDayNum) {
    setTimeout(() => {
      $.notify(
        "XiaoMao阿里云盘！",
        "奖励领取执行完成！",
        "请刷新App签到页面或查看日志检查领取状态！",
        ""
      );
      $.done({});
    }, 2000);
  }
};

if (
  requestUrl &&
  /^https:\/\/member\.aliyundrive\.com\/v1\/activity\/sign_in_reward?/.test(
    requestUrl
  )
) {
  if ($.read("x-timestamp") == headers["x-timestamp"]) {
    $done({
      headers: {
        Host: "member.aliyundrive.com",
        Cookie: $.read("Cookie"),
        "User-Agent":
          "AliApp(AYSD/5.8.1) com.alicloud.smartdrive/5.8.1 Version/17.6.1 Channel/201200 Language/zh-Hans-CN /iOS Mobile/iPhone16,2",
        "x-timestamp": $.read("x-timestamp"),
        Referer: "https://aliyundrive.com/",
        "X-Canary": "client=web,app=other,version=v0.1.0",
        "x-sgext": $.read("x-sgext"),
        "x-device-id": $.read("x-device-id"),
        "Content-Length": 17,
        Connection: "keep-alive",
        "x-signature": $.read("x-signature"),
        "x-sign": $.read("x-sign"),
        "x-mini-wua": $.read("x-mini-wua"),
        Authorization: $.read("Authorization"),
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "x-umt": $.read("x-umt"),
        Accept: "*/*",
        "Content-Type": "application/json; charset=UTF-8",
        "x-signature-v2": $.read("x-signature-v2"),
        "Accept-Encoding": "gzip, deflate, br",
        "x-nonce": $.read("x-nonce"),
      },
    });
  } else {
    $.write(headers["Cookie"], "Cookie");
    $.write(headers["x-sgext"], "x-sgext");
    $.write(headers["x-device-id"], "x-device-id");
    $.write(headers["x-signature"], "x-signature");
    $.write(headers["x-sign"], "x-sign");
    $.write(headers["x-mini-wua"], "x-mini-wua");
    $.write(headers["Authorization"], "Authorization");
    $.write(headers["x-umt"], "x-umt");
    $.write(headers["x-signature-v2"], "x-signature-v2");
    $.write(headers["x-nonce"], "x-nonce");
    $.write(headers["x-timestamp"], "x-timestamp");
    $.notify(
      "XiaoMao阿里云盘",
      "Token获取成功！正在执行奖励自动领取！",
      "签到临时Token获取成功！正在执行奖励自动领取，请等待结束通知！",
      ""
    );
    getAllReward();
  }
}

function getError(info) {
  $.notify(
    "🚨阿里云盘奖励领取失败❗️",
    "错误代码：" + info,
    "🚧请稍后再试❗️",
    "https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg"
  );
  $done({});
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
