**[QxScript](https://github.com/xiaomaoJT/QxScript)**   ***https://github.com/xiaomaoJT/QxScript***  **@XiaoMao**

**[<< 回到首页](https://github.com/xiaomaoJT/QxScript)** 



------

##### 🎟 XiaoMao频道 · 群组

<div align="center">
<a href="https://t.me/xiaomaoJT" target="_blank">
<img src=https://img.shields.io/badge/Telegram-XiaoMao频道-blue alt=github style="margin-bottom: 5px;" />
</a>
<a href="https://t.me/hSuMjrQppKE5MWU9" target="_blank">
<img src=https://img.shields.io/badge/Telegram-XiaoMao%E7%BE%A4%E8%81%8A-red alt=github style="margin-bottom: 5px;" />
</a>
<a href="https://t.me/Xiao_MaoMao_bot" target="_blank">
<img src=https://img.shields.io/badge/Robot-XiaoMaoBot-orange alt=github style="margin-bottom: 5px;" />
</a>
<a href="https://github.com/xiaomaoJT/xiaomaoJT/blob/main/photo/qrcode.jpg?raw=true" target="_blank">
<img src=https://img.shields.io/badge/WeChat-小帽集团-green alt=github style="margin-bottom: 5px;" />
</a>
</div>



------------
#### 🎟 更新日志 · 说明

| 文件类型 |           更新类型           | 一键更新 |
| :------: | :--------------------------: | :------: |
| 节点资源 | 远程更新（新文件需手动引用） |    🙆‍♂️    |
| 分流资源 | 远程更新（新文件需手动引用） |    🙆‍♂️    |
| 重写资源 | 远程更新（新文件需手动引用） |    🙆‍♂️    |
| 懒人配置 | 手动更新（手动替换更新代码） |    🙅‍♂️    |

> **远程更新方法：**点击 右下角风车 > 节点/分流/重写 > 规则资源 > 全部更新
>
> ⚠️ 远程更新出错，可打开相应文件的资源解析器。

```text
若无解析器，请在配置（右下角风车 > 配置文件 > 编辑）中[general]下添加以下代码

resource_parser_url= https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/resource-parser.js
```

> **针对已引用xiaomao懒人规则，因配置无法远程更新，可选用以下两种方式更新**。
>
> **懒人配置更改：**右下角风车 > 配置文件 > 编辑 ，寻找对应标签替换相应代码。
>
> [🌟 配置代码更改图解](https://github.com/xiaomaoJT/QxScript/blob/main/lazy/xiaomao/xiaomao规则配置图解/小版本配置更新方法.jpg?raw=true)
>
> [🌟 配置标签快速定位](https://github.com/xiaomaoJT/QxScript/blob/main/lazy/xiaomao/xiaomao规则配置图解/配置文件标签快速定位.jpg?raw=true)

| 序号 | 懒人配置更新方法                                             | 注意事项                                                     |
| :--: | :----------------------------------------------------------- | :----------------------------------------------------------- |
|  1⃣️   | 重新下载懒人配置。                                           | 此方式会覆盖之前所有包括节点在内的配置，谨慎操作，请提前备份。 |
|  2⃣️   | 根据更新日志，找到配置文件中对应标签，并手动替换对应标签下代码，右上角保存即可。 | 替换注意保留自己新增的规则代码。                             |



------------

#### 🎟 仓库资源更新日志

> 小帽语：日常更新如**节点订阅更新**、**去广告分流更新**、**去广告重写更新**将不推送更新提示及更新日志，请自行QX软件内开启对应资源的默认更新即可自动获取，最新更新时间以首页或对应资源内说明文字或本页的更新时间为准。
>
> 本仓自3.0版本后 于2022年12月1日起 已持续更新 ***105*** 次
>
> ***最新更新时间 2023.02.11 15:35 ***

+ ##### 20230211

  * > 优化ios懒人配置（增加重写去广告类型：[bili2](https://raw.githubusercontent.com/RuCu6/QuanX/main/Rewrites/Cube/bilibili.snippet),[wyy](https://raw.githubusercontent.com/RuCu6/QuanX/main/Rewrites/Cube/cloudmusic.snippet),[kuwo](https://raw.githubusercontent.com/RuCu6/QuanX/main/Rewrites/Cube/kuwo.snippet)）。
    >

+ ##### 20230207

  * > 优化ios懒人配置（增加微博去广告2）。
    >

+ ##### 20230203

  * > 优化mac懒人配置（增加百度分流），iOS懒人开启ipv6，关闭系统dns。
    >

+ ##### 20230203

  * > 更新xiaomao重写1。
    >
    > 优化懒人自定义版普通节点策略（默认剔除大于1.0倍率的小数位节点 排除带有x5 x0倍率）；优化延迟测试间隔。
    >

+ ##### 20230202

  * > 新增[XiaoMao分流修正脚本](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/filter/ShuntCorrection.list)
    >
    > 更新xiaomao重写1。
    >
    > 优化懒人分流配置：主要针对本地分流（删减）及远程分流（分流首行新增一条）。
    >

+ ##### 20230201

  * > 更新xiaomao重写1。
    >

+ ##### 20230131【懒人配置 4.0版本 · 建议更新⚠️】

  * > 全面优化懒人规则各版本模块配置
    >
    > ```text
    > 本次优化详情：
    > 
    > 1、配置内标签重新排序。
    > 2、策略组：全部更名、取消XiaoMao字样更改为英文辨识（如下文）、取消漏网之鱼策略更改为auto.node捕获。
    > 3、分流规则：全部更名、取消国内分流改为geoip直连、取消games等低效分流。
    > 4、重写规则：全部更名、新增ad.free类型备选脚本、优化xiaomao脚本内容加载。
    > 5、三大版本均有更新，版本特点已更新至仓库首页，本页上滑至顶部可通过按钮快速跳转首页。
    > 6、新增xiaomao重写5聚合脚本。
    > 7、剔除所有无关主机名，减少MitM（务必开启xiaomao重写1）。
    > 8、3.0版本仍然保留，请见首页历史版本处。
    > 9、采用部分替换方式更新，替换后需长按右下角风车全量更新一次。
    > 
    > # 建议在「其他设置」里「GeoLite2」的「来源」填写使用下面链接「任选一个」，并开启「自动更新」
    > # https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb
    > # https://github.com/Hackl0us/GeoIP2-CN/raw/release/Country.mmdb
    > ```
    >
    > ```javascript
    > # 规则命名声明
    > # S. - 静态策略组
    > # U. - 自动延迟测速策略
    > # A. - 健康策略
    > # common - 自动延迟测速策略 - 普通节点
    > # optimize - 自动延迟测速策略 - 优选节点
    > # opt.地区 - 自动延迟测速策略 - 优选地区节点
    > # screen - 自动延迟测速策略 - 热门地区节点
    > # ordinary - 自动延迟测速策略 - 优选节点
    > # ord.地区 - 自动延迟测速策略 - 优选地区节点
    > # auto.node - 自动节点
    > # escape.node - 兜底节点
    > # netease.music - 网易云
    > # XiaoMao.Node - 节点类型
    > # XiaoMao.F - 分流类型
    > # (standby) - 备用类型
    > # XiaoMao.Rw / XiaoMao.R - 重写类型
    > # (L) - 轻量
    > # (H) - 重度
    > # (ad.free) - 去广告
    > # (Menber) - vip
    > # XiaoMao.T - 自动任务
    > ```
    >
    > ⚠️⚠️**本次更新均建议升级，请根据自身使用替换各模块内容或重新下载配置。**
    >
    > ⚠️⚠️***配置内注释项及软件内默认未开启的规则均为有效附加能力*，请务必清楚了解其所造成的隐私及安全风险后按需启用**

+ ##### 20230130

  * > 新增[XiaoMao_XMind自定义脚本](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoXMind.js)
    >
    > 更新xiaomao重写1。
    >
    > 更新懒人重写配置。
    >

+ ##### 20230129

  * > 更新XiaoMaoButterCamera脚本。
    >

+ ##### 20230118

  * > 更新脚本路径。
    >
    > 更新懒人重写配置。
    >
    > 新增[XiaoMao_ScanningAlmighty自定义脚本](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoScanningAlmighty.js)
    >

+ ##### 20230117

  * > 新增[XiaoMao_B612相机自定义脚本](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoKaJi.js)
    >
    > 新增[XiaoMao_wps自定义脚本](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoWps.js)
    >
    > 更新xiaomao重写1。
    >

+ ##### 20230116

  * > 新增[XiaoMao_黄油相机自定义脚本](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoButterCamera.js)
    >
    > 优化其它XiaoMaoBoxJs脚本。
    >
    > 更新xiaomao重写1。
    >

+ ##### 20230114

  * > 更新懒人规则DNS配置。
    >

+ ##### 20230113

  * > 新增[XiaoMao_百度云自定义脚本](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoBaiDuCloud.js)
    >
    > 更新xiaomao重写1和重写3。
    >
    > 更新xiaomaoBoxJs。
    >

+ ##### 20230106

  * > 修复 djy 脚本远程引用路径问题。
    >

+ ##### 20230103

  * > 新增[XiaoMao_彩云自定义脚本](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoCaiYunWeather.js)
    >
    > 优化部分BUG及404链接。
    >

+ ##### 20221230

  * > 新增[XiaoMao_rw4远程重写](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/QX_XiaoMao_rw4.conf)
    >
    > 优化懒人DNS配置
    >

+ ##### 20221201【懒人配置 3.0版本 】

  * > 全面优化懒人规则各版本模块配置
    >
    > ```text
    > 本次优化详情：
    > 
    > 1、重新定义懒人三大版本区别。
    > · 通用版：主打精简，策略组自带默认配置。（XiaoMao推荐）
    > · 自定义版：主打自定义+聚合，策略组均可自定义配置，各模块丰富资源备用选择）
    > · Mac版：主打精简+自定义，策略组均可自定义配置，专为Mac设计。
    > 
    > 2、优化策略组配置。
    > 3、优化调用分流顺序。
    > 4、优化重写配置集。
    > 5、移除多余hostname。
    > ```
    >
    > ⚠️⚠️**配置内默认未开启的规则均为有效附加能力，请务必清楚了解其所造成的隐私及安全风险后按需启用**





------

##### 🎟 Visitor Counter

<div align="left">
<img src="https://komarev.com/ghpvc/?username=xiaomaoJT&&style=flat-square" align="center" />
</div>




------------

#### 🎟 ***声明***

- 此项目中仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
- 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
- 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
- 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
- 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
- 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我将在收到认证文件确认后删除此脚本。
- 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

