/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-03-06
 *
 * 

/n/e/w/b/i/n/g/ /重/定/向/+/分/流/+/模/拟/e/d/g/e/浏/览/器/内/核/
模拟内核脚本 @野比

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoNewBing.js


2、【此操作描述基于XiaoMao配置4.1】
将首页策略组 S.microsoft 切换为美国策略等他国节点
或 QX > 右下角风车 > 分流 > 分流规则资源  > 新增以下分流
host-wildcard, *bing.com, 🇺🇸 U.ord.us

3、使用safari访问newBing网址即可 
https://www.bing.com/new 

4、请注意务必切换微软分流或新增newBing为非国内节点后访问newBing网址，否则将会导致网页崩溃


********************************

[rewrite_local]
^https?:\/\/cn\.bing\.com url 302 https://bing.com
^https:\/\/www\.bing\.com\/(search|new) url request-header (\r\nUser-Agent:.+?)\w+\/[\d\.]+(\r\n) request-header $1AppleWebKit/537.36 Chrome/110.0 Safari/537.36 Edg/110.0$2


[mitm]
hostname = www.bing.com,cn.bing.com

 ***************/
