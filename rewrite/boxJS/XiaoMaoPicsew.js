/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-08-15
 *
 * 


\p\i\c\s\e\w\标\准\版\&\专\业\版\解\锁\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoPicsew.js

2、打开软件 > 右上角按钮 > 高级功能 > 自动解锁专业版 ，若未解锁成功，手动点击高级功能 > 右上角「恢复购买」

3、解锁成功理论上有消息弹窗，成功后即可关闭脚本。[🚨🚨🚨无效请关掉软件进程后，先打开脚本，再进软件进行解锁]

4、⚠️⚠️⚠️解锁脚本不可共存，请逐一使用并关闭。

5、建议添加本地分流 host, firebaseinstallations.googleapis.com, reject 或使用远程分流https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/filter/AdBlock.list


[mitm]
hostname = buy.itunes.apple.com

[rewrite_local]

https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/psw.js

********************************/