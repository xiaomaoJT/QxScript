<div align="center">

# QxScript @XiaoMao

**QuantumultX 使用成长记录 · 规则 / 重写 / 脚本**

<a href="https://t.me/ListenToMao" target="_blank">
<img src="https://img.shields.io/badge/Telegram-频道-blue?style=flat-square&logo=telegram&logoColor=white" alt="Telegram 频道" />
</a>
<a href="https://github.com/xiaomaoJT/QxScript" target="_blank">
<img src="https://img.shields.io/badge/GitHub-QxScript-181717?style=flat-square&logo=github" alt="GitHub" />
</a>
<img src="https://komarev.com/ghpvc/?username=xiaomaoJT&style=flat-square" alt="Visitor" />

</div>

---

## 环境信息

| 项目 | 内容 |
| :--- | :--- |
| QuantumultX | 1.9.0-953（兼容 Surge / Loon） |
| iOS | 27.0（兼容其他版本） |
| 适配设备 | iPhone / iPad / Mac M 芯片 |
| 懒人版本 | 4.2 中英文双版 |

---

## 目录总览

| 目录 | 资源内容 |
| :--- | :--- |
| **[懒人 · 规则](https://github.com/xiaomaoJT/QxScript/tree/main/lazy)** | 各版本懒人规则、懒人规则图解 |
| **[节点 · 转换](https://github.com/xiaomaoJT/QxScript/tree/main/server)** | 节点转换图解、远程节点 |
| **[重写 · 脚本](https://github.com/xiaomaoJT/QxScript/tree/main/rewrite)** | 脚本订阅、脚本集合、去广告模块、**逆向工具链** |
| **[分流 · 过滤](https://github.com/xiaomaoJT/QxScript/tree/main/filter)** | XiaoMao 分流 |
| **[任务 · 收藏](https://github.com/xiaomaoJT/QxScript/tree/main/auto)** | 自动任务收藏、推荐库、图标库 |

---

## 新增内容

近期新增的**实用脚本、逆向分析工具链、TGBot 配置面板**已单独整理成文档：

👉 **[新增内容 · 脚本与工具链](NEW.md)**

---

## 懒人规则 · 使用教程

| 设备 | 懒人规则 | 教程 | 图解 |
| :--- | :--- | :--- | :--- |
| iPhone / iPad | [通用版](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/iOS/general/QX_XiaoMao_CN.conf) | [iOS 配置](https://github.com/xiaomaoJT/QxScript/blob/main/COURSE.md) | [图解](https://github.com/xiaomaoJT/QxScript/blob/main/lazy/iOS/配置图解) |
| iPhone / iPad | [自定义版](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/iOS/custom/QX_XiaoMao_CN.conf) | 同上 | 同上 |
| Mac M 芯片 | [英文版](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/macOS/QX_XiaoMao.conf) / [中文版](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/lazy/macOS/QX_XiaoMao_CN.conf) | [Mac 配置](https://github.com/xiaomaoJT/QxScript/tree/main/lazy/macOS) | [图解](https://github.com/xiaomaoJT/QxScript/tree/main/lazy/macOS/配置图解) |
| QX 历史版本 | [配置历史版本](https://github.com/xiaomaoJT/QxScript/tree/main/lazy/oldConfig) | — | — |
| BoxJS | [XiaoMao 订阅](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json) | [自动任务订阅](https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoAutoTask.json) | — |
| Clash | 兼容 Win / Android / iOS / macOS | [Clash 仓库](https://github.com/xiaomaoJT/clash) | [在线配置](https://static-mp-4c1955c1-4e3f-4ed7-9f2b-ea2165e28195.next.bspapp.com/xiaomao-clash/index.html#/) |

### 版本选择

| 版本 | 特点 | 关键字 | 推荐 |
| :--- | :--- | :--- | :---: |
| 通用版 | 策略精简：剔除低效策略组、绑定默认策略<br />分流精简：剔除流媒体分流、剔除备选 ad 类分流<br />重写精简：剔除自定义及备选规则 | 精简 · 默认策略 | ✅ |
| 自定义版 | 策略自定义：多种策略组类型、拦截防护自定义控制<br />分流自定义：多种分流规则、多种备选分流防护<br />重写自定义：多种聚合脚本、单独规则自定义 | 自定义 · 多策略 | |
| Mac 版 | 策略聚合：常用策略默认选择、热门策略自定义选择<br />分流精简：同通用版<br />重写极简：仅保留 boxjs 及 substore | 聚合 · Mac | |
| Clash 版 | 兼容 Win / Android / iOS / macOS，更适用于 PC 端 | PC | ✅ |

> 规则命名规范：`S.` 静态策略组 / `U.` 自动延迟测速 / `A.` 健康策略 / `XiaoMao.T` 自动任务

---

## 快速导航 · 教程

- 📚 [QuantumultX 使用教程及远程订阅精品库](https://github.com/xiaomaoJT/QxScript/blob/main/COURSE.md)
- 🧰 [XiaoMao 教程合集](http://mp.weixin.qq.com/mp/homepage?__biz=MzI3MjE3NTc4OA==&hid=1&sn=69f77280608382e9ab1e6afac8c2a881&scene=18#wechat_redirect)
- 🏖 [三分钟免费注册外区 Apple ID](https://mp.weixin.qq.com/s/YzYsF9QyHZVJK9P7bsrURQ)
- 🏝 [Apple 礼品卡购买教程](https://mp.weixin.qq.com/s/Ehi23fjFpeUc2DocnQb4hw)
- 📖 <span id="update">[仓库资源更新日志](https://github.com/xiaomaoJT/QxScript/blob/main/UPDATELOG.md)</span>

---

## 使用注意

- 脚本配置项均在文件顶部 `CONFIG` / `RULES` / `SUBS` / `SITES` 常量里，每项均有注释
- **MITM 证书**：QX → 设置 → MITM → 生成证书 → 安装并信任，否则重写不生效
- **定时任务依赖 App 存活**：iOS 杀后台后任务不执行，属 QX 机制限制
- **单次执行 10 秒上限**：脚本均已做超时控制，监控类站点建议 ≤ 5 个

---

## 声明

- 此项目仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断。
- 您必须在下载后 24 小时内将所有内容从存储设备中完全删除。
- 请勿将此脚本用于任何商业或非法目的，若违反规定请自行负责。
- 逆向工具链为通用分析工具，**不含任何具体目标的配置**。请仅在自有应用或获得明确授权的目标上使用，并遵守当地法律法规。
- 本人对此脚本引起的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。

---

<div align="center">

**[Telegram 频道](https://t.me/ListenToMao)** · 问题反馈与更新提醒

<img src="https://github-readme-stats.vercel.app/api?username=xiaomaoJT&show_icons=true&count_private=true&hide_border=true" align="center" style="height:165px;" />

</div>
