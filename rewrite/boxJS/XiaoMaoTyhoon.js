/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-07-27
 *
 * 


\实\时\台\风\信\息\播\报\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 9 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoTyhoon.js, tag=🌀XiaoMao_台风监测, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Blackhole.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoTyhoon.js

********************************/

let tfDetails,
  tfInfo = "";
let url2 = encodeURI(
  "https://typhoon.slt.zj.gov.cn/Api/TyphoonList/" + new Date().getFullYear()
);
let option3 = {
  url: url2,
};
$task
  .fetch(option3)
  .then((response) => {
    let obj = JSON.parse(response.body);
    getDetail(obj.at(-1).tfid);
  })
  .catch((error) => {
    getError("_error_1");
  });

setTimeout(() => {
  let option = {
    url: encodeURI("https://typhoon.slt.zj.gov.cn/Api/TyhoonActivity"),
  };
  $task
    .fetch(option)
    .then((response) => {
      let obj = JSON.parse(response.body);
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
            (tfDetails && index == objLength - 1 ? tfDetails : "") +
            "\n\n";

          returnText =
            returnText +
            (objLength < 2 ? "" : "第[" + (index + 1) + "条] ") +
            tfInfo;
        });

        $notify(
          "🌀XiaoMao_台风监测",
          "监测到" + objLength + "条台风数据",
          returnText
        );
      } else {
        getError("_error_2");
      }
    })
    .catch((err) => {
      getError("_error_1");
    });
}, 5000);

function getDetail(tfid) {
  let url = `https://typhoon.slt.zj.gov.cn/Api/TyphoonInfo/` + tfid;
  let option2 = {
    url: encodeURI(url),
  };
  $task
    .fetch(option2)
    .then((response) => {
      let obj2 = JSON.parse(response.body);
      if (obj2.points.length) {
        let tf_D = obj2.points.at(-1);
        let radius7,
          radius10,
          radius12 = "";
        if (tf_D.radius7) {
          let a = tf_D.radius7;
          let b = a.split("|");
          let startNum = Math.min(...b);
          let endNum = Math.max(...b);
          if (startNum == endNum) {
            radius7 = "🕖 七级半径：" + startNum + "公里" + "\n";
          } else {
            radius7 = "🕖 七级半径：" + startNum + "~" + endNum + "公里" + "\n";
          }
        }
        if (tf_D.radius10) {
          let a = tf_D.radius10;
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
        if (tf_D.radius12) {
          let a = tf_D.radius12;
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

        tfDetails =
          radius7 +
          radius10 +
          radius12 +
          "\n" +
          (tf_D.ckposition
            ? "🗼 参考位置：" + tf_D.ckposition.replace(/\s+/g, "") + "\n"
            : "") +
          (tf_D.jl ? "🎢 未来趋势：" + tf_D.jl.replace(/\s+/g, "") + "\n" : "");
      }
    })
    .catch((err) => {});
}

function getError(params = "") {
  $notify("🌀XiaoMao_台风监测", "", "🚧" + params + "获取失败，请稍后再试❗️", {
    "open-url":
      "https://i.pixiv.re/img-original/img/2021/01/01/21/42/56/86736781_p0.jpg",
    "media-url":
      "https://i.pixiv.re/img-original/img/2021/01/01/21/42/56/86736781_p0.jpg",
  });
}
setTimeout(() => {
  $done({});
}, 8000);
