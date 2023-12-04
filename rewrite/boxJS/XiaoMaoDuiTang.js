/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-09-17
 *
 * 


\堆\糖\s\v\i\p\、\去\除\部\分\广\告\、\去\除\部\分\推\广\去\开\屏\广\告\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置svip到期时间及等级【不设置默认永久10天后】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoDuiTang.js

4、去除开屏广告，下载安装App后，先开启脚本，打开QX抓包模式，成功登录账号后再关闭抓包模式，此后脚本需先运行再进入软件，当前测试暂未出现开屏

********************************

[mitm]
hostname = api.duitang.com,www.duitang.com,qzs.gdtimg.com

[rewrite_local]
# \去\除\发\现\模\块\横\幅\
http:\/\/api\.duitang\.com\/napi\/ads url reject-dict
https:\/\/api\.duitang\.com\/napi\/infra\/settings url reject-dict
# \去\除\分\享\标\签\
https:\/\/www\.duitang\.com\/napi\/hot\/(tag|search)\/(top|list) url reject-dict
# \模\板\广\告\
https:\/\/qzs\.gdtimg\.com\/union\/res\/union_temp_v2\/page\/ANTempMob\/tempMob.package.json url reject
http:\/\/api\.duitang\.com\/napi\/index\/discovery url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/dt.js
# \数\据\流\广\告\
http:\/\/api\.duitang\.com\/napi\/settings url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/dt.js
# \s\v\i\p\
https?:\/\/(www|api)\.duitang\.com\/napi\/people\/me url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/dt.js
https:\/\/www\.duitang\.com\/napi\/vienna\/graphic url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/dt.js

 ***************/

