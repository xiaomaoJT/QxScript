/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-12-12
 *
 * 

\中\医\通\ \题\库\解\锁\ \、\ \课\程\解\锁\ \、\ \会\员\共\享\

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoZhongYiTong.js

2、通过抓包请求 【/period/getuser.php】获取 【loginname】 参数填入脚本即可共享会员

********************************


[mitm]
hostname = www.gsstargroup.com

[rewrite_local]
https:\/\/www\.gsstargroup\.com\/riddles url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/zyt.js

********************************/
