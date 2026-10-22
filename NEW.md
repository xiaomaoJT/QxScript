# 新增内容 · 脚本与工具链

> 本页汇总近期新增的实用脚本、逆向分析工具链与 TGBot 配置面板。每个脚本头部均带有 GitHub 文件地址，可直接跳转查看源码。

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

> 默认 `hosts` / 规则 `host` 留空，脚本只做"捕获 + 引导"：运行后会打印你真实命中的 `host`/`path`，并给出**可直接复制的专属配置**（QX `[rewrite_local]` + `[mitm] hostname` + 脚本内配置）。把它们填进去即可锁定到你的目标，避免 blanket 匹配所有流量。

| 脚本 | 用途 | 类型 | 文件地址 |
| :--- | :--- | :--- | :--- |
| `resp_inspector.js` | 响应体分析：自动标出所有会员 / 权限字段及完整 JSON 路径 | `script-response-body` | [查看](https://github.com/xiaomaoJT/QxScript/blob/main/rewrite/script/js/resp_inspector.js) |
| `ad_block.js` | 广告拦截引擎：删广告项 / 清空列表 / 改字段 / 正则替换 | `script-response-body` | [查看](https://github.com/xiaomaoJT/QxScript/blob/main/rewrite/script/js/ad_block.js) |
| `vip_patch.js` | 通用解锁引擎：批量打通 VIP 布尔、时间、等级字段 | `script-response-body` | [查看](https://github.com/xiaomaoJT/QxScript/blob/main/rewrite/script/js/vip_patch.js) |
| `sign_lab.js` | 签名还原：自动穷举 MD5/SHA1/SHA256/HMAC × 排序 × 拼接 × 盐值位置 | `script-request-header` | [查看](https://github.com/xiaomaoJT/QxScript/blob/main/rewrite/script/js/sign_lab.js) |

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
