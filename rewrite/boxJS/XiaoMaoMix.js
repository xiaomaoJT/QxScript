/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-10-25
 *
 * 


\M\i\x\ \V\I\P\年\度\会\员\+\净\化\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoMix.js

2、打开软件 > 右上角 > 恢复购买

3、拦截Mix社区加载 host, mix-community.camera360.com, reject


[mitm]
hostname = mix-api.camera360.com,cdn-bm.camera360.com

[rewrite_local]
https:\/\/mix-api\.camera360\.com\/v1\/operational-positions url reject
https:\/\/cdn-bm\.camera360\.com\/api\/mix\/recovery url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/mix.js
https:\/\/cdn-bm\.camera360\.com\/api\/iap\/check-receipt url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/mix.js
https:\/\/cdn-bm\.camera360\.com\/\/api\/mix-asset\/assets url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/mix.js



********************************/


