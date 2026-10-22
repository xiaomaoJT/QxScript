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

---

### 快速开始

**前置条件**
1. 安装并信任 QX 的 MITM 证书：`设置 → HTTPS 解密 → 安装证书`，再去系统「关于本机 → 证书信任设置」里把 QX 根证书开关打开。
2.（可选但推荐）订阅 BoxJS，让还原结论、抓取到的响应能跨运行缓存：在 QX 的 BoxJS 配置里加入 `rewrite/boxJS/XiaoMao.json`。

**加载方式一：一键引用（推荐，最省事）**
QX 的「重写 → 规则资源 → 引用」只能解析**配置片段**（含 `[rewrite_local]` / `[mitm]` 小节的文本），**不能直连纯 JS 脚本**——直接引用那四个 `.js` 会报「返回内容并未包含相关重写规则」。

我提供了一个打包好的 conf 包装文件（后缀虽是 `.js`，内容却是配置片段），引用它即可一次性挂上四个脚本：

```
# QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoReverseTools.js
```

> 引用的是**包装 conf**，不是四个 `.js` 脚本本体。默认 `hostname = *` 会抓取全部流量做"捕获引导"；研究具体 App 时，把 conf 里的 `hostname` 改成该 App 域名、并把脚本 `CONFIG.hosts` 填成同一域名即可锁定目标。

**加载方式二：手动粘贴（想精确控制时）**
四个脚本都通过完整远程地址加载，直接复制下面这段到 QX 的 `[rewrite_local]`，`[mitm]` 里填上你要研究的域名即可：

```ini
[rewrite_local]
^https?:// url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/sign_lab.js
^https?:// url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/resp_inspector.js
^https?:// url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/ad_block.js
^https?:// url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/vip_patch.js

[mitm]
hostname = api.target.com, cdn.target.com
```

> 这里的 `hostname` 决定 QX 抓哪些域名的明文。研究时先填目标域名；**不要长期留 `*`**，否则所有流量都会被这四个脚本拦截，开销很大。

**默认是「未配置态」**
四个脚本的 `hosts` / 规则 `host` 默认都是空的，**不会处理任何数据**，只做「捕获 + 引导」：运行后会在日志里打印你真实命中的 `host` 和 `path`，并给出一段**可直接复制的专属配置**（含 `[rewrite_local]` + `[mitm] hostname` + 脚本内 `hosts`/`RULES`）。把它填进脚本配置区，就锁定到你的目标了。

---

### 标准工作流分步

#### ① resp_inspector.js — 先看服务端到底返回了哪些字段
1. 在脚本 `CONFIG.hosts` 填上目标域名（或先用未配置态，让它捕获后给你可复制配置）。
2. 打开 App，进入「我的 / 会员中心」触发接口。
3. 脚本递归扫描响应，把 `vip` / `member` / `expire` / `level` / `auth` 等可疑字段标出来，并给出**完整 JSON 路径**（如 `data.vip_info.is_vip`、`data.user.expire_time`）。
4. 想反复比对时，把 `CONFIG.saveBody` 改成 `true`，原始响应会存进 `$prefs`（key：`respInspectorBody`）。

> 产出：一份「字段地图」。记下关键路径，下一步要用。

#### ② vip_patch.js — 改响应，验证是不是纯客户端校验
1. 把①拿到的路径和字段名填进 `RULES`（或用内置快捷开关 `vipFields` / `timeFields`）：
   ```js
   {
     name: '用户信息解锁',
     host: 'api.target.com',
     path: /user/i,
     vipFields: ['is_vip', 'vip'],
     timeFields: ['expire_time'],
     timeValue: '2099-12-31',
   }
   ```
2. 重新进会员页 → 响应里 `is_vip=true`、`expire_time` 变远期 → 客户端显示「已开通」。
3. 三种模式：
   - `field`：用 `vipFields` / `timeFields` / `typeFields` / `patches` 改字段值（最常用）。
   - `delete`：用 `deletes: ['data.pay_wall']` 删除字段（有些接口靠「字段不存在」判定未付费）。
   - `whole`：用 `whole: { code:0, data:{ vip:true, ... } }` 整体替换响应（返回一个已付费模板）。

> 价值：如果改完客户端就显示会员 → 说明是**纯客户端校验**，你已经定位到逻辑；如果没反应 → 说明服务端还有校验，进入③。

#### ③ ad_block.js — 顺手把广告也清了（可选）
加一条规则干掉信息流广告 / 开屏 / 倒计时：
```js
{
  name: '信息流去广告',
  host: 'api.target.com',
  path: /feed/i,
  action: 'remove_ads',
  listPath: 'data.list',   // 数组所在路径
  adFlag: 'is_ad',         // 广告标记字段，为真即删
}
```
四种 `action`：`remove_ads`（按标记删数组项）、`empty_list`（直接清空数组）、`set_field`（改字段值，如把倒计时 `ad_duration` 改成 0）、`regex`（正则替换，适合 JS/CSS 等非 JSON 响应）。

