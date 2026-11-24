/*
 * 免费兑换码速报 (QX 运行脚本 / 简单加密版)
 * 数据源: Convex 公共查询接口，无需登录、无需 Cookie
 *
 * 自动任务 (QX > 任务 > [task_local])：复制下面整行即可
 * 0 8 * * * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/free_codes.js, tag=免费码速报, enabled=false
 * 说明：enabled=false 表示默认关闭，需到任务里手动开启/点运行；改 cron 可调整运行时间
 */


// ===== 轻量混淆解码：4 位十六进制一组，异或 90 还原 =====
function dec(h) {
  var o = "", i = 0;
  while (i < h.length) { o += String.fromCharCode(parseInt(h.substr(i, 4), 16) ^ 90); i += 4; }
  return o;
}

(function () {
  // ---- BoxJS 配置键（与 XiaoMao.json 的 FreeCode* 对应）----
  // 接口地址内置于脚本（加密），不作为可配置项，避免暴露
  var K_LIMIT = dec('001c0028003f003f00190035003e003f0016003300370033002e'),
      K_SOURCE = dec('001c0028003f003f00190035003e003f00090035002f00280039003f'),
      K_SORT = dec('001c0028003f003f00190035003e003f000900350028002e'),
      K_PLATFORM = dec('001c0028003f003f00190035003e003f000a0036003b002e003c003500280037'),
      K_MINREMAIN = dec('001c0028003f003f00190035003e003f0017003300340008003f0037003b00330034'),
      K_CHUNK = dec('001c0028003f003f00190035003e003f00190032002f00340031'),
      K_NOTIFY = dec('001c0028003f003f00190035003e003f00140035002e0033003c0023'),
      K_HIDELINK = dec('001c0028003f003f00190035003e003f00120033003e003f0016003300340031');

  var DEFAULT_ENDPOINT = dec('0032002e002e002a0029006000750075003f003400390032003b0034002e003f003e00770028003b003800380033002e00770069006a006d0074003900350034002c003f00220074003900360035002f003e0075003b002a00330075002b002f003f00280023');
  var PAGE_SIZE = 200;          // 全量分页大小，单响应更小更稳
  var MAX_PAGES = 10;           // 分页上限保护
  var BOARD_LIMIT = 10;         // 三个榜单各取多少用于打标签
  var CT = dec('001900350034002e003f0034002e0077000e0023002a003f');      // 需要引号的 key 用变量，便于统一加密

  function read(k, def) {
    var v = null;
    if (typeof $prefs !== dec('002f0034003e003f003c00330034003f003e') && $prefs) v = $prefs.valueForKey(k);
    else if (typeof $persistentStore !== dec('002f0034003e003f003c00330034003f003e')) v = $persistentStore.read(k);
    if (v === null || v === undefined || v === "") return def;
    return String(v);
  }
  function readInt(k, def) {
    var v = parseInt(read(k, ""), 10);
    return isNaN(v) ? def : v;
  }
  function log(s) {
    if (typeof console !== dec('002f0034003e003f003c00330034003f003e') && console.log) console.log(String(s));
  }
  function notify(t, s, b) {
    if (typeof $notify === dec('003c002f00340039002e003300350034')) $notify(t, s, b);
  }
  function qxFetch(url, opts) {
    return $task.fetch({
      url: url,
      method: opts.method || dec('001d001f000e'),
      headers: opts.headers || {},
      body: opts.body || null
    });
  }
  // 调用一个 convex query，返回解码后的 JSON 对象
  async function query(path, args, endpoint) {
    var h = {};
    h[CT] = dec('003b002a002a003600330039003b002e00330035003400750030002900350034');
    var r = await qxFetch(endpoint, {
      method: dec('000a00150009000e'),
      headers: h,
      body: JSON.stringify({ path: path, args: args })
    });
    var txt = (r && r.body) || (typeof r === dec('0029002e002800330034003d') ? r : "");
    return JSON.parse(txt);
  }
  // 分页拉全量 apps
  async function fetchAll(endpoint) {
    var out = [], cursor = null, page = 0;
    while (page < MAX_PAGES) {
      var j = await query(dec('003b002a002a00290060003d003f002e001b002a002a0029'), { paginationOpts: { numItems: PAGE_SIZE, cursor: cursor } }, endpoint);
      var v = j.value || {};
      var list = v.page || [];
      out = out.concat(list);
      if (v.isDone || !v.continueCursor) break;
      cursor = v.continueCursor;
      page++;
    }
    return out;
  }
  // 拉一个榜单的 id 有序列表（失败返回空，不影响主流程）
  async function fetchBoard(path, limit, endpoint) {
    try {
      var j = await query(dec('003b002a002a00290060') + path, { limit: limit }, endpoint);
      var list = Array.isArray(j.value) ? j.value : [];
      return list.map(function (x) { return x._id || x.id; }).filter(function (x) { return !!x; });
    } catch (e) {
      log(dec('69c6530f007a') + path + dec('007a83ed538c596b8d7f0060007a') + e);
      return [];
    }
  }
  // 从 singleCodeValue 里拆出「纯码」和「兑换链接」
  function parseCode(v) {
    var s = String(v == null ? "" : v).trim();
    var code = "", link = "", m;
    m = s.match(/[?&]code=([A-Za-z0-9_-]+)/i) || s.match(/Use Code:\s*([A-Za-z0-9_-]+)/i);
    if (m) code = m[1];
    if (!code) {
      m = s.match(/^([A-Za-z0-9][A-Za-z0-9_-]{3,})/);
      if (m) code = m[1];
    }
    m = s.match(/https?:\/\/[^\s]+/i);
    if (m) link = m[0];
    return { code: code || s, link: link };
  }
  function fmtDate(v) {
    if (!v) return "-";
    var n = Number(v);
    if (isNaN(n)) return String(v);
    if (n > 1e12) { /* 毫秒 */ } else if (n > 1e9) { n *= 1000; } else { return String(v); }
    try {
      var d = new Date(n), p = function (x) { return ("0" + x).slice(-2); };
      return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
    } catch (e) { return String(v); }
  }
  function val(v, def) {
    return (v === null || v === undefined || v === "") ? (def || "-") : v;
  }
  function joinPlatforms(p) {
    if (Array.isArray(p)) return p.join("/");
    return p ? String(p) : "-";
  }
  // App Store 详情页链接：优先用接口给的 appStoreUrl，否则按 id 拼
  function detailLink(x) {
    if (x.appStoreUrl) return String(x.appStoreUrl);
    var m = String(x.id || "").match(/(\d{5,})/);
    return m ? dec('0032002e002e002a0029006000750075003b002a002a00290074003b002a002a0036003f00740039003500370075003b002a002a00750033003e') + m[1] : "";
  }

  async function main() {
    var endpoint = DEFAULT_ENDPOINT;
    var limit = readInt(K_LIMIT, 10);
    var source = readInt(K_SOURCE, 0);
    var sortMode = readInt(K_SORT, 2);
    var platform = readInt(K_PLATFORM, 0);
    var minRemain = readInt(K_MINREMAIN, 1);
    var chunk = readInt(K_CHUNK, 10);
    var notifyOn = readInt(K_NOTIFY, 1) === 1;
    var hideLink = readInt(K_HIDELINK, 0) === 1;

    log(dec('6b3957728bad6c1863ff53b9007400740074'));
    var all = await fetchAll(endpoint);
    log(dec('513291956293538c0060007a') + all.length + dec('007a673b'));

    // 三个榜单 id（用于打标签 / 来源筛选）；每个接口失败都返回空，不影响主流程
    var boardIds = {
      featured: await fetchBoard(dec('003d003f002e001c003f003b002e002f0028003f003e001b002a002a0029'), BOARD_LIMIT, endpoint),
      hot: await fetchBoard(dec('003d003f002e00120035002e001b002a002a0029'), BOARD_LIMIT, endpoint),
      trending: await fetchBoard(dec('003d003f002e000e0028003f0034003e00330034003d001b002a002a0029'), BOARD_LIMIT, endpoint)
    };

    function inBoard(id, arr) { return arr.indexOf(id) >= 0; }

    // 清洗 + 过滤
    var seen = {};
    var items = [];
    all.forEach(function (x) {
      var id = x._id || x.id;
      if (!id || seen[id]) return;
      seen[id] = 1;
      if (x.status && x.status !== dec('003b0039002e0033002c003f')) return;
      var remain = Number(x.codesRemaining);
      if (isNaN(remain) || remain < minRemain) return;
      var pc = parseCode(x.singleCodeValue);
      if (!pc.code) return;
      var plats = Array.isArray(x.platforms) ? x.platforms : [];
      if (platform === 1 && plats.indexOf(dec('003300350029')) < 0) return;
      if (platform === 2 && plats.indexOf(dec('003b0034003e002800350033003e')) < 0) return;
      if (platform === 3 && plats.length < 2) return;
      var feat = inBoard(id, boardIds.featured) || !!x.isFeatured;
      var hot = inBoard(id, boardIds.hot) || !!x.isHot;
      var trend = inBoard(id, boardIds.trending);
      if (source === 1 && !feat) return;
      if (source === 2 && !hot) return;
      if (source === 3 && !trend) return;
      if (source === 4 && !(feat || hot || trend)) return;
      items.push({
        id: id,
        name: x.name || "-",
        remain: remain,
        total: Number(x.codesTotal) || 0,
        code: pc.code,
        redeem: pc.link,
        detail: detailLink(x),
        platforms: joinPlatforms(plats),
        codeType: val(x.codeType, "-"),
        dealType: val(x.dealType, "-"),
        rating: val(x.rating, "-"),
        created: fmtDate(x.createdAt),
        feat: feat,
        hot: hot,
        trend: trend
      });
    });

    // 排序
    items.sort(function (a, b) {
      if (sortMode === 1) {
        return String(b.created).localeCompare(String(a.created)) || b.remain - a.remain;
      }
      if (sortMode === 2) {
        var wa = (a.hot ? 4 : 0) + (a.feat ? 2 : 0) + (a.trend ? 1 : 0);
        var wb = (b.hot ? 4 : 0) + (b.feat ? 2 : 0) + (b.trend ? 1 : 0);
        if (wb !== wa) return wb - wa;
        return b.remain - a.remain;
      }
      if (sortMode === 3) {
        var ra = Number(a.rating) || 0, rb = Number(b.rating) || 0;
        if (rb !== ra) return rb - ra;
        return b.remain - a.remain;
      }
      return b.remain - a.remain;   // 默认：剩余码多优先
    });

    var total = items.length;
    if (limit > 0 && items.length > limit) items = items.slice(0, limit);
    var hotCount = items.filter(function (x) { return x.hot; }).length;
    var featCount = items.filter(function (x) { return x.feat; }).length;

    var SEP = dec('255b255b255b255b255b255b255b255b255b255b255b255b255b255b255b255b255b255b');
    var CFG_URL = dec('0032002e002e002a00290060007500750028003b002d0074003d0033002e0032002f0038002f0029003f0028003900350034002e003f0034002e0074003900350037007500220033003b00350037003b00350010000e0075000b00220009003900280033002a002e00750037003b0033003400750028003f002d00280033002e003f007500380035002200100009007500020033003b00350017003b003500740030002900350034');

    function tags(x) {
      var t = "";
      if (x.hot) t += dec('007ad867dd7f70b795b2');
      if (x.feat) t += dec('007a2b0a7ce49053');
      if (x.trend) t += dec('007ad867dc928dd152e5');
      return t;
    }
    function block(x, idx) {
      var lines = [];
      lines.push("【" + (idx + 1) + dec('304bd867dcab007a') + x.name + tags(x));
      lines.push(dec('d866dfc5fe55007a510b6338785bff40') + x.code);
      lines.push(dec('d867dc90007a52334f03007a') + x.remain + "/" + x.total + dec('007a00ed007ad866df4a007a') + x.platforms + dec('007a00ed007ad866dfadfe55007a') + x.codeType);
      if (x.created && x.created !== "-") lines.push(dec('d867dc9f007a4e5067ecff40') + x.created);
      if (!hideLink && x.redeem) lines.push(dec('d867dd5b007a510b6338ff40') + x.redeem);
      if (x.detail) lines.push(dec('d867dd4d007a8bbc609fff40') + x.detail);
      return lines.join("\n");
    }

    var summary = dec('53b59053007a') + total + dec('007a6b64007a0075007a67768f34007a') + items.length + dec('007a673b')
      + dec('007a0075007a70b795b2007a') + hotCount + dec('007a0075007a7ce49053007a') + featCount;
    log(dec('6c1d60610060007a') + summary);
    items.forEach(function (x, i) { log("\n" + block(x, i)); });

    if (!notifyOn || items.length === 0) {
      if (notifyOn && items.length === 0) notify(dec('d867dcbc007a51178d63785b904562ff'), dec('67768f3465ba7b7c5452673b4eac76de652a6334'), summary);
      $done();
      return;
    }

    notify(dec('d867dcbc007a51178d63785b904562ff'), summary,
      dec('66547e9c899b54547eb7904077bfff52635370b795b24f42511263c85ed5ff53')
      + "\n⚙️ 更多配置可在 BoxJS 的 XiaoMao.json 订阅中修改"
      + "\n📄 " + CFG_URL);

    var size = chunk > 0 ? chunk : 10;
    var parts = Math.ceil(items.length / size);
    for (var p = 0; p < parts; p++) {
      var seg = items.slice(p * size, (p + 1) * size);
      var body = SEP + "\n" + seg.map(function (x, i) { return block(x, p * size + i); }).join("\n" + SEP + "\n") + "\n" + SEP;
      notify(dec('d867dc91007a66547e9c007a') + (p + 1) + "/" + parts, dec('7b76007a') + (p * size + 1) + "-" + (p * size + seg.length) + dec('007a673b'), body);
    }
    $done();
  }

  main().catch(function (e) {
    log(dec('8140677651a095430060007a') + e);
    notify(dec('2716007a51178d63785b904562ff51a09543'), (e && e.message) || String(e), "");
    $done();
  });
})();
