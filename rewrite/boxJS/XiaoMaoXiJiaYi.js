/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-11-09
 *
 * 


\s\t\e\a\m\ \e\p\i\c\ \喜\加\一\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 11 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoXiJiaYi.js, tag=🕹XiaoMao_喜加一, img-url=https://raw.githubusercontent.com/Toperlock/Quantumult/main/icon/Doraemon/Doraemon-1092.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoXiJiaYi.js

********************************/









let option={url:encodeURI("https://api.pearktrue.cn/api/steamplusone")};$task.fetch(option).then((response)=>{let obj=JSON.parse(response.body);if(obj.code==200){let changeNum=["零","一","二","三","四","五","六","七","八","九",];let text="今日喜加"+changeNum[obj.count]+"！ "+"[UpdateTime:"+obj.time+"]"+"\n\n\n";let listLength=obj.data.length;if(listLength){obj.data.forEach((element,index)=>{text=text+"🎁仓库加"+changeNum[index+1]+"："+element.name+"\n\n"+"⛓来源类型："+"["+element.source+"]"+element.type+"\n\n"+"⏱持续时间："+element.starttime+" ~ "+element.endtime+"\n\n"+"🕹领取地址："+element.url+"\n\n\n"+(listLength==1?"":"-----------------------------")+"\n\n\n"})}$notify("🕹XiaoMao_喜加一","🌟点击查看",text)}else{getError("_error_2")}}).catch((err)=>{getError("_error_1")});function getError(params=""){$notify("🕹XiaoMao_喜加一","","🚧"+params+"获取失败，请稍后再试❗️",{"open-url":"https://i.pixiv.re/img-original/img/2022/09/19/08/00/04/101330591_p0.png","media-url":"https://i.pixiv.re/img-original/img/2022/09/19/08/00/04/101330591_p0.png",})}setTimeout(()=>{$done({})},6000);