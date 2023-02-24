/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-02-24
 *
 * 
彩/云/天/气/S/v/i/p /+/ /彩/云/天/气/p/r/o/ /s/v/i/p/ /+/ /去/广/告
仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置天气svip到期时间
【一二此步骤可省略，会员到期时间永远定格明天，失效请重开app】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoCaiYunWeather.js

********************************

[mitm]
hostname = biz.caiyunapp.com,biz.cyapi.cn,cdn-w.caiyunapp.com,ad.cyapi.cn

[rewrite_local]
https?:\/\/biz\.(caiyunapp|cyapi)\.(com|cn)\/(membership_rights|v2\/user) url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/cyw.js
https:\/\/cdn-w\.caiyunapp\.com\/p\/app\/activity url reject
https:\/\/biz\.cyapi\.cn\/p\/v1\/entries url reject-dict
https:\/\/ad\.cyapi\.cn\/* url reject

 ***************/
