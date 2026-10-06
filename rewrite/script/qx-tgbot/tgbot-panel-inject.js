/**
 * tgbot-panel-inject.js — Quantumult X 页面注入脚本
 *
 * 作用：劫持目标站点的 HTML 响应，在页面里注入一个 Telegram Bot 配置面板。
 * 面板功能：token 管理、快捷指令(getMyCommands/setMyCommands)、按钮配置
 *          (InlineKeyboardMarkup 预览)、测试发送消息(sendMessage)。
 *
 * 配置位置：
 *   [rewrite_local]
 *   ^https?://(你指定的域名)/ url script-response-body tgbot-panel-inject.js
 *
 * 依赖：需配套 tgbot-cors.js 提供本地 CORS 代理，否则浏览器无法直连 Telegram。
 */

var INJECT_FLAG = "__QX_TGBOT_PANEL__";

// 外层 HTML 转义（面板内部的 h() 定义在注入的 <script> 里，此处不可用）
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 外层模板拼接处的 h(...) 与面板内部保持同名同义
function h(s) {
  return esc(s);
}

(function () {
  try {
    // 避免重复注入（单页应用 / 软刷新）
    if ($response.body.indexOf(INJECT_FLAG) !== -1) {
      $done({ body: $response.body });
      return;
    }

    var panel = [
      "<div id=" + JSON.stringify(INJECT_FLAG) + ">",
      "<style>",
      "#" + INJECT_FLAG + " *{box-sizing:border-box}",
      ".qxtg-fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));width:52px;height:52px;border-radius:50%;background:#229ED9;color:#fff;border:none;font-size:24px;box-shadow:0 6px 20px rgba(0,0,0,.25);z-index:2147483000;cursor:pointer;display:flex;align-items:center;justify-content:center}",
      ".qxtg-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483001;display:none;align-items:flex-end;justify-content:center}",
      ".qxtg-mask.on{display:flex}",
      ".qxtg-panel{background:#fff;width:100%;max-width:520px;max-height:88vh;border-radius:16px 16px 0 0;display:flex;flex-direction:column;font:14px/1.5 -apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;color:#222;box-shadow:0 -8px 30px rgba(0,0,0,.2)}",
      ".qxtg-hd{padding:14px 16px;border-bottom:1px solid #eee;display:flex;align-items:center;gap:8px;font-weight:600;font-size:16px}",
      ".qxtg-hd .dot{width:8px;height:8px;border-radius:50%;background:#229ED9}",
      ".qxtg-hd .x{margin-left:auto;font-size:22px;color:#999;cursor:pointer;line-height:1;padding:0 4px}",
      ".qxtg-bd{overflow-y:auto;padding:14px 16px;padding-bottom:calc(20px + env(safe-area-inset-bottom));-webkit-overflow-scrolling:touch}",
      ".qxtg-tabs{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}",
      ".qxtg-tab{padding:6px 12px;border-radius:999px;background:#f0f2f5;font-size:13px;cursor:pointer;border:1px solid transparent}",
      ".qxtg-tab.on{background:#229ED9;color:#fff}",
      ".qxtg-f{margin-bottom:12px}",
      ".qxtg-f label{display:block;font-size:12px;color:#666;margin-bottom:4px}",
      ".qxtg-f input,.qxtg-f textarea,.qxtg-f select{width:100%;padding:9px 10px;border:1px solid #ddd;border-radius:8px;font-size:14px;font-family:inherit;background:#fff;color:#222}",
      ".qxtg-f textarea{min-height:70px;resize:vertical}",
      ".qxtg-row{display:flex;gap:8px}",
      ".qxtg-row>*{flex:1}",
      ".qxtg-btn{padding:10px 12px;border:none;border-radius:8px;background:#229ED9;color:#fff;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit}",
      ".qxtg-btn.sec{background:#f0f2f5;color:#333}",
      ".qxtg-btn:active{opacity:.75}",
      ".qxtg-out{background:#1f2430;color:#c9d4e5;border-radius:8px;padding:10px;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-all;max-height:200px;overflow:auto;margin-top:8px}",
      ".qxtg-kb{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}",
      ".qxtg-kb .kb-btn{padding:7px 12px;border-radius:6px;background:#e8f4fd;color:#1c7db5;font-size:13px;border:1px solid #bfe0f5}",
      ".qxtg-kb .kb-btn.w{width:100%;text-align:center}",
      ".qxtg-hint{font-size:12px;color:#888;line-height:1.6;background:#f7f9fb;border-radius:8px;padding:9px 10px;margin-bottom:12px}",
      ".qxtg-cmds{display:flex;gap:6px;margin-bottom:6px;align-items:center}",
      ".qxtg-cmds input{flex:1}",
      ".qxtg-cmds .del{color:#d9534f;font-size:18px;cursor:pointer;padding:0 6px}",
      ".qxtg-row2{display:flex;gap:6px}",
      ".qxtg-row2>*{flex:1}",
      "</style>",
      "<button class=qxtg-fab id=qxtgFab title='TGBot 配置'>⚙</button>",
      "<div class=qxtg-mask id=qxtgMask>",
      "<div class=qxtg-panel>",
      "<div class=qxtg-hd><span class=dot></span>TGBot 配置<span class=x id=qxtgX>×</span></div>",
      "<div class=qxtg-bd>",
      "<div class=qxtg-tabs>",
      "<div class='qxtg-tab on' data-t=basic>连接</div>",
      "<div class='qxtg-tab' data-t=cmd>快捷指令</div>",
      "<div class='qxtg-tab' data-t=kb>消息按钮</div>",
      "<div class='qxtg-tab' data-t=send>测试发送</div>",
      "</div>",
      "<div id=qxtgPane></div>",
      "</div></div></div>",
      "<script>",
      "(function(){",
      "var TOKEN_KEY='qxtg_token', CHAT_KEY='qxtg_chat';",
      "var LS=function(k,d){try{return localStorage.getItem(k)||d}catch(e){return d}};",
      "var SS=function(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}};",
      "var token=LS(TOKEN_KEY,''), chat=LS(CHAT_KEY,'');",
      "var cmds=[],kbRows=[[]];",
      "try{cmds=JSON.parse(LS('qxtg_cmds','[]'))||[]}catch(e){cmds=[]}",
      "if(!Array.isArray(cmds))cmds=[];",
      "try{kbRows=JSON.parse(LS('qxtg_kb','[[]]'))||[[]]}catch(e){kbRows=[[]]}",
      "if(!Array.isArray(kbRows)||!kbRows.length)kbRows=[[]];",
      "var P=function(){return api('https://api.telegram.org/bot'+token+'/'+m,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b||{})})};",
      "function api(u,o){return fetch(u,o).then(function(r){return r.text().then(function(t){try{return JSON.parse(t)}catch(e){return{ok:false,description:'non-json: '+t.slice(0,200)}}})})}",
      "function save(){try{localStorage.setItem(TOKEN_KEY,token);localStorage.setItem(CHAT_KEY,chat);localStorage.setItem('qxtg_cmds',JSON.stringify(cmds));localStorage.setItem('qxtg_kb',JSON.stringify(kbRows))}catch(e){}}",
      "function h(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}",
      "function out(t){var el=document.getElementById('qxtgOut');if(el){el.textContent=typeof t==='string'?t:JSON.stringify(t,null,2)}}",
      "function toast(m){try{console.log('[TGBot] '+m)}catch(e){}}",
      "function needTok(){if(!token){out('请先在「连接」页填写 Bot Token');return false}return true}",
      "function maskBuild(){return {inline_keyboard:kbRows.map(function(row){return row.filter(function(c){return c&&c.text}).map(function(c){return{text:c.text,callback_data:(c.data||c.text||'').slice(0,64)}})}).filter(function(r){return r.length})}}",
      "var panes={};",
      "panes.basic=function(){",
      "return [",
      "'<div class=qxtg-hint>Token 来自 @BotFather。本面板通过 Quantumult X 本地代理访问 Telegram API，Token 仅存于本机 localStorage。</div>',",
      "'<div class=qxtg-f><label>Bot Token</label><input id=qxtgToken type=password value=\"\" placeholder=\"123456:ABC-DEF...\"></div>',",
      "'<div class=qxtg-f><label>Chat ID（测试发送目标）</label><input id=qxtgChat value=\"\" placeholder=\"123456789 或 @channelusername\"></div>',",
      "'<div class=qxtg-row><button class=qxtg-btn id=qxtgSave>保存</button><button class=qxtg-btn sec id=qxtgMe>验证连接 getMe</button></div>',",
      "'<div class=qxtg-out id=qxtgOut></div>'",
      "].join('');",
      "};",
      "panes.cmd=function(){",
      "var rows=cmds.map(function(c,i){return \"<div class=qxtg-cmds><input class='qxtgCc' data-i='\"+i+\"' value='\"+h(c.command)+\"' placeholder='命令'><input class=qxtgCd' data-i='\"+i+\"' value='\"+h(c.description)+\"' placeholder='描述'><span class=del data-i='\"+i+\"' title=删除>×</span></div>\"}).join('');",
      "return [",
      "'<div class=qxtg-hint>快捷指令即 Telegram 输入框「/」弹出的命令列表，通过 setMyCommands 设置。</div>',",
      "'<div id=qxtgCmdList>'+rows+'</div>',",
      "'<div class=qxtg-row style=\"margin-bottom:12px\"><button class=qxtg-btn sec id=qxtgAddCmd>+ 添加一条</button></div>',",
      "'<div class=qxtg-row style=\"margin-bottom:12px\"><button class=qxtg-btn id=qxtgSetCmds>保存到 Bot</button><button class=qxtg-btn sec id=qxtgGetCmds>读取现有</button></div>',",
      "'<button class=qxtg-btn sec style=\"width:100%\" id=qxtgDelCmds>清除全部指令</button>',",
      "'<div class=qxtg-out id=qxtgOut></div>'",
      "].join('');",
      "};",
      "panes.kb=function(){",
      "var rows=kbRows.map(function(row,ri){var bs=row.map(function(c,ci){return \"<span class='kb-btn\"+(row.length===1?' w':'')+\"' data-r='\"+ri+\"' data-c='\"+ci+\"' data-t='\"+h(c.text)+\"' data-d='\"+h(c.data||'')+\"'>\"+h(c.text||'(空)')+\"</span>\"}).join('');",
      "return \"<div style='margin-bottom:12px'><div style='font-size:12px;color:#666;margin-bottom:4px'>第 \"+(ri+1)+\" 行</div><div class=qxtg-kb>\"+bs+\"</div></div>\"}).join('');",
      "return [",
      "'<div class=qxtg-hint>点击按钮可编辑文字与 callback_data。行内只有一个按钮时显示为整行宽（与 Telegram 展示一致）。</div>',",
      "'<div id=qxtgKbBox>'+rows+'</div>',",
      "'<div class=qxtg-row2 style=\"margin-bottom:12px\"><button class=qxtg-btn sec id=qxtgAddRow>+ 加一行</button><button class=qxtg-btn sec id=qxtgAddKb>+ 加按钮</button></div>',",
      "'<div class=qxtg-row><button class=qxtg-btn id=qxtgKbSave>保存布局</button><button class=qxtg-btn sec id=qxtgKbReset>重置</button></div>',",
      "'<div class=qxtg-out id=qxtgOut></div>'",
      "].join('');",
      "};",
      "panes.send=function(){",
      "var mk=maskBuild();",
      "return [",
      "'<div class=qxtg-f><label>文本（支持 /start 等命令，会以 bot 身份发出）</label><textarea id=qxtgText placeholder=\"输入测试消息\">'+h(SS('qxtg_text','/start'))+'</textarea></div>',",
      "'<div class=qxtg-f><label>解析模式</label><select id=qxtgParse><option value=\"\">默认</option><option value=\"MarkdownV2\">MarkdownV2</option><option value=\"HTML\">HTML</option></select></div>',",
      "'<div class=qxtg-row style=\"margin-bottom:12px\"><button class=qxtg-btn id=qxtgSend>发送</button><button class=qxtg-btn sec id=qxtgSendKb>带按钮发送</button></div>',",
      "'<div style=\"font-size:12px;color:#666;margin-bottom:4px\">当前按钮预览</div><div class=qxtg-kb>'+",
      "(mk.inline_keyboard.length?mk.inline_keyboard.map(function(r){return r.map(function(b){return '<span class=' + String.fromCharCode(34) + 'kb-btn'+(r.length===1?' w':'')+String.fromCharCode(34)+'>'+h(b.text)+'</span>'}).join('')}).join('<div style=' + String.fromCharCode(34) + 'width:100%;height:4px' + String.fromCharCode(34) + '></div>'):'<span style=' + String.fromCharCode(34) + 'font-size:12px;color:#aaa' + String.fromCharCode(34) + '>（无）</span>')+",
      "'</div><div class=qxtg-out id=qxtgOut></div>'",
      "].join('');",
      "};",
      "var cur='basic';",
      "function render(){",
      "document.getElementById('qxtgPane').innerHTML=panes[cur]();",
      "if(cur==='basic'){var t=document.getElementById('qxtgToken'),c=document.getElementById('qxtgChat');if(t)t.value=token;if(c)c.value=chat;}",
      "bind();",
      "}",
      "function bind(){",
      "var g=function(i){return document.getElementById(i)};",
      "if(cur==='basic'){",
      "if(g('qxtgSave'))g('qxtgSave').onclick=function(){token=(g('qxtgToken').value||'').trim();chat=(g('qxtgChat').value||'').trim();save();out('已保存到本机');};",
      "if(g('qxtgMe'))g('qxtgMe').onclick=function(){token=(g('qxtgToken').value||'').trim();save();if(!needTok())return;out('请求中...');P('getMe').then(function(r){out(r)})};",
      "}",
      "if(cur==='cmd'){",
      "if(g('qxtgAddCmd'))g('qxtgAddCmd').onclick=function(){cmds.push({command:'',description:''});render()};",
      "Array.prototype.forEach.call(document.querySelectorAll('.qxtg-cmds .del'),function(el){el.onclick=function(){cmds.splice(+el.getAttribute('data-i'),1);render()}});",
      "Array.prototype.forEach.call(document.querySelectorAll('.qxtgCc'),function(el){el.oninput=function(){cmds[+el.getAttribute('data-i')].command=el.value}});",
      "Array.prototype.forEach.call(document.querySelectorAll('.qxtgCd'),function(el){el.oninput=function(){cmds[+el.getAttribute('data-i')].description=el.value}});",
      "if(g('qxtgSetCmds'))g('qxtgSetCmds').onclick=function(){",
      "if(!needTok())return;",
      "var list=cmds.filter(function(c){return c&&c.command&&c.command.trim()}).map(function(c){var cmd=c.command.trim();if(cmd.charAt(0)==='/')cmd=cmd.slice(1);return{command:cmd.slice(0,32),description:(c.description||'').trim().slice(0,256)}});",
      "if(!list.length){out('没有有效指令');return}",
      "save();out('保存中...');P('setMyCommands',{commands:list}).then(function(r){out(r)})",
      "};",
      "if(g('qxtgGetCmds'))g('qxtgGetCmds').onclick=function(){if(!needTok())return;out('读取中...');P('getMyCommands').then(function(r){",
      "if(r&&r.ok&&Array.isArray(r.result)){cmds=r.result.map(function(x){return{command:x.command,description:x.description}});render();out('已载入 '+cmds.length+' 条')}else out(r)}",
      ")};",
      "if(g('qxtgDelCmds'))g('qxtgDelCmds').onclick=function(){if(!needTok())return;out('清除中...');P('deleteMyCommands').then(function(r){cmds=[];save();render();out(r)})};",
      "}",
      "if(cur==='kb'){",
      "if(g('qxtgAddRow'))g('qxtgAddRow').onclick=function(){kbRows.push([]);render()};",
      "if(g('qxtgAddKb'))g('qxtgAddKb').onclick=function(){if(!kbRows.length)kbRows=[[]];kbRows[kbRows.length-1].push({text:'按钮',data:''});render()};",
      "Array.prototype.forEach.call(document.querySelectorAll('.kb-btn[data-r]'),function(el){el.onclick=function(){",
      "var t=prompt('按钮文字',el.getAttribute('data-t')||'');if(t===null)return;",
      "var d=prompt('callback_data（回调数据，≤64字节）',el.getAttribute('data-d')||'');if(d===null)d=el.getAttribute('data-d')||'';",
      "kbRows[+el.getAttribute('data-r')][+el.getAttribute('data-c')]={text:t,data:d};render()",
      "}});",
      "if(g('qxtgKbSave'))g('qxtgKbSave').onclick=function(){save();out('布局已保存（切到「测试发送」可预览并发送）')};",
      "if(g('qxtgKbReset'))g('qxtgKbReset').onclick=function(){kbRows=[[]];save();render();out('已重置')};",
      "}",
      "if(cur==='send'){",
      "if(g('qxtgSend'))g('qxtgSend').onclick=function(){doSend(false)};",
      "if(g('qxtgSendKb'))g('qxtgSendKb').onclick=function(){doSend(true)};",
      "}",
      "}",
      "function doSend(withKb){",
      "if(!needTok())return;",
      "if(!chat){out('请先在「连接」页填写 Chat ID');return}",
      "var txt=(g('qxtgText').value||'').trim();if(!txt){out('消息内容为空');return}",
      "var ps=g('qxtgParse').value;",
      "var body={chat_id:chat,text:txt};",
      "if(ps)body.parse_mode=ps;",
      "if(withKb){var mk=maskBuild();if(mk.inline_keyboard.length)body.reply_markup=mk;else out('提示：当前没有按钮，将以纯文本发送')}",
      "try{SS('qxtg_text',txt)}catch(e){}",
      "out('发送中...');",
      "P('sendMessage',body).then(function(r){out(r);if(r&&r.ok)toast('sent')})",
      "}",
      "Array.prototype.forEach.call(document.querySelectorAll('.qxtg-tab'),function(el){el.onclick=function(){",
      "Array.prototype.forEach.call(document.querySelectorAll('.qxtg-tab'),function(x){x.classList.remove('on')});",
      "el.classList.add('on');cur=el.getAttribute('data-t');render()",
      "}});",
      "var fab=document.getElementById('qxtgFab'),mask=document.getElementById('qxtgMask');",
      "fab.onclick=function(){mask.classList.add('on');render()};",
      "document.getElementById('qxtgX').onclick=function(){mask.classList.remove('on')};",
      "mask.onclick=function(e){if(e.target===mask)mask.classList.remove('on')};",
      "})();",
      "<\/script>",
      "</div>",
    ].join("\n");

    var body = $response.body;
    var anchor = body.lastIndexOf("</body>");
    if (anchor === -1) anchor = body.lastIndexOf("</html>");
    if (anchor === -1) {
      body = body + panel;
    } else {
      body = body.slice(0, anchor) + panel + body.slice(anchor);
    }

    $done({ body: body });
  } catch (e) {
    // 注入失败就原样返回，绝不破坏原页面
    $done({ body: $response.body });
  }
})();