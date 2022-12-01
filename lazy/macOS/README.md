**[QxScript](https://github.com/xiaomaoJT/QxScript)**   ***https://github.com/xiaomaoJT/QxScript***  **@XiaoMao**

**[<< 回到首页](https://github.com/xiaomaoJT/QxScript)** 



------------

#### 🎟 QuantumultX 懒人配置XiaoMao Mac版

| **最近更新时间**     | **2022年11月27日**          |
| :------------------- | :-------------------------- |
| **MacOS版本**        | **Monterey 12.4 、 M1芯片** |
| **QuantumultX 版本** | **Ipad/Iphone版 1.1.0**     |

- [XiaoMao懒人配置 - Mac版](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/xiaomao/QX_Mac/QuantumultX_XIAOMAO_Mac.conf)

------------

#### 🎟 使用前需知

> 本配置仅适用于M芯片，请于App Store中下载Ipad/Iphone版QuantumultX即可使用。ipad及iPhone设备建议使用[手机版配置](https://github.com/xiaomaoJT/QxScript)。

> **鉴于Mac的使用习惯及环境，本配置有别于XiaoMao ios端懒人配置，仅保留核心内容，关闭所有重写及自动任务，剔除绝大部分MitM监听。**

```text
当前版本仅保留以下功能 【主要用于科学上网及广告拦截】

- 广告拦截、隐私保护等
- 机场订阅【已剔除网易云相关订阅，若需添加，请自行从手机版配置中添加网易云节点[server_remote]、网易云策略组[policy]及网易云分流[filter_remote]】
- SubStore订阅【信任证书方可使用】
- XiaoMao分流割离，针对GitHub、Google、YouTube等新建单独策略组分流
- 重写默认关闭【功能保留，自行按需开启】
- 剔除大量无关MitM【如需使用部分重写，请自行从手机版配置中添加已删除的hostname】
- 保留证书【可自行下载或安装XiaoMao提供的证书】
```

```text
⚠️使用须知⚠️
1⃣️ 生效前需通过其他代理软件【科学上网】进行QX配置下载及资源更新，否则无法将出现连接服务器的情况。推荐代理软件ClashX Pro，软件下载请见下文相关附件处。
2⃣️ 本配置生效后，将会与本机上其他系统级代理软件冲突，有且仅有一个能够生效，请注意规避。
3⃣️ 通过其他代理软件设置了代理端口，例如通过ClashX配置的Telegram的socks5端口，本配置生效后请于相应软件内关闭代理，本配置生效后自带国际分流，无需再设置代理，否则软件将无法联网。

❗️小贴士❗️
1、QX启用后即可关闭软件，会自动驻留进程，无需最小化保留，目前版本暂无状态栏图标。
2、出现已挂起情况，即检查Mac网络问题，一般是网络问题导致，如网络中断。
3、考虑到Mac办公环境，部分策略组类似隐私、广告等请选择性开启REJECT，避免误拦截重要信息。
4、如无需科学上网等需求，可将首页策略组分流节点改为 DIRECT，主要包括【XiaoMao-自动节点、XiaoMao-漏网之鱼、XiaoMao-苹果IP】。
5、如遇Mac ID账号或AppStore账号无法登陆、软件无法下载，可试试将【XiaoMao-苹果IP】策略改完【XiaoMao-Auto等】。
6、QX证书需手动进行信任操作，否则安装后也无法生效，不开MitM亦可，即当前配置内SubStore无法生效。
7、第一次配置需要科学上网。第一次配置需要科学上网。第一次配置需要科学上网。
```
- 相关附件[ClashX Pro 点击下载](https://install.appcenter.ms/users/clashx/apps/clashx-pro/distribution_groups/public)



------------

#### 🎟 更新日志 

> 📖<span id='update'> [仓库资源更新日志](https://github.com/xiaomaoJT/QxScript/blob/main/UPDATELOG.md)</span>

##### 

------------

#### 🎟 配置教程
> [图解教程](https://github.com/xiaomaoJT/QxScript/tree/main/lazy/xiaomao/QX_Mac/Mac配置图解)

##### 🚇 第一步，下载并安装QX。
> App Store搜索Quantumult X，并选择 ipad/iphone 版本下载安装。
>
> 下载QX需要外区账号，付费下载。

###### 

##### 🚇 第二步，下载QX配置。
> [XiaoMao懒人规则 - Mac版 链接](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/xiaomao/QX_Mac/QuantumultX_XIAOMAO_Mac.conf)

```text
- 点击右下角风车
- 找到配置文件
- 选择下载配置 
- 输入懒人配置文件地址，右上角确认
```


##### 🚇 第三步，下载并安装证书。

```text
- 复制证书地址，到Safari打开，将自动下载证书
- 点击已下载的证书进行安装，请注意安装到 **系统** 位置，其他位置将不生效。
- 点击已安装的证书，进行手动信任（必需信任，否则无法生效）。
```
```text
- 或可通过 右下角风车 > MitM > 配置证书 ，进行证书下载，之后完成信任操作即可。
- 若不需要使用MitM解析，则可无需开启MITM功能，当前配置默认仅用于substore。
```



##### 🚇 第四步，QX，启动！

```text
- 配置及MitM下载完毕，即可到首页开启QX开关。
- 本配置自带节点，将自动进行资源搭桥，可手动对各模块资源进行全部更新操作即可生效。
- 若节点资源提示无法连接服务器等报错，请开启其他代理软件后，手动更新一次节点资源即可。
- 策略组分流，可根据自身使用习惯进行策略选择，或参考图解
```
```text
- 首页节点
- 自定义策略组
- 选择自定义分流配置即可
- 选择类型：【direct, proxy, reject ，auto 】：即直连 代理 拒绝 自动选择
- 广告类型可选择拒绝【reject】
- 外网类型选择代理或自动选择【proxy】或【自动选择】
- 国内站点选择直连【direct】
- 国内出现访问问题时，可考虑关闭部分规则或开启直连【direct】
```