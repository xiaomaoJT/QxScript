/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-01-17
 *
 * 
\w\p\s\v\i\p

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置vip到期时间
【一二此步骤可省略，会员到期时间永远定格明天，失效请重开app】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWps.js

********************************

[mitm]
hostname = account.wps.cn,vip.wps.cn

[rewrite_local]
https:\/\/account\.wps\.cn\/api\/users\/(.+)\/overview url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWps.js
https:\/\/vip\.wps\.cn\/userinfo url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWps.js

 ***************/


function ENV(){const e="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:"undefined"!=typeof $task,isLoon:"undefined"!=typeof $loon,isSurge:"undefined"!=typeof $httpClient&&"undefined"==typeof $loon,isBrowser:"undefined"!=typeof document,isNode:"function"==typeof require&&!e,isJSBox:e,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule,}}function HTTP(e={baseURL:""}){function t(t,a){a="string"==typeof a?{url:a}:a;const h=e.baseURL;h&&!d.test(a.url||"")&&(a.url=h?h+a.url:a.url),a.body&&a.headers&&!a.headers["Content-Type"]&&(a.headers["Content-Type"]="application/x-www-form-urlencoded"),(a={...e,...a});const c=a.timeout,l={onRequest:()=>{},onResponse:(e)=>e,onTimeout:()=>{},...a.events,};let f,y;if((l.onRequest(t,a),s))f=$task.fetch({method:t,...a});else if(o||n)f=new Promise((e,s)=>{$httpClient[t.toLowerCase()](a,(t,o,n)=>{t?s(t):e({statusCode:o.status||o.statusCode,headers:o.headers,body:n,})})});else if(r){const e=require("got"),s=require("iconv-lite");f=new Promise((o,n)=>{e[t.toLowerCase()](a).then((e)=>o({statusCode:e.statusCode,headers:e.headers,body:s.decode(e.rawBody,"utf-8"),})).catch(n)})}else if(i){const e=new Request(a.url);(e.method=t),(e.headers=a.headers),(e.body=a.body),(f=new Promise((t,s)=>{e.loadString().then((s)=>{t({statusCode:e.response.statusCode,headers:e.response.headers,body:s,})}).catch((e)=>s(e))}))}else u&&(f=new Promise((e,s)=>{fetch(a.url,{method:t,headers:a.headers,body:a.body}).then((e)=>e.json()).then((t)=>e({statusCode:t.status,headers:t.headers,body:t.data})).catch(s)}));const p=c?new Promise((e,s)=>{y=setTimeout(()=>(l.onTimeout(),s(`${t}URL:${a.url}exceeds the timeout ${c}ms`)),c)}):null;return(p?Promise.race([p,f]).then((e)=>(clearTimeout(y),e)):f).then((e)=>l.onResponse(e))}const{isQX:s,isLoon:o,isSurge:n,isScriptable:i,isNode:r,isBrowser:u,}=ENV(),a=["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"],d=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,h={};return a.forEach((e)=>(h[e.toLowerCase()]=(s)=>t(e,s))),h}function API(e="untitled",t=!1){const{isQX:s,isLoon:o,isSurge:n,isNode:i,isJSBox:r,isScriptable:u,}=ENV();return new(class{constructor(e,t){(this.name=e),(this.debug=t),(this.http=HTTP()),(this.env=ENV()),(this.node=(()=>{if(i){const e=require("fs");return{fs:e}}return null})()),this.initCache();const s=(e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)});Promise.prototype.delay=function(e){return this.then(function(t){return s(e,t)})}}initCache(){if((s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(o||n)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),i)){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},(e)=>console.log(e)),(this.root={}),(e=`${this.name}.json`),this.node.fs.existsSync(e)?(this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`))):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},(e)=>console.log(e)),(this.cache={}))}}persistCache(){const e=JSON.stringify(this.cache,null,2);s&&$prefs.setValueForKey(e,this.name),(o||n)&&$persistentStore.write(e,this.name),i&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},(e)=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root,null,2),{flag:"w"},(e)=>console.log(e)))}write(e,t){if((this.log(`SET ${t}`),-1!==t.indexOf("#"))){if(((t=t.substr(1)),n||o))return $persistentStore.write(e,t);if(s)return $prefs.setValueForKey(e,t);i&&(this.root[t]=e)}else this.cache[t]=e;this.persistCache()}read(e){return(this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:((e=e.substr(1)),n||o?$persistentStore.read(e):s?$prefs.valueForKey(e):i?this.root[e]:void 0))}delete(e){if((this.log(`DELETE ${e}`),-1!==e.indexOf("#"))){if(((e=e.substr(1)),n||o))return $persistentStore.write(null,e);if(s)return $prefs.removeValueForKey(e);i&&delete this.root[e]}else delete this.cache[e];this.persistCache()}notify(e,t="",a="",d={}){const h=d["open-url"],c=d["media-url"];if((s&&$notify(e,t,a,d),n&&$notification.post(e,t,a+`${c?"\n多媒体:"+c:""}`,{url:h,}),o)){let s={};h&&(s.openUrl=h),c&&(s.mediaUrl=c),"{}"===JSON.stringify(s)?$notification.post(e,t,a):$notification.post(e,t,a,s)}if(i||u){const s=a+(h?`\n点击跳转:${h}`:"")+(c?`\n多媒体:${c}`:"");if(r){const o=require("push");o.schedule({title:e,body:(t?t+"\n":"")+s})}else console.log(`${e}\n${t}\n${s}\n\n`)}}log(e){this.debug&&console.log(`[${this.name}]LOG:${this.stringify(e)}`)}info(e){console.log(`[${this.name}]INFO:${this.stringify(e)}`)}error(e){console.log(`[${this.name}]ERROR:${this.stringify(e)}`)}wait(e){return new Promise((t)=>setTimeout(t,e))}done(e={}){s||o||n?$done(e):i&&!r&&"undefined"!=typeof $context&&(($context.headers=e.headers),($context.statusCode=e.statusCode),($context.body=e.body))}stringify(e){if("string"==typeof e||e instanceof String)return e;try{return JSON.stringify(e,null,2)}catch(e){return"[object Object]"}}})(e,t)}function getGoneDay(n=0,yearFlag=true){let myDate=new Date();myDate.setDate(myDate.getDate()-n);let month=myDate.getMonth()+1;let day=myDate.getDate();let result=""+(yearFlag?myDate.getFullYear():"")+"/"+(month<10?"0"+month:month)+"/"+(day<10?"0"+day:day);return result}var obj=JSON.parse($response.body);var $XiaoMaoSvip="";var appName=`XiaoMao-WpsVip`;var XiaoMaoSvip="";let XiaoMaoEndTime=null;!(async()=>{await XiaoMaoFunction()})().catch((err)=>{$XiaoMaoSvip.error(err);setTimeout(()=>{$XiaoMaoSvip.done()},3000)}).finally(()=>{console.log(appName+"设置成功");setTimeout(()=>{$XiaoMaoSvip.done()},5000)});function XiaoMaoFunction(){$XiaoMaoSvip=API("XiaoMao");if($XiaoMaoSvip.read("WpsVipYear")&&$XiaoMaoSvip.read("WpsVipMonth")&&$XiaoMaoSvip.read("WpsVipDay")){SvipDate=new Date($XiaoMaoSvip.read("WpsVipYear")+"/"+$XiaoMaoSvip.read("WpsVipMonth")+"/"+$XiaoMaoSvip.read("WpsVipDay")).getTime();if(!SvipDate){$XiaoMaoSvip.notify(appName,"","会员日期设置错误，请输入正确的日期范围!");XiaoMaoSvip=getGoneDay(-1)}else{XiaoMaoSvip=$XiaoMaoSvip.read("WpsVipYear")+"/"+$XiaoMaoSvip.read("WpsVipMonth")+"/"+$XiaoMaoSvip.read("WpsVipDay")}}else{XiaoMaoSvip=getGoneDay(-1)}XiaoMaoEndTime=new Date(XiaoMaoSvip).getTime()/1000}if($response.body){let vipModify={enabled:[{name:"超级会员",memberid:40,expire_time:XiaoMaoEndTime},{name:"WPS会员",memberid:20,expire_time:XiaoMaoEndTime},{name:"稻壳会员",memberid:12,expire_time:XiaoMaoEndTime},],memberid:40,name:"超级会员",has_ad:0,expire_time:XiaoMaoEndTime,};let privilegeModify=[{times:99,spid:"data_recover",expire_time:XiaoMaoEndTime},{times:99,spid:"ocr",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf_merge",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf_split",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf_edit",expire_time:XiaoMaoEndTime},{times:99,spid:"merge_sheet",expire_time:XiaoMaoEndTime},{times:99,spid:"pic_doc",expire_time:XiaoMaoEndTime},{times:99,spid:"jianli",expire_time:XiaoMaoEndTime},{times:99,spid:"banner_charts",expire_time:XiaoMaoEndTime},{times:99,spid:"photos",expire_time:XiaoMaoEndTime},{times:99,spid:"signonline",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf2ppt",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf2cad",expire_time:XiaoMaoEndTime},{times:99,spid:"audio_shorthand",expire_time:XiaoMaoEndTime},{times:99,spid:"extract_pics",expire_time:XiaoMaoEndTime},{times:99,spid:"pic2xls",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf_extract_text",expire_time:XiaoMaoEndTime},{times:99,spid:"recovery_file",expire_time:XiaoMaoEndTime},{times:99,spid:"audio_input_recognizer",expire_time:XiaoMaoEndTime},{times:99,spid:"imagecompression",expire_time:XiaoMaoEndTime},{times:99,spid:"enproofreading",expire_time:XiaoMaoEndTime},{times:99,spid:"doc_fix",expire_time:XiaoMaoEndTime},{times:99,spid:"translate",expire_time:XiaoMaoEndTime},{times:99,spid:"doc_downsizing",expire_time:XiaoMaoEndTime},{times:99,spid:"cnproofreading",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf2xls",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf_page_adjust",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf_annotation",expire_time:XiaoMaoEndTime},{times:99,spid:"pages_export",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf_sign",expire_time:XiaoMaoEndTime},{times:99,spid:"pic2doc",expire_time:XiaoMaoEndTime},{times:99,spid:"pic2ppt",expire_time:XiaoMaoEndTime},{times:99,spid:"merge_sheet",expire_time:XiaoMaoEndTime},{times:99,spid:"image_splicing",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf_edit",expire_time:XiaoMaoEndTime},{times:99,spid:"extract_file",expire_time:XiaoMaoEndTime},{times:99,spid:"export_pic_file",expire_time:XiaoMaoEndTime},{times:99,spid:"process_on",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf_add_text",expire_time:XiaoMaoEndTime},{times:99,spid:"cad2pdf",expire_time:XiaoMaoEndTime},{times:99,spid:"pdf2doc",expire_time:XiaoMaoEndTime},{times:99,spid:"pic2pdf",expire_time:XiaoMaoEndTime},{times:99,spid:"play_record",expire_time:XiaoMaoEndTime},{times:99,spid:"resume_layout",expire_time:XiaoMaoEndTime},{times:99,spid:"beauty_template",expire_time:XiaoMaoEndTime},{times:99,spid:"image_resource",expire_time:XiaoMaoEndTime},{times:99,spid:"cloud_font",expire_time:XiaoMaoEndTime},{times:99,spid:"gradients",expire_time:XiaoMaoEndTime},{times:99,spid:"paper_layout",expire_time:XiaoMaoEndTime},{times:99,spid:"export_resume",expire_time:XiaoMaoEndTime},{times:99,spid:"page_background",expire_time:XiaoMaoEndTime},{times:99,spid:"identification_photo",expire_time:XiaoMaoEndTime},{times:99,spid:"online_icon",expire_time:XiaoMaoEndTime},{times:99,spid:"docer_library",expire_time:XiaoMaoEndTime},{times:99,spid:"resume_score",expire_time:XiaoMaoEndTime},{times:99,spid:"super_ppt",expire_time:XiaoMaoEndTime},{times:99,spid:"typesetter",expire_time:XiaoMaoEndTime},{times:99,spid:"art_font",expire_time:XiaoMaoEndTime},{times:99,spid:"resume_beautify",expire_time:XiaoMaoEndTime},{times:99,spid:"free_template",expire_time:XiaoMaoEndTime},{times:99,spid:"resume_assistant",expire_time:XiaoMaoEndTime},{times:99,spid:"art_font",expire_time:XiaoMaoEndTime},];obj.hasOwnProperty("vip")?(obj.vip=vipModify):"";obj.hasOwnProperty("privilege")?(obj.privilege=privilegeModify):"";let FinishBody=JSON.stringify(obj);$done(FinishBody)}else{$done({})}