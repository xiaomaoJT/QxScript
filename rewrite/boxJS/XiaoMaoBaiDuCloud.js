/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-03-30
 *
 * 
\百\度\云\盘\s\v\i\p + \去\推\广 

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置svip到期时间及等级
【一二此步骤可省略，会员到期时间永远定格明天，等级定格svip9，失效请重开app】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoBaiDuCloud.js

********************************

[mitm]
hostname = pan.baidu.com,sf3-fe-tos.pglstatp-toutiao.com

[rewrite_local]
https:\/\/pan\.baidu\.com\/rest\/\d\.\d\/membership\/user url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bdc.js
https:\/\/pan\.baidu\.com\/act\/v2\/membergrow\/my url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bdc.js
https:\/\/pan\.baidu\.com\/story\/diff url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bdc.js
https:\/\/pan\.baidu\.com\/dosp\/opconf\/list url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bdc.js
https:\/\/pan\.baidu\.com\/api\/user\/getinfo url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bdc.js
https:\/\/pan\.baidu\.com\/act\/api\/activityentry url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bdc.js
https:\/\/pan\.baidu\.com\/api\/singkil\/bindquery url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bdc.js
https:\/\/staticsns\.cdn\.bcebos\.com\/amis\/.+\.(jpg|png|jpeg|gif)$ url reject-200
https:\/\/pan\.baidu\.com\/imbox\/msg\/pull url reject-200
https:\/\/pan\.baidu\.com\/api\/version\/getlatestversion url reject-200
https:\/\/pan\.baidu\.com\/rest\/\d\.\d\/membership\/product url reject-200
https:\/\/pan\.baidu\.com\/rest\/\d\.\d\/membership\/level url reject-200
https:\/\/pan\.baidu\.com\/rest\/\d\.\d\/membership\/activity url reject-200
https:\/\/pan\.baidu\.com\/act\/api\/conf url reject-200
https:\/\/pan\.baidu\.com\/act\/v2\/welfare\/list url reject-200
https:\/\/pan\.baidu\.com\/api\/getconfig url reject-200
https:\/\/pan\.baidu\.com\/rest\/\d\.\d\/membership\/proxy\/guide url reject-200
https:\/\/pan\.baidu\.com\/api\/taskscore\/tasklist url reject-200
https:\/\/pan\.baidu\.com\/rest\/\d\.\d\/xpan\/smartprogram url reject-200
https:\/\/sf3-fe-tos\.pglstatp-toutiao\.com\/obj\/ad-pattern\/renderer url reject-200
 ***************/

