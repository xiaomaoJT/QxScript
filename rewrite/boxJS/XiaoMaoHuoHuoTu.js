/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-03-19
 *
 * 


\火\火\兔\刷\激\励\广\告\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHuoHuoTu.js

2、点击页面「广告解锁」按钮激活授权

3、手动运行自动任务刷去积分

⚠️ 配置文件 [task_local] 标签添加

0 0 9 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/hht.js, tag=🐰XiaoMao_火火兔刷激励, img-url=https://raw.githubusercontent.com/Toperlock/Quantumult/main/icon/Doraemon/Doraemon-1099.png, enabled=false



[mitm]
hostname = api.cloud.alilo.com.cn

[rewrite_local]
https:\/\/api\.cloud\.alilo\.com\.cn\/api\/v4\/user-activation\/check-sowing url script-request-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/hht.js

********************************/
