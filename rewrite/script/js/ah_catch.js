/*
 * AH 热门兑换码抓取 (QX 运行脚本 / 简单加密版)
 * 登录 Cookie 来自 BoxJS「AH」卡片 AHCookies（由 ah_check_cookie.js 抓取）
 * 支持多登录态循环、失效检测、访客码对比，LIMIT/访客Cookie 可在卡片配置
 *
 * 自动任务 (QX > 任务 > [task_local])：复制下面整行即可
 * 0 0 1 1 * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/ah_catch.js, tag=AH 兑换码抓取, img-url=https://ah.app/api/icons/6807537708?v=7f85689094b3, enabled=false
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
      UA = dec('001700350020003300360036003b0075006f0074006a007a0072000d00330034003e0035002d0029007a0014000e007a006b006a0074006a0061007a000d00330034006c006e0061007a0022006c006e0073007a001b002a002a0036003f000d003f003800110033002e0075006f0069006d00740069006c007a007200110012000e001700160076007a003600330031003f007a001d003f0039003100350073007a00190032002800350037003f0075006b006f006d0074006a0074006a0074006a007a0009003b003c003b002800330075006f0069006d00740069006c'),
      GUEST_DEFAULT = dec('003b002a002a0032002f0034002e0005003e003b00230067003e006800740035003c003c0061007a003b002a002a0032002f0034002e0005003c00360035002d0067003300340029002e003b003600360061007a003b002a002a0032002f0034002e0005003d003900670068007f0069001b0070007f006d001900390037002d0030002b0034002e003b0033006a006a006a006b0039006300370069002e003b00310028002c0032003d006a0074006c00620069006e0063006e006b00690062006b007f006d001900390037002d003000350062002b0029002d006a006a006a006b00390063003e0037003500300062003b003100380063002b0074006c00620069006e0062006d0062006200680068007f006d001900390037002d003f0022002b0062002e003e006a006a006a006b003900630022002b0063003e00290032006f00280068003d0074006c006200690069006d006a006a00630068006f0061007a003b002a002a0032002f0034002e0005003d002f003f0029002e0067006e003e003b0038006e0063006f006a006c006b0068003e006e003c006a003b006900390069006a006300680063006c006a00630038003e00620039003b006f'),
      K_COOKIES = dec('001b002a002a0012002f0034002e00190035003500310033003f0029'),
      K_LIMIT = dec('001b002a002a0012002f0034002e0016003300370033002e'),
      K_GUEST = dec('001b002a002a0012002f0034002e001d002f003f0029002e00190035003500310033003f'),
      K_ONLYHOT = dec('001b002a002a0012002f0034002e001500340036002300120035002e'),
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

      // 没有登录 Cookie：提示去登录，并说明不登录也能拿访客兑换码
      if (cookies.length === 0) {
        notify(dec('2716007a001b002a002a0012002f0034002e007a6770689a6d11526a76215f0f007a00190035003500310033003f'), dec('4e5776215f0f4e0580a798dc538c8be55bf8510b6338785b'), dec('5f095217677062c9526a76215f0f605b007a00190035003500310033003f30588bad51125772007a001b002a002a0012002f0034002e007a001b002a002a007a76215f0fff5651d77572919751c381406776007a003b002a002a0032002f0034002e000500390032003f00390031000500390035003500310033003f007400300029007a62c9538c76215f0f605b305800508bae6654ff404e5776215f0f4e0553b54ebf51b78be55bf88ef14ea783ed538c526a8be55bf8510b6338785bff56814067764e974f407ebd7eb75c478b8f6e625bf862c9538c3058'));
      }

      console.log("获取 App 列表... LIMIT=" + LIMIT + " 登录Cookie=" + cookies.length + " 仅热门=" + onlyHot);

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
          "x-ah-page": PAGE_VAL
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
          appName: app.appName, id: app.id, codesLeft: app.codesLeft,
          originUrl: app.redeemUrl, guest: guest, users: userResults
        });

        console.log("\n----------------------------------");
        console.log("📱 应用名称: " + app.appName);
        console.log("🆔 App ID: " + app.id);
        console.log("🔢 剩余兑换码: " + app.codesLeft);
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
        lines.push("[" + (idx + 1) + "] " + r.appName);
        // 链接取自 /zh-hans 的 redeemUrl(r.originUrl)，转成 App Store 详情页形式；取不到再退回各兑换链接
        var link = appStoreLink(r.originUrl, r.guest.url, r.users[0] && r.users[0].url);
        if (link) lines.push("链接: " + link);
        lines.push("剩余: " + (r.codesLeft != null ? r.codesLeft : "-"));
        // 兑换码只显示码本身，不显示 session；游客码在前，其后依次登录码，每个单独一行
        if (r.guest.code) lines.push(r.guest.code);
        r.users.forEach(function (u) { if (u.code) lines.push(u.code); });
        lines.push("");
      });
      notify(dec('275f007a001b002a002a0012002f0034002e007a62c9538c5bd6624a'), "已抓 " + results.length + " 个App / " + cookies.length + " 个登录态" +
             (invalid.length ? " / " + invalid.length + " 个失效" : ""), lines.join("\n").trim());

      // 失效 Cookie：明确提示用户去删除（列出 session 片段与原因）
      if (invalid.length) {
        var ib = dec('4ebf4e5176215f0f605b75cb4f66596b6512ff568bad526a007a001800350022001000093056001b002a002a0012002f0034002e3057533b721d76de3056513290b200190035003500310033003f305791966353007a0029003f00290029003300350034007a721d6bef527a963e5ba35ece673b76b4ff56624c62d030566e5f7a20635d4ebe30578be44e60007a006b007a5454919765ea76215f0f62c9538cff40');
        invalid.forEach(function (x, idx) {
          ib += "\n" + (idx + 1) + ". session: " + x.s + " | 原因: " + x.reason;
        });
        notify(dec('26fafe55007a001b002a002a0012002f0034002e007a538b73ea596b6512007a00190035003500310033003fff568bad527a963e'), dec('8bad526a533b721d527a963e596b651276215f0f605b5454919765ea62c9538c'), ib);
      }

      $done();
    } catch (e) {
      console.log("脚本出错: " + e);
      notify(dec('2716007a001b002a002a0012002f0034002e007a62c9538c51a09543'), (e && e.message) || String(e), "");
      $done();
    }
  })();
})();
