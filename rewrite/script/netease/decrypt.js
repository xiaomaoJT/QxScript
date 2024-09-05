// https://raw.githubusercontent.com/nondanee/Glee/dev/js/netease.js
// https://gist.githubusercontent.com/Sliverkiss/865c82e42a5730bb696f6700ebb94cee/raw/mxbc.js
// https://fastly.jsdelivr.net/gh/Sliverkiss/QuantumultX@main/Utils/Buffer.min.js

const $ = new Env("XiaoMao_WYY");

//主程序执行入口
!(async () => {
  try {
    if (typeof $request != "undefined") {
    } else {
      await loadModule();
      await XiaoMaoHeiHei();
    }
  } catch (e) {
    throw e;
  }
})()
  .catch((e) => {
    $.logErr(e), $.msg($.name, `⛔️ script run error!`, e.message || e);
  })
  .finally(async () => {
    $.done({ ok: 1 });
  });

//加载模块
async function loadModule() {
  $.crypto = await loadCryptoJS();
  $.buffer = await loadBufferJS();
  return $.crypto && $.buffer ? true : false;
}

async function XiaoMaoHeiHei() {
  // 给定的加密数据 (HEX 格式)
  const encryptedData =
    "4dc12a14eca8f30f33123e619c7b9c898a63ec001a2097d78ca57d3976f3779c6eee2d85b68aac7c9fe0b5317b093dbbb16624a76f0e1932ee0af8214bbfc18b391c57fdc52bd22ea0b97de86090300376bad750ae2cf9098f6181e94b531fdc73b4f9ae93ad447b53b4dd8fe28f713e502502b110e2e3af4fd5d66e7b754fbe7b2983e6cd307b5ba0fd2d84580fe4027e18c84d76dcca2d67253cb1981a945e251707dbbedcd1f602fca32a969f424b07a1f3f5cb1e706f9a419f6f4814aef01fa153335622d3d1f322aec60cb2e66cfc3498d7925734c8e34d220bff7adaf7";

  // '{"code":200,"message":"成功","data":[{"expName":"SearchHotlistsubtitle","expGroupName":"t1","status":0,"clientConfig":{},"expInfo":{"t1":"1.0"},"log":null,"flowHashId":"userId","createTimestamp":"1716450134"}]}'

  const iv = $.crypto.enc.Hex.parse("0102030405060708");
  const presetKey = $.crypto.enc.Utf8.parse("0CoJUm6Qyw8W8jud");
  const eapiKey = $.crypto.enc.Utf8.parse("e82ckenh8dichen8");
  const linuxapiKey = $.crypto.enc.Utf8.parse("rFgB&h#%2?^eDg:Q");

  // AES-128-CBC 解密函数
  const aesDecryptCBC = (ciphertext, key, iv) => {
    const decrypted = $.crypto.AES.decrypt(
      { ciphertext: $.crypto.enc.Hex.parse(ciphertext.toString("hex")) },
      key,
      {
        iv: iv,
        mode: $.crypto.mode.CBC,
        padding: $.crypto.pad.Pkcs7,
      }
    );
    return $.crypto.enc.Utf8.stringify(decrypted);
  };

  // AES-128-ECB 解密函数
  const aesDecryptECB = (ciphertext, key) => {
    const decrypted = $.crypto.AES.decrypt(
      { ciphertext: $.crypto.enc.Hex.parse(ciphertext.toString("hex")) },
      key,
      {
        mode: $.crypto.mode.ECB,
        padding: $.crypto.pad.Pkcs7,
      }
    );
    return $.crypto.enc.Utf8.stringify(decrypted);
  };

  // 尝试解密方法
  try {
    // 尝试使用 presetKey 和 IV 进行 AES-128-CBC 解密
    const bufferData = $.buffer.from(encryptedData, "hex");
    const decryptedDataCBC = aesDecryptCBC(bufferData, presetKey, iv);
    console.log("CBC 解密后的数据:" + decryptedDataCBC.toString("utf8"));
  } catch (error) {
    console.log("CBC 解密出错:" + error.message);
  }

  try {
    // 尝试使用 eapiKey 进行 AES-128-ECB 解密
    const bufferData = $.buffer.from(encryptedData, "hex");
    const decryptedDataECB = aesDecryptECB(bufferData, eapiKey);
    console.log(
      "ECB 解密后的数据 (eapiKey):" + decryptedDataECB.toString("utf8")
    );
  } catch (error) {
    console.log("ECB 解密出错 (eapiKey):" + error.message);
  }

  try {
    // 尝试使用 linuxapiKey 进行 AES-128-ECB 解密
    const bufferData = $.buffer.from(encryptedData, "hex");
    const decryptedDataECB = aesDecryptECB(bufferData, linuxapiKey);
    console.log(
      "ECB 解密后的数据 (linuxapiKey):" + decryptedDataECB.toString("utf8")
    );
  } catch (error) {
    console.log("ECB 解密出错 (linuxapiKey):" + error.message);
  }
}

