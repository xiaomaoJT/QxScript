/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-10-07
 *
 * 

\B\H\ \P\r\o\ \解\锁\调\研\G\o\数\据\解\锁\会\员\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoBHPro.js

********************************

[mitm]
hostname = litebhapi.belugabh.com

[rewrite_local]
https:\/\/litebhapi\.belugabh\.com\/personal_center\/user_equity_status_list url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bh.js
https:\/\/litebhapi\.belugabh\.com\/\/momentsHome\/getClassifyList url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bh.js
https:\/\/litebhapi\.belugabh\.com\/personal_center\/user_info url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bh.js
https:\/\/litebhapi\.belugabh\.com\/personal_center\/my_homepage url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bh.js
https:\/\/litebhapi\.belugabh\.com\/market_survey_report\/periphery url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bh.js
https:\/\/litebhapi\.belugabh\.com\/home_page\/banner_image url reject

 ***************/

