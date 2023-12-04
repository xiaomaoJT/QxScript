/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-10-15
 *
 * 


\快\对\会\员\+\p\d\f\捕\获\+\图\片\捕\获\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoKuaiDui.js

2、该脚本使用大量全匹配，可能会消耗性能！



[mitm]
hostname = kd02-1253445850.file.myqcloud.com, apivip.kuaiduizuoye.com, apm.zuoyebang.com, www.kuaiduizuoye.com

[rewrite_local]
http:\/\/kd02-1253445850\.file\.myqcloud\.com\/scanimg url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/kd.js
https:\/\/apm\.zuoyebang\.com url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/kd.js
https:\/\/www\.kuaiduizuoye\.com url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/kd.js
https:\/\/apivip\.kuaiduizuoye\.com url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/kd.js

********************************/
