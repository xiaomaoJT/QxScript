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
var appName = `🌌XiaoMao_星座运势`;
var XiaoMaoHoroscopeList = [];
var XiaoMaoHoroscopeTimeList = [];
var typeList = [
  {
    name: "\u2648\ufe0f\u767d\u7f8a\u5ea7",
    type: "baiyang",
    params: "aries",
  },
  {
    name: "\u2649\ufe0f\u91d1\u725b\u5ea7",
    type: "jinniu",
    params: "taurus",
  },
  {
    name: "\u264a\ufe0f\u53cc\u5b50\u5ea7",
    type: "shuangzi",
    params: "gemini",
  },
  {
    name: "\u264b\ufe0f\u5de8\u87f9\u5ea7",
    type: "juxie",
    params: "cancer",
  },
  {
    name: "\u264c\ufe0f\u72ee\u5b50\u5ea7",
    type: "shizi",
    params: "leo",
  },
  {
    name: "\u264d\ufe0f\u5904\u5973\u5ea7",
    type: "chunv",
    params: "virgo",
  },
  {
    name: "\u264e\ufe0f\u5929\u79e4\u5ea7",
    type: "tiancheng",
    params: "libra",
  },
  {
    name: "\u264f\ufe0f\u5929\u874e\u5ea7",
    type: "tianxie",
    params: "scorpio",
  },
  {
    name: "\u2650\ufe0f\u5c04\u624b\u5ea7",
    type: "sheshou",
    params: "sagittarius",
  },
  {
    name: "\u2651\ufe0f\u6469\u7faf\u5ea7",
    type: "mojie",
    params: "capricorn",
  },
  {
    name: "\u2652\ufe0f\u6c34\u74f6\u5ea7",
    type: "shuiping",
    params: "aquarius",
  },
  {
    name: "\u2653\ufe0f\u53cc\u9c7c\u5ea7",
    type: "shuangyu",
    params: "pisces",
  },
];
var timeList = [
  {
    name: "\u4eca\u65e5\u8fd0\u52bf",
    type: "D",
    params: "today",
  },
  {
    name: "\u660e\u65e5\u8fd0\u52bf",
    type: "T",
    params: "nextday",
  },
  {
    name: "\u672c\u5468\u8fd0\u52bf",
    type: "W",
    params: "week",
  },
  {
    name: "\u672c\u6708\u8fd0\u52bf",
    type: "M",
    params: "month",
  },
  {
    name: "\u672c\u5e74\u8fd0\u52bf",
    type: "Y",
    params: "year",
  },
];
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
    console.log(appName + "星座运势数据获取成功");
    setTimeout(() => {
      $XiaoMaoInfo.done();
    }, 5000);
  });

function XiaoMaoFunction(){$XiaoMaoInfo=API("XiaoMao");if($XiaoMaoInfo.read("HoroscopeList")&&$XiaoMaoInfo.read("HoroscopeTime")){XiaoMaoHoroscopeList=$XiaoMaoInfo.read("HoroscopeList").split("+");XiaoMaoHoroscopeTimeList=$XiaoMaoInfo.read("HoroscopeTime").split("+");if(XiaoMaoHoroscopeList.length&&XiaoMaoHoroscopeTimeList.length){XiaoMaoHoroscopeList.forEach((type)=>{XiaoMaoHoroscopeTimeList.forEach((time)=>{let typeObj=typeList.find((e)=>e.type==type);let timeObj=timeList.find((e)=>e.type==time);let timeObjName=timeObj.name.slice(0,2);if(typeObj&&timeObj){let option={url:encodeURI("https://api.vvhan.com/api/horoscope?type="+typeObj.params+"&time="+timeObj.params),method:"GET",headers:{"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",},};$task.fetch(option).then((response)=>{let obj=JSON.parse(response.body);if(obj.success){let resultText=typeObj.name+"- "+obj.data.type+"（"+obj.data.time+"）"+"\n\n";if(obj.data.hasOwnProperty("todo")){resultText=resultText+timeObjName+"吉凶宜忌："+"\n"+"✅适宜动作："+(obj.data.todo.yi||"- ")+"\n"+"❎忌讳动作："+(obj.data.todo.ji||"- ")+"\n"+"🔢幸运数字："+(obj.data.luckynumber||"- ")+"\n"+"🎨幸运颜色："+(obj.data.luckycolor||"- ")+"\n"+"❤️速配星座："+(obj.data.luckyconstellation||"- ")+"\n"+"💔提防星座："+(obj.data.badconstellation||"- ")+"\n"+"💮运势短评："+(obj.data.shortcomment||"- ")+"\n\n"}if(obj.data.hasOwnProperty("fortune")){let starIndex="🌟🌟🌟🌟🌟";resultText=resultText+timeObjName+"运势："+"\n"+"🈴综合运势："+starIndex.slice(0,2*parseInt(obj.data.fortune.all))+"\n"+"💞爱情运势："+starIndex.slice(0,2*parseInt(obj.data.fortune.love))+"\n"+"📖事业运势："+starIndex.slice(0,2*parseInt(obj.data.fortune.work))+"\n"+"💰财富运势："+starIndex.slice(0,2*parseInt(obj.data.fortune.money))+"\n"+"💪健康运势："+starIndex.slice(0,2*parseInt(obj.data.fortune.health))+"\n\n"}if(obj.data.hasOwnProperty("index")){resultText=resultText+timeObjName+"指数："+"\n"+"🈴综合运势："+obj.data.index.all+"\n"+"💞爱情运势："+obj.data.index.love+"\n"+"📖事业运势："+obj.data.index.work+"\n"+"💰财富运势："+obj.data.index.money+"\n"+"💪健康运势："+obj.data.index.health+"\n\n"}if(obj.data.hasOwnProperty("fortunetext")){resultText=resultText+timeObjName+"运势解析："+"\n"+"🈴综合运势："+obj.data.fortunetext.all+"\n"+"💞爱情运势："+obj.data.fortunetext.love+"\n"+"📖事业运势："+obj.data.fortunetext.work+"\n"+"💰财富运势："+obj.data.fortunetext.money+"\n"+"💪健康运势："+obj.data.fortunetext.health+"\n"+"😮‍💨解压秘诀："+(obj.data.fortunetext.decompression||"- ")+"\n"+"😄开运秘诀："+(obj.data.fortunetext.openluck||"- ")+"\n\n"}$notify("🌌XiaoMao_星座运势","",resultText)}}).catch((err)=>{getError(typeObj.name+"_error_1")})}})})}}else{$XiaoMaoInfo.notify(appName,"🚦数据获取失败❗️","🚧星座默认参数未正确填写或获取失败，请前往XiaoMaoBoxJS填写！https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHoroscope.js")}}function getError(params){$notify("🌌XiaoMao_星座运势","","🚧"+params+"获取失败，请稍后再试❗️",{"open-url":"https://i.pixiv.re/img-original/img/2022/04/21/04/04/09/97769134_p0.png","media-url":"https://i.pixiv.re/img-original/img/2022/04/21/04/04/09/97769134_p0.png",})}setTimeout(()=>{$done({})},2000);