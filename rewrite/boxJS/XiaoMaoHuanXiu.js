/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-10-22
 *
 * 


\幻\休\S\V\I\P\+\去\除\部\分\广\告\及\按\钮\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHuanXiu.js



[mitm]
hostname = api.shaolinzen.com

[rewrite_local]
https:\/\/api\.shaolinzen\.com\/user\/v1\/info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/hx.js
https:\/\/api\.shaolinzen\.com\/system\/v1\/mime url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/hx.js

********************************/
