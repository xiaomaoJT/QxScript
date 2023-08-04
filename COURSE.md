**[QxScript](https://github.com/xiaomaoJT/QxScript)**   ***https://github.com/xiaomaoJT/QxScript***  **@XiaoMao**

**[<< 回到首页](https://github.com/xiaomaoJT/QxScript)** 



------------

#### 🎟 使用教程

|       教程目录       |                        远程订阅精品库                        |
| :------------------: | :----------------------------------------------------------: |
|  [懒人规则](#lazy)   |                    [ 自动脚本库](#autoku)                    |
| [节点配置](#server)  |                     [ BoxJs库](#boxjsku)                     |
| [分流配置](#filter)  |                      [ 图标库](#iconku)                      |
| [重写配置](#rewrite) |                                                              |
|  [自动任务](#auto)   | 🧰 [QuantumultX图文教程 - 从入门到进阶](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzI3MjE3NTc4OA==&scene=1&album_id=2740008142629273602&count=3#wechat_redirect) |
| [本地脚本](#script)  |                                                              |



------------

##### 🎟 <span id='lazy'> 懒人规则</span>

> 规则首次启用需科学上网，若无上网环境，可参考以下教程文章底部。
>
> [三分钟免费注册外区Apple ID 教程](https://mp.weixin.qq.com/s/YzYsF9QyHZVJK9P7bsrURQ)

> 懒人规则：即已包装好的QuantumultX规则，可直接下载导入，软件自动对各模块进行配置。

```text
懒人配置下载方法：
⚠️ 配置下载需科学上网。
⚠️ 下载懒人规则将自动覆盖之前所有规则，请注意提前备份资源地址。

1⃣️ 点击右下角风车
2⃣️ 找到配置文件
3⃣️ 选择下载配置 
4⃣️ 输入懒人配置文件地址，右上角确认
```

```javascript
//XiaoMao懒人规则文件地址：

//通用版地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/iOS/general/QX_XiaoMao.conf

//自定义版地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/iOS/custom/QX_XiaoMao.conf

//Mac版地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/macOS/QX_XiaoMao.conf
```

> **各版本区别**
>
> 通用版：**主打精简**，策略组自带默认配置。**（XiaoMao推荐）**
>
> 推荐人群：适合喜欢简洁、使用需求较少、初学者。
>
> 
>
> 自定义版：**主打自定义+聚合**，策略组均可自定义配置，各模块丰富资源备用选择
>
> 推荐人群：适合喜欢折腾、进阶者。
>
> 
>
> Mac版：**主打精简+自定义**，策略组均可自定义配置。
>
> 推荐人群：专为Mac设计。

```text
懒人规则启用方法：
⚠️ 有两处证书需要手动信任才能完全生效。
⚠️ 通用版自带证书，可直接执行第三步。

1⃣️ 配置完成后，选择MitM
2⃣️ 选择生成证书，自动跳转Safari下载证书
3⃣️ 选择配置证书
4⃣️ 打开手机设置（ios15）> 通用 > vpn与设备管理 > 选择quantumultx证书 > 安装
5⃣️ 打开手机设置（ios15）> 通用 > 关于本机 > 选择证书信任设置 > 信任quantumultx
6⃣️ QuantumultX选择节点，配置机场订阅地址（免费节点https://v2cross.com）
7⃣️ 返回首页，右上角开启即可使用
```

```text
懒人规则策略组配置方法：

1⃣️ 首页节点
2⃣️ 自定义策略组
3⃣️ 选择自定义分流配置即可
4⃣️ 选择类型：【direct, proxy, reject ，auto 】：即直连 代理 拒绝 自动选择
5⃣️ 广告类型可选择拒绝【reject】
6⃣️ 外网类型选择代理或自动选择【proxy】或【自动选择】
7⃣️ 国内站点选择直连【direct】
8⃣️ 国内出现访问问题时，可考虑关闭部分规则或开启直连【direct】
```

```text
# 🎟🎟🎟🎟 使用须知 🎟🎟🎟🎟
# 规则分流拦截需在首页手动勾选☑️对应策略才可生效！
# 🏕 XiaoMao-Screen 热门地区节点优选最优延迟策略
# 🚇 XiaoMao-Auto 所有节点优选最优延迟策略
# 🚇 XiaoMao-Auto-地区 指定地区节点优选最优延迟策略
# 🛰 XiaoMao-Pre 所有节点优选最优延迟策略
# 🛰 XiaoMao-Pre-地区 指定地区节点优选最优延迟策略
# proxy 手动节点选择策略
# direct 直连策略（即不使用代理网络）
# reject 拒绝策略 （拦截、隐私类型分流 如广告等请选择此策略）
```



------------

##### 🎟 <span id='server'> 节点配置</span>

> 节点配置需在QuantumultX开启状态下完成。
>
> 机场节点需要自行购买，价格不一，自行选择。
>
> xiaomao懒人规则自带节点，节点为公益节点每天自动更新，可手动长按进行更新以获取最新节点。
>
> XiaoMao懒人规则自带网易云解锁节点，自动更新。

```text
节点导入方法：
⚠️ 复制所购机场订阅地址，若无法导入，TG搜索 @Xiao_MaoMao_bot 回复转换，进行订阅转换。
⚠️ 部分节点出错或需要过滤，可使用资源解析器或SubStore。

1⃣️ 点击右下角风车
2⃣️ 找到节点
3⃣️ 选择节点资源
4⃣️ 右上角导入
5⃣️ 输入节点订阅地址即可，标签可自行命名，右上角确认
```



------------

##### 🎟 <span id='filter'> 分流配置</span>

> 分流配置需在QuantumultX开启状态下完成。
>
> 因导入的批量规则不支持单独设置、禁用等，故除懒人配置内的规则将按类型单独展示与引用，方便后续按需调配。

```text
分流引用方法：

1⃣️ 点击右下角风车
2⃣️ 找到分流
3⃣️ 选择规则资源
4⃣️ 右上角导入
5⃣️ 输入分流文件地址即可，标签可自行命名，右上角确认
6⃣️ 或可选择分流规则进行单独配置
```



------------

##### 🎟 <span id='rewrite'> 重写配置</span>

> 重写配置需在QuantumultX开启状态下完成。
>
> 因导入的批量规则不支持单独设置、禁用等，故除懒人配置内的规则将按类型单独展示与引用，方便后续按需调配。

```text
重写引用方法：

1⃣️ 点击右下角风车
2⃣️ 找到重写
3⃣️ 选择规则资源
4⃣️ 右上角导入
5⃣️ 输入重写文件地址即可，标签可自行命名，右上角确认
6⃣️ 或可选择重写规则进行单独配置
```



------------

##### 🎟 <span id='auto'> 自动任务</span>

> 自动任务配置需在QuantumultX开启状态下完成。
>
> 自动任务可能需要配合BoxJS使用。

```text
自动任务引用方法：

1⃣️ 点击右下角风车
2⃣️ 找到工具&分析
3⃣️ 选择构造HTTP请求
4⃣️ 右上角第一个，增加
5⃣️ 右上角增加
6⃣️ 输入自动任务文件地址即可，确认
7⃣️ 选择需要的自动任务添加即可
```



##### 🎟 <span id='script'> 本地脚本使用方法</span>

> 本地脚本，即把脚本文件放在本地（手机文件夹内）直接调用，无需拉取远程资源
>
> 本地脚本分两种路径，1⃣️ iCloud本地 2⃣️ 我的iPhone本地

```text
1⃣️ iCloud本地
当 QX设置 > 其他设置 > 资源 > iCloud云盘 按钮打开时，即开启了iCloud模式，资源将默认访问iCloud端。
或通过 QX设置 > 其他设置 底部版本号，云朵标志即为开启。

本地脚本资源存放位置：文件 > iCloud > QuantumultX > Scripts 
引用方式：直接输入脚本名称即可引用，如 xxx.js ......

2⃣️ iPhone本地
未开启iCloud 或通过 QX设置 > 其他设置 底部版本号，花边圆圈标志即为关闭。

本地脚本资源存放位置：文件 > 我的iPhone > QuantumultX > Scripts 
引用方式：直接输入脚本名称即可引用，如 xxx.js ......

3⃣️ 小知识
当QX安装成功后，将自动在本地创建QuantumultX文件夹，其中包含3个子文件夹，分别是
Scripts：用于存放规则文件
Profiles：用于存放配置文件
Images：用于存放图片文件

同时，在开启后iCloud后，将提升QX共享校验等级（3个），未开启iCloud则为（8个），自用无限制，超出账号内QX将永久失效。

via开发者：
1、不开 iCloud 只能验证到第 8 台设备。
2、开启 iCloud ，有 3 个 iCloud 辅助验证名额，使用 iCloud 验证并无设备数量限制。极端点，自用设备 1000 台也不会受影响。
3、无法靠登出自己当前的 iCloud 再登入别人已验证的 iCloud 来辅助验证，以当前设备第一次（或还原系统后第一次）启用的 iCloud 为准。
注：可以美区 App Store 其他区域的 iCloud，以首次使用 Quantumult X 并开启 iCloud 功能的 iCloud 为准。

```



------------

#### 🎟 远程订阅精品库

> 感谢@各位原作者的无私奉献 / 以下排名不分前后。



------

##### 🎟 <span id='autoku'> 自动任务订阅合集</span>

```text
自动任务添加方法：

QX首页 > 右下角小风车左边上三条横杠图标 > 右上角第一个三叠层图标
添加以下自动脚本库即可。

脚本库可能需要搭配Boxjs使用，具体详见对应脚本使用说明。
```

| 序号  |                         自动任务订阅                         |
| :---: | :----------------------------------------------------------: |
|   1⃣️   | [UI脚本合集](https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/UI-Action.json) |
|   2⃣️   | [cron task](https://dove.589669.xyz/task2qxgallery?img=1&sub=https://raw.githubusercontent.com/ChuheGit/1/main/Surge/Module/Task.sgmodule) |
|   3⃣️   | [blackmatrix7](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/script/gallery.json) |
|   4⃣️   | [gather](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1/gather_task.json) |
|   5⃣️   | [JD_task](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1/JD_task.json) |
|   6⃣️   | [QuantumultX_Task](https://raw.githubusercontent.com/w37fhy/QuantumultX/master/QuantumultX_Task.json) |
|   7⃣️   | [faker](https://cdn.jsdelivr.net/gh/shufflewzc/faker@main/qx.json) |
| **8⃣️** | **[XiaoMao脚本订阅](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoAutoTask.json)** |



------

##### 🎟 <span id='boxjsku'> BoxJs订阅合集</span>

```text
BoxJs订阅添加方法：

Safari浏览器 打开网址 http://boxjs.com > 底部菜单 订阅 > 选择右上角➕图标  
添加以下脚本库地址即可。

打开网址需要boxjs重写，xiaomao懒人规则内自带，未添加请详见懒人[rewrite_remote]标签内。
此库不可单独使用，需搭配自动脚本库。
```

|  序号  |                          BoxJs订阅                           |
| :----: | :----------------------------------------------------------: |
|   1⃣️    |             [ooxx](https://ooxx.be/js/box.json)              |
|   2⃣️    | [NobyDa](https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json) |
|   3⃣️    | [Peng-YM](https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/box.js.json) |
|   4⃣️    | [chavyleung](https://raw.githubusercontent.com/chavyleung/scripts/master/box/chavy.boxjs.json) |
|   5⃣️    | [chouchoui](https://raw.githubusercontent.com/chouchoui/QuanX/master/vei.boxjs.json) |
|   6⃣️    | [evilbutcher](https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json) |
|   7⃣️    | [lowking](https://raw.githubusercontent.com/lowking/Scripts/master/lowking.boxjs.json) |
|   8⃣️    | [songyangzz](https://raw.githubusercontent.com/songyangzz/QuantumultX/master/syzzzf.box.json) |
|   9⃣️    | [toulanboy](https://raw.githubusercontent.com/toulanboy/scripts/master/toulanboy.boxjs.json) |
|   🔟    | [zZPiglet](https://raw.githubusercontent.com/zZPiglet/Task/master/zZPiglet.boxjs.json) |
|   1⃣️1⃣️   | [id77](https://raw.githubusercontent.com/id77/QuantumultX/master/box.json) |
|   1⃣️2⃣️   | [dompling](https://raw.githubusercontent.com/dompling/Script/master/dompling.boxjs.json) |
|   1⃣️3⃣️   | [iRingo](https://github.com/VirgilClyne/iRingo/blob/main/box/iRingo.boxjs.json?raw=true) |
| **1⃣️4⃣️** | **[XiaoMaoBoxJS订阅](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json)** |



------------

##### 🎟 <span id='iconku'> 图标订阅合集</span>

```text
图标添加方法：

QX首页 > 长按任意机场组/策略组 > 选择图标 > 右上角➕ 
添加以下图标库地址即可。
```

| 序号 |                           图标订阅                           |
| :--: | :----------------------------------------------------------: |
|  1⃣️   | [Qure（彩色1）](https://github.com/Koolson/Qure/raw/master/Other/QureColor-All.json) |
|  2⃣️   | [Qure（黑白）](https://github.com/Koolson/Qure/raw/master/Other/QureLight-All.json) |
|  3⃣️   | [Qure（彩色2）](https://raw.githubusercontent.com/Koolson/Qure/master/Other/QureColor.json) |
|  4⃣️   | [Qure（mini）](https://raw.githubusercontent.com/Koolson/Qure/master/Other/Quremini.json) |
|  5⃣️   | [Orz-3（mini style）](https://github.com/Orz-3/mini/raw/master/mini.json) |
|  6⃣️   | [Orz-3（big style）](https://github.com/Orz-3/mini/raw/master/Color%2B.json) |
|  7⃣️   | [Orz-3（mini color）](https://raw.githubusercontent.com/Orz-3/mini/master/miniColor.json) |
|  8⃣️   | [tugepaopao](https://raw.githubusercontent.com/tugepaopao/Image-Storage/master/other/Cute.json) |
|  9⃣️   | [PokemonGo](https://raw.githubusercontent.com/shoujiqiyuan/PokemonGOforQuanX/master/PokemonGo.json) |
|  🔟   | [WSL33099](https://raw.githubusercontent.com/WSL33099/QuantumultX/main/Icon/Collection/Tubiao.json) |
|  1⃣️1⃣️  | [小猫咪1](https://raw.githubusercontent.com/LovedGM/Quantumult-X-TuBiao/d9790e7036861013a4c8fd51990888b1674b9ee1/maomi.json) |
|  1⃣️2⃣️  | [小猫咪2](https://raw.githubusercontent.com/Yuanxsxs/QtumultX/master/Icon/Catcat.json) |
|  1⃣️3⃣️  | [姿势1](https://github.com/LovedGM/Quantumult-X-TuBiao/raw/main/zishi.json) |
|  1⃣️4⃣️  | [姿势2](https://raw.githubusercontent.com/LovedGM/Quantumult-X-TuBiao/main/zishi-cs.json) |
|  1⃣️5⃣️  |      [hellcell](https://github.com/zc-nju-med/hellcell)      |
|  1⃣️6⃣️  | [哆啦A梦](https://raw.githubusercontent.com/Toperlock/Quantumult/main/D-icons.json) |
|  1⃣️7⃣️  | [植物大战僵尸](https://raw.githubusercontent.com/shoujiqiyuan/PVSZforQuanX/master/PVSZ.json) |
|  1⃣️8⃣️  | [数码宝贝](https://raw.githubusercontent.com/shoujiqiyuan/DigimonforQuanX/master/Digimon.json) |
|  1⃣️9⃣️  | [EMBY](https://raw.githubusercontent.com/code170202/emby-icon/main/package.json) |
|  2⃣️0⃣️  | [color](https://raw.githubusercontent.com/Onlookers-Group/Texonin-LAB-Public/main/Quantumult(X)/Icon/color/color.json) |
|  2⃣️1⃣️  | [tubiao](https://raw.githubusercontent.com/Softlyx/Fileball/main/YUAN/tubiao.json) |
|  2⃣️2⃣️  | [theraw](https://raw.githubusercontent.com/Twoandz9/Emby-icons/main/TheRaw.json) |
|  2⃣️3⃣️  | [ligeicon](https://raw.githubusercontent.com/lige47/QuanX-icon-rule/main/ligeicon.json) |
|  2⃣️4⃣️  | [vvv](https://raw.githubusercontent.com/LovedGM/Quantumult-X-TuBiao/a6da7ef83e55a098bc7e9b793a670bbdfde5e36e/yyy.json) |
|  2⃣️5⃣️  | [maomi](https://raw.githubusercontent.com/LovedGM/Quantumult-X-TuBiao/d9790e7036861013a4c8fd51990888b1674b9ee1/maomi.json) |
|  2⃣️6⃣️  | [zishi-cs](https://raw.githubusercontent.com/LovedGM/Quantumult-X-TuBiao/main/zishi-cs.json) |
|  2⃣️7⃣️  | [icons](https://raw.githubusercontent.com/LovedGM/Quantumult-X-TuBiao/main/zishi-cs.json) |
|  2⃣️8⃣️  | [icon-gallery](https://raw.githubusercontent.com/erdongchanyo/icon/main/edc-country-icon-gallery.json) |
|  2⃣️9⃣️  | [edc-country](https://raw.githubusercontent.com/erdongchanyo/icon/main/edc-filter-icon-gallery.json) |
|  3⃣️0⃣️  | [semporia](https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Semporia.json) |
|  3⃣️1⃣️  | [edc-airport](https://raw.githubusercontent.com/erdongchanyo/icon/main/edc-airport-icon-gallery.json) |
|  3⃣️2⃣️  | [icons-all](https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/icons-all.json) |
|  3⃣️3⃣️  | [dongzuo](https://raw.githubusercontent.com/LovedGM/Quantumult-X-TuBiao/main/dongzuo.json) |
|  3⃣️4⃣️  | [火影忍者](https://raw.githubusercontent.com/Toperlock/Quantumult/main/Naruto-icons.json) |
|  3⃣️5⃣️  | [进击的巨人](https://raw.githubusercontent.com/Toperlock/Quantumult/main/AOT-icons.json) |