//加载CryptoJS模块
async function loadCryptoJS() {
  let code =
    ($.isNode() ? require("crypto-js") : $.getdata("CryptoJS_code")) || "";
  //node环境
  if ($.isNode()) return code;
  //ios环境
  if (code && Object.keys(code).length) {
    console.log(`✅ ${$.name}: 缓存中存在CryptoJS代码, 跳过下载`);
    eval(code);
    return createCryptoJS();
  }
  console.log(`🚀 ${$.name}: 开始下载CryptoJS代码`);
  return new Promise(async (resolve) => {
    $.getScript(
      "https://fastly.jsdelivr.net/gh/Sliverkiss/QuantumultX@main/Utils/CryptoJS.min.js"
    ).then((fn) => {
      $.setdata(fn, "CryptoJS_code");
      eval(fn);
      const CryptoJS = createCryptoJS();
      console.log(`✅ CryptoJS加载成功, 请继续`);
      resolve(CryptoJS);
    });
  });
}

//加载Buffer模块
async function loadBufferJS() {
  let code = ($.isNode() ? require("buffer") : $.getdata("Buffer_code")) || "";
  //node环境
  if ($.isNode()) return code;
  //ios环境
  if (code && Object.keys(code).length) {
    console.log(`✅ ${$.name}: 缓存中存在Buffer代码, 跳过下载`);
    eval(code);
    return loadBuffer();
  }
  console.log(`🚀 ${$.name}: 开始下载Buffer代码`);
  return new Promise(async (resolve) => {
    $.getScript(
      "https://fastly.jsdelivr.net/gh/Sliverkiss/QuantumultX@main/Utils/Buffer.min.js"
    ).then((fn) => {
      $.setdata(fn, "Buffer_code");
      eval(fn);
      const BufferJS = loadBuffer();
      console.log(`✅ Buffer加载成功, 请继续`);
      resolve(BufferJS);
    });
  });
}

