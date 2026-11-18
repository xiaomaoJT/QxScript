/**************************
 * @Author: XiaoMao
 * @Name  : ah_check_cookie.js
 * @Desc  : AH 登录状态监听 / 多登录态 Cookie 抓取
 * @Enc   : 关键字符串已做异或混淆(运行时 dec() 解码)，属轻量混淆非强加密
 *
 * 使用方法：
 * 1、QX > 重写 > 规则资源 > 引用本脚本并开启资源解析器；[mitm] 打开对应域名
 * 2、在 AH 登录，脚本捕获 ah_session 登录态 Cookie
 * 3、多登录态：换账号重新登录即可再抓一条，按 session 自动去重、可设上限
 * 4、捕获结果写入 BoxJS 订阅 XiaoMao.json 的「AH」卡片：
 *      AHCookies  = 全部 Cookie（JSON 数组，可复制）
 *      AHLatest   = 最近一条完整 Cookie（方便直接复制）
 *      AHCount    = 已捕获数量
 *   在卡片里可开关捕获 / 通知、设置上限、下发清空指令
 *
 [mitm]
hostname = ah.app

 [rewrite_local]
^https?:\/\/[^/]*ah\.app\/ url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/ah_check_cookie.js

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
  var K_COOKIE = dec('00190035003500310033003f'), K_cookie = dec('00390035003500310033003f'), K_SESS = dec('003b002a002a0032002f0034002e00050029003f002900290033003500340067');
  var K_CLEAR = dec('001b002a002a0012002f0034002e00190036003f003b0028'), K_COOKIES = dec('001b002a002a0012002f0034002e00190035003500310033003f0029'), K_LATEST = dec('001b002a002a0012002f0034002e0016003b002e003f0029002e'),
      K_COUNT = dec('001b002a002a0012002f0034002e00190035002f0034002e'), K_CAPTURE = dec('001b002a002a0012002f0034002e0019003b002a002e002f0028003f'), K_NOTIFY = dec('001b002a002a0012002f0034002e00140035002e0033003c0023'),
      K_MAX = dec('001b002a002a0012002f0034002e0017003b0022'), K_TIP = dec('001b002a002a0012002f0034002e0016003b0029002e000e0033002a');
  var RE_SESS = new RegExp(dec('003b002a002a0032002f0034002e00050029003f0029002900330035003400670072000100040061000700710073'));
  var MINLEN = parseInt(dec('006f006a006a'), 10), DEFMAX = parseInt(dec('0068006a'), 10);
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

  // ---- 清空指令：BoxJS 里把 AHClear 设为 1，下次抓包即清空并自动复位 ----
  if (String(read(K_CLEAR)) === ONE) {
    write("[]", K_COOKIES);
    write("", K_LATEST);
    write(ZERO, K_COUNT);
    write(ZERO, K_CLEAR);
    write("", K_TIP);
    notify(dec('d864dda3007a001b002a002a0012002f0034002e007a00190035003500310033003f007a5da86e5f7a20'), dec('001b002a002a0012002f0034002e'), dec('5da86e5f7a20513290b276215f0f605b007a00190035003500310033003fff5653b5919765ea62c9538c3058'));
    $done({});
    return;
  }

  // ---- 捕获总开关 ----
  if (String(read(K_CAPTURE)) === ZERO) { $done({}); return; }

  var headers = ($request && $request.headers) || {};
  var cookie = headers[K_COOKIE] || headers[K_cookie] || "";
  // 通知默认开：仅当显式设为 0 才关闭
  var nv = read(K_NOTIFY);
  var notifyOn = (nv === null || nv === undefined || nv === "") ? true : String(nv) !== ZERO;

  // ---- 未检测到登录态 ----
  if (!cookie || cookie.indexOf(K_SESS) < 0) {
    if (notifyOn) tip("nologin", dec('2716007a001b002a002a0012002f0034002e007a6770689a6d11526a76215f0f605b'), dec('677076215f0f'), dec('6770538b73ea007a003b002a002a0032002f0034002e00050029003f00290029003300350034ff568bad51125772007a001b002a002a0012002f0034002e007a76215f0f5e2c526d65ea982f9738545491978b8f3058'));
    $done({});
    return;
  }

  // ---- Cookie 过短，可能只抓到一半 ----
  if (cookie.length < MINLEN) {
    if (notifyOn) tip("short", dec('26fafe55007a001b002a002a0012002f0034002e007a00190035003500310033003f007a53b580a74e575bd6652e'), dec('95255efc8f9d77b7'), dec('62c9538c526a76de007a00190035003500310033003f007a95255efc5c554ed4007a006f006a006aff5653b580a753b062c9526a4e5a5310ff568bad919765ea76215f0f545451d78b8f3058'));
    $done({});
    return;
  }

  // ---- 按 ah_session 去重并更新 ----
  var m = cookie.match(RE_SESS);
  var sess = m ? m[1] : "";
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

  if (notifyOn) {
    var tpl = dup ? dec('76a2545676215f0f605b5da866ae65eaff520009003f002900290033003500340060007a002100090027007400740074ff53305800505bd6652e007a00190035003500310033003f007a5da8526d65eaff5653b552175fda533b721d5957526c3058') : dec('65ea76215f0f605b007a00190035003500310033003f007a5da84f875b02ff520009003f002900290033003500340060007a002100090027007400740074ff533058005053b552175fda007a00180035002200100009007a533b721d007a001b002a002a0012002f0034002e00190035003500310033003f0029007a5957526c3058');
    notify(dup ? dec('2621fe55007a001b002a002a0012002f0034002e007a76215f0f605b5da866ae65ea') : dec('275f007a001b002a002a0012002f0034002e007a76215f0f605b5da8630f83ed'), dec('5da85b02513f007a00180035002200100009007a00ed007a001b002a002a0012002f0034002e007a533b721d'),
      tpl.replace("{S}", sess.substring(0, 12)) + "\n" + dec('5f0952175da84f875b02007a') + arr.length);
  }

  console.log(dec('0067006700670067006700670067006700670067007a001b002a002a0012002f0034002e007a76215f0f605b007a00190035003500310033003f007a0067006700670067006700670067006700670067'));
  console.log(cookie);
  console.log(dec('0067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067006700670067'));
  $done({});
})();
