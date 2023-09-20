/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-09-20
 *
 * 


国际金价 上海黄金 实物黄金



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、⚠️ 配置文件 [task_local] 标签添加

0 0 10 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoGold.js, tag=💰XiaoMao_今日金价, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/VIP.png, enabled=true


单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoGold.js

********************************/

let gold1=new Promise((resolve,reject)=>{let option1={url:encodeURI("https://api-q.fx678img.com/exchangeSymbol.php?exchName=WGJS"),method:"GET",headers:{Accept:"application/json, text/javascript, */*; q=0.01","Accept-Encoding":"gzip, deflate, br","Accept-Language":"zh-CN,zh;q=0.9",Connection:"keep-alive",Host:"api-q.fx678img.com",Origin:"https://quote.fx678.com",Referer:"https://quote.fx678.com/","Sec-Fetch-Dest":"empty","Sec-Fetch-Mode":"cors","Sec-Fetch-Site":"cross-site","User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36","sec-ch-ua":'"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',"sec-ch-ua-mobile":"?0","sec-ch-ua-platform":'"macOS"',},};$task.fetch(option1).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});let gold2=new Promise((resolve,reject)=>{let option1={url:encodeURI("https://api-q.fx678img.com/exchangeSymbol.php?exchName=SGE"),method:"GET",headers:{Accept:"application/json, text/javascript, */*; q=0.01","Accept-Encoding":"gzip, deflate, br","Accept-Language":"zh-CN,zh;q=0.9",Connection:"keep-alive",Host:"api-q.fx678img.com",Origin:"https://quote.fx678.com",Referer:"https://quote.fx678.com/","Sec-Fetch-Dest":"empty","Sec-Fetch-Mode":"cors","Sec-Fetch-Site":"cross-site","User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36","sec-ch-ua":'"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',"sec-ch-ua-mobile":"?0","sec-ch-ua-platform":'"macOS"',},};$task.fetch(option1).then((response)=>{let obj=JSON.parse(response.body);resolve(obj)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});let gold3=new Promise((resolve,reject)=>{let url=encodeURI("http://vip.stock.finance.sina.com.cn/q/view/vGold_Matter_History.php");$task.fetch({url:url}).then((response)=>{let obj=response.body.replace(/\s*/g,"").toString();let startContentIndex=obj.indexOf("<table>");let endContentIndex=obj.indexOf("</table>");let content=obj.substring(startContentIndex,endContentIndex);let array=content.split("<tr").filter((el)=>el.indexOf(getGoneDay(0))!=-1);let returnText=array.map((e)=>{let arr=e.split('<divalign="center">');return arr.map((el)=>{let index=el.indexOf("</div>");if(el.indexOf("</div>")!=-1){return el.substring(0,index)}}).filter((l)=>l!=undefined)});resolve(returnText)}).catch((error)=>{getError("_error_1"+"获取失败，请稍后再试❗️")})});Promise.all([gold1,gold2,gold3]).then((result)=>{let returnText="今日金价数据获取成功，数据更新时间：["+getGoneDay(0)+"]"+"\n\n\n";if(result.length!=3){returnText=returnText+"获取数据结果出错，请稍后再试～"}else{let textIntelNation="🥇国际黄金行情[实时]"+"\n\n"+"[名称]"+"     [最新价]"+"   [涨跌]"+"   [涨跌幅]"+"   [昨收]"+"\n\n";let textShangHai="🎖上海黄金行情[实时]"+"\n\n"+"[名称]"+"     [最新价]"+"   [涨跌]"+"   [涨跌幅]"+"   [昨收]"+"\n\n";let textInKind="🥇实物黄金行情[当天]"+"\n\n"+"[品牌]"+"   [产品]"+"         [价格]"+"     [涨跌]"+"\n\n";result.forEach((item,index)=>{switch(index){case 0:item.forEach((el)=>{textIntelNation=textIntelNation+el.name+"   "+el.c.toString().padEnd(8)+"   "+(el.c-el.p).toFixed(2).toString().padEnd(5)+"   "+((((el.c-el.p)/el.c)*100).toFixed(2)+"%").toString().padEnd(6)+"   "+el.p+"\n"});break;case 1:item.forEach((el)=>{let re=/[\u4E00-\u9FA5]/g;textShangHai=textShangHai+el.name.toString().padEnd(6)+"   "+el.c.toString().padEnd(8)+"   "+(el.c-el.p).toFixed(2).toString().padEnd(5)+"   "+((((el.c-el.p)/el.c)*100).toFixed(2)+"%").toString().padEnd(6)+"   "+el.p+"\n"});break;case 2:item.sort().forEach((el)=>{textInKind=textInKind+el[1].toString().padEnd(3,"－")+"   "+el[2].toString().padEnd(8)+"   "+el[3].toString().padEnd(8)+"   "+el[7]+"\n"});break;default:break}});returnText=returnText+textIntelNation+"\n\n"+textShangHai+"\n\n"+textInKind}$notify("💰XiaoMao_今日金价","数据获取成功，点击查看详情～",returnText)}).catch((error)=>{console.log(error);getError("_error_1")});function getGoneDay(n=0,yearFlag=true){let myDate=new Date();myDate.setDate(myDate.getDate()-n);let month=myDate.getMonth()+1;let day=myDate.getDate();let result=""+(yearFlag?myDate.getFullYear():"")+"-"+(month<10?"0"+month:month)+"-"+(day<10?"0"+day:day);return result}function getError(params=""){$notify("💰XiaoMao_今日金价","","🚧"+params,{"open-url":"https://i.pixiv.re/img-original/img/2023/06/15/23/00/01/109042224_p0.jpg","media-url":"https://i.pixiv.re/img-original/img/2023/06/15/23/00/01/109042224_p0.jpg",})}setTimeout(()=>{$done({})},3000);