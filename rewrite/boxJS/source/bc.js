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
function getGoneDay(n = 0, yearFlag = true) {
  let myDate = new Date();
  myDate.setDate(myDate.getDate() - n);
  let month = myDate.getMonth() + 1;
  let day = myDate.getDate();
  let result =
    "" +
    (yearFlag ? myDate.getFullYear() : "") +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    (day < 10 ? "0" + day : day);
  return result;
}
var obj = JSON.parse(
  $response.body
    .replace(/\"ownership\":\"\w+\"/g, '"ownership":"free"')
    .replace(/\"remark\":\"\w+\"/g, '"remark":"使用期限：永久"')
    .replace(/\"enable\":\"\w+\"/g, '"enable":true')
    .replace(/\"usageType\":\"\w+\"/g, '"usageType":"unlimited"')
    .replace(/\"canDownloadAll\":\"\w+\"/g, '"canDownloadAll":true')
    .replace(/preview/g, "free")
    .replace(/builtin/g, "free")
    .replace(/仅限试用/g, "使用期限：永久")
    .replace(/使用期限：未知/g, "使用期限：永久")
    .replace(/false/g, "true")
);
var $XiaoMaoSvip = "";
var appName = `XiaoMao-黄油相机vip`;
var XiaoMaoSvip = "";
let XiaoMaoEndTime = null;
let fi = 1;
let fs = 999999;
let modelOk = 0;
!(async () => {
  await XiaoMaoFunction();
})()
  .catch((err) => {
    $XiaoMaoSvip.error(err);
    setTimeout(() => {
      $XiaoMaoSvip.done();
    }, 3000);
  })
  .finally(() => {
    console.log(appName + "设置成功");
    setTimeout(() => {
      $XiaoMaoSvip.done();
    }, 5000);
  });
function XiaoMaoFunction() {
  $XiaoMaoSvip = API("XiaoMao");
  if (
    $XiaoMaoSvip.read("ButterVipYear") &&
    $XiaoMaoSvip.read("ButterVipMonth") &&
    $XiaoMaoSvip.read("ButterVipDay")
  ) {
    SvipDate = new Date(
      $XiaoMaoSvip.read("ButterVipYear") +
        "/" +
        $XiaoMaoSvip.read("ButterVipMonth") +
        "/" +
        $XiaoMaoSvip.read("ButterVipDay")
    ).getTime();
    if (!SvipDate) {
      $XiaoMaoSvip.notify(
        appName,
        "",
        "会员日期设置错误，请输入正确的日期范围!"
      );
      XiaoMaoSvip = getGoneDay(-9);
    } else {
      XiaoMaoSvip =
        $XiaoMaoSvip.read("ButterVipYear") +
        "/" +
        $XiaoMaoSvip.read("ButterVipMonth") +
        "/" +
        $XiaoMaoSvip.read("ButterVipDay");
    }
  } else {
    XiaoMaoSvip = getGoneDay(-9);
  }
  if ($XiaoMaoSvip.read("ButterFollowing")) {
    let num = parseInt($XiaoMaoSvip.read("ButterFollowing"));
    fi = num > 0 ? num : fi;
  }
  if ($XiaoMaoSvip.read("ButterFollowers")) {
    let num = parseInt($XiaoMaoSvip.read("ButterFollowers"));
    fs = num > 0 ? num : fs;
  }
  if ($XiaoMaoSvip.read("ButterModel")) {
    let num = parseInt($XiaoMaoSvip.read("ButterModel"));
    modelOk = num;
  }
  XiaoMaoEndTime = new Date(XiaoMaoSvip).getTime() / 1000;
}
if ($response.body) {
  let requestUrl = $request.url;
  if (/^https:\/\/api4\.bybutter\.com\/v4\/users?/.test(requestUrl)) {
    let arrObj = [
      {
        usageType: "unlimited",
        term: 31622400,
        id: "1",
        ownership: "temporary",
        type: "membership",
        name: "普通会员",
        endAt: XiaoMaoEndTime,
        startAt: 1674975583,
      },
    ];
    if (obj == [] || obj.length == 0) {
      obj = arrObj;
    }
    obj.hasOwnProperty("memberships") ? (obj.memberships = arrObj) : "";
    obj.hasOwnProperty("followingCount") ? (obj.followingCount = fi) : "";
    obj.hasOwnProperty("followersCount") ? (obj.followersCount = fs) : "";
    obj.hasOwnProperty("bio") ? (obj.bio = "微信公众号「小帽集团」") : "";
  } else if (
    /^https:\/\/api4\.bybutter\.com\/v4\/users\/me\/attributes?/.test(
      requestUrl
    )
  ) {
    obj["using:ai"] = true;
    obj["shop:subscriptionProducts"] = "0BUTTERVIP12MONTH";
  } else if (
    (/^https:\/\/api4\.bybutter\.com\/v4\/editor?/.test(requestUrl) ||
      /^https:\/\/api4\.bybutter\.com\/v4\/(template|template-square)?/.test(
        requestUrl
      )) &&
    obj.hasOwnProperty("data") &&
    obj.data.length > 0
  ) {
    obj.data.forEach((el) => {
      el.author.name = "XiaoMao";
      el.author.authorName = "XiaoMao";
      el.pictureSet.preview = el.pictureSet.free;
    });
  } else if (
    /^https:\/\/api4\.bybutter\.com\/v4\/templates\/.+\/dingWithGroup?/.test(
      requestUrl
    )
  ) {
    obj.hasOwnProperty("stickers") && obj.stickers.length
      ? obj.stickers.forEach((item) => {
          item.usageType = "USAGE_TYPE_UNLIMITED";
          item.ownership = "free";
          item.style = "none";
          item.paymentChannels = ["butter:free"];
          item.ownershipType = "free";
          item.enable = true;
          item.meta = {};
        })
      : "";
    obj.hasOwnProperty("strokes") && obj.strokes.length
      ? obj.strokes.forEach((item) => {
          item.usageType = "USAGE_TYPE_UNLIMITED";
          item.ownership = "free";
          item.style = "none";
          item.paymentChannels = ["butter:free"];
          item.ownershipType = "free";
          item.enable = true;
          item.meta = {};
        })
      : "";
    obj.hasOwnProperty("packets") && obj.packets.length
      ? obj.packets.forEach((item) => {
          item.downloadUrl = item.uri;
          delete item.uri;
          item.usageType = "unlimited";
          item.ownership = "free";
          item.style = "none";
          item.paymentChannels = ["butter:free"];
          item.ownershipType = "free";
          item.enable = true;
          item.meta = {};
        })
      : "";
    obj.hasOwnProperty("bubbles") && obj.bubbles.length
      ? obj.bubbles.forEach((item) => {
          item.usageType = "USAGE_TYPE_UNLIMITED";
          item.ownership = "free";
          item.style = "none";
          item.paymentChannels = ["butter:free"];
          item.ownershipType = "free";
          item.enable = true;
          item.meta = {};
        })
      : "";
    obj.hasOwnProperty("brushes") && obj.brushes.length
      ? obj.brushes.forEach((item) => {
          item.usageType = "unlimited";
          item.ownership = "free";
          item.style = "none";
          item.paymentChannels = ["butter:free"];
          item.ownershipType = "free";
          item.enable = true;
          item.meta = {};
        })
      : "";
    obj.hasOwnProperty("filters") && obj.filters.length
      ? obj.filters.forEach((item) => {
          item.usageType = "USAGE_TYPE_UNLIMITED";
          item.ownership = "free";
          item.style = "none";
          item.paymentChannels = ["butter:free"];
          item.ownershipType = "free";
          item.enable = true;
          item.meta = {};
        })
      : "";
    obj.hasOwnProperty("font") && obj.font.length
      ? obj.font.forEach((item) => {
          item.usageType = "USAGE_TYPE_UNLIMITED";
          item.ownership = "free";
          item.style = "none";
          item.paymentChannels = ["butter:free"];
          item.ownershipType = "free";
          item.enable = true;
          item.meta = {};
        })
      : "";
  } else if (
    /^https:\/\/api4\.bybutter\.com\/v4\/search\/products?/.test(requestUrl)
  ) {
    if (obj.hasOwnProperty("data")) {
      obj.data.forEach((el) => {
        if (el.hasOwnProperty("priceRemark")) {
          delete el.priceRemark;
          delete el.simpleRemark;
        }
        el.hasOwnProperty("name") ? (el.name = "XiaoMao") : "";
        el.usageType = "USAGE_TYPE_UNLIMITED";
        if (!el.hasOwnProperty("downloadUri")) {
          el.downloadUri = el.iconUri;
          delete el.uri;
        }
        el.style = "none";
        el.paymentChannels = ["butter:free"];
        el.ownershipType = "free";
        el.enable = true;
        el.meta = {};
        if (el.hasOwnProperty("price")) {
          if (el.price && el.price.length) {
            el.price.forEach((price) => {
              price.price = 0;
              price.ownershipType = "free";
              price.enable = true;
              price.style = "none";
              price.meta = {};
              price.paymentChannels = ["butter:free"];
              price.localizedOriginalPrice = "0.00";
              price.localizedPrice = "0.00";
              price.remark = "使用期限：永久";
            });
          }
        } else {
          el.price = [
            {
              enable: true,
              style: "none",
              paymentChannels: ["butter:free"],
              localizedOriginalPrice: "0.00",
              localizedPrice: "0.00",
              price: 0,
              originalPrice: 0,
              attributes: [],
              localizedUnit: "NT$",
              meta: {},
              ownershipType: "free",
            },
          ];
        }
        el.remark = "使用期限：永久";
      });
    }
  } else if (
    /^https:\/\/api4\.bybutter\.com\/v4\/shop\/shelves\/(packet|brush|font|filter|recommend-tag)?/.test(
      requestUrl
    )
  ) {
    if (obj.hasOwnProperty("data")) {
      obj.data.forEach((el) => {
        if (el.hasOwnProperty("priceRemark")) {
          delete el.priceRemark;
          delete el.simpleRemark;
        }
        el.style = "none";
        el.paymentChannels = ["butter:free"];
        el.ownershipType = "free";
        el.enable = true;
        el.meta = {};
        if (el.price.length) {
          el.price.forEach((price) => {
            price.price = 0;
            price.ownershipType = "free";
            price.enable = true;
            price.style = "none";
            price.meta = {};
            price.paymentChannels = ["butter:free"];
            price.localizedOriginalPrice = "0.00";
            price.localizedPrice = "0.00";
            price.remark = "使用期限：永久";
          });
        } else {
          el.price = [
            {
              enable: true,
              style: "none",
              paymentChannels: ["butter:free"],
              localizedOriginalPrice: "0.00",
              localizedPrice: "0.00",
              price: 0,
              originalPrice: 0,
              attributes: [],
              localizedUnit: "NT$",
              meta: {},
              ownershipType: "free",
            },
          ];
        }
        el.remark = "使用期限：永久";
      });
    }
  } else if (
    /^https:\/\/api4\.bybutter\.com\/v4\/shop\/me\/privileges?/.test(
      requestUrl
    ) &&
    modelOk
  ) {
    if (obj.hasOwnProperty("packets") && obj.packets.length) {
      obj.packets.forEach((el) => {
        el.enable = true;
        el.style = "none";
        el.remark = "使用期限：永久";
        el.paymentChannels = ["butter:free"];
      });
    }
    if (obj.hasOwnProperty("filters") && obj.filters.length) {
      obj.filters.forEach((el) => {
        el.enable = true;
        el.style = "none";
        el.remark = "使用期限：永久";
        el.paymentChannels = ["butter:free"];
      });
    }
    if (obj.hasOwnProperty("brushes") && obj.brushes.length) {
      obj.brushes.forEach((el) => {
        el.enable = true;
        el.style = "none";
        el.remark = "使用期限：永久";
        el.paymentChannels = ["butter:free"];
      });
    }
    if (obj.hasOwnProperty("fonts") && obj.fonts.length) {
      obj.fonts.forEach((el) => {
        el.enable = true;
        el.style = "none";
        el.remark = "使用期限：永久";
        el.paymentChannels = ["butter:free"];
      });
    }
    if (obj.hasOwnProperty("bubbles") && obj.bubbles.length) {
      obj.bubbles.forEach((el) => {
        el.enable = true;
        el.style = "none";
        el.remark = "使用期限：永久";
        el.paymentChannels = ["butter:free"];
      });
    }
    if (obj.hasOwnProperty("strokes") && obj.strokes.length) {
      obj.strokes.forEach((el) => {
        el.enable = true;
        el.style = "none";
        el.remark = "使用期限：永久";
        el.paymentChannels = ["butter:free"];
      });
    }
    if (obj.hasOwnProperty("sounds") && obj.sounds.length) {
      obj.sounds.forEach((el) => {
        el.enable = true;
        el.style = "none";
        el.remark = "使用期限：永久";
        el.paymentChannels = ["butter:free"];
      });
    }
    if (obj.hasOwnProperty("wallpapers") && obj.wallpapers.length) {
      obj.wallpapers.forEach((el) => {
        el.enable = true;
        el.style = "none";
        el.remark = "使用期限：永久";
        el.paymentChannels = ["butter:free"];
      });
    }
    if (obj.hasOwnProperty("features") && obj.features.length) {
      obj.features.forEach((el) => {
        el.remark = "使用期限：永久";
        el.usageType = "unlimited";
        el.ownership = "free";
      });
    }
  } else if (
    /^https:\/\/api4\.bybutter\.com\/v4\/shop\/products?/.test(requestUrl)
  ) {
    if (obj.length != undefined) {
      obj.forEach((el) => {
        el.paymentChannels = ["butter:free"];
        el.enable = true;
        el.style = "none";
        el.basePrice = 0;
        if (el.price.length) {
          el.price.forEach((price) => {
            delete price.priceRemark;
            delete price.simpleRemark;
            delete price.group;
            price.price = 0;
            price.ownershipType = "free";
            price.enable = true;
            price.style = "none";
            price.meta = {};
            price.paymentChannels = ["butter:free"];
            price.localizedOriginalPrice = "0.00";
            price.localizedPrice = "0.00";
            price.remark = "使用期限：永久";
          });
        } else {
          el.price = [
            {
              enable: true,
              style: "none",
              paymentChannels: ["butter:free"],
              localizedOriginalPrice: "0.00",
              localizedPrice: "0.00",
              price: 0,
              originalPrice: 0,
              attributes: [],
              localizedUnit: "NT$",
              meta: {},
              ownershipType: "free",
            },
          ];
        }
        if (el.items.length) {
          el.items.forEach((el) => {
            delete el.privilege.uri;
          });
        }
      });
    } else if (obj.hasOwnProperty("enable")) {
      obj.enable = true;
      obj.style = "none";
      delete obj.priceRemark;
      delete obj.simpleRemark;
      obj.remark = "使用期限：永久";
      obj.paymentChannels = ["butter:free"];
      if (obj.price.length) {
        obj.price.forEach((price) => {
          price.price = 0;
          price.ownershipType = "free";
          price.enable = true;
          price.style = "none";
          price.meta = {};
          price.paymentChannels = ["butter:free"];
          price.localizedOriginalPrice = "0.00";
          price.localizedPrice = "0.00";
          price.remark = "使用期限：永久";
        });
      } else {
        delete obj.price.priceRemark;
        delete obj.price.simpleRemark;
        obj.price = [
          {
            enable: true,
            style: "none",
            paymentChannels: ["butter:free"],
            localizedOriginalPrice: "0.00",
            localizedPrice: "0.00",
            price: 0,
            originalPrice: 0,
            attributes: [],
            localizedUnit: "NT$",
            meta: {},
            ownershipType: "free",
          },
        ];
      }
    }
  }
  let FinishBody = JSON.stringify(obj);
  $done(FinishBody);
} else {
  $done({});
}
