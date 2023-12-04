/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-06-17
 *
s\p\o\t\i\f\y\自\动\歌\词\翻\译
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

2、根据以下方法注册翻译API，在boxJS中spotify自动翻译里填写AppID和securityKey
https://github.com/xiaomaoJT/QxScript/tree/main/rewrite/boxJS#--xiaomaospotify

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoSpotify.js

********************************

[mitm]
hostname = spclient.wg.spotify.com

[rewrite_local]
^https:\/\/spclient\.wg\.spotify\.com\/color-lyrics\/v2\/track url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/sp_translate.js

 ***************/
