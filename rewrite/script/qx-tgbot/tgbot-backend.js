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

var JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Connection': 'Close',
};

// ============================================================
// 面板 HTML
// ============================================================
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
'.kbb{display:flex;flex-wrap:wrap;gap:6px;max-width:100%}',
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
'.tabs{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:4px;gap:4px;overflow-x:auto;box-shadow:0 1px 0 rgba(255,255,255,.03) inset}',
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

'.sg{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}',
'.sg button{flex:0 0 auto;padding:5px 11px;border-radius:999px;border:1px solid #e0e4e8;background:#fff;font-size:12px;cursor:pointer}',
'.sg button.on{background:#229ED9;color:#fff;border-color:#229ED9}',
'</style></head><body>',
'<div class=hd><h1>TGBot 配置</h1><span class=st id=st>本机服务</span></div>',
'<div class=wrap>',
'<div class=tabs>',
'<div class="tab on" data-t=basic>连接</div>',
'<div class=tab data-t=cmd>快捷指令</div>',
'<div class=tab data-t=kb>消息按钮</div>',
'<div class=tab data-t=send>测试发送</div>',
'<div class=tab data-t=info>Bot 信息</div>',
'</div>',
'<div id=pane></div>',
'</div>',
'<div class=toast id=toast></div>',
'<script>',
'(function(){',
'var BASE="/tgbot/v1";',
'var token="", cmds=[], kbRows=[[]], botInfo=null, lastMsgId=null;',
'try{token=localStorage.getItem("tg_token")||""}catch(e){}',
'try{cmds=JSON.parse(localStorage.getItem("tg_cmds")||"[]")||[];if(!Array.isArray(cmds))cmds=[]}catch(e){cmds=[]}',
'try{kbRows=JSON.parse(localStorage.getItem("tg_kb")||"[[]]")||[[]];if(!Array.isArray(kbRows)||!kbRows.length)kbRows=[[]]}catch(e){kbRows=[[]]}',
'function $(id){return document.getElementById(id)}',
'function save(){try{localStorage.setItem("tg_token",token);localStorage.setItem("tg_cmds",JSON.stringify(cmds));localStorage.setItem("tg_kb",JSON.stringify(kbRows))}catch(e){}}',
'function h(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}',
'function q(s){return String(s==null?"":s).replace(/"/g,"&quot;")}',
// gt: 在外层单引号串中写内层双引号 HTML 时的辅助（还原被转义的引号）
'function gt(s){return String(s).replace(/\\\\"/g,String.fromCharCode(34))}',
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
'    var bs=row.map(function(c,ci){',
'      var cls = row.length===1 ? "kb w" : "kb";',
'      return \'<span class="\'+cls+\'" data-r="\'+ri+\'" data-c="\'+ci+\'">\'+h(c.text||"(空)")+"</span>";',
'    }).join("");',
'    var head=gt("<div class=kbrow><div class=kblabel><span class=kbtxt>第 "+(ri+1)+" 行</span><button class=\\"btn sm sec\\" data-delrow=\\""+ri+"\\" style=\\"flex:0 0 auto\\">删除行</button></div>");',
'    var box=gt("<div class=kbb>"+bs+"</div></div>");',
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
'    \'<div class=row><button class=btn id=send>发送</button><button class="btn sec" id=sendkb>带按钮发送</button></div>\',',
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
'  if(cur==="kb"){',
'    $("addrow").onclick=function(){kbRows.push([]);save();render()};',
'    $("addkb").onclick=function(){',
'      if(!kbRows.length)kbRows=[[]];',
'      kbRows[kbRows.length-1].push({text:"按钮",data:""});',
'      save();',
'      render();',
'    };',
'    var kb=document.querySelectorAll(".kb[data-r]"), n;',
'    for(n=0;n<kb.length;n++){',
'      kb[n].onclick=function(){',
'        var r=+this.getAttribute("data-r"), c=+this.getAttribute("data-c");',
'        var cur2=this.textContent==="(空)"?"":this.textContent;',
'        var t=prompt("按钮文字",cur2); if(t===null)return;',
'        var d=prompt("callback_data（回调数据，≤64 字节）", kbRows[r][c].data||"");',
'        if(d===null)d=kbRows[r][c].data||"";',
'        kbRows[r][c]={text:t,data:d};',
'        save(); render();',
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
    $done({
      status: 'HTTP/1.1 200 OK',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Connection': 'Close',
      },
      body: PANEL_HTML,
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