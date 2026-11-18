/**************************
 * @Author: XiaoMao
 * @Name  : ah_check_cookie.js
 * @Desc  : 登录状态监听 / 多登录态 Cookie 抓取
 * @Enc   : 关键字符串已做异或混淆(运行时 dec() 解码)，属轻量混淆非强加密
 *
 * 使用方法：
 * 1、QX > 重写 > 规则资源 > 引用本脚本并开启资源解析器；[mitm] 打开对应域名
 * 2、在应用登录，脚本捕获登录态 session Cookie
 *    真实登录 Cookie 一般在对应站点的请求头里
 * 3、规则匹配目标域名全部路径（实测收窄到 /zh-hans 会匹配不稳定、不触发，故用通配）
 * 4、★ 脚本内三重去重保证不重复骚扰：完全相同 Cookie 静默放行、相同 session 静默刷新不弹通知、同源提示去重
 * 5、脚本同时会跳过 .jpg/.png/.css/.js 等静态资源，双保险
 * 6、多登录态：换账号重新登录即可再抓一条，按 session 自动去重、可设上限
 * 7、捕获结果写入 BoxJS 订阅 XiaoMao.json 的「AH」卡片：
 *      AppHuntCookies  = 全部 Cookie（JSON 数组，可复制）
 *      AppHuntLatest   = 最近一条完整 Cookie（方便直接复制）
 *      AppHuntCount    = 已捕获数量
 *   在卡片里可开关捕获 / 通知、设置上限、下发清空指令
 *
 [mitm]
hostname = apphunt.app

 [rewrite_local]
^https?:\/\/[^/]*apphunt\.app url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/ah_check_cookie.js

 ********************************/

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
  var K_COOKIE = dec('00190035003500310033003f'), K_cookie = dec('00390035003500310033003f');
  var RE_SESS = new RegExp(dec('003b002a002a0032002f0034002e00050029003f0029002900330035003400670072000100040061000700710073'));
  var RE_STATIC = new RegExp(dec('000600740072006500600030002a003d00260030002a003f003d0026002a0034003d0026003d0033003c0026002d003f0038002a00260029002c003d0026003300390035002600380037002a002600390029002900260030002900260037003000290026002d0035003c003c006800650026002e002e003c0026003f0035002e00260037003b002a0073007200650060000600650026007e007300260075003b002a0033007500330039003500340029007500260075003b002a003300750033003900350034002900060065'));
  var K_CLEAR = dec('001b002a002a0012002f0034002e00190036003f003b0028'), K_COOKIES = dec('001b002a002a0012002f0034002e00190035003500310033003f0029'), K_LATEST = dec('001b002a002a0012002f0034002e0016003b002e003f0029002e'),
      K_COUNT = dec('001b002a002a0012002f0034002e00190035002f0034002e'), K_CAPTURE = dec('001b002a002a0012002f0034002e0019003b002a002e002f0028003f'), K_NOTIFY = dec('001b002a002a0012002f0034002e00140035002e0033003c0023'),
      K_MAX = dec('001b002a002a0012002f0034002e0017003b0022'), K_TIP = dec('001b002a002a0012002f0034002e0016003b0029002e000e0033002a');
  var MIN_SESS = parseInt(dec('006e006a'), 10), DEFMAX = parseInt(dec('0068006a'), 10);
  var ONE = "1", ZERO = "0";

  function read(k) {
    if (typeof $prefs !== "undefined" && $prefs) return $prefs.valueForKey(k);
    if (typeof $persistentStore !== "undefined") return $persistentStore.read(k);
    return null;
  }
  function write(v, k) {
    if (typeof $prefs !== "undefined" && $prefs) return $prefs.setValueForKey(v, k);
    if (typeof $persistentStore !== "undefined") return $persistentStore.write(v, k);
  }
  function notify(t, s, b) {
    if (typeof $notify === "function") $notify(t, s, b);
  }
  // 同源提示去重：状态未变化时不再弹，避免通知轰炸
  function tip(type, t, s, b) {
    if (String(read(K_TIP)) !== type) { notify(t, s, b); write(type, K_TIP); }
  }
  function getList() {
    try {
      var a = JSON.parse(read(K_COOKIES) || "[]");
      return Object.prototype.toString.call(a) === "[object Array]" ? a : [];
    } catch (e) { return []; }
  }

  // ---- 清空指令：BoxJS 里把 AppHuntClear 设为 1，下次抓包即清空并自动复位 ----
  if (String(read(K_CLEAR)) === ONE) {
    write("[]", K_COOKIES);
    write("", K_LATEST);
    write(ZERO, K_COUNT);
    write(ZERO, K_CLEAR);
    write("", K_TIP);
    notify("🧹 Cookie 已清空", dec('00190035003500310033003f'), dec('5da86e5f7a20513290b276215f0f605b007a00190035003500310033003fff5653b5919765ea62c9538c3058'));
    console.log("[ah] 已清空全部 Cookie");
    $done({});
    return;
  }

  // ---- 捕获总开关 ----
  if (String(read(K_CAPTURE)) === ZERO) { $done({}); return; }

  var url = ($request && $request.url) || "";

  // ---- ★ 静态资源直接放行：图片/css/js/字体/图标 等请求带的 Cookie 常不完整，抓它没意义还会误报 ----
  if (RE_STATIC.test(url)) {
    console.log("[ah] 跳过静态资源: " + url);
    $done({});
    return;
  }

  var headers = ($request && $request.headers) || {};
  var cookie = headers[K_COOKIE] || headers[K_cookie] || "";
  // 通知默认开：仅当显式设为 0 才关闭
  var nv = read(K_NOTIFY);
  var notifyOn = (nv === null || nv === undefined || nv === "") ? true : String(nv) !== ZERO;

  // 提取 apphunt_session 的值（JWT），有效性以 session 值本身为准，不再看 Cookie 总长度
  var m = cookie.match(RE_SESS);
  var sess = m ? m[1] : "";

  // ---- ★ 完全相同的 Cookie 直接静默放行：同一个登录态在一次页面加载里会伴随几十个请求，内容一模一样就没必要重复处理 ----
  var prevLatest = read(K_LATEST);
  if (prevLatest && String(prevLatest) === cookie) {
    $done({});
    return;
  }

  console.log("[ah] " + url + " | Cookie长度=" + cookie.length + " Session长度=" + sess.length);

  // ---- 未检测到登录态 session ----
  if (!sess) {
    if (notifyOn) tip("nologin", "❌ 未检测到登录态", dec('677076215f0f'), "未发现登录态 session，请先登录并刷新页面后重试。");
    $done({});
    return;
  }

  // ---- session 值过短（真正可能只抓到一半）：低阈值，不再用 500 误伤正常 Cookie ----
  if (sess.length < MIN_SESS) {
    if (notifyOn) tip("short", "⚠️ Session 值偏短", dec('53b580a753b062c9526a4e5a5310'), "抓取到的 session 值仅 {N} 字符，可能不完整，未保存。请重新登录后再试。".replace("{N}", String(sess.length)));
    $done({});
    return;
  }

  // ---- 按 apphunt_session 去重并更新 ----
  var arr = getList(), idx = -1;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] && arr[i].s === sess) { idx = i; break; }
  }
  var item = { t: Date.now(), s: sess, c: cookie };
  var dup = idx >= 0;
  if (dup) arr[idx] = item; else arr.unshift(item);

  var mx = parseInt(read(K_MAX), 10);
  if (isNaN(mx) || mx < 1) mx = DEFMAX;
  if (arr.length > mx) arr = arr.slice(0, mx);

  write(JSON.stringify(arr), K_COOKIES);
  write(cookie, K_LATEST);
  write(String(arr.length), K_COUNT);
  write("", K_TIP);

  // ---- 通知：只有真正新增登录态才弹；相同 session 只静默刷新存储，不弹通知 ----
  if (notifyOn && !dup) {
    notify("✅ 登录态已捕获", "已存入 BoxJS",
      "新登录态 Cookie 已保存（Session: {S}...）。\n可前往 BoxJS 卡片复制。".replace("{S}", sess.substring(0, 12)) + "\n" + dec('5f0952175da84f875b02007a') + arr.length);
  } else if (dup) {
    console.log("[ah] 相同 session 已静默刷新: " + sess.substring(0, 12));
  }

  console.log("========== 登录态 Cookie ==========");
  console.log(cookie);
  console.log(dec('0067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067'));
  $done({});
})();
