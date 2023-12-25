/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-12-25
 *
 * 

\洋\葱\学\园\ \会\员\
\解\锁\会\员\ \解\锁\课\程\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoYangCong.js

********************************



[mitm]
hostname = ios-api-v5-0.yangcong345.com,7to12.yangcong345.com

[rewrite_local]
https:\/\/ios-api-v5-0\.yangcong345\.com\/growth-operation-config\/api\/vip\/info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/yc.js
https:\/\/ios-api-v5-0\.yangcong345\.com\/api\/client\/userAuth url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/yc.js
https:\/\/ios-api-v5-0\.yangcong345\.com\/api\/client\/userAuth\/current url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/yc.js
https:\/\/7to12\.yangcong345\.com\/backend\/api\/client\/userAuth url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/yc.js
https:\/\/ios-api-v5-0\.yangcong345\.com\/course-mall\/app\/mytabs url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/yc.js
https:\/\/7to12\.yangcong345\.com\/backend\/study-course url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/yc.js
 ***************/

