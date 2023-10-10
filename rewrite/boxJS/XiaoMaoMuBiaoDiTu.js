/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-10-10
 *
 * 


\目\标\地\图\P\r\o\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoMuBiaoDiTu.js

2、打开软件 > 设置 > 等待片刻 或点击「升级Pro版本」

3、解锁成功理论上有消息弹窗，成功后即可关闭脚本。[🚨🚨🚨无效请关掉软件进程后，先打开脚本，再进软件进行解锁]

4、⚠️⚠️⚠️解锁脚本不可共存，请逐一使用并关闭。


[mitm]
hostname = api.revenuecat.com

[rewrite_local]
https:\/\/api\.revenuecat\.com\/v1\/(subscribers|receipts) url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/mb.js
https:\/\/api\.revenuecat\.com\/v1\/(subscribers|receipts) url script-response-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/mb.js

********************************/
