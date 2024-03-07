/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-03-07
 *
 * 


\考\试\宝\ \部\分\功\能\解\锁\
\广\告\拦\截\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoKaoShiBao.js

********************************



[mitm]
hostname = api.ankianki.com

[rewrite_local]
https:\/\/api\.ankianki\.com url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/ksb.js
https:\/\/api\.ankianki\.com\/banner\/get url reject-200
https:\/\/api\.ankianki\.com\/popupAd\/get url reject-200
https:\/\/api\.ankianki\.com\/ad url reject-200
 ***************/

