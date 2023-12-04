/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-08-11
 *
 * 

\微\博\+\微\博\轻\享\版\/\国\际\版\
\解\锁\全\部\会\员\图\标\、\限\时\图\标\
\解\锁\部\分\个\性\小\尾\巴\

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWeiBo.js

2、解锁位置：
微博 > 我 > 右上角设置 > 会员专属设置 > 个性图标/微博来源
微博轻享版 > 我 > 设置 > 通用 > 显示设置 > APP图标


********************************


[mitm]
hostname = new.vip.weibo.cn,api.weibo.cn,weibointl.api.weibo.cn

[rewrite_local]
https:\/\/new\.vip\.weibo\.cn\/aj\/appicon\/list url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wb.js
https:\/\/api\.weibo\.cn\/device\/get url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wb.js
https:\/\/weibointl\.api\.weibo\.cn\/portal\.php url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wb.js

********************************/
