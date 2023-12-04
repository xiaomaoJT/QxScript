/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-10-16
 *
 * 

\言\橘\ \解\锁\A\D\内\容\ \增\加\图\片\链\接\捕\获\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoYanJu.js

2、链接捕获依赖于网络，若图片存在缓存将无法捕获，可尝试清理缓存后再试，按需启用～


********************************

[mitm]
hostname = *.wscreativity.com

[rewrite_local]
http:\/\/.+.wscreativity\.com\/yanju\/.+\.(jpg|png) url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/yanju.js
https:\/\/yanju63resapi\.wscreativity\.com url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/yanju.js
 ***************/

