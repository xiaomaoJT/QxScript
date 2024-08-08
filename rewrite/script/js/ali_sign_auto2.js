/**
 * 
 * XiaoMao
 * \阿\里\云\盘\自\动\签\到\
 * 脚本发布地址：https://t.me/XiaoMaoScript/129
 * 
 * 签到奖励领取机制：考虑到部分会员权益想按需领取，平日到月底第三天均不会自动领取奖励
 * 增加奖励激活留存通知
 * 
 * 自动领取已失效
 * 自动领取已失效
 * 自动领取已失效
 * 
 * 基于@Sliverkiss修改
 * 感谢@chavyleung提供的Env，以及@Sliverkiss、@zqzess、@lowking三位大佬的脚本用来抄袭
 * 


QuantumultX配置如下：

自动任务
[task_local]
0 10 * * * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/ali_sign_auto2.js, tag=阿里云签到, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/AliYunDrive.png, enabled=true

获取token
[rewrite_local]
^https:\/\/(auth|aliyundrive)\.alipan\.com\/v2\/account\/token url script-request-body https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.js

[MITM]
hostname = auth.alipan.com,auth.aliyundrive.com


*/

// env.js 全局
const $ = new Env("阿里云盘签到");
const ckName = "ADriveCheckIn";
//-------------------- 一般不动变量区域 -------------------------------------
const Notify = 1; //0为关闭通知,1为打开通知,默认为1
const notify = $.isNode() ? require("./sendNotify") : "";
let envSplitor = ["@"]; //多账号分隔符
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || "";
let userList = [];
let userIdx = 0;
let userCount = 0;
//调试
$.is_debug =
  ($.isNode() ? process.env.IS_DEDUG : $.getdata("is_debug")) || "false";
// 为通知准备的空数组
$.notifyMsg = [];
//bark推送
$.barkKey =
  ($.isNode() ? process.env["bark_key"] : $.getdata("bark_key")) || "";
//---------------------- 自定义变量区域 -----------------------------------

// 当天
function getGoneDay(n = 0, yearFlag = true) {
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
}

// 月底倒数第三天
function getLastDay() {
  let nowDate = new Date();
  nowDate.setMonth(nowDate.getMonth() + 1);
  nowDate.setDate(-2);
  let lastMonthDay = nowDate.toLocaleDateString();
  return lastMonthDay;
}

// 当月有几天
function getCountDays() {
  var curDate = new Date();
  var curMonth = curDate.getMonth();
  curDate.setMonth(curMonth + 1);
  curDate.setDate(0);
  return curDate.getDate();
}

var directiveAccessKey = "";
var directiveXumt = "";
var directiveSignInCount = "";

//脚本入口函数main()
async function main() {
  // console.log("\n================== 任务 ==================\n");
  for (let user of userList) {
    // console.log(`🔷账号${user.index} >> Start work`);
    // console.log(`随机延迟${user.getRandomTime()}ms`);
    //刷新token
    let accessKey = await user.getAuthorizationKey();
    directiveAccessKey = accessKey;
    if (user.ckStatus) {
      //签到
      await user.signCheckin(accessKey);
      DoubleLog(
        "⚠️签到奖励领取已失效，请使用「✍️XiaoMao_阿里云盘奖励领取」脚本进行领取！\n"
      );
      DoubleLog(
        "https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoALiSignReward.js"
      );
    } else {
      //将ck过期消息存入消息数组
      $.notifyMsg.push(`❌账号${user.index} >> Check ck error!`);
    }
  }
}

