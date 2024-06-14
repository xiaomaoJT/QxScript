/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-06-14
 *
 * 


\小\红\书\高\清\图\片\捕\获\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript



使用方法：

1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoXiaoHongShu.js

2、通过boxjs设置图片捕获模式
1为原始分辨率,2为高质量压缩,3为高像素输出,4为平衡配置，默认为1

3、访问图片帖子详情，即可触发捕获，请留意通知



********************************


[mitm]
hostname = edith.xiaohongshu.com

[rewrite_local]
https:\/\/edith\.xiaohongshu\.com\/api\/sns\/v2\/note\/widgets url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js


********************************/