#### ④ sign_lab.js — 还原请求签名（最有研究价值）
1. 在 App 里触发一个**带签名**的请求（登录 / 下单 / 刷新列表）。
2. 脚本自动识别 `sign` / `sig` / `signature` / `token` 等签名字段，穷举：
   `算法(MD5/SHA1/SHA256/HMAC) × 参数排序(字典序/原序) × 拼接(k=v&) × 盐位置(前置/后置)`
   再和响应/请求里的真实签名比对。
3. 命中即输出结论，例如：`算法=HMAC-SHA256，拼接=字典序 k=v&，盐=后置 app_secret`。
4. 结论**缓存进 BoxJS**（`signLabResult`），下次同参数直接复用，不用重算。
5. 盐值字典 `CONFIG.saltDict` 可按你的目标补充；签名字段名候选 `signKeys`、时间戳字段 `tsKeys` 同理。

> 拿到算法后，你自己就能写脚本合法构造带签请求——这才是研究价值所在。

---

### 各脚本配置详解

#### resp_inspector.js（CONFIG）
| 字段 | 说明 |
| :--- | :--- |
| `hosts` | 目标域名数组；留空 `[]` 为未配置态（仅捕获引导）。支持 `'*.example.com'` / `'api.*.com'` |
| `pathFilter` | 正则，只分析匹配的路径；如 `/user/i` |
| `saveBody` | `true` 时把原始响应存进 `$prefs`（key `respInspectorBody`） |
| `maxDepth` | 递归扫描深度上限，默认 8 |
| `notify` | 是否弹通知 |
| `keywords` / `valueHints` | 可疑字段关键词与可疑值，命中即标注 |

#### vip_patch.js / ad_block.js（RULES 数组，每条一项）
| 字段 | 适用 | 说明 |
| :--- | :--- | :--- |
| `name` | 通用 | 备注，仅日志显示 |
| `host` | 通用 | 目标域名；留空 `''` 为未配置 |
| `path` | 通用 | 匹配 URL 路径的正则 |
| `vipFields` | vip | 这些字段置为真值（true/1） |
| `timeFields` / `timeValue` | vip | 时间字段置为远期（`'2099-12-31'` 或 `'now+3650d'`） |
| `typeFields` | vip | 类型/等级字段设固定值，如 `{ level: 9 }` |
| `patches` | vip | 显式改写数组 `[{ path, value }]`，最高优先级 |
| `deletes` | vip | 删除字段数组（靠"字段不存在"判定未付费时用） |
| `whole` | vip | 整体替换响应（返回已付费模板） |
| `action` | ad | `remove_ads` / `empty_list` / `set_field` / `regex` |
| `listPath` | ad | 广告数组所在路径（点号分隔） |
| `adFlag` / `adType` | ad | 广告标记字段 / 类型值，为真即删 |
| `fieldPath` / `value` | ad-set_field | 要改的字段路径与值 |
| `pattern` / `replacement` | ad-regex | 正则匹配的原文与替换值 |

#### sign_lab.js（CONFIG）
| 字段 | 说明 |
| :--- | :--- |
| `hosts` | 目标域名数组；留空为未配置态 |
| `pathFilter` | 正则，只处理匹配路径的请求 |
| `signKeys` | 签名字段名候选（小写比较），命中即作为待还原签名 |
| `tsKeys` | 时间戳/随机数字段候选（签名常拼入） |
| `saltDict` | 盐值字典，按你的目标补充 |
| `maxCandidates` | 最多输出的候选组合数 |
| `useBoxJs` / `boxJsKey` | 缓存还原结论到 BoxJS，key 默认 `signLabResult` |

---

### 捕获引导：从「空白」到「专属配置」

四个脚本都内置了"捕获 + 引导"：当你还没锁定目标（默认 `hosts=[]` 或 `host=''`）时，脚本命中真实请求后，会在**日志 + 通知**里输出一段可直接复制的配置，例如 `sign_lab.js` 捕获到 `api.target.com/api/user/info` 后给出：

```
【sign_lab.js · 捕获到目标】
host = api.target.com
path = /api/user/info

复制下面这段到 QX 配置，即可锁定你的专属目标（脚本名已是完整远程地址，QX 资源引入直接拉取）：

[rewrite_local]
^https?://api\.target\.com/ url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/sign_lab.js

[mitm]
hostname = api.target.com

// sign_lab.js 配置区
hosts: ['api.target.com'],
  pathFilter: /\/api\/user/i,
```

把 `hosts: ['api.target.com']` 那段填回脚本配置区，就完成了"专属配置"。每个 host 只引导一次（已存 `$prefs`），不会刷屏。

---

### 注意事项
- 这些脚本改的是**你本地客户端看到的响应**，不改变服务端数据；请在你自己的授权测试范围内使用。
- 不要长期把 `mitm hostname` 设为 `*`：四个脚本会拦截所有流量，既泄露隐私又浪费性能。
- 抓不到明文？先检查 MITM 证书是否安装并信任；非 HTTPS 或证书钉扎（certificate pinning）的接口 QX 无法解密。
- `sign_lab.js` 的穷举有组合数上限（`maxCandidates`），若未命中可扩充 `saltDict` / `signKeys`，或把目标接口的盐值、拼接方式已知部分直接写进配置。

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
