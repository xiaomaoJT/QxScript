/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-02-27
 *
 * 


\中\国\房\价\行\情\ \解\锁\部\分\能\力\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoChinaPrice.js

2、解锁部分能力


[mitm]
hostname = api.crevalue.cn

[rewrite_local]

http:\/\/api\.crevalue\.cn url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/cp.js

********************************/
