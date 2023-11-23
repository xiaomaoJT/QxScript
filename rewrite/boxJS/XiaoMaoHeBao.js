/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-11-23
 *
 * 

\和\包\银\联\红\包\商\品\种\类\查\询\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

0 0 0/4 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHeBao.js, tag=🎁XiaoMao_和包银联红包查询, img-url=https://raw.githubusercontent.com/Toperlock/Quantumult/main/icon/Doraemon/Doraemon-1037.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHeBao.js

********************************/








const url="https://m.jf.10086.cn/cmcc-hepay-shop/search/query";const method="POST";const headers={Connection:"keep-alive","Accept-Encoding":"gzip, deflate, br","Content-Type":"application/json",Origin:"https://m.jf.10086.cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 Hebao/9.15.42/com.cmpay.CMPayClient /sa-sdk-ios/sensors-verify/uba.cmpay.com?production ",Host:"m.jf.10086.cn",Referer:"https://m.jf.10086.cn/","Accept-Language":"zh-CN,zh-Hans;q=0.9",Accept:"*/*",};const body='{"sortColumn":"default","sortType":"desc","pageSize":20,"pageNum":1,"firstKeyword":"银联","integral":820,"userPhoneNo":"10000000000","province":"jx"}';const myRequest={url:url,method:method,headers:headers,body:body,};$task.fetch(myRequest).then((response)=>{let body=JSON.parse(response.body);let returnText="";let searchLen=body.resultJson.searchList.length;if(searchLen){returnText="✅ 银联红包商品查询成功！"+"\n\n"+"共"+searchLen+"款商品：";returnText=returnText+body.resultJson.searchList.map((e)=>e.name).toString()+"\n\n"+"快去和包商场兑换吧～"}else{returnText="❌查询失败，请稍后再试～"}$notify("🎁XiaoMao_和包银联红包查询","",returnText)},(reason)=>{$notify("🎁XiaoMao_和包银联红包查询","","❌查询失败，请稍后再试～")});setTimeout(()=>{$done()},3000);