/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-05-28
 *
 * 


\今\日\热\榜\v\i\p\自\定\义\+\广\告\移\除\+\新\增\订\阅\摘\要\展\示\+\新\增\追\踪\摘\要\展\示\+\新\增\自\定\义\模\块\摘\要\展\示\

官方会员兑换码：0B4KM

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置vip到期时间及等级
【一二此步骤可省略，会员到期时间永远定格明天，失效请重开app】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoTodayHotList.js

********************************

[mitm]
hostname = api2.tophub.app

[rewrite_local]
https:\/\/api2\.tophub\.app\/account\/sync url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/th.js
https:\/\/api2\.tophub\.app\/my\/items url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/th.js
https:\/\/api2\.tophub\.app\/my\/alerts\/items url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/th.js
https:\/\/api2\.tophub\.app\/my\/channels\/.+\/items url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/th.js
https:\/\/api2\.tophub\.app\/explore url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/th.js
https:\/\/api2\.tophub\.app\/remai\/recommend\/taobao url reject-dict
 ***************/
