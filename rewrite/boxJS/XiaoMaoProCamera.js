/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-11-24
 *
 * 


\P\r\o\C\a\m\e\r\a\ \U\p\会\员\年\度\订\阅\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoProCamera.js

2、打开软件 > 右下角角按钮 > 底部中间购物车按钮 > 自动解锁年度会员 ，若未解锁成功，手动点击「恢复购买」


[mitm]
hostname = buy.itunes.apple.com

[rewrite_local]

https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/pc.js

********************************/