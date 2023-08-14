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
var appName = `⛽️XiaoMao_每日油价`;
var XiaoMaoProvince = "";
var XiaoMaoCity = "";
var XiaoMaoArea = "";
var XiaoMaoAreaInfo = "";

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
    console.log(appName + "油价地区数据获取成功");
    setTimeout(() => {
      $XiaoMaoInfo.done();
    }, 5000);
  });
function XiaoMaoFunction(){$XiaoMaoInfo=API("XiaoMao");if($XiaoMaoInfo.read("YouJiaProvince")){if(!$XiaoMaoInfo.read("YouJiaCity")&&$XiaoMaoInfo.read("YouJiaArea")){XiaoMaoProvince=$XiaoMaoInfo.read("YouJiaProvince")?"/"+$XiaoMaoInfo.read("YouJiaProvince"):"/guangdong";$XiaoMaoInfo.notify(appName+"地区数据获取失败❗️","🚦当前默认获取省级行政区数据","🚧油价地区信息不可跨行政区填写，请前往XiaoMaoBoxJS修正！");return}else{XiaoMaoProvince=$XiaoMaoInfo.read("YouJiaProvince")?"/"+$XiaoMaoInfo.read("YouJiaProvince"):"/guangdong";XiaoMaoCity=$XiaoMaoInfo.read("YouJiaCity")?"/"+$XiaoMaoInfo.read("YouJiaCity"):"";XiaoMaoArea=$XiaoMaoInfo.read("YouJiaArea")?"/"+$XiaoMaoInfo.read("YouJiaArea"):""}}else{XiaoMaoProvince="/guangdong";$XiaoMaoInfo.notify(appName+"地区数据获取失败❗️","🚦当前默认获取广东油价信息","🚧油价地区信息未填写或获取失败，请前往XiaoMaoBoxJS填写！")}XiaoMaoAreaInfo=XiaoMaoProvince+XiaoMaoCity+XiaoMaoArea;let url="http://www.qiyoujiage.com"+XiaoMaoAreaInfo+".shtml";let option={url:encodeURI(url),method:"GET",headers:{"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",},};$task.fetch(option).then((response)=>{let obj=response.body.replace(/\s*/g,"").toString();let startIndex=obj.indexOf('<divclass="info">');let endIndex=obj.indexOf('<divid="contAd"');let subContent=obj.substring(startIndex,endIndex);let areaIndex=subContent.indexOf("</div>");let areaTitle=subContent.substring(17,areaIndex).replace("每日即时更新单位:元/升","").replace("(汽油跟柴油价格)","").replace("）","由XiaoMao加工而得）")||"每日油价";let areaList=subContent.split("<dl>");let areaContentList=[];if(areaList.length){areaList.forEach((el,index)=>{if(index!=0){let end1=el.indexOf("</dt>");let type=el.substring(4,end1);let end2=el.indexOf("</dd>");let price=el.substring(end1+9,end2);areaContentList.push({type:type,price:price+"(元/升)"})}})}let subContent2=subContent.substring(subContent.lastIndexOf("</dl>")+20,subContent.length);let changeStart=subContent2.indexOf(">");let changeEnd=subContent2.indexOf("<br/>");let changeText=subContent2.substring(changeStart+1,changeEnd)||"";let subContent3=subContent2.substring(changeEnd+5,subContent2.length);let changeInfoStart=subContent3.indexOf(">");let changeInfoEnd=subContent3.indexOf("</span>");let changeInfoTem=subContent3.substring(changeInfoStart+1,changeInfoEnd);let changeInfo=changeInfoTem.substring(0,changeInfoTem.lastIndexOf("，"))||"";let resultText="🛟 "+areaTitle+"\n\n";if(areaContentList.length){areaContentList.forEach((el,index)=>{resultText=resultText+(index!=3?"⛽️ "+el.type+"："+el.price:"🛢 "+el.type+"  ："+el.price)+"\n"});resultText=resultText+"\n\n"+(changeText?"📈 本轮油价调整时间："+changeText:"")+"\n\n"+(changeInfo?"📣 本轮油价调整幅度："+changeInfo:"");$notify("⛽️XiaoMao_每日油价❗️","",resultText)}else{$notify("🚨XiaoMao_每日油价❗️","","🚧获取失败，请检查XiaoMaoBoxJS地区设置❗️",{"open-url":"https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg","media-url":"https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg",})}}).catch((err)=>{$notify("🚨XiaoMao_每日油价❗️","","🚧获取失败，请稍后再试❗️",{"open-url":"https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg","media-url":"https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg",})})}setTimeout(()=>{$done({})},2000);