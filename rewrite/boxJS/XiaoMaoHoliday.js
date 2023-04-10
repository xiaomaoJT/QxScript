/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-04-10
 *
 * 

\年\度\节\日\信\息\推\送\+\b\i\n\g\每\日\图\片\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

0 0 8 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHoliday.js, tag=💢年度节日自动推送, img-url=https://raw.githubusercontent.com/shoujiqiyuan/PokemonGOforQuanX/master/IconSet/Z002.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHoliday.js

********************************/


let year=new Date().getFullYear().toString();let nowMonth=(new Date().getMonth()+1).toString().padStart(2,0);let nowDay=new Date().getDate().toString().padStart(2,0);let time=new Date().getTime()/1000;let dateTime=year+nowMonth+nowDay;let option={url:encodeURI("https://pan.baidu.com/api/getholiday?vip=0&version=11.34.5&queryfree=2&network_type=wwan&freeisp=0&activestatus=0&time="+time+"&clienttype=1&status=0&date="+year),};$task.fetch(option).then((response)=>{let obj=JSON.parse(response.body);if(obj.errno==0&&obj.data.hasOwnProperty(dateTime)){$notify("💢节日推送·"+obj.data[dateTime].name+"·"+obj.data[dateTime].tag||"💢节日推送","",obj.data[dateTime].info||"",{"open-url":"https://apis.jxcxin.cn/api/Bing","media-url":"https://apis.jxcxin.cn/api/Bing",})}else{$notify("早上好","","今天是"+year+"年"+nowMonth+"月"+nowDay+"日",{"open-url":"https://apis.jxcxin.cn/api/Bing","media-url":"https://apis.jxcxin.cn/api/Bing",})}}).catch((err)=>{console.log(JSON.stringify(err));$notify("XiaoMao提示","","节日信息获取失败!",{"open-url":"https://i.pixiv.re/img-original/img/2023/01/08/00/35/11/104329217_p0.jpg","media-url":"https://i.pixiv.re/img-original/img/2023/01/08/00/35/11/104329217_p0.jpg",})});setTimeout(()=>{$done({})},2000);