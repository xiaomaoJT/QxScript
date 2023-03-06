/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-03-06
 *
 * 

/n/e/w/b/i/n/g/ /重/定/向/+/分/流/+/模/拟/浏/览/器/内/核/

模拟内核脚本 @野比

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoNewBing.js

2、QX > 右下角风车 > 分流 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoNewBing.js

********************************

[filter_local]
host, www.bing.com, 🇺🇸 U.ord.us
host, cn.bing.com, 🇺🇸 U.ord.us

[rewrite_local]
^https?:\/\/cn\.bing\.com url 302 https://bing.com
^https:\/\/www\.bing\.com\/(search|new) url request-header (\r\nUser-Agent:.+?)\w+\/[\d\.]+(\r\n) request-header $1AppleWebKit/537.36 Chrome/110.0 Safari/537.36 Edg/110.0$2


[mitm]
hostname = www.bing.com,cn.bing.com

 ***************/
