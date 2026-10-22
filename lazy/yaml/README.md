**[QxScript](https://github.com/xiaomaoJT/QxScript)**   ***https://github.com/xiaomaoJT/QxScript***  **@XiaoMao**

**[<< 回到首页](https://github.com/xiaomaoJT/QxScript)** 



------------

##### 🎟 XiaoMao_Clash 配置说明

> **前言：**针对QuamtumultX的Mac版本，XiaoMao调试了有一段时间了，由于QuamtumultX当前版本暂未有完全支持Mac端的版本，得益于M芯片的优势，我们所安装运行的只是ipad设备类型，也可能是其他种种原因吧，在实际运用中经常遇到网站加载缓慢、DNS解析迟缓等问题，且暂未有比较优质的解决方案
>
> 故借此机会打造一款Clash配置，它将服务于所有Mac、Windows、Android设备。
>
> **Clash各版本下载链接见文末～！**



#### **XiaoMao_Clash @1.0**

[		🏖 **XiaoMao_Clash 配置 - 懒人版**](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/yaml/Clash_XiaoMao.yaml)

[		⛱ **XiaoMao_Clash 配置 - 模版**](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/yaml/Clash_XiaoMao_template.yaml)



> 在使用Clash前你得明白一点，不同于QuamtumultX模块化配置，Clash的配置主要依赖于 **proxies、proxy-groups、rules** 三大参数，即 **节点组、策略组、规则**。其所呈现出来的效果便是节点与策略相互绑定，故无法实现单独的节点导入，也就不存在懒人这一说。
>
> 但也事无绝对：
>
> 1⃣️ **XiaoMao_Clash 配置 - 懒人版：**懒人版基于 🎟XiaoMao-Forever ，即导即用，此配置同样支持远程更新，更新间隔时间不定，因源于免费节点，可能会受限于节点速度等，请知悉～
>
> 2⃣️ **XiaoMao_Clash 配置 - 模版：**同时搭建的一份Clash模板配置，此配置内置了策略组及基础分流，需自行通过导入 proxies 并配置相应proxy-groups方可使用。



------

##### 🎟 如何下载配置？

> **以下教程以Mac端ClashX Pro为例。**
>
> 
>
> 1⃣️ 链接形式导入配置
>
> 状态栏Clash图标 > 配置 > 托管配置 > 管理 > 添加。
>
> 
>
> 2⃣️ 文件形式引入
>
> 状态栏Clash图标 > 配置 > 打开配置文件夹 > 放入配置文件
>
> 状态栏Clash图标 > 配置 > 重载配置文件
>
> 状态栏Clash图标 > 配置 > 选择新配置（一般配置名与文件名一致）
>
> 
>
> ⚠️ 由于配置带有远程资源，第一次配置可能需要特殊网络环境用以加载远程规则。
>
> 
>
> ⛱ 资源加载完成即可正常使用。
>
> 状态栏Clash图标 > 出站模式 > 规则判断
>
> 状态栏Clash图标 > 设置为系统代理
>
> 
>
> 建议在 状态栏Clash图标 > 配置 > 实验性功能 > 更新ip数据库 中填写以下链接
>
> *# https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country-only-cn-private.mmdb*



------

##### 🎟 如何使用？

> XiaoMao_Clash配置自带分流及策略组。
>
> 
>
> 1⃣️ 分流说明
>
> 分流为远程分流资源，可实现自动更新，包含 规则修正、广告拦截、隐私防护、反劫持、苹果服务分流、github服务分流、微软服务分流、谷歌服务分流、国外网络分流、国外媒体分流、国内分流、兜底分流
>
> 
>
> 2⃣️ 策略组说明
>
> 策略组共包含静态策略（综合策略、git服务、谷歌服务、微软服务、苹果服务、手动选择）6个，自动延迟策略（全部节点、香港节点、台湾节点、日本节点、美国节点、新加坡节点）6个。
>
> 可针对不同策略组进行单独的规则分流，综合策略统管所有国外分流及兜底分流，可通过手动选择策略进行任一节点的自由选择。

------



##### 🎟 Clash Premium 各版本下载地址

- [Clash Premium 命令行版](https://github.com/Dreamacro/clash/releases/tag/premium)（适用于 Windows、macOS、Linux、OpenWRT 等多种平台）
- Clash Premium **图形用户界面版**
  - [ClashX Pro](https://install.appcenter.ms/users/clashx/apps/clashx-pro/distribution_groups/public)（适用于 macOS）
  - [Clash for Windows](https://github.com/Fndroid/clash_for_windows_pkg/releases)（适用于 Windows、macOS、Linux）
  - [Clash for Android](https://github.com/Kr328/ClashForAndroid/releases)（适用于 Android）
- [Clash for Windows文档](https://docs.cfw.lbyczf.com/)



------



##### 🎟 XiaoMao_Clash 模板预览

```yaml
# Clash 配置模板XiaoMao版【作者】XiaoMao
# 最近更新时间 20230310
# XiaoMao_Clash @1.0


# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/ListenToMao
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript

# ❕❕❕❕XiaoMao提示❕❕❕❕
# 配置内注释项及软件内默认未开启的规则均为有效附加能力，请务必清楚了解其所造成的隐私及安全风险后按需启用

# 建议在更新IP数据库选项中填写下面链接
# https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country-only-cn-private.mmdb


# ⚠️⚠️⚠️请注意⚠️⚠️⚠️
# 本模板为样例模版，还需自行补充内容方可生效。
# 第一次使用时需要特殊环境以拉取远程规则。

# 懒人版Clash配置见以下链接
# https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/yaml/Clash_XiaoMao.yaml



# 代理端口
mixed-port: 7890
# 是否允许局域网代理
allow-lan: true
bind-address: "*"
# 运行模式
mode: rule
# 日志类型
log-level: info
# 外部控制
external-controller: "127.0.0.1:9090"
dns:
  enable: true
  listen: "127.0.0.1:53"
  # ipv6连接
  ipv6: false
  default-nameserver: [223.5.5.5, 119.29.29.29]
  enhanced-mode: fake-ip
  fake-ip-range: 28.0.0.1/8
  fake-ip-filter:
    [
      +.lan,
      +.cn,
      +.10010.com,
      +.chinaunicom.com,
      "*.alipay.com",
      "*.alipayobjects.com",
      connect.rom.miui.com,
      localhost.ptlogin2.qq.com,
      "+.stun.*.*",
      "+.stun.*.*.*",
      "+.stun.*.*.*.*",
      "+.stun.*.*.*.*.*",
      "*.n.n.srv.nintendo.net",
      +.stun.playstation.net,
      "*.msftncsi.com",
      "*.msftconnecttest.com",
      ntp.ntsc.ac.cn,
    ]
  nameserver: ["https://doh.pub/dns-query", "https://dns.alidns.com/dns-query"]
  fallback: ["tls://8.8.4.4", "https://dns.twnic.tw/dns-query"]
  fallback-filter:
    { geoip: true, geoip-code: CN, ipcidr: [240.0.0.0/4, 0.0.0.0/32] }

#节点组
proxies:
  # 于此处添加节点配置，以下为模板，非所有字段必填，以机场订阅为主。
  # 补充节点信息
  - {
      "name": "🇦🇶€001•🎟XiaoMao-Forever",
      "type": "",
      "server": "",
      "port": "",
      "cipher": "",
      "uuid": "",
      "alterId": "",
      "tls": "",
      "network": "",
      "ws-opts": { "path": "", "headers": { "Host": "" } },
      "servername": "",
    }

# 策略组
proxy-groups:
  # 静态策略 - 综合策略
  - {
      name: S.综合策略,
      type: select,
      proxies:
        [
          DIRECT,
          U.全部节点,
          U.香港节点,
          U.台湾节点,
          U.日本节点,
          U.美国节点,
          U.新加坡节点,
          S.手动选择,
          REJECT,
        ],
    }
  # 静态策略 - Git服务
  - {
      name: S.Git服务,
      type: select,
      proxies:
        [
          U.香港节点,
          U.台湾节点,
          DIRECT,
          S.综合策略,
          U.全部节点,
          U.日本节点,
          U.美国节点,
          U.新加坡节点,
          S.手动选择,
          REJECT,
        ],
    }
  # 静态策略 - 谷歌服务
  - {
      name: S.谷歌服务,
      type: select,
      proxies:
        [
          U.香港节点,
          S.综合策略,
          U.全部节点,
          U.台湾节点,
          U.日本节点,
          U.美国节点,
          U.新加坡节点,
          S.手动选择,
          DIRECT,
          REJECT,
        ],
    }
  # 静态策略 - 微软服务
  - {
      name: S.微软服务,
      type: select,
      proxies:
        [
          DIRECT,
          S.综合策略,
          U.全部节点,
          U.香港节点,
          U.台湾节点,
          U.日本节点,
          U.美国节点,
          U.新加坡节点,
          S.手动选择,
          REJECT,
        ],
    }
  # 静态策略 - 苹果服务
  - {
      name: S.苹果服务,
      type: select,
      proxies:
        [
          DIRECT,
          S.综合策略,
          U.全部节点,
          U.香港节点,
          U.台湾节点,
          U.日本节点,
          U.美国节点,
          U.新加坡节点,
          S.手动选择,
          REJECT,
        ],
    }
  # 静态策略 - 手动选择 - 需手动配置补充
  # 此处在proxies补充所需的节点名称，如 "🇦🇶€001•🎟XiaoMao-Forever"，即节点组中的name属性值
  # 建议补充所有节点或常用节点
  - { name: S.手动选择, type: select, proxies: [DIRECT, REJECT] }
  # 自动策略 - 全部节点 - 需手动配置补充
  # 此处在proxies补充所需的节点名称，如 "🇦🇶€001•🎟XiaoMao-Forever"，即节点组中的name属性值
  # 建议补充所有节点
  - {
      name: U.全部节点,
      type: url-test,
      proxies: [],
      url: "http://captive.apple.com/",
      interval: 216000,
    }
  # 自动策略 - 香港节点 - 需手动配置补充
  # 此处在proxies补充所需的节点名称，如 "🇦🇶€001•🎟XiaoMao-Forever"，即节点组中的name属性值
  # 建议补充所有香港节点
  - {
      name: U.香港节点,
      type: url-test,
      proxies: [],
      url: "http://captive.apple.com/",
      interval: 216000,
    }
  # 自动策略 - 台湾节点 - 需手动配置补充
  # 此处在proxies补充所需的节点名称，如 "🇦🇶€001•🎟XiaoMao-Forever"，即节点组中的name属性值
  # 建议补充所有台湾节点
  - {
      name: U.台湾节点,
      type: url-test,
      proxies: [],
      url: "http://captive.apple.com/",
      interval: 216000,
    }
  # 自动策略 - 日本节点 - 需手动配置补充
  # 此处在proxies补充所需的节点名称，如 "🇦🇶€001•🎟XiaoMao-Forever"，即节点组中的name属性值
  # 建议补充所有日本节点
  - {
      name: U.日本节点,
      type: url-test,
      proxies: [],
      url: "http://captive.apple.com/",
      interval: 216000,
    }
  # 自动策略 - 美国节点 - 需手动配置补充
  # 此处在proxies补充所需的节点名称，如 "🇦🇶€001•🎟XiaoMao-Forever"，即节点组中的name属性值
  # 建议补充所有美国节点
  - {
      name: U.美国节点,
      type: url-test,
      proxies: [],
      url: "http://captive.apple.com/",
      interval: 216000,
    }
  # 自动策略 - 日本节点 - 需手动配置补充
  # 此处在proxies补充所需的节点名称，如 "🇦🇶€001•🎟XiaoMao-Forever"，即节点组中的name属性值
  # 建议补充所有日本节点
  - {
      name: U.新加坡节点,
      type: url-test,
      proxies: [],
      url: "http://captive.apple.com/",
      interval: 216000,
    }

rule-providers:
  Microsoft:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.yaml"
    path: ./ruleset/Microsoft.yaml
    interval: 216000
  Global:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Global/Global_Classical.yaml"
    path: ./ruleset/Global_Classical.yaml
    interval: 216000
  Streaming:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GlobalMedia/GlobalMedia_Classical.yaml"
    path: ./ruleset/GlobalMedia_Classical.yaml
    interval: 216000
  AdvertisingLite:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/AdvertisingLite/AdvertisingLite_Classical.yaml"
    path: ./ruleset/AdvertisingLite_Classical.yaml
    interval: 216000
  GitHub:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.yaml"
    path: ./ruleset/GitHub.yaml
    interval: 216000
  Google:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml"
    path: ./ruleset/Google.yaml
    interval: 216000
  Direct:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Direct/Direct.yaml"
    path: ./ruleset/Direct.yaml
    interval: 216000
  Hijacking:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Hijacking/Hijacking.yaml"
    path: ./ruleset/Hijacking.yaml
    interval: 216000
  Privacy_Classical:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Privacy/Privacy_Classical.yaml"
    path: ./ruleset/Privacy_Classical.yaml
    interval: 216000
  Apple_Classical:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple_Classical.yaml"
    path: ./ruleset/Apple_Classical.yaml
    interval: 216000

rules:
  - "RULE-SET,Direct,DIRECT"
  - "RULE-SET,AdvertisingLite,REJECT"
  - "RULE-SET,Hijacking,REJECT"
  - "RULE-SET,Privacy_Classical,REJECT"
  - "RULE-SET,Apple_Classical,S.苹果服务"
  - "RULE-SET,GitHub,S.Git服务"
  - "RULE-SET,Microsoft,S.微软服务"
  - "RULE-SET,Google,S.谷歌服务"
  - "RULE-SET,Global,S.综合策略"
  - "RULE-SET,Streaming,S.综合策略"
  - "GEOIP,CN,DIRECT"
  - "MATCH,S.综合策略"

```

