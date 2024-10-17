/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-10-17
 *


\公\考\雷\达\ \星\钻\+\净\化\部\分\解\锁\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoGKLD.js

********************************

[mitm]
hostname = errlog.umeng.com, api.gongkaoleida.com,report.gongkaoleida.com

[rewrite_local]
https:\/\/api\.gongkaoleida\.com\/api url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/gkld.js
https:\/\/errlog\.umeng\.com\/api\/crashsdk\/logcollect url reject
https:\/\/api\.gongkaoleida\.com\/api\/v.+\/my\/index url reject
https:\/\/api\.gongkaoleida\.com\/api\/v.+\/sets\/getAllTips url reject
https:\/\/api\.gongkaoleida\.com\/api\/v.+\/ad\/info url reject
https:\/\/report\.gongkaoleida\.com url reject
 ***************/
