/**
 * tgbot-backend.js — Quantumult X 本机服务版 TGBot 配置面板
 *
 * 特点：不需要域名、不需要 MITM 证书、不需要劫持任何网站。
 *      QX 在本机起服务，浏览器直接访问；面板与 API 同源 → 无跨域问题。
 *
 * 配置：
 *   [http_backend]
 *   tgbot-backend.js, tag=tgbot, path=^/tgbot/v1/
 *
 * 访问：
 *   http://127.0.0.1:9999/tgbot/v1/
 *   http://quantumult-x:9999/tgbot/v1/
 *
 * 路由：
 *   POST /tgbot/v1/api/<method> → 转发到 Telegram Bot API
 *   POST /tgbot/v1/save        → 保存 token 到 $prefs
 *   其他                         → 返回面板 HTML
 *
 * 约定：面板 HTML 属性用双引号，生成的 JS 字符串用单引号，两者不交叉。
 *
 * @supported Quantumult X (v1.0.14-build358)
 */

// ==================== 配置区 ====================
// 可选：默认 Bot Token。留空则由面板填写后存入 $prefs。
var DEFAULT_TOKEN = "";
// ================================================

var PATH_API = '/tgbot/v1/api';
var PATH_SAVE = '/tgbot/v1/save';
var PATH_POLL = '/tgbot/v1/poll';

var JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Connection': 'Close',
};

// ============================================================
// 服务端辅助
// ============================================================

// 调用 Telegram Bot API，返回 Promise
function tgCall(token, method, payload) {
  var body = payload || {};
  delete body.__token;
  return $task
    .fetch({
      url: 'https://api.telegram.org/bot' + token + '/' + method,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      opts: { redirection: true },
    })
    .then(function (r) {
      try {
        return r.body ? JSON.parse(r.body) : { ok: false };
      } catch (e) {
        return { ok: false, description: String(r.body).slice(0, 200) };
      }
    });
}

// 在规则中匹配命令或按钮 callback_data
function matchRule(rules, key) {
  var k = String(key == null ? '' : key);
  if (k.charAt(0) === '/') k = k.slice(1);
  k = k.toLowerCase();
  for (var i = 0; i < rules.length; i++) {
    var f = String((rules[i] && rules[i].key) || '');
    if (f.charAt(0) === '/') f = f.slice(1);
    if (f.toLowerCase() === k) return rules[i];
  }
  return null;
}

