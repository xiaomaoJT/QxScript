/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-08-14
 *
 * 


\每\日\油\价\
\预\设\为\每\天\早\八\点\执\行\
\默\认\获\取\广\东\油\价\数\据\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

1、使用BoxJS增加以下脚本订阅。
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置需要获取油价的省市区信息
【🚧未填写默认获取广东油价数据】
【🚧省市区填写注意事项：1、填写省市区拼音即可 如广东填写guangdong 2、不可跨行政区填写 如广东深圳南山 需分别填写guangdong shenzhen nanshan 不可省略shenzhen 3、有误请反馈】


3、⚠️ 配置文件 [task_local] 标签添加

0 0 8 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/yj.js, tag=⛽️XiaoMao_每日油价, img-url=https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/icon/oil.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoYouJia.js

********************************/
