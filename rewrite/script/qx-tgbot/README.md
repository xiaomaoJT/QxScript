# Quantumult X TGBot 配置面板

在 Quantumult X 上管理 Telegram Bot：**快捷指令**、**消息按钮**、**测试发送**。

## 两种方案

| | **方案 A：本机服务**（推荐） | **方案 B：劫持网页** |
|---|---|---|
| 需要域名 | ❌ 不需要 | ✅ 需要 |
| 需要 MITM 证书 | ❌ 不需要 | ✅ 需要，且要信任 |
| 劫持他人网站 | ❌ 不需要 | 需要你有控制权的站点 |
| 跨域问题 | 无（同源） | 需额外 CORS 代理规则 |
| 配置复杂度 | 一行 | 三条规则 + 证书 |

**没有域名？直接用方案 A。** 它不需要域名、不需要证书、不劫持任何网站。

---

## 方案 A：本机服务（推荐）

### 1. 添加配置

主配置里加入（`tgbot.snippet` 已备好）：

```ini
[http_backend]
https://raw.githubusercontent.com/xiaomaoJT/QxScript/refs/heads/main/rewrite/script/qx-tgbot/tgbot-backend.js, tag=tgbot, path=^/tgbot/v1/, enabled=true
```

### 2. 打开面板

Safari 访问：

```
http://127.0.0.1:9999/tgbot/v1/
```

同一局域网的其他设备可用 `http://quantumult-x:9999/tgbot/v1/`。

> 需在 QX「设置 → MITM」里**生成证书**（本方案不需信任，只是 QX 启用本地服务的开关）。

### 3. 填写信息

「连接」页填入：

- **Bot Token**：从 [@BotFather](https://t.me/BotFather) 获取
- **Chat ID**：你的数字 ID，或群组 `@channelusername`

点「验证连接」确认 Token 有效。

Token 会同时存入浏览器 localStorage 和 QX 的 `$prefs`，刷新不丢失。

---

## 方案 B：劫持网页

需要你有一个**自己控制的 HTTPS 域名**（当前 snippet 配置为 `xiaomaotgbot.com`）。

### 1. 放置脚本

两个脚本下载到 `iCloud Drive/Quantumult X/Scripts/`：

- `tgbot-panel-inject.js` — 注入面板
- `tgbot-cors.js` — 本地 CORS 代理

### 2. 配置规则

```ini
[rewrite_local]
^https?://你的域名/ url script-response-body tgbot-panel-inject.js
^https://api\.telegram\.org/bot url script-echo-response tgbot-cors.js

[mitm]
hostname = 你的域名, *.你的域名, api.telegram.org
```

### 3. 信任证书

QX → 设置 → MITM → 生成证书 → 装到 iOS「设置 → 通用 → 关于本机 → 证书信任设置」并**打开信任**。

> 不信任证书，HTTPS 无法解密，规则不生效。

### 为什么需要那条 CORS 规则

Telegram Bot API **官方不返回 CORS 头**，浏览器会直接拦截响应。所以必须由 QX 在本地代发请求并注入 `Access-Control-Allow-Origin: *`。

---

## 面板功能

| 页签 | 能力 | API |
|---|---|---|
| **连接** | Token / ChatID 配置、连通性验证 | `getMe` |
| **快捷指令** | 增删改、保存到 Bot、读取现有、清除 | `setMyCommands` / `getMyCommands` / `deleteMyCommands` |
| **消息按钮** | 可视化编辑 InlineKeyboard（多行多列）、设置 callback_data、实时预览 | → `reply_markup` |
| **测试发送** | 任意文本、MarkdownV2 / HTML、纯文本或带按钮发送 | `sendMessage` |

按钮布局中，行内只有一个按钮时自动占满整行，与 Telegram 实际展示一致。

Token 与配置仅存本机，不上传任何第三方服务器。

---

## 已验证项

- 外层脚本与内联 JS 双层语法检查通过
- 四条路由单测：面板页 / API 代理 / 无 token 401 / save 存取 token
- `__token` 剥离 5 种位置组合（含末尾无逗号边界），均保证转发合法 JSON
- 无头 Chrome 实测四页签渲染；CDP 实测 `scrollWidth == innerWidth`，无横向溢出

### 开发中踩到的坑（供后续维护参考）

1. **多层字符串转义**：面板 HTML 嵌在 JS 字符串里时，Python 风格的 `\"` 混入 JS 会直接语法报错。约定 **HTML 属性用双引号、生成的 JS 字符串用单引号**，两者不交叉。
2. **正则剥离 JSON 字段不可靠**：`__token` 在末尾时正则会留下悬空逗号，导致转发非法 JSON。改用 `JSON.parse` → `delete` → `JSON.stringify`。
3. **`input` 默认最小宽度撑破容器**：移动端需 `min-width:0` + `max-width:100%`，否则横向溢出。
4. **顶层 `return`**：部分 JS 宿主不合法，用 if/else 嵌套替代。

---

## 常见问题

**面板打不开**
QX 未运行；或 `path` 正则与访问路径不匹配（须为 `^/tgbot/v1/`）。

**提示 missing bot token**
「连接」页填 Token 后先点「保存」。

**sendMessage 返回 400**
多半是 Chat ID 不对。Bot 必须先在目标会话中收到过一条消息，才能向其发送。

**MarkdownV2 报 400**
特殊字符需转义（`*`、`.`、`-` 等），建议先用「默认」模式测试。

**setMyCommands 无效**
命令不能带 `/` 前缀（面板会自动去除），且描述不可为空。