/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-12-27
 *
 * 

\每\日\语\录\ \数\据\来\自\字\醒\

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加 或 于自动任务栏(三横杠按钮)，右上角加号，以文本方式添加以下代码即可

0 0 9 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoYuLu.js, tag=📜XiaoMao_每日语录, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute/%23.png, enabled=true


单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoYuLu.js

********************************/


function Env(name){const isLoon=typeof $loon!=="undefined";const isSurge=typeof $httpClient!=="undefined"&&!isLoon;const isQX=typeof $task!=="undefined";const read=(key)=>{if(isLoon||isSurge)return $persistentStore.read(key);if(isQX)return $prefs.valueForKey(key)};const write=(key,value)=>{if(isLoon||isSurge)return $persistentStore.write(key,value);if(isQX)return $prefs.setValueForKey(key,value)};const notify=(title="XiaoMao",subtitle="",message="",url="",url2=url)=>{if(isLoon)$notification.post(title,subtitle,message,url);if(isSurge)$notification.post(title,subtitle,message,{url});if(isQX)$notify(title,subtitle,message,{"open-url":url,"media-url":url2})};const get=(url,callback)=>{if(isLoon||isSurge)$httpClient.get(url,callback);if(isQX){url.method=`GET`;$task.fetch(url).then((resp)=>callback(null,{},resp.body))}};const post=(url,callback)=>{if(isLoon||isSurge)$httpClient.post(url,callback);if(isQX){url.method=`POST`;$task.fetch(url).then((resp)=>callback(null,{},resp.body))}};const put=(url,callback)=>{if(isLoon||isSurge)$httpClient.put(url,callback);if(isQX){url.method="PUT";$task.fetch(url).then((resp)=>callback(null,{},resp.body))}};const toObj=(str)=>JSON.parse(str);const toStr=(obj)=>JSON.stringify(obj);const queryStr=(obj)=>{return Object.keys(obj).map((key)=>`${key}=${obj[key]}`).join("&")};const log=(message)=>console.log(message);const done=(value={})=>$done(value);return{name,read,write,notify,get,post,put,toObj,toStr,queryStr,log,done,}}const $=new Env("XiaoMaoYuLu");let url="https://yiyu.doyoudo.com/YiYuServer/getAllYuluForIOS.yuluServlet";let option={url:encodeURI(url),method:"GET",headers:{"User-Agent":"ZiXing/1 CFNetwork/1399 Darwin/22.1.0",},};$.get(option,(err,resp,responseStr)=>{let response=JSON.parse(responseStr);if(response&&response.code==200&&response.data.yuluList.length){let todayDate=new Date();let todayDateStr=todayDate.getFullYear().toString()+"-"+(todayDate.getMonth()+1).toString().padStart(2,"0")+"-"+todayDate.getDate().toString().padStart(2,"0");let todayYuLuArr=response.data.yuluList.filter((el)=>el.date==todayDateStr);let todayYuLu=response.data.yuluList.pop();if(todayYuLuArr.length){todayYuLu=todayYuLuArr[0]}$.notify("📜每日语录","",todayYuLu.yulu+"\n"+"—— "+todayYuLu.auth+"\n"+"—— "+todayYuLu.date+"\n"+(todayYuLu.authUrl!=""?"—— "+todayYuLu.authUrl:""))}else{$.notify("📜XiaoMao每日语录","","数据获取失败，请稍后再试～","https://i.pixiv.re/img-original/img/2021/05/10/17/57/47/89746140_p0.jpg","https://i.pixiv.re/img-original/img/2021/05/10/17/57/47/89746140_p0.jpg")}});setTimeout(()=>{$done({})},3500);