class UserInfo {
  constructor(str) {
    this.index = ++userIdx;
    this.ADrivreInfo = JSON.parse(str);
    this.ckStatus = true;
  }
  getRandomTime() {
    return randomInt(1000, 3000);
  }
  //请求二次封装
  Request(options, method) {
    typeof method === "undefined"
      ? "body" in options
        ? (method = "post")
        : (method = "get")
      : (method = method);
    return new Promise((resolve, reject) => {
      $.http[method.toLowerCase()](options)
        .then((response) => {
          let res = response.body;
          res = $.toObj(res) || res;
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }
  //获取鉴权
  async getAuthorizationKey() {
    try {
      const options = {
        url: `https://auth.aliyundrive.com/v2/account/token`,
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          "accept-language": "zh-CN,zh-Hansq=0.9",
          "x-canary": this.ADrivreInfo.headers["x-canary"],
          "x-device-id": this.ADrivreInfo.headers["x-device-id"],
          cookie: this.ADrivreInfo.headers["cookie"],
          "user-agent": this.ADrivreInfo.headers["user-agent"],
        },
        body: JSON.stringify(this.ADrivreInfo.refresh_token_body),
      };
      //post方法
      let { avatar, nick_name, refresh_token, access_token } =
        await this.Request(options);
      //缓存用户信息(avatar=>头像，nick_name=>用户名)
      $.avatar = avatar;
      $.nick_name = nick_name;
      //获取accessKey鉴权
      let accessKey = "Bearer " + access_token;
      this.ADrivreInfo.refresh_token_body.refresh_token = refresh_token;
      this.ADrivreInfo.refresh_token = refresh_token;
      //刷新token
      if ($.setjson(this.ADrivreInfo, ckName)) {
        // $.log("刷新阿里网盘refresh_token成功 🎉");
      } else {
        DoubleLog("刷新阿里网盘refresh_token失败‼️", "", "");
        this.ckStatus = false;
      }
      //accessKey
      return accessKey;
    } catch (e) {
      throw e;
    }
  }
  //签到
  async signCheckin(authorization) {
    $.log("签到开始");
    try {
      let date = new Date();
      let timeStamp = Date.parse(date);
      const xumt =
        "defaultFY1_fyjs_not_loaded@@https://pages.aliyundrive.com/mobile-page/web/dailycheck.html@@" +
        timeStamp;
      const options = {
        url: "https://member.aliyundrive.com/v2/activity/sign_in_list",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json, text/plain, */*",
          authorization: authorization,
          "x-canary": this.ADrivreInfo.headers["x-canary"],
          "x-umt": xumt,
          origin: "https://pages.aliyundrive.com",
          "x-ua": xumt,
          "user-agent": this.ADrivreInfo.headers["user-agent"],
          referer: "https://pages.aliyundrive.com/",
        },
        body: JSON.stringify({}),
      };
      //post方法
      let { message, result } = await this.Request(options);
      //
      if (message) {
        DoubleLog(`❌签到失败!${message}`);
        return;
      }
      let { isSignIn, isReward, signInCount, signInInfos } = result;
      //获取今天签到信息
      let signInRes = signInInfos.find(
        (e) => Number(e.day) == Number(signInCount)
      );
      let { subtitle, rewards } = signInRes;
      //打印
      if (rewards.length > 0) {
        // $.log(`签到天数:${signInCount}=> ${subtitle}`);
        DoubleLog(`用户: ${$.nick_name} - 第${signInCount}天\n`);
        // DoubleLog(`签到奖励: ${rewards[0].name}`);
        // DoubleLog(`备份奖励: ${rewards[1].name}`);
      }
      //今日是否已签到
      $.signMsg =
        (isReward ? `🎉${result.title}签到成功!` : `️⚠️今天已经签到过了`) || "";
      return { signInCount, xumt };
    } catch (e) {
      throw e;
    }
  }
}

//获取Cookie
async function getCookie() {}

//主程序执行入口
!(async () => {
  //没有设置变量,执行Cookie获取
  if (typeof $request != "undefined") {
    await getCookie();
    return;
  }
  //未检测到ck，退出
  if (!(await checkEnv())) {
    throw new Error(`❌未检测到ck，请添加环境变量`);
  }
  if (userList.length > 0) {
    await main();
  }
})()
  .catch((e) => $.notifyMsg.push(e.message || e)) //捕获登录函数等抛出的异常, 并把原因添加到全局变量(通知)
  .finally(async () => {
    if ($.barkKey) {
      //如果已填写Bark Key
      await BarkNotify($, $.barkKey, $.name, $.notifyMsg.join("\n")); //推送Bark通知
    }
    await SendMsg($.notifyMsg.join("\n")); //带上总结推送通知
    $.done(); //调用Surge、QX内部特有的函数, 用于退出脚本执行
  });

/** --------------------------------辅助函数区域------------------------------------------- */

// 双平台log输出
function DoubleLog(data) {
  if ($.isNode()) {
    if (data) {
      // console.log(`${data}`);
      $.notifyMsg.push(`${data}`);
    }
  } else {
    // console.log(`${data}`);
    $.notifyMsg.push(`${data}`);
  }
}

// DEBUG
function debug(text, title = "debug") {
  if ($.is_debug === "true") {
    if (typeof text == "string") {
      console.log(`\n-----------${title}------------\n`);
      console.log(text);
      console.log(`\n-----------${title}------------\n`);
    } else if (typeof text == "object") {
      console.log(`\n-----------${title}------------\n`);
      console.log($.toStr(text));
      console.log(`\n-----------${title}------------\n`);
    }
  }
}

//检查变量
async function checkEnv() {
  if (userCookie) {
    let e = envSplitor[0];
    for (let o of envSplitor)
      if (userCookie.indexOf(o) > -1) {
        e = o;
        break;
      }
    for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
    userCount = userList.length;
  } else {
    console.log("未找到CK");
    return;
  }
  return console.log(`共找到${userCount}个账号`), true; //true == !0
}

/**
 * 随机整数生成
 */
function randomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
// 发送消息
async function SendMsg(message) {
  if (!message) return;
  if (Notify > 0) {
    if ($.isNode()) {
      await notify.sendNotify($.name, message);
    } else {
      let obj = $.openUrl
        ? { "media-url": $.avatar, "open-url": $.openUrl }
        : { "media-url": $.avatar };

      $.msg($.name, $.signMsg, message, obj);
    }
  } else {
    console.log(message);
  }
}

/** ---------------------------------固定不动区域----------------------------------------- */
// prettier-ignore

//请求函数函数二次封装
function httpRequest(options, method) { typeof (method) === 'undefined' ? ('body' in options ? method = 'post' : method = 'get') : method = method; return new Promise((resolve) => { $[method](options, (err, resp, data) => { try { if (err) { console.log(`${method}请求失败`); $.logErr(err) } else { if (data) { typeof JSON.parse(data) == 'object' ? data = JSON.parse(data) : data = data; resolve(data) } else { console.log(`请求api返回数据为空，请检查自身原因`) } } } catch (e) { $.logErr(e, resp) } finally { resolve() } }) }) }
//Bark APP notify
async function BarkNotify(c, k, t, b) {
  for (let i = 0; i < 3; i++) {
    console.log(`🔷Bark notify >> Start push (${i + 1})`);
    const s = await new Promise((n) => {
      c.post(
        {
          url: "https://api.day.app/push",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: t,
            body: b,
            device_key: k,
            ext_params: { group: t },
          }),
        },
        (e, r, d) => (r && r.status == 200 ? n(1) : n(d || e))
      );
    });
    if (s === 1) {
      console.log("✅Push success!");
      break;
    } else {
      console.log(`❌Push failed! >> ${s.message || s}`);
    }
  }
}
//From chavyleung's Env.js
function Env(t, e) {
  class s {
    constructor(t) {
      this.env = t;
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? { url: t } : t;
      let s = this.get;
      return (
        "POST" === e && (s = this.post),
        new Promise((e, a) => {
          s.call(this, t, (t, s, r) => {
            t ? a(t) : e(s);
          });
        })
      );
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new (class {
    constructor(t, e) {
      (this.name = t),
        (this.http = new s(this)),
        (this.data = null),
        (this.dataFile = "box.dat"),
        (this.logs = []),
        (this.isMute = !1),
        (this.isNeedRewrite = !1),
        (this.logSeparator = "\n"),
        (this.encoding = "utf-8"),
        (this.startTime = new Date().getTime()),
        Object.assign(this, e),
        this.log("", `🔔${this.name}, 开始!`);
    }
    getEnv() {
      return "undefined" != typeof $environment && $environment["surge-version"]
        ? "Surge"
        : "undefined" != typeof $environment && $environment["stash-version"]
        ? "Stash"
        : "undefined" != typeof module && module.exports
        ? "Node.js"
        : "undefined" != typeof $task
        ? "Quantumult X"
        : "undefined" != typeof $loon
        ? "Loon"
        : "undefined" != typeof $rocket
        ? "Shadowrocket"
        : void 0;
    }
    isNode() {
      return "Node.js" === this.getEnv();
    }
    isQuanX() {
      return "Quantumult X" === this.getEnv();
    }
    isSurge() {
      return "Surge" === this.getEnv();
    }
    isLoon() {
      return "Loon" === this.getEnv();
    }
    isShadowrocket() {
      return "Shadowrocket" === this.getEnv();
    }
    isStash() {
      return "Stash" === this.getEnv();
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t);
      } catch {
        return e;
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return e;
      }
    }
    getjson(t, e) {
      let s = e;
      const a = this.getdata(t);
      if (a)
        try {
          s = JSON.parse(this.getdata(t));
        } catch {}
      return s;
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise((e) => {
        this.get({ url: t }, (t, s, a) => e(a));
      });
    }
    runScript(t, e) {
      return new Promise((s) => {
        let a = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        a = a ? a.replace(/\n/g, "").trim() : a;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        (r = r ? 1 * r : 20), (r = e && e.timeout ? e.timeout : r);
        const [i, o] = a.split("@"),
          n = {
            url: `http://${o}/v1/scripting/evaluate`,
            body: { script_text: t, mock_type: "cron", timeout: r },
            headers: { "X-Key": i, Accept: "*/*" },
            timeout: r,
          };
        this.post(n, (t, e, a) => s(a));
      }).catch((t) => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) return {};
      {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          a = !s && this.fs.existsSync(e);
        if (!s && !a) return {};
        {
          const a = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(a));
          } catch (t) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          a = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s
          ? this.fs.writeFileSync(t, r)
          : a
          ? this.fs.writeFileSync(e, r)
          : this.fs.writeFileSync(t, r);
      }
    }
    lodash_get(t, e, s) {
      const a = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of a) if (((r = Object(r)[t]), void 0 === r)) return s;
      return r;
    }
    lodash_set(t, e, s) {
      return Object(t) !== t
        ? t
        : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []),
          (e
            .slice(0, -1)
            .reduce(
              (t, s, a) =>
                Object(t[s]) === t[s]
                  ? t[s]
                  : (t[s] = Math.abs(e[a + 1]) >> 0 == +e[a + 1] ? [] : {}),
              t
            )[e[e.length - 1]] = s),
          t);
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, a] = /^@(.*?)\.(.*?)$/.exec(t),
          r = s ? this.getval(s) : "";
        if (r)
          try {
            const t = JSON.parse(r);
            e = t ? this.lodash_get(t, a, "") : e;
          } catch (t) {
            e = "";
          }
      }
      return e;
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, a, r] = /^@(.*?)\.(.*?)$/.exec(e),
          i = this.getval(a),
          o = a ? ("null" === i ? null : i || "{}") : "{}";
        try {
          const e = JSON.parse(o);
          this.lodash_set(e, r, t), (s = this.setval(JSON.stringify(e), a));
        } catch (e) {
          const i = {};
          this.lodash_set(i, r, t), (s = this.setval(JSON.stringify(i), a));
        }
      } else s = this.setval(t, e);
      return s;
    }
    getval(t) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
          return $persistentStore.read(t);
        case "Quantumult X":
          return $prefs.valueForKey(t);
        case "Node.js":
          return (this.data = this.loaddata()), this.data[t];
        default:
          return (this.data && this.data[t]) || null;
      }
    }
    setval(t, e) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
          return $persistentStore.write(t, e);
        case "Quantumult X":
          return $prefs.setValueForKey(t, e);
        case "Node.js":
          return (
            (this.data = this.loaddata()),
            (this.data[e] = t),
            this.writedata(),
            !0
          );
        default:
          return (this.data && this.data[e]) || null;
      }
    }
    initGotEnv(t) {
      (this.got = this.got ? this.got : require("got")),
        (this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
        (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
        t &&
          ((t.headers = t.headers ? t.headers : {}),
          void 0 === t.headers.Cookie &&
            void 0 === t.cookieJar &&
            (t.cookieJar = this.ckjar));
    }
    get(t, e = () => {}) {
      switch (
        (t.headers &&
          (delete t.headers["Content-Type"],
          delete t.headers["Content-Length"],
          delete t.headers["content-type"],
          delete t.headers["content-length"]),
        t.params && (t.url += "?" + this.queryStr(t.params)),
        this.getEnv())
      ) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          this.isSurge() &&
            this.isNeedRewrite &&
            ((t.headers = t.headers || {}),
            Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
            $httpClient.get(t, (t, s, a) => {
              !t &&
                s &&
                ((s.body = a),
                (s.statusCode = s.status ? s.status : s.statusCode),
                (s.status = s.statusCode)),
                e(t, s, a);
            });
          break;
        case "Quantumult X":
          this.isNeedRewrite &&
            ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
            $task.fetch(t).then(
              (t) => {
                const {
                  statusCode: s,
                  statusCode: a,
                  headers: r,
                  body: i,
                  bodyBytes: o,
                } = t;
                e(
                  null,
                  {
                    status: s,
                    statusCode: a,
                    headers: r,
                    body: i,
                    bodyBytes: o,
                  },
                  i,
                  o
                );
              },
              (t) => e((t && t.error) || "UndefinedError")
            );
          break;
        case "Node.js":
          let s = require("iconv-lite");
          this.initGotEnv(t),
            this.got(t)
              .on("redirect", (t, e) => {
                try {
                  if (t.headers["set-cookie"]) {
                    const s = t.headers["set-cookie"]
                      .map(this.cktough.Cookie.parse)
                      .toString();
                    s && this.ckjar.setCookieSync(s, null),
                      (e.cookieJar = this.ckjar);
                  }
                } catch (t) {
                  this.logErr(t);
                }
              })
              .then(
                (t) => {
                  const {
                      statusCode: a,
                      statusCode: r,
                      headers: i,
                      rawBody: o,
                    } = t,
                    n = s.decode(o, this.encoding);
                  e(
                    null,
                    {
                      status: a,
                      statusCode: r,
                      headers: i,
                      rawBody: o,
                      body: n,
                    },
                    n
                  );
                },
                (t) => {
                  const { message: a, response: r } = t;
                  e(a, r, r && s.decode(r.rawBody, this.encoding));
                }
              );
      }
    }
    post(t, e = () => {}) {
      const s = t.method ? t.method.toLocaleLowerCase() : "post";
      switch (
        (t.body &&
          t.headers &&
          !t.headers["Content-Type"] &&
          !t.headers["content-type"] &&
          (t.headers["content-type"] = "application/x-www-form-urlencoded"),
        t.headers &&
          (delete t.headers["Content-Length"],
          delete t.headers["content-length"]),
        this.getEnv())
      ) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          this.isSurge() &&
            this.isNeedRewrite &&
            ((t.headers = t.headers || {}),
            Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
            $httpClient[s](t, (t, s, a) => {
              !t &&
                s &&
                ((s.body = a),
                (s.statusCode = s.status ? s.status : s.statusCode),
                (s.status = s.statusCode)),
                e(t, s, a);
            });
          break;
        case "Quantumult X":
          (t.method = s),
            this.isNeedRewrite &&
              ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
            $task.fetch(t).then(
              (t) => {
                const {
                  statusCode: s,
                  statusCode: a,
                  headers: r,
                  body: i,
                  bodyBytes: o,
                } = t;
                e(
                  null,
                  {
                    status: s,
                    statusCode: a,
                    headers: r,
                    body: i,
                    bodyBytes: o,
                  },
                  i,
                  o
                );
              },
              (t) => e((t && t.error) || "UndefinedError")
            );
          break;
        case "Node.js":
          let a = require("iconv-lite");
          this.initGotEnv(t);
          const { url: r, ...i } = t;
          this.got[s](r, i).then(
            (t) => {
              const {
                  statusCode: s,
                  statusCode: r,
                  headers: i,
                  rawBody: o,
                } = t,
                n = a.decode(o, this.encoding);
              e(
                null,
                { status: s, statusCode: r, headers: i, rawBody: o, body: n },
                n
              );
            },
            (t) => {
              const { message: s, response: r } = t;
              e(s, r, r && a.decode(r.rawBody, this.encoding));
            }
          );
      }
    }
    time(t, e = null) {
      const s = e ? new Date(e) : new Date();
      let a = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds(),
      };
      /(y+)/.test(t) &&
        (t = t.replace(
          RegExp.$1,
          (s.getFullYear() + "").substr(4 - RegExp.$1.length)
        ));
      for (let e in a)
        new RegExp("(" + e + ")").test(t) &&
          (t = t.replace(
            RegExp.$1,
            1 == RegExp.$1.length
              ? a[e]
              : ("00" + a[e]).substr(("" + a[e]).length)
          ));
      return t;
    }
    queryStr(t) {
      let e = "";
      for (const s in t) {
        let a = t[s];
        null != a &&
          "" !== a &&
          ("object" == typeof a && (a = JSON.stringify(a)),
          (e += `${s}=${a}&`));
      }
      return (e = e.substring(0, e.length - 1)), e;
    }
    msg(e = t, s = "", a = "", r) {
      const i = (t) => {
        switch (typeof t) {
          case void 0:
            return t;
          case "string":
            switch (this.getEnv()) {
              case "Surge":
              case "Stash":
              default:
                return { url: t };
              case "Loon":
              case "Shadowrocket":
                return t;
              case "Quantumult X":
                return { "open-url": t };
              case "Node.js":
                return;
            }
          case "object":
            switch (this.getEnv()) {
              case "Surge":
              case "Stash":
              case "Shadowrocket":
              default: {
                let e = t.url || t.openUrl || t["open-url"];
                return { url: e };
              }
              case "Loon": {
                let e = t.openUrl || t.url || t["open-url"],
                  s = t.mediaUrl || t["media-url"];
                return { openUrl: e, mediaUrl: s };
              }
              case "Quantumult X": {
                let e = t["open-url"] || t.url || t.openUrl,
                  s = t["media-url"] || t.mediaUrl,
                  a = t["update-pasteboard"] || t.updatePasteboard;
                return {
                  "open-url": e,
                  "media-url": s,
                  "update-pasteboard": a,
                };
              }
              case "Node.js":
                return;
            }
          default:
            return;
        }
      };
      if (!this.isMute)
        switch (this.getEnv()) {
          case "Surge":
          case "Loon":
          case "Stash":
          case "Shadowrocket":
          default:
            $notification.post(e, s, a, i(r));
            break;
          case "Quantumult X":
            $notify(e, s, a, i(r));
            break;
          case "Node.js":
        }
      if (!this.isMuteLog) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e),
          s && t.push(s),
          a && t.push(a),
          console.log(t.join("\n")),
          (this.logs = this.logs.concat(t));
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]),
        console.log(t.join(this.logSeparator));
    }
    logErr(t, e) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        case "Quantumult X":
        default:
          this.log("", `❗️${this.name}, 错误!`, t);
          break;
        case "Node.js":
          this.log("", `❗️${this.name}, 错误!`, t.stack);
      }
    }
    wait(t) {
      return new Promise((e) => setTimeout(e, t));
    }
    done(t = {}) {
      const e = new Date().getTime(),
        s = (e - this.startTime) / 1e3;
      switch (
        (this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`),
        this.log(),
        this.getEnv())
      ) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        case "Quantumult X":
        default:
          $done(t);
          break;
        case "Node.js":
          process.exit(1);
      }
    }
  })(t, e);
}
