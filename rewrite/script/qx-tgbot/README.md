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
| **连接** | Token / ChatID 配置、连通性验证、已连接 Bot 摘要、清除 Token | `getMe` |
| **快捷指令** | 增删改、序号标注、输入即保存、读取现有、清除全部 | `setMyCommands` / `getMyCommands` / `deleteMyCommands` |
| **指令回复** | 为指令配置自动回复内容、开关自动应答、从快捷指令一键生成规则 | `getUpdates` + `sendMessage` / `answerCallbackQuery` |
| **消息按钮** | 每个按钮配「按钮文字」+「回调指令」两个显式输入框，多行多列、每行可删、4 种预设 | → `reply_markup` |
| **互动消息** | 读取消息与按钮点击、当前规则速查、命中状态标记（已回复/未命中） | `getUpdates` |
| **测试发送** | 表情快插、MarkdownV2 / HTML、静默发送、关闭预览、删除上一条消息 | `sendMessage` / `deleteMessage` |
| **Bot 信息** | ID、用户名、语言、可加入群组、内联查询、Web App 等能力 | `getMe` |

---

## 让 Bot 真的会回话（重要）

只配「快捷指令」Bot 确实不会回内容——那只是注册了命令列表。要让它有行为，必须配「指令回复」。

### 三步跑通

1. **指令回复**页 → 点「从快捷指令生成」→ 逐条填写回复内容
2. 打开右上角**自动回复**开关
3. 在 Telegram 里给 Bot 发 `/start`

Bot 会自动回复你配置的内容。

### 按钮点击同样能响应

「消息按钮」页每个按钮下方有**两个输入框**，直接填即可，无需弹窗：

- **按钮文字**：Telegram 里显示的文本
- **回调指令**：填 `nn` 这样的名字，**必须与「指令回复」里的规则名一致**

配好后用「测试发送 → 带按钮发送」发到目标会话。用户点击时：

1. 先 `answerCallbackQuery` 消除按钮上的加载圈
2. 回调指令命中规则则自动回复对应内容

> 规则名带不带 `/` 都行，`/nn` 和 `nn` 都能匹配上。

**排查方法**：打开「互动消息」页，顶部会列出当前所有规则名。若点击按钮后消息显示「未命中规则」黄色标签，说明按钮的回调指令与规则名对不上。

### 架构限制（请务必了解）

自动回复依赖**面板页面处于打开状态**。QX 的 `http_backend` 是请求-响应模型，没有常驻进程：

- 面板打开 → 每 4 秒轮询一次，正常应答
- 面板关闭 → **停止应答**

这是 QX 脚本环境的固有限制，不是配置问题。若需要 7×24 小时在线 replying，必须用独立后端（如 Cloudflare Workers / VPS + webhook），本面板则退化为管理控制台。

### 其他要点

- **offset 游标**存于 `$prefs`，跨请求保持，不会重复处理同一条更新
- 轮询用 `timeout:0`（立即返回）而非长轮询，避免撞上 QX 脚本 10 秒执行上限
- 首次使用请点「互动消息 → 立即读取」确认 Bot 能收到消息
- 若 Bot 已配置 webhook，`getUpdates` 会返回冲突错误，需先删除 webhook

---

## 界面说明

**顶部页签**采用换行平铺（`flex-wrap`），7 个页签在 320px 窄屏下也排成两行，全部可见，无需横向滑动。

**自动回复开关**有三个状态反馈：滑块渐变 + 圆点右移 + 标题切换（「自动回复」/「自动回复已开启」），关闭时描述也会变回提示文案。

**消息按钮**每个按钮下方直接展开两个输入框（按钮文字、回调指令），改完即时保存，按钮预览同步更新。

---

## 消息按钮预设

「消息按钮」页提供 5 种一键预设：**单列**（纵向菜单）、**两列**、**三列**、**宫格**（2×3）、以及关闭预设的「取消」。预设只是填入布局，之后仍可逐个点击编辑。

按钮布局中，行内只有一个按钮时自动占满整行，与 Telegram 实际展示一致。

Token 与配置仅存本机（localStorage + QX `$prefs` 双写），不上传任何第三方服务器。

---

## 已验证项

全部经无头 Chrome + CDP 实测：

- 外层脚本与内联 JS **双层**语法检查通过
- 后端四条路由：面板页 / API 代理 / 无 token 401 / save 存取 token
- **自动应答引擎**：调用序列验证为 `getUpdates → sendMessage → answerCallbackQuery → sendMessage`；
  `auto=false` 时只读不回复；offset 正确推进到 `update_id+1`
- `__token` 剥离 5 种位置组合（含末尾无逗号边界），均保证转发合法 JSON
- **指令回复页**：添加/删除规则、输入即保存、自动回复开关、从快捷指令生成，均通过
- **互动消息页**：立即读取、清空、空态提示，均通过
- 七个页签均可正常切换与渲染
- CDP 实测 `scrollWidth == innerWidth`，**无横向溢出**

### 开发中踩到的坑（供后续维护参考）

1. **面板 HTML 双层嵌套的引号地狱**（本项目最大的坑）
   面板 HTML 要作为**字符串**塞进 JS 源码，等于「JS 里嵌 JS 字符串嵌 HTML」。
   - 约定：**HTML 属性用双引号，生成的 JS 字符串用单引号**，两者不交叉
   - 数组 `.join('')` 优于跨元素字符串续行——`value=''` 里的单引号会提前闭合字符串
   - **不要用模板字符串**：`${}` 会在外层就被求值，而变量只在浏览器侧存在
   - 出现深层嵌套时，改用 `gt()` 辅助函数统一还原引号，别硬拼转义

2. **静默 bug 模式**：`rows` 算出来了但忘放进 `return` 数组，语法完全合法、
   `node --check` 全绿、浏览器也不报错——只是输入框永远不渲染。
   **必须用 CDP 真实点击验证**，不能只靠语法检查。

3. **内存改动未持久化**：`render()` 会从 localStorage 重读，所以 `push`/`splice`
   之后必须 `save()`，否则刷新后改动丢失（表现为"删了又回来"）。

4. **正则剥离 JSON 字段不可靠**：`__token` 在末尾时正则会留下悬空逗号，
   导致转发非法 JSON。改用 `JSON.parse` → `delete` → `JSON.stringify`。

5. **`input` 默认最小宽度撑破容器**：移动端需 `min-width:0` + `max-width:100%`。

6. **别信截图，判断布局要靠 CDP**：无头模式下视口宽度（500/756px）与
   `--window-size` 截图裁剪不一致，会造成"文字被截断"的**假象**。
   实测 `document.documentElement.scrollWidth <= innerWidth` 才可信。

7. **顶层 `return`**：部分 JS 宿主不合法，用 if/else 嵌套替代。

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