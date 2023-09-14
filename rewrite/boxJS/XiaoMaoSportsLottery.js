/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-09-14
 *
 * 


\中\国\体\育\彩\票\最\新\开\奖\结\果\
\超\级\大\乐\透\ \排\列\3\ \排\列\5\ \七\星\彩\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 21 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoSportsLottery.js, tag=🎴XiaoMao_体彩查询, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Cryptocurrency_3.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoSportsLottery.js

********************************/


let sf1=new Promise((resolve,reject)=>{let url=encodeURI("https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=85&provinceId=0&pageSize=1&isVerify=1&pageNo=1");$task.fetch({url:url}).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});let sf2=new Promise((resolve,reject)=>{let url=encodeURI("https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=35&provinceId=0&pageSize=1&isVerify=1&pageNo=1");$task.fetch({url:url}).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});let sf3=new Promise((resolve,reject)=>{let url=encodeURI("https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=350133&provinceId=0&pageSize=1&isVerify=1&pageNo=1");$task.fetch({url:url}).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});let sf4=new Promise((resolve,reject)=>{let url=encodeURI("https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=04&provinceId=0&pageSize=1&isVerify=1&pageNo=1");$task.fetch({url:url}).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});Promise.all([sf1,sf2,sf3,sf4]).then((result)=>{let returnText="中国体育彩票最新开奖结果公示"+"\n\n";if(result.length!=4){returnText=returnText+"获取数据结果出错，请稍后再试～"}else{result.forEach((el,index)=>{switch(index){case 0:returnText=returnText+"🏀【"+el.value.lastPoolDraw.lotteryGameName+"】"+"[期号："+el.value.lastPoolDraw.lotteryDrawNum+"_"+el.value.lastPoolDraw.lotteryDrawTime+"] "+"\n"+"🔴 "+el.value.lastPoolDraw.lotteryDrawResult.substring(0,14)+"  🔵 "+el.value.lastPoolDraw.lotteryDrawResult.substring(15)+"\n\n";break;case 1:returnText=returnText+"🥎【"+el.value.lastPoolDraw.lotteryGameName+"】"+"[期号："+el.value.lastPoolDraw.lotteryDrawNum+"_"+el.value.lastPoolDraw.lotteryDrawTime+"] "+"\n"+"🔴 "+el.value.lastPoolDraw.lotteryDrawResult+"\n\n";break;case 2:returnText=returnText+"⚾️【"+el.value.lastPoolDraw.lotteryGameName+"】"+"[期号："+el.value.lastPoolDraw.lotteryDrawNum+"_"+el.value.lastPoolDraw.lotteryDrawTime+"] "+"\n"+"🔴 "+el.value.lastPoolDraw.lotteryDrawResult+"\n\n";break;case 3:returnText=returnText+"🏐【"+el.value.lastPoolDraw.lotteryGameName+"】"+"[期号："+el.value.lastPoolDraw.lotteryDrawNum+"_"+el.value.lastPoolDraw.lotteryDrawTime+"] "+"\n"+"🔴 "+el.value.lastPoolDraw.lotteryDrawResult.substring(0,11)+" 🔵 "+el.value.lastPoolDraw.lotteryDrawResult.substring(12)+"\n\n";break;default:break}})}$notify("🎴XiaoMao_体彩查询","体彩数据获取成功，点击查看详情～",returnText)}).catch((error)=>{console.log(error);getError("_error_1")});function getError(params=""){$notify("🎴XiaoMao_体彩查询","","🚧"+params,{"open-url":"https://i.pixiv.re/img-original/img/2023/05/18/00/21/30/108215031_p1.jpg","media-url":"https://i.pixiv.re/img-original/img/2023/05/18/00/21/30/108215031_p1.jpg",})}setTimeout(()=>{$done({})},3000);