/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2025-03-07
 *
 * 


\车\牌\影\片\搜\索\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoAvCode.js

2、支持\百\度\引\擎\，及www开头的谷歌域名


[mitm]
hostname = m.baidu.com,www.baidu.com,www.google.*

[rewrite_local]
^https:\/\/(m|www)\.baidu\.com\/s\?.*?\b(word|wd)=av%23[-a-zA-Z0-9]+(?![^\s&]) url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/avc.js
^http(s?):\/\/(?:[a-zA-Z0-9-]+\.)?google\.[a-zA-Z.]+\/search\b[^?]*\?.*?\bq=av%23([a-zA-Z0-9-]+) url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/avc.js

********************************/
