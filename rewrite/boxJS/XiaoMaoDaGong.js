/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-07-04
 *
 * 


\职\场\人\日\历\
\接\口\数\据\来\自\韩\小\韩\A\P\I\接\口\由\X\i\a\o\M\a\o\进\行\二\次\加\工\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 10 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoDaGong.js, tag=💼XiaoMao_职场人日历_图片版, img-url=https://raw.githubusercontent.com/Toperlock/Quantumult/main/icon/Doraemon/Doraemon-1037.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoDaGong.js

********************************/


let option={url:encodeURI("https://api.vvhan.com/api/zhichang?type=json")};$task.fetch(option).then((response)=>{let obj=JSON.parse(response.body);if(obj.success){$notify("💼XiaoMao_职场人日历","🌟点击查看","🛟打工人打工魂,打工成为人上人",{"open-url":encodeURI(obj.url),"media-url":encodeURI(obj.url)})}else{getError("_error_2")}}).catch((err)=>{getError("_error_1")});function getError(params=""){$notify("💼XiaoMao_职场人日历","","🚧"+params+"获取失败，请稍后再试❗️",{"open-url":"https://i.pixiv.re/img-original/img/2023/04/25/22/11/12/107520054_p0.jpg","media-url":"https://i.pixiv.re/img-original/img/2023/04/25/22/11/12/107520054_p0.jpg",})}setTimeout(()=>{$done({})},2000);