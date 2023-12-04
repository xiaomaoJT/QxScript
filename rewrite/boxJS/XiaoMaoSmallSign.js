/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-08-18
 *
 * 

\微\信\小\程\序\小\小\签\到\薅\金\币\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoSmallSign.js

2、访问微信小程序 「小小签到」 或 通过微信小程序链接访问 「#小程序://小小签到/myEWlJZ1Tlrbmob」

3、点击个人中心，自动获取Token，请注意QX通知弹窗

4、配置文件 [task_local] 标签添加
0 0 10 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/ss.js, tag=🐣XiaoMao_小小签到_自动获取金币, img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/KittyLink.png, enabled=false

5、先决条件：token时效较短，请确保token有效，失效请重新获取；每日执行最大次数为30次，脚本一次运行即执行完毕。

6、建议手动执行


[mitm]
hostname = api-xcx-qunsou.weiyoubot.cn

[rewrite_local]
https:\/\/api-xcx-qunsou\.weiyoubot\.cn\/xcx\/checkin\/v3\/vip url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/ss.js

********************************/
