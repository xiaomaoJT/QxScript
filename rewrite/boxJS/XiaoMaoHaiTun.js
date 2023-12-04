/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-10-30
 *
 * 


\海\豚\记\账\本\v\i\p\+\净\化\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHaiTun.js



[mitm]
hostname = book.haitunwallet.com

[rewrite_local]
https:\/\/book\.haitunwallet\.com\/app\/config url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/ht.js
https:\/\/book\.haitunwallet\.com\/app\/launchad url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/ht.js
https:\/\/book\.haitunwallet\.com\/app\/upgrade url reject-200
https:\/\/book\.haitunwallet\.com\/app\/explore\/explore url reject-dict
https:\/\/book\.haitunwallet\.com\/app\/vip\/status url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/ht.js

********************************/
