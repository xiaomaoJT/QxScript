/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-07-14
 *
 * 

\微\博\
解锁全部会员图标、限时图标
解锁部分个性小尾巴

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWeiBo.js




********************************


[mitm]
hostname = new.vip.weibo.cn,api.weibo.cn

[rewrite_local]
https:\/\/new\.vip\.weibo\.cn\/aj\/appicon\/list url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wb.js
https:\/\/api\.weibo\.cn\/device\/get url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/wb.js

********************************/
