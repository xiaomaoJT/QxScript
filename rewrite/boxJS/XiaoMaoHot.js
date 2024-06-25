/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-06-25
 *
 * 


\实\时\热\榜\
\接\口\数\据\来\自\韩\小\韩\A\P\I\接\口\由\X\i\a\o\M\a\o\进\行\二\次\加\工\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、使用BoxJS增加以下脚本订阅。
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json


2、通过boxjs设置需要查询的热榜信息
🚧 支持的热榜有：虎扑热榜（hp）、知乎热榜（zh）、36氪热榜（36）、百度热榜（bd）、B站热榜（bz）、贴吧热榜（tb）、微博热榜（wb）、抖音热榜（gy）、豆瓣热榜（db）、微信热榜（wx）、少数派热榜（ss）、IT资讯热榜（it）、IT资讯新榜（itn）、历史上的今天（ls）、微信美食榜（ms）、微信搞笑榜（gx）、微信财经榜（cj）、微信科技榜（kj）、微信八卦榜（bg）、微信星座榜（xz）、微信旅游榜（ly）
🚧 热榜集合(多个以+号间隔)【填入热榜缩写】如 虎扑热榜+微博热榜+百度热榜：hp+wb+bd


3、⚠️ 配置文件 [task_local] 标签添加

0 0 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/hot.js, tag=🔥XiaoMao_实时热榜, img-url=https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/cartoon/Cute/1icon.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHot.js

********************************/
