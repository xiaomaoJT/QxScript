/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2025-04-28
 *
 * 


\音\乐\搜\索\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoMusicCode.js

2、支持\百\度\引\擎\，及www开头的谷歌域名

3、使用百度或谷歌 搜索框输入 “md#音乐名或歌手名” 或 “ml#音乐名或歌手名” 即可搜索音乐


[mitm]
hostname = m.baidu.com,www.baidu.com,www.google.*

[rewrite_local]
^https:\/\/(?:m|www)\.baidu\.com\/s\?.*?[?&](?:word|wd)=(?:md|ml)%23[^&]+ url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/muc.js
^https?:\/\/(?:[a-zA-Z0-9-]+\.)?google\.[a-zA-Z.]+\/search\?[^&]*q=(md|ml)%23([^&]+) url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/muc.js

********************************/
