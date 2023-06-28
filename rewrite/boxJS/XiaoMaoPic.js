/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-06-28
 *
 * 

\每\日\随\机\图\片\（\二\次\元\+\1\8\）

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

0 0 0/4 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoPic.js, tag=💢靓图自动推送, img-url=https://raw.githubusercontent.com/shoujiqiyuan/PokemonGOforQuanX/master/IconSet/Z029.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoPic.js

********************************/


let option={url:encodeURI("https://api.lolicon.app/setu?apikey=&r18=2&keyword=&num=1"),};$task.fetch(option).then((response)=>{let obj=JSON.parse(response.body);if(obj.code==0&&obj.data.length){let picture=encodeURI(obj.data[0].url);$notify("💢靓图推送·"+obj.data[0].title||"💢每日靓图","",obj.data[0].author||""+obj.data[0].tags[0]||""+obj.data[0].tags[1]||"",{"open-url":picture,"media-url":picture})}}).catch((err)=>{console.log(JSON.stringify(err));$notify("XiaoMao提示","","本次靓图获取失败!",{"open-url":"https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg","media-url":"https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg",})});setTimeout(()=>{$done({})},2000);