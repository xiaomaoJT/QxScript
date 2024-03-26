/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-03-26
 *
 * 


\小\白\学\习\打\印\ \s\v\i\p\ \图\片\捕\获\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoXiaoBaiDaYin.js


[mitm]
hostname = api.xbxxhz.com,cdn-h.gongfudou.com

[rewrite_local]
https:\/\/cdn-h\.gongfudou\.com\/.+\.(jpg|png) url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xbdy.js
https:\/\/api\.xbxxhz\.com\/graphql url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xbdy.js

********************************/
