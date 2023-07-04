/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-07-04
 *
 * 


\豆\瓣\电\影\排\行\榜\
\接\口\数\据\来\自\韩\小\韩\A\P\I\接\口\由\X\i\a\o\M\a\o\进\行\二\次\加\工\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 12 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoMovie.js, tag=🎬XiaoMao_豆瓣电影, img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Video.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoMovie.js

********************************/


let option={url:encodeURI("https://api.vvhan.com/api/douban"),};$task.fetch(option).then((response)=>{let obj=JSON.parse(response.body);if(obj.success&&obj.data.length){let returnText="更新时间："+obj.time+"\n\n";obj.data.forEach((el,index)=>{returnText=returnText+"["+(index+1)+"] "+el.title+"\n"+"豆瓣评分："+el.info.pingfen+"\n"+"演员名单："+el.info.yanyuan+"\n"+"评价人数："+el.info.pingjia+"\n"+"电影详情："+el.info.url+"\n\n"});$notify("🎬XiaoMao_豆瓣电影排行","",returnText)}else{getError("_error_2")}}).catch((err)=>{getError("_error_1")});function getError(params=""){$notify("🎬XiaoMao_豆瓣电影排行","","🚧"+params+"获取失败，请稍后再试❗️",{"open-url":"https://i.pixiv.re/img-original/img/2022/02/20/12/41/49/96386959_p0.png","media-url":"https://i.pixiv.re/img-original/img/2022/02/20/12/41/49/96386959_p0.png",})}setTimeout(()=>{$done({})},2000);