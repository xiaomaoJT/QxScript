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
| QuantumultX | 1.5.0-830（兼容 Surge / Loon） |
| iOS | 18.6.1（兼容其他版本） |
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

## 新增：实用脚本

零依赖，复制 `[task_local]` 配置即可用。详见 [`rewrite/script/UTILS.md`](rewrite/script/UTILS.md)。

| 脚本 | 功能 | 触发周期 |
| :--- | :--- | :--- |
| `daily_brief.js` | 每日早报：天气 + 节假日倒计时 + 摸鱼进度 + 每日一句 | `30 8 * * *` |
| `sub_expire.js` | 订阅到期管家：域名 / 服务器 / 会员到期提醒，12 月年度汇总 | `0 9 * * *` |
| `site_monitor.js` | 网站宕机监控：故障报警、恢复通知、防劫持、免打扰时段 | `*\/10 * * * *` |

```ini
[task_local]
30 8 * * * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/daily_brief.js, tag=每日早报, enabled=true
```

## 新增：逆向分析工具链

面向安全研究的通用工具，**规则由你配置，不内置任何具体目标**。

| 脚本 | 用途 | 类型 |
| :--- | :--- | :--- |
| `resp_inspector.js` | 响应体分析：自动标出所有会员 / 权限字段及完整 JSON 路径 | `script-response-body` |
| `ad_block.js` | 广告拦截引擎：删广告项 / 清空列表 / 改字段 / 正则替换 | `script-response-body` |
| `vip_patch.js` | 通用解锁引擎：批量打通 VIP 布尔、时间、等级字段 | `script-response-body` |
| `sign_lab.js` | 签名还原：自动穷举 MD5/SHA1/SHA256/HMAC × 排序 × 拼接 × 盐值位置 | `script-request-header` |

**推荐工作流**

```
resp_inspector.js   定位哪个字段控制会员状态
      ↓
vip_patch.js        改字段，验证是否纯客户端校验
      ↓
sign_lab.js         若服务端校验，还原签名算法
      ↓
自行构造请求         完成闭环
```

`sign_lab.js` 内联 MD5 / SHA1 / SHA256 / HMAC 纯 JS 实现（QX 无内置 crypto），
已用 Node `crypto` **63 组测试向量逐字节对拍通过**；还原结论缓存到 `$prefs`，BoxJS 可读。

## 新增：TGBot 配置面板

跑在 QuantumultX 上的 Telegram Bot 管理面板，**无需域名、无需证书、无需公网**。

```ini
[rewrite_local]
^http://127.0.0.1:9999/tgbot/v1/ url script-echo-response tgbot-backend.js
```

访问 `http://127.0.0.1:9999/tgbot/v1/` 打开面板。面板与 API 同源，彻底绕开 Telegram 无 CORS 头的问题。

**能力**：快捷指令 / 指令自动回复 / 消息按钮可视化编辑 / 互动消息收件箱 / 测试发送 / Bot 信息。
详见 [`rewrite/script/qx-tgbot/README.md`](rewrite/script/qx-tgbot/README.md)。

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
