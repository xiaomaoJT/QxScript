/*
 * 热门兑换码抓取 (QX 运行脚本 / 简单加密版)
 * 登录 Cookie 来自 BoxJS「AH」卡片 AppHuntCookies（由 ah_check_cookie.js 抓取）
 * 支持多登录态循环、失效检测、访客码对比，LIMIT/访客Cookie 可在卡片配置
 *
 * 自动任务 (QX > 任务 > [task_local])：复制下面整行即可
 * 0 0 1 1 * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/ah_catch.js, tag=兑换码抓取, img-url=https://apphunt.app/api/icons/6807537708?v=7f85689094b3, enabled=false
 * 说明：enabled=false 表示默认关闭，需到任务里手动开启/点运行；若要定时每天跑，把 cron 改成 0 8 * * * 并设 enabled=true
 */

// ===== 轻量混淆解码：4 位十六进制一组，异或 90 还原 =====
function dec(h) {
  var o = "", i = 0;
  while (i < h.length) {
    o += String.fromCharCode(parseInt(h.substr(i, 4), 16) ^ 90);
    i += 4;
  }
  return o;
}

(function () {
  var BASE = dec('0032002e002e002a0029006000750075003b002a002a0032002f0034002e0074003b002a002a'),
      API = dec('0075003b002a00330075002a0028003500370035002900750028003f002c003f003b0036'),
      REGISTER_URL = dec('0032002e002e002a0029006000750075003b002a002a0032002f0034002e0074003b002a002a0075003b002a00330075003b002f002e003200750028003f003d00330029002e003f0028'),
      EMAIL_DOMAIN = dec('001a003d0037003b003300360074003900350037'),
      UA = dec('001700350020003300360036003b0075006f0074006a007a0072000d00330034003e0035002d0029007a0014000e007a006b006a0074006a0061007a000d00330034006c006e0061007a0022006c006e0073007a001b002a002a0036003f000d003f003800110033002e0075006f0069006d00740069006c007a007200110012000e001700160076007a003600330031003f007a001d003f0039003100350073007a00190032002800350037003f0075006b006f006d0074006a0074006a0074006a007a0009003b003c003b002800330075006f0069006d00740069006c'),
      GUEST_DEFAULT = dec('003b002a002a0032002f0034002e0005003e003b00230067003e006800740035003c003c0061007a003b002a002a0032002f0034002e0005003c00360035002d0067003300340029002e003b003600360061007a003b002a002a0032002f0034002e0005003d003900670068007f0069001b0070007f006d001900390037002d0030002b0034002e003b0033006a006a006a006b0039006300370069002e003b00310028002c0032003d006a0074006c00620069006e0063006e006b00690062006b007f006d001900390037002d003000350062002b0029002d006a006a006a006b00390063003e0037003500300062003b003100380063002b0074006c00620069006e0062006d0062006200680068007f006d001900390037002d003f0022002b0062002e003e006a006a006a006b003900630022002b0063003e00290032006f00280068003d0074006c006200690069006d006a006a00630068006f0061007a003b002a002a0032002f0034002e0005003d002f003f0029002e0067006e003e003b0038006e0063006f006a006c006b0068003e006e003c006a003b006900390069006a006300680063006c006a00630038003e00620039003b006f'),
      K_COOKIES = dec('001b002a002a0012002f0034002e00190035003500310033003f0029'),
      K_LIMIT = dec('001b002a002a0012002f0034002e0016003300370033002e'),
      K_GUEST = dec('001b002a002a0012002f0034002e001d002f003f0029002e00190035003500310033003f'),
      K_ONLYHOT = dec('001b002a002a0012002f0034002e001500340036002300120035002e'),
      K_AUTOMODE = dec('001b002a002a0012002f0034002e001b002f002e003500170035003e003f'),
      K_AUTONUM = dec('001b002a002a0012002f0034002e001b002f002e00350014002f0037'),
      K_AUTOMERGE = dec('001b002a002a0012002f0034002e001b002f002e00350017003f0028003d003f'),
      PATH_ZH = dec('00750020003200770032003b00340029'),
      PAGE_VAL = dec('003300340029002e003b003600360061003e006800740035003c003c');

  function read(k) {
    if (typeof $prefs !== "undefined" && $prefs) return $prefs.valueForKey(k);
    if (typeof $persistentStore !== "undefined") return $persistentStore.read(k);
    return null;
  }
  function notify(t, s, b) {
    if (typeof $notify === "function") $notify(t, s, b);
  }
  // 从 redeemUrl 里提取 app id，拼成 App Store 详情页链接；依次尝试多个候选，取第一个能提取到 id 的
  function appStoreLink() {
    for (var i = 0; i < arguments.length; i++) {
      if (!arguments[i]) continue;
      var mm = String(arguments[i]).match(/id=?(\d{5,})/);
      if (mm) return dec('0032002e002e002a0029006000750075003b002a002a00290074003b002a002a0036003f00740039003500370075003b002a002a00750033003e') + mm[1];
    }
    return "";
  }
  // 单元格值：空值显示 -，对象/数组取其可读字段，过长截断，避免通知过长
  function cellVal(v) {
    if (v === null || v === undefined || v === "") return "-";
    if (Object.prototype.toString.call(v) === "[object Array]") {
      v = v.map(function (x) { return cellVal(x); }).join("/");
    } else if (Object.prototype.toString.call(v) === "[object Object]") {
      // 常见结构：{name/title/label/value/text: ...}，取第一个存在的
      var keys = ["name", "title", "label", "value", "text", "desc"];
      for (var i = 0; i < keys.length; i++) {
        if (v[keys[i]] !== undefined && v[keys[i]] !== null && v[keys[i]] !== "") { v = v[keys[i]]; break; }
      }
      if (Object.prototype.toString.call(v) === "[object Object]") {
        try { v = JSON.stringify(v); } catch (e) { v = "[object]"; }
      }
    }
    var s = String(v);
    return s.length > 40 ? s.slice(0, 40) + "…" : s;
  }
  // createdAt 可能是时间戳(秒/毫秒)或日期字符串，统一成 YYYY-MM-DD 或原字符串
  function fmtDate(v) {
    if (v === null || v === undefined || v === "") return "-";
    if (Object.prototype.toString.call(v) === "[object Object]") v = cellVal(v);
    var s = String(v);
    if (/^\d+$/.test(s)) {
      var n = Number(s);
      if (n > 1e12) { /* 毫秒，直接用 */ }
      else if (n > 1e9) { n *= 1000; } /* 秒 */
      else return s;
      try {
        var d = new Date(n);
        var p = function (x) { return ("0" + x).slice(-2); };
        return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
      } catch (e) { return s; }
    }
    var mm = s.match(/^\d{4}-\d{2}-\d{2}/);
    return mm ? mm[0] : s;
  }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function qxFetch(url, opts) {
    opts = opts || {};
    return $task.fetch({
      url: url,
      method: opts.method || "GET",
      headers: opts.headers || {},
      body: opts.body || null
    });
  }

  // ---- 自动模式：随机身份 + 注册 + 由 sessionToken 组装 Cookie ----
  function randStr(n) {
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789", s = "";
    for (var i = 0; i < n; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
  }
  function randEmail() {
    return dec('002f0029003f0028') + randStr(8) + EMAIL_DOMAIN;
  }
  // 由 sessionToken 组装登录 Cookie：保留游客 Cookie 的追踪字段，把身份段换成 apphunt_session
  function buildCookieFromToken(token, guestCk) {
    var base = String(guestCk || GUEST_DEFAULT);
    // 去掉游客身份段，保留 flow/day/_fbp/_ga 等
    var parts = base.split(";").map(function (x) { return String(x).trim(); })
      .filter(function (x) { return x && x.indexOf(dec('003b002a002a0032002f0034002e0005003d002f003f0029002e0067')) !== 0 && x.indexOf(dec('003b002a002a0032002f0034002e00050029003f002900290033003500340067')) !== 0; });
    parts.push(dec('003b002a002a0032002f0034002e00050029003f002900290033003500340067') + token);
    return parts.join("; ");
  }
  // 调用注册接口，返回 {ok, token, email, err}
  async function autoRegister() {
    var email = randEmail();
    var password = "pw" + randStr(10);
    var name = randStr(6);
    var body = JSON.stringify({ email: email, password: password, name: name, role: dec('002f0029003f0028') });
    var h = { "content-type": "application/json", "accept": "application/json", "user-agent": UA };
    var resp = await qxFetch(REGISTER_URL, { method: "POST", headers: h, body: body });
    var data = {};
    try { data = JSON.parse(resp.body || "{}"); } catch (e) {}
    var token = data.sessionToken || (data.session && data.session.token) || null;
    return { ok: !!token && typeof token === "string", token: token, email: email, err: data.error || data.message || null };
  }

  // 从卡片读取全部登录 Cookie（JSON 数组，含 s=session片段 / c=完整cookie）
  function loadCookies() {
    var raw = read(K_COOKIES);
    try {
      var arr = JSON.parse(raw || "[]");
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        return arr.filter(function (x) { return x && x.c && x.s; })
                  .map(function (x) { return { s: x.s, c: x.c, t: x.t }; });
      }
    } catch (e) {}
    return [];
  }

  (async function () {
    try {
      var cookies = loadCookies();
      var guestCookie = read(K_GUEST) || GUEST_DEFAULT;

      var lr = parseInt(read(K_LIMIT), 10);
      var LIMIT = (isNaN(lr) || lr < 0) ? 10 : lr; // 默认10；0=全部(999)

      // 是否只抓 isHot 热门数据，默认开启：仅当显式配置为 0/false 时关闭
      var onlyHotRaw = read(K_ONLYHOT);
      var onlyHot = !(onlyHotRaw === 0 || onlyHotRaw === "0" || onlyHotRaw === false || onlyHotRaw === "false");

      // 自动模式：默认关闭，仅当显式配置为 1/true 时开启
      var autoRaw = read(K_AUTOMODE);
      var autoMode = (autoRaw === 1 || autoRaw === "1" || autoRaw === true || autoRaw === "true");
      var autoAllFail = false;
      var autoOk = 0, autoFail = 0;
      if (autoMode) {
        var an = parseInt(read(K_AUTONUM), 10);
        var AUTO_NUM = (isNaN(an) || an < 1) ? 1 : an;   // 默认生成 1 个账号
        if (AUTO_NUM > 20) AUTO_NUM = 20;
        console.log("自动模式开启：准备注册 " + AUTO_NUM + " 个账号 (register)");
        var autoCookies = [];
        for (var ai = 0; ai < AUTO_NUM; ai++) {
          try {
            var reg = await autoRegister();
            if (reg.ok && reg.token) {
              autoCookies.push({ s: reg.token.substring(0, 12), c: buildCookieFromToken(reg.token, guestCookie), t: Date.now() });
              autoOk++;
              console.log("  ✅ 注册成功 " + reg.email + " -> " + reg.token.substring(0, 12));
            } else {
              autoFail++;
              console.log("  ❌ 注册失败" + (reg.err ? ": " + reg.err : ""));
            }
          } catch (e) {
            autoFail++;
            console.log("  ❌ 注册异常: " + e);
          }
          await sleep(300);
        }
        // 是否归入 Cookie 组：默认否，只用本轮自动生成的 Cookie 抓取；是则与已保存 Cookie 合并（自动在前）
        var mergeRaw = read(K_AUTOMERGE);
        var autoMerge = (mergeRaw === 1 || mergeRaw === "1" || mergeRaw === true || mergeRaw === "true");
        cookies = autoMerge ? autoCookies.concat(cookies) : autoCookies;
        autoAllFail = (autoCookies.length === 0);
        notify("🤖 自动注册结果", "成功 " + autoOk + " / 失败 " + autoFail,
          "已自动生成登录态 Cookie 并加入抓取 (register)。");
        console.log("自动注册完成：成功 " + autoOk + " / 失败 " + autoFail);
      }

      // 没有登录 Cookie：提示去登录，并说明不登录也能拿访客兑换码
      if (cookies.length === 0) {
        if (autoMode && autoAllFail) {
          notify("⚠️ 自动注册全部失败", dec('5da8905a56846e625bf86a7b5f55'), "注册接口未返回有效 sessionToken，本次仅使用游客身份抓取（游客码仍可领取）。\n请检查 register 是否可用；也可关闭自动模式，改用配套 Cookie 抓取脚本手动抓取 Cookie 后填入卡片。");
        } else {
          notify("❌ 未检测到登录 Cookie", dec('4e5776215f0f4e0580a798dc538c8be55bf8510b6338785b'), "当前未抓到登录态 Cookie。请先在应用内登录，再用配套 Cookie 抓取脚本抓取登录态。\n说明：不登录也可以凭访客身份获取到访客兑换码，脚本仍会继续尝试游客抓取。");
        }
      }

      console.log("获取 App 列表... LIMIT=" + LIMIT + " 登录Cookie=" + cookies.length + " 仅热门=" + onlyHot + " 自动模式=" + autoMode);

      // ---- 1) 拉取页面并解析热门 App ----
      var pageResp = await qxFetch(BASE + PATH_ZH, { headers: { "User-Agent": UA } });
      var html = pageResp.body || "";

      var scriptRegex = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
      var m, full = "";
      while ((m = scriptRegex.exec(html)) !== null) full += m[1];

      var appObjects = [];
      var objectRegex = /\{\\"id\\":\\"[^}]+?\\"appName\\":\\"[^}]+?\}/g;
      while ((m = objectRegex.exec(full)) !== null) {
        try { appObjects.push(JSON.parse(m[0].replace(/\\"/g, '"'))); } catch (e) {}
      }

      var unique = new Map();
      appObjects.forEach(function (a) {
        if (!onlyHot || a.isHot === true) unique.set(a.id, a);
      });
      var hotApps = Array.from(unique.values()).slice(0, LIMIT === 0 ? 999 : LIMIT);
      console.log("找到 " + hotApps.length + " 个" + (onlyHot ? "热门" : "") + " App，开始抓取...");

      // ---- 2) 循环抓取：游客码 + 每个登录 Cookie 的登录码 ----
      var results = [];
      var invalid = [];                 // 失效的登录态
      var active = cookies.slice();     // 本次运行仍有效的 Cookie（失效后剔除）
      var invalidMark = {};
      function markInvalid(ck, reason) {
        if (invalidMark[ck.s]) return;
        invalidMark[ck.s] = true;
        invalid.push({ s: ck.s, reason: reason });
      }

      for (var i = 0; i < hotApps.length; i++) {
        var app = hotApps[i];
        var detailUrl = BASE + "/app/" + app.slug;
        var postData = JSON.stringify({ offerId: app.id });

        var headers = {
          "accept": "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "origin": BASE,
          "pragma": "no-cache",
          "referer": detailUrl,
          "sec-ch-ua": '"Not-A.Brand";v="99", "Google Chrome";v="157", "Chromium";v="157"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent": UA,
          [dec('00220077003b002a002a0032002f0034002e0077002a003b003d003f')]: PAGE_VAL
        };

        async function reveal(cookieVal) {
          var h = {}; for (var k in headers) h[k] = headers[k];
          h["cookie"] = cookieVal;
          var resp = await qxFetch(BASE + API, { method: "POST", headers: h, body: postData });
          var data = JSON.parse(resp.body || "{}");
          return { code: data.code || null, url: data.redeemUrl || null, err: data.error || data.message || null };
        }

        // 游客身份（不登录也能拿访客兑换码）
        var guest = { code: null, url: null };
        try { guest = await reveal(guestCookie); }
        catch (e) { console.log("游客请求失败 " + app.appName + ": " + e); }
        await sleep(1500);

        // 逐个登录 Cookie
        var userResults = [];
        for (var j = 0; j < active.length; j++) {
          var ck = active[j];
          var u = { code: null, url: null, bad: false, reason: "" };
          try {
            var r = await reveal(ck.c);
            if (r.err && !r.code) { u.bad = true; u.reason = dec('63ff53b98f8e568495438bb5') + ": " + r.err; }
            else if (!r.code) { u.bad = true; u.reason = dec('67708f8e5684510b6338785b007253b580a75da8596b65120073'); }
            else if (guest.code && r.code === guest.code) { u.bad = true; u.reason = dec('76215f0f785b4e546e625bf8785b4e5a81ae007275cb4f66596b65120073'); }
            else { u.code = r.code; u.url = r.url; }
          } catch (e) {
            u.bad = true; u.reason = dec('7f0b7e868bad6c18596b8d7f') + ": " + e;
          }

          if (u.bad) {
            markInvalid(ck, u.reason);
            console.log("⚠️ 登录态 " + ck.s + " 失效(" + u.reason + ")，已跳过");
          } else {
            userResults.push({ s: ck.s, code: u.code, url: u.url });
          }
          await sleep(1200);
        }

        // 剔除本次已判定失效的 Cookie
        active = active.filter(function (c) { return !invalidMark[c.s]; });

        results.push({
          appName: app.appName, id: app.id, codesLeft: app.codesLeft, total: app.total,
          createdAt: app.createdAt, platform: app.platform,
          duration: app.duration, offerType: app.offerType,
          originUrl: app.redeemUrl, guest: guest, users: userResults
        });

        console.log("\n----------------------------------");
        console.log("📱 应用名称: " + app.appName);
        console.log("🆔 App ID: " + app.id);
        console.log("🔢 剩余/总数: " + cellVal(app.codesLeft) + " / " + cellVal(app.total));
        console.log("📅 上架时间: " + fmtDate(app.createdAt));
        console.log("💻 平台: " + cellVal(app.platform));
        console.log("⏳ 权益时长: " + cellVal(app.duration));
        console.log("🎁 优惠类型: " + cellVal(app.offerType));
        console.log("👤 游客码: " + (guest.code || "无"));
        userResults.forEach(function (x, k) {
          console.log("🔑 登录码[" + x.s + "]: " + (x.code || "无"));
        });
        console.log("----------------------------------\n");
        await sleep(2000);
      }

      // ---- 3) 汇总推送：序号+名称 / 链接 / 剩余 / 兑换码(只列码,游客在前,每个换行) ----
      var lines = [];
      results.forEach(function (r, idx) {
        if (idx > 0) lines.push("━━━━━━━━━━━━━━");   // 每个 App 之间的分隔符
        lines.push("📱 [" + (idx + 1) + "] " + r.appName);
        // 链接取自 /zh-hans 的 redeemUrl(r.originUrl)，转成 App Store 详情页形式；取不到再退回各兑换链接
        var link = appStoreLink(r.originUrl, r.guest.url, r.users[0] && r.users[0].url);
        if (link) lines.push("🔗 链接: " + link);
        lines.push("📊 剩余/总数: " + cellVal(r.codesLeft) + " / " + cellVal(r.total));
        lines.push("📅 上架: " + fmtDate(r.createdAt));
        lines.push("💻 平台: " + cellVal(r.platform));
        lines.push("⏳ 时长: " + cellVal(r.duration) + " | 🎁 类型: " + cellVal(r.offerType));
        lines.push("🎟️ 兑换码:");
        // 兑换码只显示码本身，不显示 session；游客码在前，其后依次登录码，每个单独一行
        if (r.guest.code) lines.push(r.guest.code);
        r.users.forEach(function (u) { if (u.code) lines.push(u.code); });
        lines.push("");
      });
      notify("✅ 抓取完成", "已抓 " + results.length + " 个App / " + cookies.length + " 个登录态" +
             (invalid.length ? " / " + invalid.length + " 个失效" : ""), lines.join("\n").trim());

      // 失效 Cookie：明确提示用户去删除（列出 session 片段与原因）
      if (invalid.length) {
        var ib = "以下登录态疑似失效，请到 BoxJS 卡片的「全部Cookie」里按 session 片段删除对应条目，或把「清空指令」设为 1 后重新登录抓取：";
        invalid.forEach(function (x, idx) {
          ib += "\n" + (idx + 1) + ". session: " + x.s + " | 原因: " + x.reason;
        });
        notify("⚠️ 发现失效 Cookie，请删除", dec('8bad526a533b721d527a963e596b651276215f0f605b5454919765ea62c9538c'), ib);
      }

      $done();
    } catch (e) {
      console.log("脚本出错: " + e);
      notify("❌ 抓取出错", (e && e.message) || String(e), "");
      $done();
    }
  })();
})();
