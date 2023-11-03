/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-11-03
 *
 * 


\每\日\一\言\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 10 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoGrowToday.js, tag=🏝XiaoMao_每日一言, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute1/1806616.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoGrowToday.js

********************************/



let option={url:encodeURI("https://api.floatingislandapps.com/operation/today?language=cn"),};$task.fetch(option).then((response)=>{let obj=JSON.parse(response.body);if(obj.success){$notify("🏝XiaoMao_每日一言","",obj.data.quote,{"open-url":encodeURI(obj.data.bgImage),"media-url":encodeURI(obj.data.bgImage),})}else{getError("_error_2")}}).catch((err)=>{getError("_error_1")});function getError(params=""){$notify("🏝XiaoMao_每日一言","","🚧"+params+"获取失败，请稍后再试❗️",{"open-url":"https://i.pixiv.re/img-original/img/2022/09/19/08/00/04/101330591_p0.png","media-url":"https://i.pixiv.re/img-original/img/2022/09/19/08/00/04/101330591_p0.png",})}setTimeout(()=>{$done({})},2000);