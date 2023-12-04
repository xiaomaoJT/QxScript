/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-08-02
 *
 * 

\彩\云\天\气\个\人\t\o\k\e\n\捕\获\
仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、清除彩云天气缓存，重新登录

2、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器 > ⚠️打开插入资源
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/cyw_token_get.js

3、搭配token可实现会员多端共享 （教程地址：https://t.me/xiaomaoJT/710）


须知：
1、不可与其他脚本共存，捕获个人数据，本脚本导入必须打开插入资源开关
2、仅用于捕获Token，将与其他会员脚本冲突，导致会员重写失效，用后即关
3、为避免软件缓存，建议重新登录后再执行捕获
4、捕获说明，打开彩云App即可自动捕获（仅适配Pro版本，普通版未测试）

********************************

[mitm]
hostname = biz.caiyunapp.com,biz.cyapi.cn

[rewrite_local]
https?:\/\/biz\.(caiyunapp|cyapi)\.(com|cn)\/(membership_rights|v2\/user) url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/cyw_token_get.js


 ***************/

var obj = JSON.parse($response.body);
let requestUrl = $request.url;
if (
  /^https?:\/\/biz\.(caiyunapp|cyapi)\.(com|cn)\/(membership_rights|v2\/user)?/.test(
    requestUrl
  )
) {
  if (obj.result.hasOwnProperty("token")) {
    $notify(
      "XiaoMao提示",
      "彩云天气个人Token获取成功",
      "个人Token为:" + "\n" + obj.result.token
    );
  } else {
    $notify(
      "XiaoMao提示",
      "彩云天气个人Token获取失败",
      "请清除彩云天气缓存，退出登录后重新登录再试！"
    );
  }
}

$done({});
