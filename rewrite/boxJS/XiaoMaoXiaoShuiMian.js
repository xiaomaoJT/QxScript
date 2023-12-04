/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-10-22
 *
 * 


\小\睡\眠\亮\标\+\净\化\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoXiaoShuiMian.js

2、打开软件 > 登录账号 > 关闭程序 > 重新打开软件即可亮标

3、部分vip广告拦截，可能影响续费功能
# https:\/\/api\.psy-1\.com\/cosleep\/newborn\/popups\/detain\/vip url reject
# https:\/\/api\.psy-1\.com\/cosleep\/newborn\/vips\/rights url reject
# https:\/\/api\.psy-1\.com\/cosleep\/vip\/goods url reject

[mitm]
hostname = api.psy-1.com

[rewrite_local]
https:\/\/api\.psy-1\.com\/cosleep url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xsm.js
https:\/\/api\.psy-1\.com\/cosleep\/my\/ad url reject
https:\/\/api\.psy-1\.com\/cosleep\/ad url reject
https:\/\/api\.psy-1\.com\/cosleep\/startup url reject

********************************/
