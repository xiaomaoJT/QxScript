# 实用工具脚本

零依赖的 QuantumultX 定时任务脚本，直接可用。

## 脚本清单

| 脚本 | 功能 | cron |
|---|---|---|
| [daily_brief.js](js/daily_brief.js) | 每日早报：天气 + 节假日倒计时 + 摸鱼进度 + 每日一句 | `30 8 * * *` |
| [sub_expire.js](js/sub_expire.js) | 订阅到期管家：域名/服务器/会员到期提醒，12 月 1 日年度汇总 | `0 9 * * *` |
| [site_monitor.js](js/site_monitor.js) | 网站宕机监控：定时探测、故障报警、恢复通知、防劫持 | `*\/10 * * * *` |

三个脚本均为**零依赖**（只用 QX 原生 `$prefs` / `$notify` / `$task.fetch`），
不需要额外引 Env 库，单独添加即可运行。

## 快速配置

以「每日早报」为例，其余同理：

```ini
[task_local]
30 8 * * * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/daily_brief.js, tag=每日早报, enabled=true
```

每个脚本头部的注释块里都写了对应的 `[task_local]` 配置，直接复制粘贴即可。

## 使用说明

### daily_brief.js 每日早报

修改脚本顶部的 `CONFIG`：

```js
const CONFIG = {
  city: '北京',        // 改成你的城市
  workStart: 9,        // 上班时间，用于算摸鱼进度
  workEnd: 18,         // 下班时间
  holidays: [...],     // 农历节日每年需手动更新
};
```

天气接口多源兜底，失败时自动跳过该模块，不影响其余内容。

### sub_expire.js 订阅到期管家

修改顶部的 `SUBS` 数组：

```js
{ name: '域名 xxxx.com', expire: '2027-03-15', warnDays: 14, price: 75, note: '腾讯云' }
```

- `warnDays`：提前几天开始提醒
- `price`：年费，用于年度汇总
- 提醒节点：`warnDays` / 14 / 7 / 3 / 1 / 0 天，过期后每 7 天一次
- **同一天同一进度只提醒一次**（状态存 `$prefs`），不会反复打扰
- 续费后把 `expire` 改成新日期即可

### site_monitor.js 网站宕机监控

修改顶部的 `SITES` 数组：

```js
{ name: '博客', url: 'https://blog.example.com', keyword: 'example' }
```

- `keyword`：页面必须包含的关键词。留空则只判断状态码。
  填上关键词可以识破「HTTP 200 但内容是运营商广告页」这类劫持
- `failThreshold`：连续失败几次才判定宕机，默认 2（即 20 分钟），避免网络抖动误报
- `quietHours`：免打扰时段，此区间内只记录日志不推送
- 故障和恢复都会通知，恢复时给出故障时长

## 注意事项

1. **QX 定时任务依赖 App 存活**：iOS 后台被杀后任务不会执行，属于 QX 机制限制。
   对时效性要求高的（如宕机监控），建议同时配合 UptimeRobot 等外部服务。
2. **单次执行有 10 秒上限**：三个脚本都做了超时控制（`httpGet` 默认 6 秒，
   监控单站 6 秒）。站点数量建议控制在 5 个以内。
3. **状态持久化**：`sub_expire.js` 和 `site_monitor.js` 用 `$prefs` 存状态，
   重装 App 或清除数据会丢失（表现为重新提醒一次，无其他影响）。
