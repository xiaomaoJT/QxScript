/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-10-07
 *
 * 

\X\M\i\n\d \v\i\p \自\定\义
\需\登\录\解\锁\，\失\效\请\重\新\登\录

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置vip到期时间及等级
【一二此步骤可省略，会员到期时间永远定格1年后，失效请重开app】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoXMind.js

⚠️⚠️最新版本已失效，进入频道获取共享会员版本吧～

********************************

[mitm]
hostname = www.xmind.net,www.xmind.cn,www.xmind.app

[rewrite_local]
https:\/\/www\.xmind(\.net|\.cn|\.app)\/\_res\/devices url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xm.js
https:\/\/www\.xmind(\.net|\.cn|\.app)\/\_res\/profile\/.+\/ url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xm.js
 ***************/

