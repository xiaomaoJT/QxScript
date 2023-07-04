/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-07-04
 *
 * 


\每\日\新\闻\6\0\s\图\片\版\
\接\口\数\据\来\自\韩\小\韩\A\P\I\接\口\由\X\i\a\o\M\a\o\进\行\二\次\加\工\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 9 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoNewsPic.js, tag=📰XiaoMao_每日新闻60s_图片版, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute1/1689251.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoNewsPic.js

********************************/


let option={url:encodeURI("https://api.vvhan.com/api/60s?type=json")};$task.fetch(option).then((response)=>{let obj=JSON.parse(response.body);if(obj.success){$notify("📰XiaoMao_每日新闻60s","🌟点击查看","🛟每天60s读懂世界新闻，每天六十秒看懂世界频道",{"open-url":encodeURI(obj.imgUrl),"media-url":encodeURI(obj.imgUrl),})}else{getError("_error_2")}}).catch((err)=>{getError("_error_1")});function getError(params=""){$notify("📰XiaoMao_每日新闻60s","","🚧"+params+"获取失败，请稍后再试❗️",{"open-url":"https://i.pixiv.re/img-original/img/2022/09/19/08/00/04/101330591_p0.png","media-url":"https://i.pixiv.re/img-original/img/2022/09/19/08/00/04/101330591_p0.png",})}setTimeout(()=>{$done({})},2000);