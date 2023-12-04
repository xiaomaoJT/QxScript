/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-05-19
 *
 * 

\网\页\版\百\度\贴\吧\解\禁\+\路\由\获\取\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoBaiDuTieBa.js

********************************

[mitm]
hostname = wapp.baidu.com

[rewrite_local]
https?:\/\/wapp\.baidu\.com\/p\/[0-9]{3,}\?query url script-response-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/bdtb.js
 ***************/

