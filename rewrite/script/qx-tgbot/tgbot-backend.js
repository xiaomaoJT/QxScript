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
'.card{background:#fff;border-radius:12px;padding:14px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,.06);max-width:100%}',
'.f{margin-bottom:12px}',
'.f:last-child{margin-bottom:0}',
'.f label{display:block;font-size:12px;color:#666;margin-bottom:5px}',
'.f input,.f textarea,.f select{width:100%;max-width:100%;min-width:0;padding:10px;border:1px solid #dcdfe4;border-radius:8px;font-size:16px;font-family:inherit;background:#fff;color:#222}',
'.f textarea{min-height:80px;resize:vertical}',
'.f input:focus,.f textarea:focus,.f select:focus{outline:none;border-color:#229ED9}',
'.row{display:flex;gap:8px;width:100%;max-width:100%}',
'.row>*{flex:1 1 0;min-width:0}',
'.btn{padding:11px 12px;border:none;border-radius:8px;background:#229ED9;color:#fff;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit}',
'.btn.sec{background:#eef0f3;color:#333}',
'.btn:active{opacity:.75}',
'.hint{font-size:12px;color:#8a9199;line-height:1.6;background:#f7f9fb;border-radius:8px;padding:10px;margin-bottom:12px;word-break:break-word;overflow-wrap:anywhere}',
'.out{background:#1f2430;color:#c9d4e5;border-radius:8px;padding:10px;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-all;max-height:220px;overflow:auto;margin-top:10px}',
'.out:empty{display:none}',
'.kbrow{margin-bottom:10px;max-width:100%}',
'.kblabel{font-size:12px;color:#666;margin-bottom:5px}',
'.kbb{display:flex;flex-wrap:wrap;gap:6px;max-width:100%}',
'.kb{padding:8px 12px;border-radius:6px;background:#e8f4fd;color:#1c7db5;font-size:13px;border:1px solid #bfe0f5;cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
'.kb.w{width:100%;text-align:center}',
'.cmdrow{display:flex;gap:6px;margin-bottom:6px;align-items:center;max-width:100%}',
'.cmdrow input{flex:1 1 0;min-width:0}',
'.cmdrow .del{color:#d9534f;font-size:20px;cursor:pointer;padding:0 8px;flex:0 0 auto}',
'.empty{font-size:12px;color:#aaa;padding:4px 0}',
'.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(24px + env(safe-area-inset-bottom));background:rgba(0,0,0,.85);color:#fff;padding:9px 16px;border-radius:8px;font-size:13px;opacity:0;pointer-events:none;transition:opacity .2s;z-index:99}',
'.toast.on{opacity:1}',
'</style></head><body>',
'<div class=hd><h1>TGBot 配置</h1><span class=st id=st>本机服务</span></div>',
'<div class=wrap>',
'<div class=tabs>',
'<div class="tab on" data-t=basic>连接</div>',
'<div class=tab data-t=cmd>快捷指令</div>',
'<div class=tab data-t=kb>消息按钮</div>',
'<div class=tab data-t=send>测试发送</div>',
'</div>',
'<div id=pane></div>',
'</div>',
'<div class=toast id=toast></div>',
'<script>',
'(function(){',
'var BASE="/tgbot/v1";',
'var token="", cmds=[], kbRows=[[]];',
'try{token=localStorage.getItem("tg_token")||""}catch(e){}',
'try{cmds=JSON.parse(localStorage.getItem("tg_cmds")||"[]")||[];if(!Array.isArray(cmds))cmds=[]}catch(e){cmds=[]}',
'try{kbRows=JSON.parse(localStorage.getItem("tg_kb")||"[[]]")||[[]];if(!Array.isArray(kbRows)||!kbRows.length)kbRows=[[]]}catch(e){kbRows=[[]]}',
'function $(id){return document.getElementById(id)}',
'function save(){try{localStorage.setItem("tg_token",token);localStorage.setItem("tg_cmds",JSON.stringify(cmds));localStorage.setItem("tg_kb",JSON.stringify(kbRows))}catch(e){}}',
'function h(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}',
'function q(s){return String(s==null?"":s).replace(/"/g,"&quot;")}',
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
'panes.basic=function(){',
'  return [',
'    \'<div class=card><div class=hint>面板由 Quantumult X 本机服务提供（同源，无需域名与证书）。Bot Token 只保存在本机，不上传任何第三方服务器。</div>\',',
'    \'<div class=f><label>Bot Token（来自 @BotFather）</label><input id=tok type=password value="\'+q(h(token))+\'" placeholder="123456:ABC-DEF..."></div>\',',
'    \'<div class=f><label>Chat ID（测试发送目标）</label><input id=chat value="\'+q(localStorage.getItem("tg_chat")||"")+\'" placeholder="123456789 或 @channelusername"></div>\',',
'    \'<div class=row><button class=btn id=save>保存</button><button class="btn sec" id=me>验证连接</button></div></div>\'',
'  ].join("");',
'};',
'panes.cmd=function(){',
'  var rows=cmds.map(function(c,i){',
'    return [',
'      \'<div class=cmdrow>\',',
'      \'<input class=cc data-i="\'+i+\'" value="\'+q(h(c.command))+\'" placeholder="命令 如 start">\',',
'      \'<input class=cd data-i="\'+i+\'" value="\'+q(h(c.description))+\'" placeholder="描述">\',',
'      \'<span class=del data-i="\'+i+\'">×</span></div>\'',
'    ].join("");',
'  }).join("");',
'  return [',
'    \'<div class=card><div class=hint>快捷指令即 Telegram 输入框输入「/」时弹出的命令列表，通过 setMyCommands 写入。命令无需以 / 开头。</div>\',',
'    rows ? "" : \'<div class=empty>暂无指令，点下方按钮添加</div>\',',
'    \'<div class=row style="margin-top:10px"><button class="btn sec" id=add>+ 添加一条</button></div>\',',
'    \'<div class=row style="margin-top:8px"><button class=btn id=set>保存到 Bot</button><button class="btn sec" id=get>读取现有</button></div>\',',
'    \'<button class="btn sec" style="width:100%;margin-top:8px" id=del>清除全部指令</button></div>\',',
'    \'<div class=out id=out></div>\'',
'  ].join("");',
'};',
'panes.kb=function(){',
'  var rows=kbRows.map(function(row,ri){',
'    var bs=row.map(function(c,ci){',
'      var cls = row.length===1 ? "kb w" : "kb";',
'      return \'<span class="\'+cls+\'" data-r="\'+ri+\'" data-c="\'+ci+\'">\'+h(c.text||"(空)")+\'</span>\';',
'    }).join("");',
'    return \'<div class=kbrow><div class=kblabel>第 \'+(ri+1)+\' 行</div><div class=kbb>\'+bs+\'</div></div>\';',
'  }).join("");',
'  return [',
'    \'<div class=card><div class=hint>点击按钮可编辑文字与 callback_data。行内只有一个按钮时自动占满整行，与 Telegram 实际展示一致。</div>\',',
'    \'<div id=kbbox>\'+rows+\'</div>\',',
'    \'<div class=row style="margin-top:10px"><button class="btn sec" id=addrow>+ 加一行</button><button class="btn sec" id=addkb>+ 加按钮</button></div>\',',
'    \'<div class=row style="margin-top:8px"><button class=btn id=savelayout>保存布局</button><button class="btn sec" id=resetkb>重置</button></div></div>\',',
'    \'<div class=out id=out></div>\'',
'  ].join("");',
'};',
'panes.send=function(){',
'  var mk=mask();',
'  var prev=mk.inline_keyboard.length ? mk.inline_keyboard.map(function(r){',
'    return r.map(function(b){',
'      var cls = r.length===1 ? "kb w" : "kb";',
'      return \'<span class="\'+cls+\'">\'+h(b.text)+\'</span>\';',
'    }).join("");',
'  }).join(\'<div style="height:4px"></div>\') : \'<span class=empty>（无）</span>\';',
'  return [',
'    \'<div class=card>\',',
'    \'<div class=f><label>消息内容（会以 Bot 身份发送）</label><textarea id=txt placeholder="输入测试消息，如 /start">\'+h(localStorage.getItem("tg_text")||"/start")+\'</textarea></div>\',',
'    \'<div class=f><label>解析模式</label><select id=pm><option value="">默认</option><option value=MarkdownV2>MarkdownV2</option><option value=HTML>HTML</option></select></div>\',',
'    \'<div class=row><button class=btn id=send>发送</button><button class="btn sec" id=sendkb>带按钮发送</button></div></div>\',',
'    \'<div class=card><div class=kblabel>按钮预览</div><div class=kbb>\'+prev+\'</div></div>\',',
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
'      toast("已保存");',
'      out("已保存到本机");',
'      fetch(BASE+"/save",{',
'        method:"POST",',
'        headers:{"Content-Type":"application/json"},',
'        body:JSON.stringify({token:token})',
'      }).catch(function(){});',
'    };',
'    $("me").onclick=function(){',
'      token=$("tok").value.trim(); save();',
'      if(!needTok())return;',
'      out("请求中…");',
'      api("getMe").then(function(r){out(r)});',
'    };',
'  }',
'  if(cur==="cmd"){',
'    $("add").onclick=function(){cmds.push({command:"",description:""});render()};',
'    var ds=document.querySelectorAll(".cmdrow .del"), i;',
'    for(i=0;i<ds.length;i++){',
'      ds[i].onclick=function(){cmds.splice(+this.getAttribute("data-i"),1);render()};',
'    }',
'    var cs=document.querySelectorAll(".cc"), j;',
'    for(j=0;j<cs.length;j++){',
'      cs[j].oninput=function(){cmds[+this.getAttribute("data-i")].command=this.value};',
'    }',
'    var cds=document.querySelectorAll(".cd"), k;',
'    for(k=0;k<cds.length;k++){',
'      cds[k].oninput=function(){cmds[+this.getAttribute("data-i")].description=this.value};',
'    }',
'    $("set").onclick=function(){',
'      if(!needTok())return;',
'      var list=cmds.filter(function(c){return c && c.command && c.command.trim()}).map(function(c){',
'        var n=c.command.trim();',
'        if(n.charAt(0)==="/")n=n.slice(1);',
'        return{command:n.slice(0,32),description:String(c.description||"").trim().slice(0,256)};',
'      });',
'      if(!list.length){toast("没有有效指令");return}',
'      save(); out("保存中…");',
'      api("setMyCommands",{commands:list}).then(function(r){out(r);if(r&&r.ok)toast("已保存 "+list.length+" 条")});',
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
'      out("清除中…");',
'      api("deleteMyCommands").then(function(){cmds=[];save();render();toast("已清除")});',
'    };',
'  }',
'  if(cur==="kb"){',
'    $("addrow").onclick=function(){kbRows.push([]);render()};',
'    $("addkb").onclick=function(){if(!kbRows.length)kbRows=[[]];kbRows[kbRows.length-1].push({text:"按钮",data:""});render()};',
'    var kb=document.querySelectorAll(".kb[data-r]"), n;',
'    for(n=0;n<kb.length;n++){',
'      kb[n].onclick=function(){',
'        var cur2=this.textContent==="(空)"?"":this.textContent;',
'        var t=prompt("按钮文字",cur2); if(t===null)return;',
'        var d=prompt("callback_data（回调数据，≤64字节）","");',
'        kbRows[+this.getAttribute("data-r")][+this.getAttribute("data-c")]={text:t,data:d||""};',
'        render();',
'      };',
'    }',
'    $("savelayout").onclick=function(){save();toast("布局已保存")};',
'    $("resetkb").onclick=function(){kbRows=[[]];save();render();toast("已重置")};',
'  }',
'  if(cur==="send"){',
'    $("send").onclick=function(){doSend(false)};',
'    $("sendkb").onclick=function(){doSend(true)};',
'  }',
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
'  if(withKb){',
'    var m=mask();',
'    if(m.inline_keyboard.length)b.reply_markup=m;',
'    else toast("当前没有按钮，将纯文本发送");',
'  }',
'  localStorage.setItem("tg_text",txt);',
'  out("发送中…");',
'  api("sendMessage",b).then(function(r){out(r);if(r&&r.ok)toast("已发送")});',
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