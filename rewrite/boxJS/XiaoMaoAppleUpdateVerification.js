/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-08-16
 *
 * 


\X\i\a\o\M\a\o\A\p\p\l\e\U\p\d\a\t\e\V\e\r\i\f\i\c\a\t\i\o\n\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json


2、通过boxjs设置需要设备型号
【🚧未填写默认获取「iPhone 15 Pro Max」版本信息】

 设备型号示例：
「iPhone 15 Pro Max」                👉 [iPhone16,2]
「iPad Air 11-inch (M2)」            👉 [iPad14,8]
「MacBook Air (13-inch, M3, 2024)」  👉 [Mac15,12]
「Apple Watch Series 5 (44mm, LTE)」 👉 [Watch5,4]
「Apple Vision Pro」                 👉 [RealityDevice14,1]
「Apple TV 4K」                      👉 [AppleTV6,2]
「HomePod mini」                     👉 [AudioAccessory5,1]
「iPod touch 7」                     👉 [iPod9,1]



3、⚠️ QX > 请求列表(三横杠按钮) > 右上角加号 > 文本方式添加代码

0 0 2 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoAppleUpdateVerification.js, tag=XiaoMao_Apple验证通道, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute/apple.png, enabled=true




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
const $ = new Env("XiaoMaoAppleUpdateVerification");

let DeviceInformation = "iPhone16,2";
$.read("DeviceInformation")
  ? (DeviceInformation = $.read("DeviceInformation"))
  : "";

function convertToChineseDate(dateStr) {
  // 去除序数词后缀（例如 'nd', 'rd', 'st', 'th'）
  const cleanDateStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
  // 将英文日期字符串转换为 Date 对象
  const dateObj = new Date(cleanDateStr);
  // 获取日期的年、月、日
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // 月份补零
  const day = String(dateObj.getDate()).padStart(2, "0"); // 日期补零
  // 构建中文日期字符串
  return `${year}/${month}/${day}`;
}
function getDateList(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const rows = doc.querySelectorAll("tr.firmware");
  const device = doc
    .querySelector("title")
    ?.textContent.replace("Choose an IPSW for the ", "")
    .replace("Choose an OTA for the ", "")
    .replace(" / IPSW Downloads", "");
  let deviceName = "";
  const tdSequence = rows[0].querySelectorAll("td").length == 5 ? 0 : 1;
  const firmwareData = Array.from(rows).map((row) => {
    deviceName == ""
      ? (deviceName = row
          .querySelector("td:nth-child(2)")
          .childNodes[0].textContent.trim()
          .match(/^\D+/)[0]
          .trim())
      : "";
    const status = row.querySelector("td:nth-child(1)").textContent.trim();
    const version = row
      .querySelector("td:nth-child(2)")
      .childNodes[0].textContent.trim()
      .replace(/^\D+/, "")
      .replace(/\s+/g, "");
    const date = convertToChineseDate(
      row
        .querySelector("td:nth-child(" + (3 + tdSequence) + ")")
        .textContent.trim()
    );
    const size = row
      .querySelector("td:nth-child(" + (4 + tdSequence) + ")")
      .textContent.trim();
    const filename = row
      .querySelector("td:nth-child(" + (5 + tdSequence) + ")")
      .textContent.trim();
    const downloadLink = row
      .getAttribute("onclick")
      .match(/window\.location\s*=\s*'(.*)'/)[1]
      .replace("download", "install");
    return { status, version, date, size, filename, downloadLink };
  });
  return { device, deviceName, firmwareData };
}
function padToChars(input, Length = 9) {
  const targetLength = Length;
  const paddingChar = " ";
  const currentLength = input.length;
  if (currentLength < targetLength) {
    const paddingLength = targetLength - currentLength;
    const paddedString = "" + paddingChar.repeat(paddingLength) + " ";
    return input + paddedString;
  }
  return input + " ";
}

// 核心函数
let option = {
  url: encodeURI("https://ipsw.me/" + DeviceInformation),
  method: "GET",
};
$.get(option, (error1, resp1, response) => {
  if (response) {
    let versionList = getDateList(response);
    if (!versionList.device?.includes("404")) {
      if (versionList.firmwareData.length) {
        let returnText = `设备型号「${versionList.device}」\n设备系统「${
          versionList.deviceName
        }」\n有效版本「${
          versionList.firmwareData.filter((e) => e.status == "✓").length
        }」个\n\n\n🎲验证通道版本列表\n\n${
          padToChars(versionList.deviceName, 18) +
          padToChars("状态", 3) +
          padToChars("大小", 8) +
          "时间"
        }\n`;
        let statusList = ["✅", "❌"];
        let downloadLinkText = "\n\n" + "🧩可用版本下载地址" + "\n\n";
        versionList.firmwareData.map((el) => {
          let verificationStatus = el.status == "✓" ? true : false;
          returnText =
            returnText +
            `${
              padToChars(el.version, 18) +
              padToChars(
                verificationStatus ? statusList[0] : statusList[1],
                3
              ) +
              padToChars(el.size, 8) +
              el.date
            }\n`;

          if (verificationStatus) {
            downloadLinkText =
              downloadLinkText +
              `${versionList.deviceName + " " + el.version}\n大小：${
                el.size
              }\n时间：${el.date}\n下载：${
                "https://ipsw.me" + el.downloadLink
              }\n\n`;
          }
        });
        $.notify(
          "Apple验证通道",
          `${versionList.deviceName}系统验证通道`,
          returnText + downloadLinkText
        );
        $.log(returnText + downloadLinkText);
        $done({});
      } else {
        getError("获取内容为空！");
      }
    } else {
      getError("设备型号设置错误，请检查BoxJs设备信息是否填写正确");
    }
  } else {
    getError("请求内容失败");
  }
});

function getError(err) {
  $.notify(
    "XiaoMao_Apple验证通道❗️",
    err,
    "🚧信息错误，请稍后再试❗️",
    "https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg"
  );
  $done({});
}