/** ---------------------------------固定不动区域----------------------------------------- */
//prettier-ignore
async function sendMsg(a) { a && ($.isNode() ? await notify.sendNotify($.name, a) : $.msg($.name, $.title || "", a, { "media-url": $.avatar })) }
function DoubleLog(o) {
  o && ($.log(`${o}`), $.notifyMsg.push(`${o}`));
}
function debug(g, e = "debug") {
  "true" === $.is_debug &&
    ($.log(`\n-----------${e}------------\n`),
    $.log("string" == typeof g ? g : $.toStr(g) || `debug error => t=${g}`),
    $.log(`\n-----------${e}------------\n`));
}
//From xream's ObjectKeys2LowerCase
function ObjectKeys2LowerCase(obj) {
  return !obj
    ? {}
    : Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
      );
}
//From sliverkiss's Request
async function Request(t) {
  "string" == typeof t && (t = { url: t });
  try {
    if (!t?.url) throw new Error("[发送请求] 缺少 url 参数");
    let {
      url: o,
      type: e,
      headers: r = {},
      body: s,
      params: a,
      dataType: n = "form",
      resultType: u = "data",
    } = t;
    const p = e ? e?.toLowerCase() : "body" in t ? "post" : "get",
      c = o.concat("post" === p ? "?" + $.queryStr(a) : ""),
      i = t.timeout ? ($.isSurge() ? t.timeout / 1e3 : t.timeout) : 1e4;
    "json" === n && (r["Content-Type"] = "application/json;charset=UTF-8");
    const y = s && "form" == n ? $.queryStr(s) : $.toStr(s),
      l = {
        ...t,
        ...(t?.opts ? t.opts : {}),
        url: c,
        headers: r,
        ...("post" === p && { body: y }),
        ...("get" === p && a && { params: a }),
        timeout: i,
      },
      m = $.http[p.toLowerCase()](l)
        .then((t) =>
          "data" == u ? $.toObj(t.body) || t.body : $.toObj(t) || t
        )
        .catch((t) => $.log(`❌请求发起失败！原因为：${t}`));
    return Promise.race([
      new Promise((t, o) => setTimeout(() => o("当前请求已超时"), i)),
      m,
    ]);
  } catch (t) {
    console.log(`❌请求发起失败！原因为：${t}`);
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
        new Promise((e, r) => {
          s.call(this, t, (t, s, a) => {
            t ? r(t) : e(s);
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
      if (this.getdata(t))
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
        this.get({ url: t }, (t, s, r) => e(r));
      });
    }
    runScript(t, e) {
      return new Promise((s) => {
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        r = r ? r.replace(/\n/g, "").trim() : r;
        let a = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        (a = a ? 1 * a : 20), (a = e && e.timeout ? e.timeout : a);
        const [i, o] = r.split("@"),
          n = {
            url: `http://${o}/v1/scripting/evaluate`,
            body: { script_text: t, mock_type: "cron", timeout: a },
            headers: { "X-Key": i, Accept: "*/*" },
            timeout: a,
          };
        this.post(n, (t, e, r) => s(r));
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
          r = !s && this.fs.existsSync(e);
        if (!s && !r) return {};
        {
          const r = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(r));
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
          r = !s && this.fs.existsSync(e),
          a = JSON.stringify(this.data);
        s
          ? this.fs.writeFileSync(t, a)
          : r
          ? this.fs.writeFileSync(e, a)
          : this.fs.writeFileSync(t, a);
      }
    }
    lodash_get(t, e, s = void 0) {
      const r = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let a = t;
      for (const t of r) if (((a = Object(a)[t]), void 0 === a)) return s;
      return a;
    }
    lodash_set(t, e, s) {
      return (
        Object(t) !== t ||
          (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []),
          (e
            .slice(0, -1)
            .reduce(
              (t, s, r) =>
                Object(t[s]) === t[s]
                  ? t[s]
                  : (t[s] = Math.abs(e[r + 1]) >> 0 == +e[r + 1] ? [] : {}),
              t
            )[e[e.length - 1]] = s)),
        t
      );
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, r] = /^@(.*?)\.(.*?)$/.exec(t),
          a = s ? this.getval(s) : "";
        if (a)
          try {
            const t = JSON.parse(a);
            e = t ? this.lodash_get(t, r, "") : e;
          } catch (t) {
            e = "";
          }
      }
      return e;
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, r, a] = /^@(.*?)\.(.*?)$/.exec(e),
          i = this.getval(r),
          o = r ? ("null" === i ? null : i || "{}") : "{}";
        try {
          const e = JSON.parse(o);
          this.lodash_set(e, a, t), (s = this.setval(JSON.stringify(e), r));
        } catch (e) {
          const i = {};
          this.lodash_set(i, a, t), (s = this.setval(JSON.stringify(i), r));
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
        void 0 === t.followRedirect ||
          t.followRedirect ||
          ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = !1),
          this.isQuanX() &&
            (t.opts
              ? (t.opts.redirection = !1)
              : (t.opts = { redirection: !1 }))),
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
            $httpClient.get(t, (t, s, r) => {
              !t &&
                s &&
                ((s.body = r),
                (s.statusCode = s.status ? s.status : s.statusCode),
                (s.status = s.statusCode)),
                e(t, s, r);
            });
          break;
        case "Quantumult X":
          this.isNeedRewrite &&
            ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
            $task.fetch(t).then(
              (t) => {
                const {
                  statusCode: s,
                  statusCode: r,
                  headers: a,
                  body: i,
                  bodyBytes: o,
                } = t;
                e(
                  null,
                  {
                    status: s,
                    statusCode: r,
                    headers: a,
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
                      statusCode: r,
                      statusCode: a,
                      headers: i,
                      rawBody: o,
                    } = t,
                    n = s.decode(o, this.encoding);
                  e(
                    null,
                    {
                      status: r,
                      statusCode: a,
                      headers: i,
                      rawBody: o,
                      body: n,
                    },
                    n
                  );
                },
                (t) => {
                  const { message: r, response: a } = t;
                  e(r, a, a && s.decode(a.rawBody, this.encoding));
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
        void 0 === t.followRedirect ||
          t.followRedirect ||
          ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = !1),
          this.isQuanX() &&
            (t.opts
              ? (t.opts.redirection = !1)
              : (t.opts = { redirection: !1 }))),
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
            $httpClient[s](t, (t, s, r) => {
              !t &&
                s &&
                ((s.body = r),
                (s.statusCode = s.status ? s.status : s.statusCode),
                (s.status = s.statusCode)),
                e(t, s, r);
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
                  statusCode: r,
                  headers: a,
                  body: i,
                  bodyBytes: o,
                } = t;
                e(
                  null,
                  {
                    status: s,
                    statusCode: r,
                    headers: a,
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
          let r = require("iconv-lite");
          this.initGotEnv(t);
          const { url: a, ...i } = t;
          this.got[s](a, i).then(
            (t) => {
              const {
                  statusCode: s,
                  statusCode: a,
                  headers: i,
                  rawBody: o,
                } = t,
                n = r.decode(o, this.encoding);
              e(
                null,
                { status: s, statusCode: a, headers: i, rawBody: o, body: n },
                n
              );
            },
            (t) => {
              const { message: s, response: a } = t;
              e(s, a, a && r.decode(a.rawBody, this.encoding));
            }
          );
      }
    }
    time(t, e = null) {
      const s = e ? new Date(e) : new Date();
      let r = {
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
      for (let e in r)
        new RegExp("(" + e + ")").test(t) &&
          (t = t.replace(
            RegExp.$1,
            1 == RegExp.$1.length
              ? r[e]
              : ("00" + r[e]).substr(("" + r[e]).length)
          ));
      return t;
    }
    queryStr(t) {
      let e = "";
      for (const s in t) {
        let r = t[s];
        null != r &&
          "" !== r &&
          ("object" == typeof r && (r = JSON.stringify(r)),
          (e += `${s}=${r}&`));
      }
      return (e = e.substring(0, e.length - 1)), e;
    }
    msg(e = t, s = "", r = "", a) {
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
              default:
                return { url: t.url || t.openUrl || t["open-url"] };
              case "Loon":
                return {
                  openUrl: t.openUrl || t.url || t["open-url"],
                  mediaUrl: t.mediaUrl || t["media-url"],
                };
              case "Quantumult X":
                return {
                  "open-url": t["open-url"] || t.url || t.openUrl,
                  "media-url": t["media-url"] || t.mediaUrl,
                  "update-pasteboard":
                    t["update-pasteboard"] || t.updatePasteboard,
                };
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
            $notification.post(e, s, r, i(a));
            break;
          case "Quantumult X":
            $notify(e, s, r, i(a));
          case "Node.js":
        }
      if (!this.isMuteLog) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e),
          s && t.push(s),
          r && t.push(r),
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
      const e = (new Date().getTime() - this.startTime) / 1e3;
      switch (
        (this.log("", `🔔${this.name}, 结束! 🕛 ${e} 秒`),
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
