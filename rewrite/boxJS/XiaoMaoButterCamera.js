/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-09-25
 *
 * 

\黄\油\相\机\v\i\p\关\注\粉\丝\自\定\义\ + \去\信\息\流 + \去\开\屏
\部\分\模\版\解\锁\需\要\d\i\n\g\之\后\生\效\，\未\d\i\n\g\可\能\不\生\效
\全\模\板\解\锁\


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
【一二此步骤可省略，会员到期时间永远定格明天，失效请重开app】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoButterCamera.js

4、全模版解锁 boxjs设置 ButterpModel 为1
⚠️ 全模版解锁暂未找到兼容办法，建议按以下方式使用。
①使用boxjs设置全模板解锁功能为0 ，即关闭状态。
②使用app 收藏喜欢的模版，并点击预加载一次。
③使用boxjs设置全模板解锁功能为1 ，即开启状态。
④使用app 加载收藏内的模版即可解锁。

须知：
1⃣️ 本模式下，一键P图功能、部分修图功能及部分资源加载将受限，仅用于加载不能正常crack的模板。
2⃣️ 开启后鉴别方式：一键P图功能图标为👑皇冠即为开启；⚡️闪电即为关闭。
3⃣️ 每次开启需杀掉后台重新进入。

⚠️新版本的一键P图功能已废，建议通过BoxJS开启 全模板解锁功能「设为1」，可解锁绝大部分内容。

建议添加本地分流 host, vip.bybutter.com, reject


********************************

[mitm]
hostname = api4.bybutter.com,tcbox.baidu.com,adx-cn.anythinktech.com,bgg.baidu.com

[rewrite_local]
https:\/\/api4\.bybutter\.com\/v4\/* url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bc.js
https:\/\/api4\.bybutter\.com\/v4\/app\/placements\/\d\/advertisements url reject
https:\/\/tcbox\.baidu\.com\/ztbox url reject
https:\/\/adx-cn\.anythinktech\.com\/bid url reject
https:\/\/bgg\.baidu\.com\/bgg\/produce url reject
https:\/\/api4\.bybutter\.com\/v4\/shop\/banners\/recommendation url reject
https:\/\/api4\.bybutter\.com\/v4\/shop\/orders\/apple\/receipts url reject


 ***************/

