function ENV() {
  const e = "function" == typeof require && "undefined" != typeof $jsbox;
  return {
    isQX: "undefined" != typeof $task,
    isLoon: "undefined" != typeof $loon,
    isSurge: "undefined" != typeof $httpClient && "undefined" == typeof $loon,
    isBrowser: "undefined" != typeof document,
    isNode: "function" == typeof require && !e,
    isJSBox: e,
    isRequest: "undefined" != typeof $request,
    isScriptable: "undefined" != typeof importModule,
  };
}
function HTTP(e = { baseURL: "" }) {
  function t(t, a) {
    a = "string" == typeof a ? { url: a } : a;
    const h = e.baseURL;
    h && !d.test(a.url || "") && (a.url = h ? h + a.url : a.url),
      a.body &&
        a.headers &&
        !a.headers["Content-Type"] &&
        (a.headers["Content-Type"] = "application/x-www-form-urlencoded"),
      (a = { ...e, ...a });
    const c = a.timeout,
      l = {
        onRequest: () => {},
        onResponse: (e) => e,
        onTimeout: () => {},
        ...a.events,
      };
    let f, y;
    if ((l.onRequest(t, a), s)) f = $task.fetch({ method: t, ...a });
    else if (o || n)
      f = new Promise((e, s) => {
        $httpClient[t.toLowerCase()](a, (t, o, n) => {
          t
            ? s(t)
            : e({
                statusCode: o.status || o.statusCode,
                headers: o.headers,
                body: n,
              });
        });
      });
    else if (r) {
      const e = require("got"),
        s = require("iconv-lite");
      f = new Promise((o, n) => {
        e[t.toLowerCase()](a)
          .then((e) =>
            o({
              statusCode: e.statusCode,
              headers: e.headers,
              body: s.decode(e.rawBody, "utf-8"),
            })
          )
          .catch(n);
      });
    } else if (i) {
      const e = new Request(a.url);
      (e.method = t),
        (e.headers = a.headers),
        (e.body = a.body),
        (f = new Promise((t, s) => {
          e.loadString()
            .then((s) => {
              t({
                statusCode: e.response.statusCode,
                headers: e.response.headers,
                body: s,
              });
            })
            .catch((e) => s(e));
        }));
    } else
      u &&
        (f = new Promise((e, s) => {
          fetch(a.url, { method: t, headers: a.headers, body: a.body })
            .then((e) => e.json())
            .then((t) =>
              e({ statusCode: t.status, headers: t.headers, body: t.data })
            )
            .catch(s);
        }));
    const p = c
      ? new Promise((e, s) => {
          y = setTimeout(
            () => (
              l.onTimeout(), s(`${t}URL:${a.url}exceeds the timeout ${c}ms`)
            ),
            c
          );
        })
      : null;
    return (
      p ? Promise.race([p, f]).then((e) => (clearTimeout(y), e)) : f
    ).then((e) => l.onResponse(e));
  }
  const {
      isQX: s,
      isLoon: o,
      isSurge: n,
      isScriptable: i,
      isNode: r,
      isBrowser: u,
    } = ENV(),
    a = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    d =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    h = {};
  return a.forEach((e) => (h[e.toLowerCase()] = (s) => t(e, s))), h;
}
function API(e = "untitled", t = !1) {
  const {
    isQX: s,
    isLoon: o,
    isSurge: n,
    isNode: i,
    isJSBox: r,
    isScriptable: u,
  } = ENV();
  return new (class {
    constructor(e, t) {
      (this.name = e),
        (this.debug = t),
        (this.http = HTTP()),
        (this.env = ENV()),
        (this.node = (() => {
          if (i) {
            const e = require("fs");
            return { fs: e };
          }
          return null;
        })()),
        this.initCache();
      const s = (e, t) =>
        new Promise(function (s) {
          setTimeout(s.bind(null, t), e);
        });
      Promise.prototype.delay = function (e) {
        return this.then(function (t) {
          return s(e, t);
        });
      };
    }
    initCache() {
      if (
        (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")),
        (o || n) &&
          (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")),
        i)
      ) {
        let e = "root.json";
        this.node.fs.existsSync(e) ||
          this.node.fs.writeFileSync(
            e,
            JSON.stringify({}),
            { flag: "wx" },
            (e) => console.log(e)
          ),
          (this.root = {}),
          (e = `${this.name}.json`),
          this.node.fs.existsSync(e)
            ? (this.cache = JSON.parse(
                this.node.fs.readFileSync(`${this.name}.json`)
              ))
            : (this.node.fs.writeFileSync(
                e,
                JSON.stringify({}),
                { flag: "wx" },
                (e) => console.log(e)
              ),
              (this.cache = {}));
      }
    }
    persistCache() {
      const e = JSON.stringify(this.cache, null, 2);
      s && $prefs.setValueForKey(e, this.name),
        (o || n) && $persistentStore.write(e, this.name),
        i &&
          (this.node.fs.writeFileSync(
            `${this.name}.json`,
            e,
            { flag: "w" },
            (e) => console.log(e)
          ),
          this.node.fs.writeFileSync(
            "root.json",
            JSON.stringify(this.root, null, 2),
            { flag: "w" },
            (e) => console.log(e)
          ));
    }
    write(e, t) {
      if ((this.log(`SET ${t}`), -1 !== t.indexOf("#"))) {
        if (((t = t.substr(1)), n || o)) return $persistentStore.write(e, t);
        if (s) return $prefs.setValueForKey(e, t);
        i && (this.root[t] = e);
      } else this.cache[t] = e;
      this.persistCache();
    }
    read(e) {
      return (
        this.log(`READ ${e}`),
        -1 === e.indexOf("#")
          ? this.cache[e]
          : ((e = e.substr(1)),
            n || o
              ? $persistentStore.read(e)
              : s
              ? $prefs.valueForKey(e)
              : i
              ? this.root[e]
              : void 0)
      );
    }
    delete(e) {
      if ((this.log(`DELETE ${e}`), -1 !== e.indexOf("#"))) {
        if (((e = e.substr(1)), n || o)) return $persistentStore.write(null, e);
        if (s) return $prefs.removeValueForKey(e);
        i && delete this.root[e];
      } else delete this.cache[e];
      this.persistCache();
    }
    notify(e, t = "", a = "", d = {}) {
      const h = d["open-url"],
        c = d["media-url"];
      if (
        (s && $notify(e, t, a, d),
        n &&
          $notification.post(e, t, a + `${c ? "\n多媒体:" + c : ""}`, {
            url: h,
          }),
        o)
      ) {
        let s = {};
        h && (s.openUrl = h),
          c && (s.mediaUrl = c),
          "{}" === JSON.stringify(s)
            ? $notification.post(e, t, a)
            : $notification.post(e, t, a, s);
      }
      if (i || u) {
        const s = a + (h ? `\n点击跳转:${h}` : "") + (c ? `\n多媒体:${c}` : "");
        if (r) {
          const o = require("push");
          o.schedule({ title: e, body: (t ? t + "\n" : "") + s });
        } else console.log(`${e}\n${t}\n${s}\n\n`);
      }
    }
    log(e) {
      this.debug && console.log(`[${this.name}]LOG:${this.stringify(e)}`);
    }
    info(e) {
      console.log(`[${this.name}]INFO:${this.stringify(e)}`);
    }
    error(e) {
      console.log(`[${this.name}]ERROR:${this.stringify(e)}`);
    }
    wait(e) {
      return new Promise((t) => setTimeout(t, e));
    }
    done(e = {}) {
      s || o || n
        ? $done(e)
        : i &&
          !r &&
          "undefined" != typeof $context &&
          (($context.headers = e.headers),
          ($context.statusCode = e.statusCode),
          ($context.body = e.body));
    }
    stringify(e) {
      if ("string" == typeof e || e instanceof String) return e;
      try {
        return JSON.stringify(e, null, 2);
      } catch (e) {
        return "[object Object]";
      }
    }
  })(e, t);
}

var $XiaoMaoInfo = "";
var appName = `🔥XiaoMao_实时热榜`;
var XiaoMaoProvince = "";
var XiaoMaoHotList = [];
var typeList = [
  { name: "\u864e\u6251\u70ed\u699c", type: "hp", params: "huPu" },
  { name: "\u77e5\u4e4e\u70ed\u699c", type: "zh", params: "zhihuHot" },
  { name: "36\u6c2a\u70ed\u699c", type: "36", params: "36Ke" },
  { name: "\u767e\u5ea6\u70ed\u699c", type: "bd", params: "baiduRD" },
  { name: "B\u7ad9\u70ed\u699c", type: "bz", params: "bili" },
  { name: "\u8d34\u5427\u70ed\u699c", type: "tb", params: "baiduRY" },
  { name: "\u5fae\u535a\u70ed\u699c", type: "wb", params: "wbHot" },
  { name: "\u6296\u97f3\u70ed\u699c", type: "gy", params: "douyinHot" },
  { name: "\u8c46\u74e3\u70ed\u699c", type: "db", params: "douban" },
  { name: "\u5fae\u4fe1\u70ed\u699c", type: "wx", params: "wxHot" },
  { name: "\u5c11\u6570\u6d3e\u70ed\u699c", type: "ss", params: "ssPai" },
  { name: "IT\u8d44\u8baf\u70ed\u699c", type: "it", params: "itInfo" },
  { name: "IT\u8d44\u8baf\u65b0\u699c", type: "itn", params: "itNews" },
  {
    name: "\u5386\u53f2\u4e0a\u7684\u4eca\u5929",
    type: "ls",
    params: "history",
  },
  { name: "\u5fae\u4fe1\u7f8e\u98df\u699c", type: "ms", params: "wxFood" },
  { name: "\u5fae\u4fe1\u641e\u7b11\u699c", type: "gx", params: "wxJoke" },
  { name: "\u5fae\u4fe1\u8d22\u7ecf\u699c", type: "cj", params: "wxMoney" },
  { name: "\u5fae\u4fe1\u79d1\u6280\u699c", type: "kj", params: "wxKeJi" },
  { name: "\u5fae\u4fe1\u516b\u5366\u699c", type: "bg", params: "wxBaGua" },
  { name: "\u5fae\u4fe1\u661f\u5ea7\u699c", type: "xz", params: "wxXingZuo" },
  { name: "\u5fae\u4fe1\u65c5\u6e38\u699c", type: "ly", params: "wxLvYou" },
];
var showUrl = true;
var showLength = 100;

!(async () => {
  await XiaoMaoFunction();
})()
  .catch((err) => {
    $XiaoMaoInfo.error(err);
    setTimeout(() => {
      $XiaoMaoInfo.done();
    }, 3000);
  })
  .finally(() => {
    console.log(appName + "实时热榜数据获取成功");
    setTimeout(() => {
      $XiaoMaoInfo.done();
    }, 5000);
  });

  function XiaoMaoFunction(){$XiaoMaoInfo=API("XiaoMao");if($XiaoMaoInfo.read("HotUrl")){showUrl=$XiaoMaoInfo.read("HotUrl")=="0"?false:true}if($XiaoMaoInfo.read("HotLength")){showLength=parseInt($XiaoMaoInfo.read("HotLength"))}if($XiaoMaoInfo.read("HotList")){XiaoMaoHotList=$XiaoMaoInfo.read("HotList").split("+");if(XiaoMaoHotList.length){XiaoMaoHotList.forEach((el)=>{let typeObj=typeList.find((e)=>e.type==el);if(typeObj){let option={url:encodeURI("https://api.vvhan.com/api/hotlist?type="+typeObj.params),method:"GET",headers:{"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",},};$task.fetch(option).then((response)=>{let obj=JSON.parse(response.body);if(obj.success&&obj.data.length){let resultText="♨️ "+typeObj.name+"\n"+"⏰ 更新时间："+obj.update_time+"\n\n";let list=obj.data.slice(0,showLength);list.forEach((item,i)=>{resultText=resultText+"["+item.index+"] "+(item.hasOwnProperty("hot")?(i<5?"[🔥":"[")+"热度："+item.hot.toString().replace("热度","").replace("万","w").replace("千","k")+"] ":"")+item.title+(showUrl?"\n"+"原文地址："+item.mobilUrl:"")+"\n\n"});$notify("🔥XiaoMao_实时热榜","",resultText)}else{getError(typeObj.name+"_error_2")}}).catch((err)=>{getError(typeObj.name+"_error_1")})}})}}else{$XiaoMaoInfo.notify(appName,"🚦数据获取失败❗️","🚧热榜默认参数未填写或获取失败，请前往XiaoMaoBoxJS填写！https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHot.js")}}function getError(params){$notify("🔥XiaoMao_实时热榜","","🚧"+params+"获取失败，请稍后再试❗️",{"open-url":"https://i.pixiv.re/img-original/img/2022/01/08/17/30/22/95384359_p0.jpg","media-url":"https://i.pixiv.re/img-original/img/2022/01/08/17/30/22/95384359_p0.jpg",})}setTimeout(()=>{$done({})},2000);