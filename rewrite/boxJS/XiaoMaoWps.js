/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-06-05
 *
 * 
\w\p\s\v\i\p \稻\壳\会\员 \超\级\会\员 \w\p\s\会\员 \云\空\间\容\量\自\定\义\超\级\会\员\p\r\o\
\新\会\员\体\系\解\锁\
仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置vip到期时间
【一二此步骤可省略，会员到期时间永远定格明8天后，失效请重开app】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWps.js

********************************

[mitm]
hostname = account.wps.*,vip.wps.cn,vas.wps.cn,s4.vip.wpscdn.cn,s6.vip.wpscdn.cn,drive.wps.cn,wenk.ios.wpscdn.cn,vipapi.wps.cn

[rewrite_local]
https:\/\/account\.wps\.(com|cn)\/api\/users\/(.+)\/overview url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wps.js
https:\/\/vip\.wps\.cn\/userinfo url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wps.js
https:\/\/account\.wps\.cn\/api\/v3\/mine\/vips url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wps.js
https:\/\/vas\.wps\.cn\/query\/api\/v1\/list_purchase_info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wps.js
https:\/\/s4\.vip\.wpscdn\.cn\/vipapi\/banner\/v1\/config url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wps.js
https:\/\/s6\.vip\.wpscdn\.cn\/vipapi\/banner\/v1\/config url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wps.js
https:\/\/drive\.wps\.cn\/api\/v3\/spaces url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wps.js
https:\/\/wenk\.ios\.wpscdn\.cn\/config\/purchase_config.json url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wps.js
https:\/\/vipapi\.wps\.cn\/payment_config\/v1\/client\/conf url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wps.js
 ***************/