// ============================================================
// 面板 HTML
// ============================================================
// gt: 外层拼接辅助。生成内层 JS 代码中的双引号字符串。
// 必须定义在 PANEL_HTML 之前——拼接时就会用到。
function gt(s) {
  return String(s).replace(/\\\\"/g, '"');
}


// ============================================================
// UI 片段：存在 $prefs，避免在 JS 字符串里嵌套 HTML 造成转义地狱
// ============================================================
var SNIPPETS = {
  sw: '<div class=switch id=sw><span class=sw></span><span class=sl><b>自动回复</b><span>开启后，面板会持续读取消息并按规则自动回复</span></span></div>',
  msgEmpty: '<div class=empty>暂无消息。点下方按钮读取，或开启自动回复</div>',
  ruleEmpty: '<div class=empty>还没有回复规则</div>'
};
try {
  $prefs.setValueForKey(JSON.stringify(SNIPPETS), 'tgbot_snippets');
} catch (e) {}

var PANEL_HTML = [
'<!DOCTYPE html>',
'<html lang=zh-CN><head><meta charset=utf-8>',
'<meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">',
'<title>TGBot 配置</title>',
'<style>',
'*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
'html,body{max-width:100%;overflow-x:hidden}',
'body{margin:0;font:14px/1.5 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;background:#f2f4f7;color:#222;padding-bottom:env(safe-area-inset-bottom)}',
'.hd{background:#229ED9;color:#fff;padding:calc(14px + env(safe-area-inset-top)) 16px 14px;display:flex;align-items:center;gap:8px}',
'.hd h1{margin:0;font-size:17px;font-weight:600}',
'.hd .st{margin-left:auto;font-size:12px;opacity:.9;flex:0 0 auto}',
'.wrap{width:100%;max-width:640px;margin:0 auto;padding:12px}',
'.tabs{display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%}',
'.tab{padding:7px 14px;border-radius:999px;background:#fff;font-size:13px;cursor:pointer;white-space:nowrap;border:1px solid #e3e6ea;flex:0 0 auto}',
'.tab.on{background:#229ED9;color:#fff;border-color:#229ED9}',
'.card{background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,.06);max-width:100%}',
'.card.tight{padding:12px}',
'.ctitle{font-size:13px;font-weight:600;color:#333;margin:0 0 10px;display:flex;align-items:center;gap:6px}',
'.ctitle .n{background:#eef0f3;color:#666;border-radius:10px;padding:1px 7px;font-size:11px;font-weight:500}',
'.f{margin-bottom:12px}',
'.f:last-child{margin-bottom:0}',
'.f label{display:block;font-size:12px;color:#666;margin-bottom:5px}',
'.f input,.f textarea,.f select{width:100%;max-width:100%;min-width:0;padding:10px;border:1px solid #dcdfe4;border-radius:8px;font-size:16px;font-family:inherit;background:#fff;color:#222}',
'.f textarea{min-height:80px;resize:vertical}',
'.f input:focus,.f textarea:focus,.f select:focus{outline:none;border-color:#229ED9;box-shadow:0 0 0 3px rgba(34,158,217,.12)}',
'.row{display:flex;gap:8px;width:100%;max-width:100%}',
'.row>*{flex:1 1 0;min-width:0}',
'.row.wrap{flex-wrap:wrap}',
'.btn{padding:11px 12px;border:none;border-radius:8px;background:#229ED9;color:#fff;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit}',
'.btn.sec{background:#eef0f3;color:#333}',
'.btn.warn{background:#fdecea;color:#c0392b}',
'.btn.sm{padding:7px 10px;font-size:13px;border-radius:7px;white-space:nowrap}',
'.btn:active{opacity:.75}',
'.btn:disabled{opacity:.45}',
'.hint{font-size:12px;color:#8a9199;line-height:1.6;background:#f7f9fb;border-radius:8px;padding:10px;margin-bottom:12px;word-break:break-word;overflow-wrap:anywhere}',
'.out{background:#1f2430;color:#c9d4e5;border-radius:8px;padding:10px;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-all;max-height:220px;overflow:auto;margin-top:10px}',
'.out:empty{display:none}',
'.kbrow{margin-bottom:10px;max-width:100%}',
'.kblabel{font-size:12px;color:#666;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;gap:8px;max-width:100%}',
'.kblabel .kbtxt{flex:1 1 auto;min-width:0}',
'.kbb{display:flex;flex-wrap:wrap;gap:8px;max-width:100%}',
'.kb{padding:8px 12px;border-radius:6px;background:#e8f4fd;color:#1c7db5;font-size:13px;border:1px solid #bfe0f5;cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
'.kb.w{width:100%;text-align:center}',
'.kb.drag{opacity:.4}',
'.kb.over{outline:2px dashed #229ED9;outline-offset:2px}',
'.cmdrow{display:flex;gap:6px;margin-bottom:6px;align-items:center;max-width:100%}',
'.cmdrow input{flex:1 1 0;min-width:0}',
'.cmdrow .idx{width:20px;flex:0 0 auto;text-align:center;font-size:12px;color:#999}',
'.cmdrow .del{background:#fdecea;color:#d9534f;font-size:15px;cursor:pointer;padding:6px 9px;border-radius:7px;flex:0 0 auto;border:none;line-height:1}',
'.empty{font-size:12px;color:#aaa;padding:10px 0;text-align:center;background:#fafbfc;border-radius:8px;border:1px dashed #e0e4e8}',
'.badge{display:inline-block;font-size:11px;padding:2px 7px;border-radius:10px;background:#e8f4fd;color:#1c7db5;margin-right:6px}',
'.badge.ok{background:#e6f7ed;color:#1e824c}',
'.badge.err{background:#fdecea;color:#c0392b}',
'.kv{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px solid #f0f2f4;font-size:13px}',
'.kv:last-child{border-bottom:none}',
'.kv .k{color:#888;flex:0 0 auto}',
'.kv .v{color:#222;text-align:right;word-break:break-all;overflow-wrap:anywhere}',
'.emoji{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}',
'.emoji button{border:1px solid #e0e4e8;background:#fff;border-radius:7px;padding:6px 9px;font-size:16px;cursor:pointer;line-height:1}',
'.emoji button:active{background:#eef0f3}',
'.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(24px + env(safe-area-inset-bottom));background:rgba(0,0,0,.85);color:#fff;padding:9px 16px;border-radius:8px;font-size:13px;opacity:0;pointer-events:none;transition:opacity .2s;z-index:99;max-width:80vw;text-align:center}',
'.toast.on{opacity:1}',
'/* ===== 现代深色科技风 ===== */',
':root{--bg:#0d1117;--panel:#161b22;--panel2:#1c2129;--line:#2b313a;--txt:#e6edf3;--txt2:#9aa4b2;--accent:#2dd4bf;--accent2:#38bdf8;--warn:#f87171}',
'html{background:var(--bg)}',
'body{background:radial-gradient(1200px 600px at 50% -10%,#16202e 0%,var(--bg) 55%) no-repeat,var(--bg);color:var(--txt);min-height:100vh}',
'.hd{background:linear-gradient(135deg,rgba(45,212,191,.16),rgba(56,189,248,.10));backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line);padding:calc(14px + env(safe-area-inset-top)) 16px 14px;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:20}',
'.hd h1{margin:0;font-size:17px;font-weight:650;letter-spacing:.3px;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}',
'.hd .st{margin-left:auto;font-size:12px;color:var(--txt2);flex:0 0 auto;padding:3px 9px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.03)}',
'.tabs{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:4px;gap:4px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;box-shadow:0 1px 0 rgba(255,255,255,.03) inset}',
'.tabs::-webkit-scrollbar{height:3px}',
'.tabs::-webkit-scrollbar-track{background:transparent}',
'.tabs::-webkit-scrollbar-thumb{background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:99px}',
'.tabs{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:4px;gap:4px;display:flex;flex-wrap:wrap;box-shadow:0 1px 0 rgba(255,255,255,.03) inset}',
'.tab{flex:1 1 auto;min-width:0;text-align:center;padding:8px 10px;border-radius:9px;background:transparent;border:1px solid transparent;color:var(--txt2);font-size:13px;cursor:pointer;font-weight:500;transition:.16s;white-space:nowrap}',
'.tab{background:transparent;border:1px solid transparent;color:var(--txt2);border-radius:9px;font-weight:500;transition:.16s}',
'.tab.on{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#04211f;border-color:transparent;font-weight:600;box-shadow:0 3px 12px rgba(45,212,191,.28)}',
'.card{background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.32)}',
'.ctitle{color:var(--txt);font-size:13.5px;font-weight:600}',
'.ctitle .n{background:rgba(45,212,191,.14);color:var(--accent);border:1px solid rgba(45,212,191,.25)}',
'.f label{color:var(--txt2)}',
'.f input,.f textarea,.f select{background:#0b0f14;border-color:var(--line);color:var(--txt);caret-color:var(--accent)}',
'.f input::placeholder,.f textarea::placeholder{color:#5b6472}',
'.f input:focus,.f textarea:focus,.f select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(45,212,191,.14)}',
'.f select option{background:#0b0f14;color:var(--txt)}',
'.btn{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#04211f;font-weight:600;box-shadow:0 3px 12px rgba(45,212,191,.22)}',
'.btn.sec{background:rgba(255,255,255,.05);color:var(--txt);border:1px solid var(--line);box-shadow:none}',
'.btn.warn{background:rgba(248,113,113,.12);color:var(--warn);border:1px solid rgba(248,113,113,.3);box-shadow:none}',
'.btn:active{opacity:.82;transform:translateY(1px)}',
'.hint{background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.16);color:var(--txt2)}',
'.out{background:#080b10;border:1px solid var(--line);color:#7dd3fc}',
'.kbrow{background:rgba(255,255,255,.02);border:1px solid var(--line);border-radius:12px;padding:10px}',
'.kblabel{color:var(--txt2)}',
'.kcell{flex:1 1 100%;min-width:0;margin-bottom:14px}',
'.kedit{display:grid;gap:8px;margin-top:12px;padding-top:12px;border-top:1px dashed rgba(255,255,255,.10)}',
'.kedit[cols="2"]{grid-template-columns:1fr 1fr}',
'.kedit[cols="1"] .kpair{grid-template-columns:1fr 1fr}',
'.kpair{display:grid;grid-template-columns:1fr 1fr;gap:6px;min-width:0}',
'.kedit input{width:100%;min-width:0;background:#0b0f14;border:1px solid var(--line);color:var(--txt);border-radius:8px;padding:7px 9px;font:13px/1.4 inherit}',
'.kedit input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 2px rgba(45,212,191,.13)}',
'.kedit input::placeholder{color:#5b6472}',
'.kb{background:linear-gradient(135deg,rgba(45,212,191,.16),rgba(56,189,248,.12));color:var(--accent);border:1px solid rgba(45,212,191,.3)}',
'.kb:active{background:linear-gradient(135deg,rgba(45,212,191,.3),rgba(56,189,248,.24))}',
'.cmdrow input{background:#0b0f14;border:1px solid var(--line);color:var(--txt);border-radius:9px;padding:9px 10px;font-size:16px;min-width:0}',
'.cmdrow .idx{color:var(--txt2);font-variant-numeric:tabular-nums}',
'.cmdrow .del{background:rgba(248,113,113,.12);color:var(--warn);border:1px solid rgba(248,113,113,.28)}',
'.empty{background:rgba(255,255,255,.02);border:1px dashed var(--line);color:var(--txt2)}',
'.badge{background:rgba(45,212,191,.14);color:var(--accent)}',
'.badge.ok{background:rgba(74,222,128,.14);color:#4ade80;border:1px solid rgba(74,222,128,.25)}',
'.badge.err{background:rgba(248,113,113,.14);color:var(--warn)}',
'.kv{border-bottom:1px solid rgba(255,255,255,.06)}',
'.kv .k{color:var(--txt2)}',
'.kv .v{color:var(--txt)}',
'.emoji button{background:rgba(255,255,255,.04);border-color:var(--line)}',
'.emoji button:active{background:rgba(45,212,191,.18);border-color:var(--accent)}',
'.sg button{background:rgba(255,255,255,.04);border-color:var(--line);color:var(--txt2)}',
'.sg button.on{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#04211f;border-color:transparent}',
'.toast{background:rgba(22,27,34,.96);border:1px solid var(--accent);color:var(--txt);box-shadow:0 8px 28px rgba(0,0,0,.5)}',
'input[type=checkbox]{accent-color:var(--accent)}',
'.btn.kb{background:linear-gradient(135deg,#a78bfa,#38bdf8);color:#0b1120;font-weight:600;box-shadow:0 3px 14px rgba(167,139,250,.3)}',
'.switch{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.02);margin-bottom:12px}',
'.switch .sw{width:44px;height:26px;border-radius:999px;background:#2b313a;position:relative;flex:0 0 auto;cursor:pointer;transition:.2s}',
'.switch .sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#6b7480;transition:.2s}',
'.switch.on .sw{background:linear-gradient(135deg,var(--accent),var(--accent2))}',
'.switch.on .sw::after{left:21px;background:#04211f}',
'.switch .sl{flex:1 1 auto;min-width:0}',
'.switch .sl b{display:block;font-size:14px;font-weight:600;color:var(--txt)}',
'.switch .sl span{font-size:11.5px;color:var(--txt2)}',
'.msg{background:rgba(255,255,255,.025);border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-bottom:8px}',
'.msg.cb{border-left:2px solid var(--accent2)}',
'.msg .mh{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--txt2);margin-bottom:5px;flex-wrap:wrap;max-width:100%}',
'.msg .mh .nm{color:var(--accent);font-weight:600;font-size:12.5px}',
'.msg .mh .tm{margin-left:auto;font-variant-numeric:tabular-nums}',
'.msg textarea{background:#0b0f14;border:1px solid var(--line);color:var(--txt);border-radius:9px;padding:9px 10px;font:14px/1.5 inherit;width:100%;min-height:64px;resize:vertical}',
'.msg .mh .del{display:inline-block;background:rgba(248,113,113,.15);color:#f87171;border:1px solid rgba(248,113,113,.35);border-radius:6px;padding:2px 9px;font-size:13px;cursor:pointer;line-height:1.4;flex:0 0 auto;margin-left:auto;min-width:28px}',
'.msg .tx{font-size:13.5px;color:var(--txt);word-break:break-word;overflow-wrap:anywhere;white-space:pre-wrap}',
'.msg .kd{display:inline-block;font-size:11px;padding:1px 7px;border-radius:6px;background:rgba(56,189,248,.14);color:#38bdf8;border:1px solid rgba(56,189,248,.24)}',
'.msg .rl{display:inline-block;font-size:11px;padding:1px 7px;border-radius:6px;background:rgba(74,222,128,.13);color:#4ade80}',
'.msg .rw{display:inline-block;font-size:11px;padding:1px 7px;border-radius:6px;background:rgba(251,191,36,.13);color:#fbbf24}',
'.chips{display:flex;flex-wrap:wrap;gap:6px}',
'.chip{display:inline-block;font-size:12px;padding:3px 10px;border-radius:999px;background:rgba(45,212,191,.13);color:var(--accent);border:1px solid rgba(45,212,191,.28)}',
'.sg{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}',
'.sg button{flex:0 0 auto;padding:5px 11px;border-radius:999px;border:1px solid #e0e4e8;background:#fff;font-size:12px;cursor:pointer}',
'.sg button.on{background:#229ED9;color:#fff;border-color:#229ED9}',
'</style></head><body>',
'<div class=hd><h1>XiaoMao_TGBot配置</h1><span class=st id=st>本机服务</span></div>',
'<div class=wrap>',
'<div class=tabs id=tabs>',
'<div class="tab on" data-t=basic>连接</div>',
'<div class=tab data-t=cmd>快捷指令</div>',
'<div class=tab data-t=reply>指令回复</div>',
'<div class=tab data-t=kb>消息按钮</div>',
'<div class=tab data-t=inbox>互动消息</div>',
'<div class=tab data-t=send>测试发送</div>',
'<div class=tab data-t=info>Bot 信息</div>',
'</div>',
'<div id=pane></div>',
'</div>',
'<div class=toast id=toast></div>',
'<script>',
'(function(){',
'var BASE="/tgbot/v1";',
'var token="", cmds=[], kbRows=[[]], botInfo=null, lastMsgId=null, rules=[], inbox=[], autoReply=false, pollTimer=null;',
'try{rules=JSON.parse(localStorage.getItem("tg_rules")||"[]")||[];if(!Array.isArray(rules))rules=[]}catch(e){rules=[]}',
'try{autoReply=localStorage.getItem("tg_auto")==="1"}catch(e){autoReply=false}',
'try{token=localStorage.getItem("tg_token")||""}catch(e){}',
'try{cmds=JSON.parse(localStorage.getItem("tg_cmds")||"[]")||[];if(!Array.isArray(cmds))cmds=[]}catch(e){cmds=[]}',
'try{kbRows=JSON.parse(localStorage.getItem("tg_kb")||"[[]]")||[[]];if(!Array.isArray(kbRows)||!kbRows.length)kbRows=[[]]}catch(e){kbRows=[[]]}',
'function $(id){return document.getElementById(id)}',
'function save(){try{localStorage.setItem("tg_token",token);localStorage.setItem("tg_cmds",JSON.stringify(cmds));localStorage.setItem("tg_kb",JSON.stringify(kbRows));localStorage.setItem("tg_rules",JSON.stringify(rules));localStorage.setItem("tg_auto",autoReply?"1":"0")}catch(e){}}',
'function h(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}',
'function q(s){return String(s==null?"":s).replace(/"/g,"&quot;")}',
// gt: 在外层单引号串中写内层双引号 HTML 时的辅助（还原被转义的引号）
'function gt(s){return String(s).replace(/\\\\"/g,String.fromCharCode(34))}',
// SNIP：HTML 片段，由服务端注入在脚本末尾的 window.SNIP 读取
'var SNIP={sw:"",msgEmpty:"",ruleEmpty:""};',
'try{if(typeof window.SNIPDATA==="string"){var o=JSON.parse(window.SNIPDATA);if(o&&o.sw)SNIP=o}}catch(e){}',
'function out(t){var el=$("out");if(el)el.textContent=typeof t==="string"?t:JSON.stringify(t,null,2)}',
'function toast(m){var t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove("on")},1800)}',
'function busy(b){var st=$("st");if(st)st.textContent=b?"请求中…":"本机服务"}',
'function api(method, body){',
'  busy(true);',
'  var payload = body || {};',
'  payload.__token = token;',
'  return fetch(BASE+"/api/"+method, {',
'    method:"POST",',
'    headers:{"Content-Type":"application/json"},',
'    body:JSON.stringify(payload)',
'  }).then(function(r){',
'    return r.text().then(function(t){',
'      try{return JSON.parse(t)}catch(e){return{ok:false,description:"非JSON响应: "+t.slice(0,200)}}',
'    });',
'  }).then(function(j){',
'    busy(false);',
'    if(j && j.description) toast(String(j.description).slice(0,60));',
'    return j;',
'  }).catch(function(e){',
'    busy(false);',
'    return{ok:false,description:"请求失败: "+e.message};',
'  });',
'}',
'function needTok(){if(!token){toast("请先填写 Bot Token");return false}return true}',
'function mask(){',
'  return{inline_keyboard:kbRows.map(function(r){',
'    return r.filter(function(c){return c && c.text}).map(function(c){',
'      return{text:c.text,callback_data:String(c.data||c.text||"").slice(0,64)};',
'    });',
'  }).filter(function(r){return r.length})};',
'}',
'var panes={};',
// ==================== 连接页 ====================
'panes.basic=function(){',
'  var info=botInfo;',
'  var card2 = info ? [',
'    \'<div class=card><div class=ctitle>当前 Bot <span class="badge ok">已连接</span></div>\',',
'    \'<div class=kv><span class=k>用户名</span><span class=v>@\'+h(info.username||"-")+"</span></div>",',
'    \'<div class=kv><span class=k>名称</span><span class=v>\'+h(info.first_name||"-")+"</span></div>",',
'    info.id?\'<div class=kv><span class=k>ID</span><span class=v>\'+h(String(info.id))+"</span></div>":"",',
'    \'</div>\'',
'  ].join("") : "";',
'  return [',
'    \'<div class=card><div class=hint>面板由 Quantumult X 本机服务提供（同源，无需域名与证书）。Bot Token 只保存在本机，不上传任何第三方服务器。</div>\',',
'    card2,',
'    \'<div class=f><label>Bot Token（来自 @BotFather）</label><input id=tok type=password value="\'+q(h(token))+\'" placeholder="123456:ABC-DEF..."></div>\',',
'    \'<div class=f><label>Chat ID（测试发送目标）</label><input id=chat value="\'+q(localStorage.getItem("tg_chat")||"")+\'" placeholder="123456789 或 @channelusername"></div>\',',
'    \'<div class=row><button class=btn id=save>保存</button><button class="btn sec" id=me>验证连接</button></div>\',',
'    \'<div class=row style="margin-top:8px"><button class="btn sec" id=logout>清除本机 Token</button></div>\',',
'    \'<div class=out id=out></div>\'',
'  ].join("");',
'};',
// ==================== 快捷指令页 ====================
'panes.cmd=function(){',
'  var rows=cmds.map(function(c,i){',
'    return [',
'      \'<div class=cmdrow>\',',
'      \'<span class=idx>\'+(i+1)+\'</span>\',',
'      \'<input class=cc data-i="\'+i+\'" value="\'+q(h(c.command))+\'" placeholder="命令 如 start">\',',
'      \'<input class=cd data-i="\'+i+\'" value="\'+q(h(c.description))+\'" placeholder="描述">\',',
'      \'<button class=del data-i="\'+i+\'" title="删除">×</button>\',',
'      \'</div>\'',
'    ].join("");',
'  }).join("");',
'  return [',
'    \'<div class=card><div class=ctitle>快捷指令 <span class=n>\'+cmds.length+\'</span></div>\',',
'    \'<div class=hint>即 Telegram 输入「/」时弹出的命令列表，通过 setMyCommands 写入。命令<strong>不要</strong>带 / 前缀；最多 100 条，命令名 1–32 字符，描述 1–256 字符。</div>\',',
'    rows ? rows : \'<div class=empty>还没有指令，点下方「+ 添加一条」</div>\',',
'    \'<div class=row style="margin-top:10px"><button class="btn sec" id=add>+ 添加一条</button></div>\',',
'    \'<div class=row style="margin-top:8px"><button class=btn id=set>保存到 Bot</button><button class="btn sec" id=get>读取现有</button></div>\',',
'    \'<button class="btn warn" style="width:100%;margin-top:8px" id=del>清除 Bot 上全部指令</button></div>\',',
'    \'<div class=out id=out></div>\'',
'  ].join("");',
'};',
// ==================== 消息按钮页 ====================
'panes.kb=function(){',
'  var rows=kbRows.map(function(row,ri){',
'    var btns=row.map(function(c,ci){',
'      var cls = row.length===1 ? "kb w" : "kb";',
'      return gt("<span class=")+cls+gt(" data-r=")+ri+gt(" data-c=")+ci+gt(">")+h(c.text||"(未命名)")+gt("</span>");',
'    }).join("");',
'    var edits=row.map(function(c,ci){',
'      return gt("<div class=kpair><input class=ktext data-r=")+ri+gt(" data-c=")+ci+gt(" value="+String.fromCharCode(34))+q(h(c.text||""))+gt(String.fromCharCode(34)+" placeholder="+String.fromCharCode(34)+"文字"+String.fromCharCode(34)+">")',
'        +gt("<input class=kdata data-r=")+ri+gt(" data-c=")+ci+gt(" value="+String.fromCharCode(34))+q(h(c.data||""))+gt(String.fromCharCode(34)+" placeholder="+String.fromCharCode(34)+"回调指令"+String.fromCharCode(34)+">")',
'        +gt("</div>");',
'    }).join("");',
'    var cols=row.length>1 ? 2 : 1;',
'    var head=gt("<div class=kbrow><div class=kblabel><span class=kbtxt>第 ")+(ri+1)+gt(" 行</span><button class=\\"btn sm sec\\" data-delrow=")+ri+gt("\\">删除行</button></div>");',
'    var box=gt("<div class=kbb>")+btns+gt("</div><div class=kedit cols=")+cols+gt(">")+edits+gt("</div></div>");',
'    return head+box;',
'  }).join("");',
'  var total=0;',
'  kbRows.forEach(function(r){ r.forEach(function(c){ if(c&&c.text) total++; }); });',
'  return [',
'    \'<div class=card><div class=ctitle>按钮布局 <span class=n>\'+total+\' 个</span></div>\',',
'    \'<div class=hint>点击按钮可编辑文字与 callback_data（回调数据 ≤64 字节）。行内只有一个按钮时自动占满整行，与 Telegram 实际展示一致。</div>\',',
'    rows ? rows : \'<div class=empty>还没有按钮，点下方添加</div>\',',
'    \'<div class=row style="margin-top:10px"><button class="btn sec" id=addrow>+ 加一行</button><button class="btn sec" id=addkb>+ 加按钮</button></div>\',',
'    \'<div class=row style="margin-top:8px"><button class=btn id=savelayout>保存布局</button><button class="btn sec" id=resetkb>清空</button></div></div>\',',
// ---- 预设布局 ----
'    \'<div class=card><div class=ctitle>预设布局</div>\',',
'    \'<div class=row wrap>\',',
'      \'<button class="btn sm sec" data-preset="0">单列</button>\',',
'      \'<button class="btn sm sec" data-preset="1">两列</button>\',',
'      \'<button class="btn sm sec" data-preset="2">三列</button>\',',
'      \'<button class="btn sm sec" data-preset="3">宫格</button>\',',
'      \'<button class="btn sm sec" data-preset="4">取消</button>\',',
'    \'</div></div>\',',
'    \'<div class=out id=out></div>\'',
'  ].join("");',
'};',
// ==================== 测试发送页 ====================
'panes.send=function(){',
'  var mk=mask();',
'  var prev=mk.inline_keyboard.length ? mk.inline_keyboard.map(function(r){',
'    return r.map(function(b){',
'      var cls = r.length===1 ? "kb w" : "kb";',
'      return \'<span class="\'+cls+\'">\'+h(b.text)+"</span>";',
'    }).join("");',
'  }).join(\'<div style="height:4px"></div>\') : \'<span class=empty>当前无按钮</span>\';',
'  var EMOJI=["👍","❤️","🔥","🎉","✅","❌","⭐","🚀","💡","📌","⚡","🎯"];',
'  var emo="";',
'  EMOJI.forEach(function(e){',
'    emo += \'<button data-emo="\'+h(e)+\'">\'+h(e)+"</button>";',
'  });',
'  return [',
'    \'<div class=card>\',',
'    \'<div class=f><label>消息内容（会以 Bot 身份发送）</label><textarea id=txt placeholder="输入测试消息，如 /start">\'+h(localStorage.getItem("tg_text")||"/start")+\'</textarea></div>\',',
      '      "<div class=f><label>常用表情</label><div class=emoji>"+emo+"</div></div>",',
'    \'<div class=f><label>解析模式</label><select id=pm><option value="">默认</option><option value=MarkdownV2>MarkdownV2</option><option value=HTML>HTML</option></select></div>\',',
'    \'<div class=f><label>附加选项</label>\',',
'    \'  <label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:6px">\',',
'    \'    <input type=checkbox id=dis style="width:auto;min-width:0;flex:0 0 auto"> 禁用通知（静默发送）\',',
'    \'  </label>\',',
'    \'  <label style="display:flex;align-items:center;gap:6px;font-size:13px">\',',
'    \'    <input type=checkbox id=prev2 style="width:auto;min-width:0;flex:0 0 auto"> 允许预览（Link Preview）\',',
'    \'  </label>\',',
'    \'</div>\',',
'    \'<div class=row><button class=btn id=send>发送</button><button class="btn kb" id=sendkb>带按钮发送</button></div>\',',
'    \'<div class=row style="margin-top:8px"><button class="btn warn" id=delmsg>删除上一条消息</button></div></div>\',',
      '      "<div class=card><div class=ctitle>按钮预览</div><div class=kbb>"+prev+"</div></div>",',
'    \'<div class=out id=out></div>\'',
'  ].join("");',
'};',
// ==================== Bot 信息页 ====================
'panes.info=function(){',
'  var i=botInfo;',
'  if(!i){',
'    return [',
'      \'<div class=card><div class=ctitle>Bot 信息</div>\',',
'      \'<div class=empty>尚未获取。请先到「连接」页点「验证连接」</div>\',',
'      \'<button class=btn style="width:100%;margin-top:12px" id=refresh>获取 Bot 信息</button></div>\'',
'    ].join("");',
'  }',
'  var rows=[',
'    ["ID", i.id],',
'    ["用户名", "@"+(i.username||"-")],',
'    ["名称", i.first_name||"-"],',
'    ["语言", i.language_code||"-"],',
'    ["可加入群组", i.can_join_groups===undefined?"-":(i.can_join_groups?"是":"否")],',
'    ["可读所有消息", i.can_read_all_messages===undefined?"-":(i.can_read_all_messages?"是":"否")],',
'    ["支持内联查询", i.supports_inline_queries===undefined?"-":(i.supports_inline_queries?"是":"否")],',
'    ["可连接支付", i.can_connect_to_business===undefined?"-":(i.can_connect_to_business?"是":"否")],',
'    ["有 Web App", i.has_main_web_app===undefined?"-":(i.has_main_web_app?"是":"否")]',
'  ];',
'  var kv=rows.map(function(r){',
'    return \'<div class=kv><span class=k>\'+h(r[0])+\'</span><span class=v>\'+h(String(r[1]))+"</span></div>";',
'  }).join("");',
'  return [',
'    \'<div class=card><div class=ctitle>Bot 信息 <span class="badge ok">\'+h("@"+(i.username||""))+\'</span></div>\',',
'    kv,',
'    \'</div>\',',
'    \'<div class=row><button class=btn id=refresh>刷新</button><button class="btn sec" id=logout2>清除本机 Token</button></div>\',',
'    \'<div class=out id=out></div>\'',
'  ].join("");',
'};',
'// ==================== 指令回复页 ====================',
'panes.reply=function(){',
'  var rows=rules.map(function(r,i){',
'    return gt("<div class=msg><div class=mh><span class=nm>#")+q(h(r.key||"?"))',
'      +gt("</span><span>自动回复</span><button class=del data-i=")+i+gt(">×</button></div>")',
'      +gt("<div class=f><input class=fkey data-k=")+i',
'      +gt(" value="+String.fromCharCode(34))+q(h(r.key||""))+gt(String.fromCharCode(34))',
'      +gt(" placeholder="+String.fromCharCode(34)+"命令 或 按钮 data"+String.fromCharCode(34)+"></div>")',
'      +gt("<textarea data-t2=")+i',
'      +gt(" rows=3 placeholder="+String.fromCharCode(34)+"发 /命令 或点击同名按钮时回复这段话"+String.fromCharCode(34)+">")+h(r.reply||"")+"</textarea></div></div>";',
'  }).join("");',
'  return [',
'    SNIP.sw.replace("class=switch", autoReply ? "class="+String.fromCharCode(34)+"switch on"+String.fromCharCode(34) : "class=switch").replace(">自动回复<", ">"+(autoReply?"自动回复已开启":"自动回复")+"<").replace("开启后，面板会持续读取消息并按规则自动回复", autoReply?"面板每 4 秒轮询一次，命中规则即自动回复":"开启后，面板会持续读取消息并按规则自动回复"),',
'    "<div class=card><div class=ctitle>回复规则<span class=n>"+rules.length+"</span></div>",',
'    "<div class=hint>这里配的是「指令对应的回复内容」。用户在 Telegram 发 /命令，或点击 callback_data 同名的按钮时，Bot 会自动回这段话。</div>",',
'    rows ? rows : SNIP.ruleEmpty,',
'    "<button class=btn sec style=width:100% id=addr>+ 添加规则</button>",',
'    "<div class=row style=margin-top:8px><button class=btn sec id=fromcmd>从快捷指令生成</button></div></div>",',
'    "<div class=out id=out></div>",',
'  ].join("");',
'};',
'panes.inbox=function(){',
'  var box=inbox.length ? inbox.map(function(it){',
'    var isCb=it.kind==="callback";',
'    var badge=isCb ? gt("<span class=kd>按钮 "+q(h(it.text||""))+"</span>") : "";',
'    var body=isCb ? (gt("<div class=tx>")+"点击了按钮 "+q(h(it.text||""))+"</div>")',
'                   : (gt("<div class=tx>")+q(h(it.text||""))+"</div>");',
'    return gt("<div class=\\"msg ")+(isCb?"cb":"")+gt("\\"><div class=mh>")',
'      +gt("<span class=nm>")+q(h(it.from_name||"未知"))+gt("</span>")',
'      +badge',
'      +(it.matched===false?gt("<span class=rw>未命中规则</span>"):(it.replied?gt("<span class=rl>已回复</span>"):gt("<span class=rw>已读未回</span>")))',
'      +gt("<span class=tm>")+fmtTime(it.date)+gt("</span></div>")',
'      +body+"</div>";',
'  }).join("") : SNIP.msgEmpty;',
'  return [',
'    "<div class=card><div class=ctitle>消息收件箱<span class=n>"+inbox.length+"</span></div>",',
'    "<div class=hint>读取 Bot 收到的消息与按钮点击事件。开启自动回复后，面板打开期间会持续轮询并响应。</div>",',
'    box,',
'    "<div class=row><button class=btn id=readnow>立即读取</button></div>",',
'    "<button class=btn warn style=width:100%;margin-top:8px id=clearinbox>清空列表</button></div>",',
'    "<div class=out id=out></div>",',
'  ].join("");',
'};',
// ==================== 互动消息页 ====================
'panes.inbox=function(){',
'  var box=inbox.length ? inbox.map(function(it){',
'    var isCb=it.kind==="callback";',
'    var badge=isCb ? gt("<span class=kd>按钮 "+q(h(it.text||""))+"</span>") : "";',
'    var body=isCb',
'      ? gt("<div class=tx>")+"点击了按钮 "+q(h(it.text||""))+"</div>"',
'      : gt("<div class=tx>")+q(h(it.text||""))+"</div>";',
'    return gt("<div class=\\\"msg ")+(isCb?"cb":"")+gt("\\\"><div class=mh>")',
'      +gt("<span class=nm>")+q(h(it.from_name||"未知"))+gt("</span>")',
'      +badge',
'      +(it.matched===false?gt("<span class=rw>未命中规则</span>"):(it.replied?gt("<span class=rl>已回复</span>"):gt("<span class=rw>已读未回</span>")))',
'      +gt("<span class=tm>")+fmtTime(it.date)+gt("</span></div>")',
'      +body+"</div>";',
'  }).join("") : gt("<div class=empty>暂无消息。点下方按钮读取，或开启自动回复</div>");',
'  var rlist=rules.length ? rules.map(function(r){',
'    return gt("<span class=chip>")+q(h(r.key||"?"))+gt("</span>");',
'  }).join("") : gt("<span class=empty>还没有回复规则</span>");',
'  return [',
'    \'<div class=card><div class=ctitle>当前回复规则 <span class=n>\'+rules.length+\'</span></div>\',',
'    \'<div class=hint>按钮的「回调指令」必须与下面某个名字一致，否则会显示「未命中规则」。</div>\',',
'    \'<div class=chips>\'+rlist+\'</div></div>\',',
'    \'<div class=card><div class=ctitle>消息收件箱 <span class=n>\'+inbox.length+\'</span></div>\',',
'    \'<div class=hint>读取 Bot 收到的消息与按钮点击事件。开启自动回复后，面板打开期间会持续轮询并响应。</div>\',',
'    box,',
'    \'<div class=row><button class=btn id=readnow>立即读取</button></div>\',',
'    \'<button class="btn warn" style="width:100%;margin-top:8px" id=clearinbox>清空列表</button></div>\',',
'    \'<div class=out id=out></div>\'',
'  ].join("");',
'};',
'function fmtTime(ts){',
// 本地查找规则（生成规则时避免重复）
'function matchLocal(key){',
'  var k=String(key||"").replace(/^\\//,"").toLowerCase();',
'  for(var i=0;i<rules.length;i++){',
'    var f=String((rules[i]&&rules[i].key)||"").replace(/^\\//,"").toLowerCase();',
'    if(f===k) return rules[i];',
'  }',
'  return null;',
'}',
'  if(!ts)return "";',
'  var d=new Date(ts*1000);',
'  function p(n){return n<10?"0"+n:""+n}',
'  return p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes())+":"+p(d.getSeconds());',
'}',
'// 调用本机 poll 接口：读取消息 + 可选自动应答',
'function pollOnce(reset){',
'  return fetch(BASE+"/poll",{',
'    method:"POST",',
'    headers:{"Content-Type":"application/json"},',
'    body:JSON.stringify({__token:token,rules:rules,auto:autoReply,chat_id:localStorage.getItem("tg_chat")||"",reset:!!reset})',
'  }).then(function(r){return r.json()}).then(function(j){',
'    if(j && j.ok && j.items && j.items.length){',
'      inbox = j.items.concat(inbox).slice(0,50);',
'      if(cur==="inbox") render();',
'      return j.items.length;',
'    }',
'    return 0;',
'  }).catch(function(){ return -1; });',
'}',
'function startPolling(){',
'  if(pollTimer) clearInterval(pollTimer);',
'  pollTimer=setInterval(function(){',
'    if(!token) return;',
'    pollOnce(false).then(function(n){',
'      if(n>0) $("st").textContent="收到 "+n+" 条";',
'    });',
'  },4000);',
'  pollOnce(false);',
'}',
'function stopPolling(){ if(pollTimer){clearInterval(pollTimer);pollTimer=null;} }',
'var cur="basic";',
'function render(){$("pane").innerHTML=panes[cur]();bind();}',
'function bind(){',
'  if(cur==="basic"){',
'    $("save").onclick=function(){',
'      token=$("tok").value.trim();',
'      localStorage.setItem("tg_chat", $("chat").value.trim());',
'      save();',
'      fetch(BASE+"/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:token})}).catch(function(){});',
'      toast("已保存");',
'      out("已保存到本机");',
'    };',
'    $("me").onclick=function(){',
'      token=$("tok").value.trim(); save();',
'      if(!needTok())return;',
'      out("请求中…");',
'      api("getMe").then(function(r){',
'        out(r);',
'        if(r&&r.ok){ botInfo=r.result; toast("连接成功"); render(); }',
'      });',
'    };',
'    $("logout").onclick=logout;',
'  }',
'  if(cur==="cmd"){',
'    $("add").onclick=function(){',
'      cmds.push({command:"",description:""});',
'      save();',
'      render();',
// 聚焦到新行，便于直接输入
'      var last=document.querySelectorAll(".cmdrow input.cc");',
'      if(last.length) last[last.length-1].focus();',
'    };',
'    var ds=document.querySelectorAll(".cmdrow .del"), i;',
'    for(i=0;i<ds.length;i++){',
'      ds[i].onclick=function(){',
'        cmds.splice(+this.getAttribute("data-i"),1);',
'        save();',
'        render();',
'      };',
'    }',
'    var cs=document.querySelectorAll(".cc"), j;',
'    for(j=0;j<cs.length;j++){',
'      cs[j].oninput=function(){cmds[+this.getAttribute("data-i")].command=this.value; save()};',
'    }',
'    var cds=document.querySelectorAll(".cd"), k;',
'    for(k=0;k<cds.length;k++){',
'      cds[k].oninput=function(){cmds[+this.getAttribute("data-i")].description=this.value; save()};',
'    }',
'    $("set").onclick=function(){',
'      if(!needTok())return;',
'      var list=cmds.filter(function(c){return c && c.command && c.command.trim()}).map(function(c){',
'        var n=c.command.trim();',
'        if(n.charAt(0)==="/")n=n.slice(1);',
'        return{command:n.slice(0,32),description:String(c.description||"").trim().slice(0,256) || n};',
'      });',
'      if(!list.length){toast("没有有效指令");return}',
'      if(list.length>100){toast("最多 100 条");list=list.slice(0,100)}',
'      save(); out("保存中…");',
'      api("setMyCommands",{commands:list}).then(function(r){',
'        out(r);',
'        if(r&&r.ok)toast("已保存 "+list.length+" 条")',
'      });',
'    };',
'    $("get").onclick=function(){',
'      if(!needTok())return;',
'      out("读取中…");',
'      api("getMyCommands").then(function(r){',
'        if(r&&r.ok&&Array.isArray(r.result)){',
'          cmds=r.result.map(function(x){return{command:x.command,description:x.description}});',
'          save(); render(); toast("已载入 "+cmds.length+" 条");',
'        } else out(r);',
'      });',
'    };',
'    $("del").onclick=function(){',
'      if(!needTok())return;',
'      if(!confirm("确定要清除 Bot 上的全部快捷指令吗？"))return;',
'      out("清除中…");',
'      api("deleteMyCommands").then(function(r){',
'        out(r); cmds=[]; save(); render(); toast("已清除");',
'      });',
'    };',
'  }',
'  if(cur==="reply"){',
'    if($("sw"))$("sw").onclick=function(){',
'      autoReply=!autoReply; save();',
'      if(autoReply){ if(!token){toast("请先填写 Token");autoReply=false;save();} else startPolling(); }',
'      else stopPolling();',
'      render();',
'      toast(autoReply?"自动回复已开启":"自动回复已关闭");',
'    };',
'    $("addr").onclick=function(){',
'      rules.push({key:"",reply:""}); save(); render();',
'      var ks=document.querySelectorAll(".msg input,.msg input[data-k]");',
'    };',
'    var ks=document.querySelectorAll("[data-k]"), i2;',
'    for(i2=0;i2<ks.length;i2++){',
'      ks[i2].oninput=function(){rules[+this.getAttribute("data-k")].key=this.value; save()};',
'    }',
'    var ts=document.querySelectorAll("[data-t2]"), j2;',
'    for(j2=0;j2<ts.length;j2++){',
'      ts[j2].oninput=function(){rules[+this.getAttribute("data-t2")].reply=this.value; save()};',
'    }',
'    var ds=document.querySelectorAll(".msg .del"), k2;',
'    for(k2=0;k2<ds.length;k2++){',
'      ds[k2].onclick=function(){rules.splice(+this.getAttribute("data-i"),1); save(); render()};',
'    }',
'    $("fromcmd").onclick=function(){',
'      var added=0;',
'      cmds.forEach(function(c){',
'        if(!c.command) return;',
'        var key=c.command.trim().replace(/^\\//,"");',
'        if(!key) return;',
'        if(matchLocal(key)) return;',
'        rules.push({key:key, reply:c.description||("已触发 "+key)});',
'        added++;',
'      });',
'      save(); render();',
'      toast(added?("已生成 "+added+" 条"):"没有新规则可生成");',
'    };',
'  }',
'  if(cur==="inbox"){',
'    $("readnow").onclick=function(){',
'      if(!needTok())return;',
'      out("读取中…");',
'      pollOnce(false).then(function(n){',
'        out(n>0?("收到 "+n+" 条新消息"):"没有新消息");',
'        if(n>0) render();',
'      });',
'    };',
'    $("clearinbox").onclick=function(){ inbox=[]; render(); toast("已清空"); };',
'  }',
'  if(cur==="kb"){',
'    $("addrow").onclick=function(){kbRows.push([]);save();render()};',
'    $("addkb").onclick=function(){',
'      if(!kbRows.length)kbRows=[[]];',
'      kbRows[kbRows.length-1].push({text:"按钮",data:""});',
'      save();',
'      render();',
'    };',
'    var kts=document.querySelectorAll(".ktext"), a1;',
'    for(a1=0;a1<kts.length;a1++){',
'      kts[a1].oninput=function(){',
'        var r=+this.getAttribute("data-r"), c=+this.getAttribute("data-c");',
'        if(!kbRows[r]) return;',
'        if(!kbRows[r][c]) kbRows[r][c]={text:"",data:""};',
'        kbRows[r][c].text=this.value;',
'        var lbl=document.querySelector(".kb[data-r=\\""+r+"\\"][data-c=\\""+c+"\\"]");',
'        if(lbl) lbl.textContent=this.value||"(未命名)";',
'        save();',
'      };',
'    }',
'    var kds=document.querySelectorAll(".kdata"), a2;',
'    for(a2=0;a2<kds.length;a2++){',
'      kds[a2].oninput=function(){',
'        var r=+this.getAttribute("data-r"), c=+this.getAttribute("data-c");',
'        if(!kbRows[r]) return;',
'        if(!kbRows[r][c]) kbRows[r][c]={text:"",data:""};',
'        kbRows[r][c].data=this.value.trim();',
'        save();',
'      };',
'    }',
'    var dr=document.querySelectorAll("[data-delrow]"), m;',
'    for(m=0;m<dr.length;m++){',
'      dr[m].onclick=function(){',
'        var r=+this.getAttribute("data-delrow");',
'        if(kbRows.length<=1){ kbRows=[[]]; } else { kbRows.splice(r,1); }',
'        save(); render();',
'      };',
'    }',
'    var ps=document.querySelectorAll("[data-preset]"), p;',
'    for(p=0;p<ps.length;p++){',
'      ps[p].onclick=function(){ applyPreset(+this.getAttribute("data-preset")); };',
'    }',
'    $("savelayout").onclick=function(){save();toast("布局已保存")};',
'    $("resetkb").onclick=function(){',
'      if(!confirm("确定清空全部按钮吗？"))return;',
'      kbRows=[[]]; save(); render(); toast("已清空");',
'    };',
'  }',
'  if(cur==="send"){',
'    $("send").onclick=function(){doSend(false)};',
'    $("sendkb").onclick=function(){doSend(true)};',
'    $("delmsg").onclick=delLastMsg;',
'    var eb=document.querySelectorAll("[data-emo]"), q2;',
'    for(q2=0;q2<eb.length;q2++){',
'      eb[q2].onclick=function(){',
'        var t=$("txt");',
'        t.value += this.getAttribute("data-emo");',
'        t.focus();',
'      };',
'    }',
'  }',
'  if(cur==="info"){',
'    $("refresh").onclick=function(){',
'      if(!needTok())return;',
'      out("获取中…");',
'      api("getMe").then(function(r){',
'        out(r);',
'        if(r&&r.ok){botInfo=r.result;render();toast("已更新")}',
'      });',
'    };',
'    $("logout2").onclick=logout;',
'  }',
'}',
'function logout(){',
'  if(!confirm("确定清除本机保存的 Bot Token 吗？"))return;',
'  token=""; botInfo=null;',
'  try{localStorage.removeItem("tg_token")}catch(e){}',
'  fetch(BASE+"/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:""})}).catch(function(){});',
'  toast("已清除");',
'  render();',
'}',
'function applyPreset(n){',
'  var mk=[["✅ 确认","ok"],["❌ 取消","cancel"],["📎 详情","detail"]];',
'  if(n===0){ kbRows=mk.map(function(r){return[{text:r[0],data:r[1]}]}); }',
'  else if(n===1){ kbRows=[mk.map(function(r){return{text:r[0],data:r[1]}})]; }',
'  else if(n===2){ kbRows=[[{text:"左",data:"l"},{text:"中",data:"c"},{text:"右",data:"r"}]]; }',
'  else if(n===3){ kbRows=[[{text:"1 1",data:"a"},{text:"1 2",data:"b"},{text:"1 3",data:"c"}],[{text:"2 1",data:"d"},{text:"2 2",data:"e"},{text:"2 3",data:"f"}]]; }',
'  else { return; }',
'  save(); render(); toast("已应用预设");',
'}',
'function delLastMsg(){',
'  if(!needTok())return;',
'  var c=localStorage.getItem("tg_chat")||"";',
'  if(!c){toast("请先填写 Chat ID");return}',
'  if(!lastMsgId){toast("还没有发送记录");return}',
'  api("deleteMessage",{chat_id:c,message_id:lastMsgId}).then(function(r){',
'    out(r);',
'    if(r&&r.ok){toast("已删除");lastMsgId=null}',
'  });',
'}',
'function doSend(withKb){',
'  if(!needTok())return;',
'  var c=localStorage.getItem("tg_chat")||"";',
'  if(!c){toast("请先在「连接」页填写 Chat ID");return}',
'  var txt=$("txt").value.trim();',
'  if(!txt){toast("消息内容为空");return}',
'  var pm=$("pm").value;',
'  var b={chat_id:c,text:txt};',
'  if(pm)b.parse_mode=pm;',
'  if($("dis").checked)b.disable_notification=true;',
'  if($("prev2").checked)b.disable_web_page_preview=true;',
'  if(withKb){',
'    var m=mask();',
'    if(m.inline_keyboard.length)b.reply_markup=m;',
'    else toast("当前没有按钮，将纯文本发送");',
'  }',
'  localStorage.setItem("tg_text",txt);',
'  out("发送中…");',
'  api("sendMessage",b).then(function(r){',
'    out(r);',
'    if(r&&r.ok){toast("已发送");lastMsgId=r.result.message_id}else{lastMsgId=null}',
'  });',
'}',
'var tabs=document.querySelectorAll(".tab"), t;',
'for(t=0;t<tabs.length;t++){',
'  tabs[t].onclick=function(){',
'    for(var x=0;x<tabs.length;x++)tabs[x].classList.remove("on");',
'    this.classList.add("on");',
'    cur=this.getAttribute("data-t");',
'    render();',
'  };',
'}',
'render();',
// 若已开启自动回复，进入面板即恢复轮询
'if(autoReply && token) startPolling();',
'})();',
'<' + '/script>',
'</body></html>',
].join('\n');

// ============================================================
// 入口路由
// ============================================================
try {
  var path = $request.path || '';

  var savedToken = '';
  try {
    savedToken = $prefs.valueForKey('tgbot_token') || '';
  } catch (e) {
    savedToken = '';
  }

  if (path.indexOf(PATH_SAVE) === 0) {
    var saveBody = $request.body || '';
    var sm = saveBody.match(/"token"\s*:\s*"([^"]*)"/);
    if (sm) {
      $prefs.setValueForKey(sm[1], 'tgbot_token');
    }
    $done({ status: 'HTTP/1.1 200 OK', headers: JSON_HEADERS, body: JSON.stringify({ ok: true }) });
  } else if (path.indexOf(PATH_POLL) === 0) {
    // ===== 收件箱 + 自动应答引擎 =====
    // 面板周期性调用。QX 脚本单次执行上限约 10s，故用 timeout:0 立即返回，
    // 不做长轮询；offset 游标存 $prefs 跨请求保持，避免重复处理。
    var pBody = {};
    try {
      pBody = $request.body ? JSON.parse($request.body) : {};
    } catch (e) {
      pBody = {};
    }
    var pToken = pBody.__token || savedToken || DEFAULT_TOKEN;
    var pRules = Array.isArray(pBody.rules) ? pBody.rules : [];
    var pChat = pBody.chat_id || '';
    var pAuto = !!pBody.auto;
    var pReset = !!pBody.reset;

    if (pReset) {
      try {
        $prefs.setValueForKey('0', 'tgbot_offset');
      } catch (e) {
        /* 忽略 */
      }
    }

    if (!pToken) {
      $done({
        status: 'HTTP/1.1 401 Unauthorized',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ok: false, error_code: 401, description: 'missing bot token' }),
      });
    } else {
      var curOffset = 0;
      try {
        curOffset = parseInt($prefs.valueForKey('tgbot_offset') || '0', 10) || 0;
      } catch (e) {
        curOffset = 0;
      }

      $task
        .fetch({
          url: 'https://api.telegram.org/bot' + pToken + '/getUpdates',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            offset: curOffset,
            timeout: 0,
            limit: 20,
            allowed_updates: ['message', 'callback_query'],
          }),
          opts: { redirection: true },
        })
        .then(function (resp) {
          var upd = { ok: false, result: [] };
          try {
            upd = resp.body ? JSON.parse(resp.body) : upd;
          } catch (e) {
            /* 保持默认 */
          }

          if (!upd.ok) {
            $done({ status: 'HTTP/1.1 200 OK', headers: JSON_HEADERS, body: JSON.stringify(upd) });
            return;
          }

          var updates = Array.isArray(upd.result) ? upd.result : [];
          var items = [];
          var maxId = curOffset;

          for (var i = 0; i < updates.length; i++) {
            var u = updates[i];
            if (u.update_id >= maxId) maxId = u.update_id + 1;

            if (u.message) {
              var m = u.message;
              items.push({
                kind: 'message',
                update_id: u.update_id,
                message_id: m.message_id,
                chat_id: m.chat ? m.chat.id : null,
                chat_title: m.chat ? (m.chat.title || '') : '',
                from_name: m.from ? (m.from.first_name || m.from.username || '未知') : '未知',
                date: m.date,
                text: m.text || '',
                replied: false,
              });
            } else if (u.callback_query) {
              var cq = u.callback_query;
              items.push({
                kind: 'callback',
                update_id: u.update_id,
                cb_id: cq.id,
                chat_id: cq.message ? (cq.message.chat ? cq.message.chat.id : null) : null,
                message_id: cq.message ? cq.message.message_id : null,
                from_name: cq.from ? (cq.from.first_name || cq.from.username || '未知') : '未知',
                date: cq.message ? cq.message.date : 0,
                text: cq.data || '',
                replied: false,
              });
            }
          }

          if (maxId > curOffset) {
            try {
              $prefs.setValueForKey(String(maxId), 'tgbot_offset');
            } catch (e) {
              /* 忽略 */
            }
          }

          function finish() {
            $done({
              status: 'HTTP/1.1 200 OK',
              headers: JSON_HEADERS,
              body: JSON.stringify({ ok: true, items: items, offset: maxId }),
            });
          }

          if (!pAuto || !pRules.length || !items.length) {
            finish();
            return;
          }

          // ---- 依次处理，串行避免超出脚本时限 ----
          var chain = Promise.resolve();
          items.forEach(function (it) {
            chain = chain.then(function () {
              if (pChat && String(it.chat_id) !== String(pChat)) return;

              if (it.kind === 'callback') {
                // 先 answerCallbackQuery，消除按钮上的加载动画
                var ack = { callback_query_id: it.cb_id };
                var r0 = matchRule(pRules, it.text);
                if (r0 && r0.reply) ack.text = String(r0.reply).slice(0, 200);
                // 无论是否命中都要 ack，否则按钮一直转圈
                it.matched = !!(r0 && r0.reply);
                return tgCall(pToken, 'answerCallbackQuery', ack).then(function () {
                  it.replied = true;
                  if (r0 && r0.reply) {
                    return tgCall(pToken, 'sendMessage', {
                      chat_id: it.chat_id,
                      text: r0.reply,
                    }).then(function () {});
                  }
                });
              }

              var txt = String(it.text || '');
              if (txt.charAt(0) !== '/') return;
              var cmd = txt.split(/\s+/)[0].slice(1);
              var rule = matchRule(pRules, cmd);
              if (!rule || !rule.reply) return;
              return tgCall(pToken, 'sendMessage', {
                chat_id: it.chat_id,
                text: rule.reply,
              }).then(function () {
                it.replied = true;
              });
            });
          });

          chain = chain.catch(function () {
            /* 单条失败不阻断整体 */
          });
          chain.then(finish);
        })
        .catch(function (err) {
          $done({
            status: 'HTTP/1.1 200 OK',
            headers: JSON_HEADERS,
            body: JSON.stringify({
              ok: false,
              description: 'getUpdates 失败：' + (err && err.error ? err.error : '未知'),
            }),
          });
        });
    }
  } else if (path.indexOf(PATH_API) === 0) {
    var tgMethod = path.slice(PATH_API.length).replace(/^\//, '');
    if (!tgMethod) {
      $done({
        status: 'HTTP/1.1 400 Bad Request',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ok: false, description: 'missing method' }),
      });
    } else {
      var reqBody = $request.body || '';
      var useToken = '';
      // 优先从请求体取 token（面板每次请求都会带上）
      try {
        var probe = reqBody ? JSON.parse(reqBody) : {};
        if (probe && typeof probe === 'object' && probe.__token) useToken = probe.__token;
      } catch (e) {
        useToken = '';
      }
      if (!useToken) useToken = DEFAULT_TOKEN || savedToken;

      if (!useToken) {
        $done({
          status: 'HTTP/1.1 401 Unauthorized',
          headers: JSON_HEADERS,
          body: JSON.stringify({ ok: false, error_code: 401, description: 'missing bot token' }),
        });
      } else {
        // 用 JSON 解析后剔除内部 token 字段，避免正则剥离产生悬空逗号
        var payload = '{}';
        try {
          var parsedIn = reqBody ? JSON.parse(reqBody) : {};
          if (parsedIn && typeof parsedIn === 'object') {
            delete parsedIn.__token;
            payload = JSON.stringify(parsedIn);
          }
        } catch (e) {
          // 请求体不是合法 JSON，原样转发让 Telegram 返回明确错误
          payload = reqBody || '{}';
        }
        var tgUrl = 'https://api.telegram.org/bot' + useToken + '/' + tgMethod;

        $task
          .fetch({
            url: tgUrl,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload || '{}',
            opts: { redirection: true },
          })
          .then(function (resp) {
            var parsed;
            try {
              parsed = resp.body ? JSON.parse(resp.body) : { ok: false, description: 'empty response' };
            } catch (e) {
              parsed = { ok: false, description: String(resp.body).slice(0, 200) };
            }
            $done({ status: 'HTTP/1.1 200 OK', headers: JSON_HEADERS, body: JSON.stringify(parsed) });
          })
          .catch(function (err) {
            $done({
              status: 'HTTP/1.1 502 Bad Gateway',
              headers: JSON_HEADERS,
              body: JSON.stringify({
                ok: false,
                error_code: 502,
                description: 'upstream failed: ' + (err && err.error ? err.error : 'unknown'),
              }),
            });
          });
      }
    }
  } else {
    // 面板页面：注入 SNIPDATA（HTML 片段），避免前端再写嵌套 HTML 字符串
    var inject = '<script>window.SNIPDATA=' + JSON.stringify(JSON.stringify(SNIPPETS)) + ';</' + 'script>';
    $done({
      status: 'HTTP/1.1 200 OK',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Connection': 'Close',
      },
      body: PANEL_HTML.replace('<div class=hd>', inject + '<div class=hd>'),
    });
  }
} catch (e) {
  $done({
    status: 'HTTP/1.1 500 Internal Server Error',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      ok: false,
      error_code: 500,
      description: 'script error: ' + (e && e.message ? e.message : String(e)),
    }),
  });
}