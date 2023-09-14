/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-09-14
 *
 * 


\中\国\福\利\彩\票\最\新\开\奖\结\果\
\双\色\球\ \福\彩\3\d\ \快\乐\8\ \七\乐\彩\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 21 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWelfareLottery.js, tag=🎟XiaoMao_福彩查询, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Cryptocurrency_2.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWelfareLottery.js

********************************/


let wf1=new Promise((resolve,reject)=>{let url=encodeURI("http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=1&week=&systemType=PC");$task.fetch({url:url}).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});let wf2=new Promise((resolve,reject)=>{let url=encodeURI("http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=kl8&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=1&week=&systemType=PC");$task.fetch({url:url}).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});let wf3=new Promise((resolve,reject)=>{let url=encodeURI("http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=3d&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=1&week=&systemType=PC");$task.fetch({url:url}).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});let wf4=new Promise((resolve,reject)=>{let url=encodeURI("http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=qlc&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=1&week=&systemType=PC");$task.fetch({url:url}).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});Promise.all([wf1,wf2,wf3,wf4]).then((result)=>{let returnText="中国福利彩票最新开奖结果公示"+"\n\n";if(result.length!=4){returnText=returnText+"获取数据结果出错，请稍后再试～"}else{result.forEach((el,index)=>{switch(index){case 0:returnText=returnText+"🏓【"+el.result[0].name+"】"+"[期号："+el.result[0].code+"_"+el.result[0].date+"] "+"\n"+"🔴 "+el.result[0].red.replace(/,/g," ")+"  🔵 "+el.result[0].blue.replace(/,/g," ")+"\n\n";break;case 1:returnText=returnText+"🎱【"+el.result[0].name+"】"+"[期号："+el.result[0].code+"_"+el.result[0].date+"] "+"\n"+"🔴 "+el.result[0].red.replace(/,/g," ")+"\n\n";break;case 2:returnText=returnText+"🏈【"+el.result[0].name+"】"+"[期号："+el.result[0].code+"_"+el.result[0].date+"] "+"\n"+"🔴 "+el.result[0].red.replace(/,/g," ")+"\n\n";break;case 3:returnText=returnText+"⚽️【"+el.result[0].name+"】"+"[期号："+el.result[0].code+"_"+el.result[0].date+"] "+"\n"+"🔴 "+el.result[0].red.replace(/,/g," ")+" 🔵 "+el.result[0].blue.replace(/,/g," ")+"\n\n";break;default:break}})}$notify("🎟XiaoMao_福彩查询","福彩数据获取成功，点击查看详情～",returnText)}).catch((error)=>{console.log(error);getError("_error_1")});function getError(params=""){$notify("🎟XiaoMao_福彩查询","","🚧"+params,{"open-url":"https://i.pixiv.re/img-original/img/2020/08/27/18/55/26/83968563_p0.jpg","media-url":"https://i.pixiv.re/img-original/img/2020/08/27/18/55/26/83968563_p0.jpg",})}setTimeout(()=>{$done({})},3000);