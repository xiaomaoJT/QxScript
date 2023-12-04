/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-07-04
 *
 * 


\星\座\运\势\
\接\口\数\据\来\自\韩\小\韩\A\P\I\接\口\由\X\i\a\o\M\a\o\进\行\二\次\加\工\

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


2、通过boxjs设置需要查询的信息
🚧 支持的星座有：♈️白羊座（baiyang）、♉️金牛座（jinniu）、♊️双子座（shuangzi）、♋️巨蟹座（juxie）、♌️狮子座（shizi）、♍️处女座（chunv）、♎️天秤座（tiancheng）、♏️天蝎座（tianxie）、♐️射手座（sheshou）、♑️摩羯座（mojie）、♒️水瓶座（shuiping）、♓️双鱼座（shuangyu）

🚧 支持的范围有：今日运势（D）、明日运势（T）、本周运势（W）、本月运势（M）、本年运势（Y）

🚧 星座集合(多个以+号间隔)【填入星座拼音】如 ♊️双子座+♎️天秤座：shuangzi+tiancheng
🚧 范围集合(多个以+号间隔)【填入首字母（大写）】如 今日运势+明日运势：D+T


3、⚠️ 配置文件 [task_local] 标签添加

0 0 9 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/source/hs.js, tag=🌌XiaoMao_星座运势, img-url=https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/icon/star.png, enabled=true



单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoHoroscope.js

********************************/
