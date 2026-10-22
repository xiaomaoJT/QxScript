/**************************
 * @Author: XiaoMao
 * @LastMod: 2026-10-22
 *

仅供学习参考，请于下载后24小时内删除

********************************
# 逆向分析工具链（4 合 1）
# 使用方法：
# 1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoReverseTools.js
# 2、四个脚本默认处于「未配置态」：只会捕获你真实命中的 host/path，并在日志/通知里给出可复制的专属配置
# 3、研究具体 App 时，把下面 hostname 改成该 App 的域名，并把对应脚本里 CONFIG.hosts 填成同一域名即可锁定目标
# 4、脚本详细说明见仓库 NEW.md（README 首页有跳转）
# XiaoMao · TG频道：https://t.me/ListenToMao
# XiaoMao · GitHub：https://github.com/xiaomaoJT/QxScript

[mitm]
hostname = *

[rewrite_local]
https?:\/\/ url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/sign_lab.js
https?:\/\/ url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/resp_inspector.js
https?:\/\/ url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/ad_block.js
https?:\/\/ url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/vip_patch.js

********************************/
