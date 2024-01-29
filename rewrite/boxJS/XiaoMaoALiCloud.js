/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-01-29
 *
 * 

\阿\里\云\盘\s\v\i\p\+\部\分\优\化\+\去\广\告\+\彩\蛋\+\自\定\义\+\解\锁\所\有\图\标\
\解\锁\倍\率\、\长\按\倍\率\、\清\晰\度\等\
\适\配\4\.\9\.\0\+\版\本\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置svip到期时间及等级
【一二此步骤可省略，会员到期时间永远定格永久7天后，失效请重开app】
【支持更改云容量显示，默认关闭】
【支持更改图标布局，新版本（4.9.0+）取消该特性，效果不好】
【支持获取视频m3u8临时下载链接，默认关闭】
【视频在线播放清晰度解锁，默认开启】
【支持自定义修改 注册排名】
【支持自定义修改 昵称底下 - 描述文字】
【支持自定义修改 超级会员右边 - 按钮文字】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoALiCloud.js

********************************

[mitm]
hostname = api.aliyundrive.com,member.aliyundrive.com,api.alipan.com,member.alipan.com,auth.alipan.com

[rewrite_local]
https:\/\/api\.(aliyundrive|alipan)\.com\/apps\/v1\/users\/apps\/welcome url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/v2\/databox\/get_personal_info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1.0\/users\/vip\/info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/member\.(aliyundrive|alipan)\.com\/v1\/users\/tools url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1\/users\/me\/vip\/info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1.1\/users\/me\/vip\/info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/apps\/v1\/users\/home\/widgets url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/apps\/v2\/users\/home\/widgets url reject-dict
https://api.aliyundrive.com/apps/v1/users/home/news url reject-200
https:\/\/api\.(aliyundrive|alipan)\.com\/adrive\/v1\/app\/logos url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/adrive\/v2\/user\/get url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1.0\/users\/feature\/list url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1.0\/users\/feature\/trial url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/v2\/file\/get_video_preview_play_info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.(aliyundrive|alipan)\.com\/adrive\/v2\/batch url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/member\.alipan\.com\/v2\/activity\/sign_in_info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/member\.aliyundrive\.com\/v2\/activity\/sign_in_list url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.alipan\.com\/business\/v1.0\/users\/coupon\/detail url reject-200
https:\/\/member\.alipan\.com\/v1\/users\/onboard_list url reject-200
https:\/\/member\.alipan\.com\/v1\/users\/me url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.alipan\.com\/adrive\/v1\/timeline\/user\/get url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/member\.aliyundrive\.com\/v2\/activity\/sign_in_luckyBottle url reject
https:\/\/api\.alipan\.com\/apps\/v1\/users\/home\/recent url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
https:\/\/api\.alipan\.com\/adrive\/v1\/user\/getUserCapacityInfo url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/alic.js
 ***************/
