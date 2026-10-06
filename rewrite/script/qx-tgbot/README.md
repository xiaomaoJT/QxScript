# Quantumult X 劫持网站实现 TGBot 配置面板

通过 QX 重写功能劫持任意网站页面，注入一个 Telegram Bot 配置面板，支持**快捷指令**、**消息按钮**、**测试发送**。

已在无头浏览器中实测通过：四个页签均正常渲染，被劫持的原页面内容完好无损。

---

## ⚠️ 关于 www.xiaomao.tgbot.com

你想劫持的域名 **目前在公网并不存在**：

```
权威 NS (ns51.domaincontrol.com) 查询  → 空
Google DNS 8.8.8.8 查询                → 空
```

而 `tgbot.com` 本身是 Vercel 托管的第三方站点（*"TGBot - Ranked Telegram Crypto Bots"*，加密货币交易机器人排行榜），**并非你的站点，你也没有它的控制权**。

> 本机 `dig` 出的 `198.18.x.x` 是代理软件的 fake-IP 假象，不代表域名真实存在。

**但这不影响方案落地** —— 面板功能与该域名毫无依赖关系，你可以把它注入到任意一个你能正常访问的 HTTPS 页面（自己的站点、测试页都行）。

---

## 核心原理

```
浏览器页面  ──①注入面板──▶  被劫持的站点 HTML
    │
    └─②fetch──▶ api.telegram.org/bot<token>/sendMessage
                      │
              ③QX 拦截（script-echo-response）
                      │
              ④$task.fetch 由 QX 本地发真实请求
                      │
              ⑤补齐 CORS 响应头 ──▶ 浏览器放行
```

**为什么必须有第 ③④⑤步**：Telegram Bot API 官方**不返回 CORS 头**，浏览器会直接拦截响应，面板拿不到数据。所以需要 QX 在本地做一层代理并注入 `Access-Control-Allow-Origin: *`。

两条重写规则各司其职：

| 规则 | 脚本 | 作用 |
|---|---|---|
| `^https?://你的域名/` | `script-response-body` | 劫持 HTML，注入面板 |
| `^https://api\.telegram\.org/bot` | `script-echo-response` | 本地代理 + CORS 注入 |

---

## 部署步骤

### 1. 放置脚本

把两个 `.js` 文件上传到 iCloud Drive（QX 配置里指向的目录）：

```
iCloud Drive/Quantumult X/Scripts/
├── tgbot-panel-inject.js
└── tgbot-cors.js
```

### 2. 改 snippet 中的域名

打开 `tgbot.snippet`，把两处 `example.com` 换成你的实际域名。

### 3. 导入配置

QX → 配置 → 当前配置 → 右上角「+」→ 添加 `rewrite_local` 规则，或直接编辑主配置粘贴：

```ini
[rewrite_local]
^https?://你的域名/ url script-response-body tgbot-panel-inject.js
^https://api\.telegram\.org/bot url script-echo-response tgbot-cors.js

[mitm]
hostname = 你的域名, *.你的域名, api.telegram.org
```

### 4. 安装证书

QX → 设置 → MITM → 生成证书 → 装到 iOS「设置 → 通用 → 关于本机 → 证书信任设置」里**打开信任**。

> ⚠️ 不开信任证书，HTTPS 解密不生效，规则不会触发。

### 5. 使用

打开被劫持的网站 → 页面右下角出现 **⚙ 悬浮按钮** → 点击进入面板。

**「连接」页**填入：
- **Bot Token**：从 [@BotFather](https://t.me/BotFather) 获取
- **Chat ID**：你自己的数字 ID，或群组 `@channelusername`

点「验证连接 getMe」确认 Token 有效。

---

## 面板功能

| 页签 | 能力 | 对应 API |
|---|---|---|
| **连接** | Token / ChatID 配置、连通性验证 | `getMe` |
| **快捷指令** | 增删改指令与描述、保存到 Bot、读取现有、清除 | `setMyCommands` / `getMyCommands` / `deleteMyCommands` |
| **消息按钮** | 可视化编辑 InlineKeyboard 布局（多行多列）、设置 callback_data、实时预览 | 本地布局 → `reply_markup` |
| **测试发送** | 任意文本、MarkdownV2/HTML 解析模式、纯文本或带按钮发送 | `sendMessage` |

Token 和配置只存在**本机 localStorage**，不上传任何服务器。

按钮布局的行内单按钮会自动占满整行，与 Telegram 实际展示一致。

---

## 已验证项

- 外层脚本与内联 JS 双层语法检查通过
- 注入后 HTML 结构完整（div 开闭平衡 37/37）
- 无头 Chrome 实测：四个页签渲染正常，原页面内容不受影响
- 异常安全：注入失败时 `catch` 兜底原样返回，**绝不破坏宿主页**

---

## 常见问题

**面板没出现**
检查三点：域名是否写进 `[mitm] hostname`、证书是否已信任、规则是否匹配（QX 重写要求响应体非空）。

**点「验证连接」报 CORS 错误**
第二条 `api.telegram.org` 规则没生效。确认 `$task.fetch` 可用（需 QX ≥ 1.0.14）。

**`sendMessage` 返回 400**
多半是 Chat ID 不对。Bot 必须先在目标会话中收到过一条消息，才能向该会话发消息。

**MarkdownV2 报 400**
特殊字符需转义（如 `*`、`.`、`-`），建议先用「默认」模式测试。

---

## 附：想直接用 http_backend？

QX 还支持在 `127.0.0.1:9999` 起本地服务，完全不依赖任何网站：

```ini
[http_backend]
tgbot-api.js, tag=botapi, path=^/botapi/
```

这种方式更干净（不用劫持任何页面），但面板需改为访问本地地址，且不能与页面注入方案混用。核心 API 调用逻辑与本方案一致。