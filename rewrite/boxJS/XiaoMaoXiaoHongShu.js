/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2025-03-05
 *
 * 


\小\红\书\高\清\图\片\捕\获\ + \去\广\告\


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

2、通过boxjs设置
图片捕获模式：1为原始分辨率,2为高质量压缩,3为高像素输出,4为平衡配置，默认为1，0为关闭
图片捕获狂暴模式：1为狂暴，0为标准，默认标准。狂暴模式开启后见图就收。
屏蔽膈应字眼：输入关键字，多个用“,”隔开，可屏蔽标题、用户名恶心字眼

3、访问图片帖子详情，即可触发捕获，请留意通知

4、内置RuCu6广告拦截+XiaoMao去广告



********************************


[mitm]
hostname = *.xiaohongshu.com,sns-img-hw.xhscdn.com

[rewrite_local]
# 图片捕获
https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v2\/note\/widgets url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
http:\/\/sns-img-hw\.xhscdn\.com\/.+?imageView2\/2\/w\/(?:10[8-9]\d|1[1-9]\d{2}|[2-9]\d{3,})\/format url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js

# 去广告
# 信息流加载优化@xiaomao
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v6\/homefeed url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
^https:\/\/www\.xiaohongshu\.com\/api\/sns\/(v1\/ads\/resource|v2\/hey\/\w+\/hey_gallery) url reject-dict
https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v2\/system_service\/splash_config url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
https:\/\/fe\.xiaohongshu\.com\/api\/feresource\/v1\/web url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v1\/system_service\/config url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v2\/system_service\/splash_async_optimization url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
https:\/\/www\.xiaohongshu\.com\/api\/sns\/v3\/system_service\/flag_exp url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
https:\/\/.+\.xiaohongshu\.com\/api(\/v\d+)?\/(collect|spider|data) url reject

# @RuCu6 去广告
# 惊喜弹窗
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v1\/surprisebox\/(get_style|open|submit_action) url reject-dict
^https:\/\/www\.xiaohongshu\.com\/api\/marketing\/box\/trigger\? url reject-dict
# 详情页小部件,关注页感兴趣的人
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v2\/(note\/widgets|user\/followings\/followfeed) url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
# 搜索页
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v1\/search\/(banner|hot)_list url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v4\/search\/(hint|trending)\? url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v10\/search\/notes\? url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
# 开屏广告
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v1\/system_service\/config\? url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v2\/system_service\/splash_config url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
# 图片水印,视频水印
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/(v2\/note\/feed|v3\/note\/videofeed)\? url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
# 图片水印,实况照片水印
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v1\/note\/(imagefeed|live_photo\/save) url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
# 信息流,详情页感兴趣的人
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v3\/note\/guide\? url reject-dict
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v4\/followfeed\? url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js
^https:\/\/.+\.xiaohongshu\.com\/api\/sns\/v5\/recommend\/user\/follow_recommend\? url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/xhs.js


********************************/
