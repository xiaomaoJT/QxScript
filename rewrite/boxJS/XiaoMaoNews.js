/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-06-19
 *
 * 


\每\日\新\闻\6\0\s\
\每\天\早\上\1\0\点\，\推\送\新\闻\了\解\世\界\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

* * 10 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoNews.js, tag=📰XiaoMao_每日新闻60s, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute1/1689251.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoNews.js

********************************/




let url="https://www.5fm.cn/"+(489+restDate("2023/06/18"))+".html";let option={url:encodeURI(url),method:"GET",headers:{"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",},};function restDate(date){const target=+new Date(date);const today=+new Date();const A_DAY=1000*60*60*24;const diff=target-today;const restDays=Math.floor(diff/A_DAY);return Math.abs(restDays+1)}$task.fetch(option).then((response)=>{let obj=response.body.replace(/\s*/g,"").toString();let result=obj.split("<pdata-pid=");let result_finally=result.slice(4,result.findIndex((el)=>el.indexOf("微语")!=-1)+1);let list=[];result_finally.forEach((el)=>{let start=el.indexOf(">");let end=el.indexOf("<");list.push(el.substring(start+1,end))});let img="https://www.5fm.cn/60s/"+new Date().getDay()+"/"+parseInt(Math.random()*9)+".jpg";let resultText="🛟 每天早上十点，每天60s读懂世界新闻，每天六十秒看懂世界频道"+"\n\n";if(result.length){list.forEach((el,index)=>{resultText=resultText+(index==list.length-1?"📙":"🔖 ")+el+"\n\n"});$notify("🚗XiaoMao_每日新闻60s❗️","",resultText,{"media-url":img,})}else{$notify("🚨XiaoMao_每日新闻60s数据抓取失败❗️","","🚧建议设定于每日早9点或10点后运行此脚本❗️",{"open-url":"https://i.pixiv.re/img-original/img/2023/05/14/18/00/25/108120842_p0.png","media-url":"https://i.pixiv.re/img-original/img/2023/05/14/18/00/25/108120842_p0.png",})}}).catch((err)=>{$notify("🚨XiaoMao_每日新闻60s推送失败❗️","","🚧请稍后再试❗️",{"open-url":"https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg","media-url":"https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg",})});setTimeout(()=>{$done({})},2000);