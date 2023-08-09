/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-08-09
 *
 * 

\酷\安\数\据\爆\表\+\绿\标\认\证\+\去\动\态\好\物\+\去\除\头\条\值\得\买\+\去\广\告\+\去\除\开\屏\广\告\
\动\态\详\情\及\评\论\区\查\看\链\接\ \原\始\链\接\提\取\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoCool.js

********************************

[mitm]
hostname = api.coolapk.com

[rewrite_local]

https:\/\/api\.coolapk\.com\/v6\/feed\/detail url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/cool.js
https:\/\/api\.coolapk\.com\/v6\/account\/loadConfig url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/cool.js
https:\/\/api\.coolapk\.com\/v6\/user\/(profile|space) url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/cool.js
https:\/\/api\.coolapk\.com\/v6\/feed\/(replyList|replyDetail) url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/cool.js
https:\/\/api\.coolapk\.com\/v6\/main\/indexV8 url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/cool.js
https:\/\/api\.coolapk\.com\/v6\/page\/dataList url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/cool.js
https:\/\/api\.coolapk\.com\/v6\/main\/init url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/cool.js
 ***************/
