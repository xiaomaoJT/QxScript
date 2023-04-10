/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-04-10
 *
 * 

\每\日\b\i\n\g\图\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

0 0 8 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoBingPic.js, tag=每日Bing图自动推送, img-url=https://raw.githubusercontent.com/shoujiqiyuan/PokemonGOforQuanX/master/IconSet/Z006.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoBingPic.js

********************************/

$notify("每日Bing图","","早上好，好事即将发生～",{"open-url":"https://apis.jxcxin.cn/api/Bing","media-url":"https://apis.jxcxin.cn/api/Bing",});setTimeout(()=>{$done({})},1000);