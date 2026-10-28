/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2026-10-28
 *
 *
\阿\里\云\盘\签\到\+\奖\励\领\取\

仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoALiSignReward.js

2、首次进入「签到页」会自动捕获临时 Token，随后自动领取：
   · 当日签到（/v1/activity/sign_in）
   · 主奖励（/v1/activity/sign_in_reward）
   · 备份奖励（/v2/activity/sign_in_task_reward）
   已领取的日期会按「年/月」记录进度，下次只补领缺的天数，不再每天全量重领。

3、Token 失效时脚本会通知你，去 App 手动领一次奖励即可重新激活；领取完建议关闭脚本。

4、⚠️ 配置文件 [task_local] 标签添加（每日定时触发，可选）
// 每日签到
0 8 * * * https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/ali_sign_auto2.js, tag=阿里云签到, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/AliYunDrive.png, enabled=true


********************************

[mitm]
hostname = member.aliyundrive.com,auth.alipan.com,aliyundrive.alipan.com

[rewrite_local]
// 获取签到Token + 自动领取奖励
https:\/\/member\.aliyundrive\.com\/v1\/activity\/sign_in_reward url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoALiSignReward.js

// 获取账号Token（Authorization 刷新，依赖外部脚本）
^https:\/\/(auth|aliyundrive)\.alipan\.com\/v2\/account\/token url script-request-body https://raw.githubusercontent.com/zqzess/rule_for_quantumultX/master/js/Mine/aDriveCheckIn/aDriveCheckIn.js


********************************/

let $ = new Env("AliSignReward");
let reqHeaders = ($request && $request.headers) || {};
let requestUrl = $request && $request.url;

/* ===================== 配置 ===================== */
// 致命错误码：命中说明临时 Token 失效，需要手动重新激活
const FATAL_CODES = ["Forbidden", "InvalidSignature", "ExchangeFailed"];
// 需要持久化的请求头（用于后续自动领取）
const HEAD_KEYS = [
  "Cookie",
  "x-timestamp",
  "x-sgext",
  "x-device-id",
  "x-signature",
  "x-sign",
  "x-mini-wua",
  "Authorization",
  "x-umt",
  "x-signature-v2",
  "x-nonce",
];
// 领取接口
const EP = {
  signIn: {
    url: "https://member.aliyundrive.com/v1/activity/sign_in",
    label: "当日签到",
  },
  main: {
    url: "https://member.aliyundrive.com/v1/activity/sign_in_reward",
    label: "主奖励",
  },
  backup: {
    url: "https://member.aliyundrive.com/v2/activity/sign_in_task_reward?_rx-s=mobile",
    label: "备份奖励",
  },
};

const UA =
  "AliApp(AYSD/5.8.1) com.alicloud.smartdrive/5.8.1 Version/17.6.1 Channel/201200 Language/zh-Hans-CN /iOS Mobile/iPhone16,2";

/* ===================== 工具函数 ===================== */
// 构造自动领取用的请求头（不再写死 Content-Length，交由 HTTP 客户端计算）
const buildHeaders = () => ({
  Host: "member.aliyundrive.com",
  Cookie: $.read("Cookie"),
  "User-Agent": UA,
  "x-timestamp": $.read("x-timestamp"),
  Referer: "https://aliyundrive.com/",
  "X-Canary": "client=web,app=other,version=v0.1.0",
  "x-sgext": $.read("x-sgext"),
  "x-device-id": $.read("x-device-id"),
  Connection: "keep-alive",
  "x-signature": $.read("x-signature"),
  "x-sign": $.read("x-sign"),
  "x-mini-wua": $.read("x-mini-wua"),
  Authorization: $.read("Authorization"),
  "Accept-Language": "zh-CN,zh-Hans;q=0.9",
  "x-umt": $.read("x-umt"),
  Accept: "*/*",
  "Content-Type": "application/json; charset=UTF-8",
  "x-signature-v2": $.read("x-signature-v2"),
  "Accept-Encoding": "gzip, deflate, br",
  "x-nonce": $.read("x-nonce"),
});

// 保存本次请求里的凭证头（空值不覆盖已有有效值）
const saveHeaders = (h) => {
  const src = {};
  HEAD_KEYS.forEach((k) => {
    const v = h[k] != null ? h[k] : h[k.toLowerCase()];
    if (v != null && v !== "") src[k] = v;
  });
  HEAD_KEYS.forEach((k) => {
    if (src[k] != null) $.write(src[k], k);
  });
};

const monthKey = () => {
  const d = new Date();
  return d.getFullYear() + "/" + (d.getMonth() + 1);
};
const todayNum = () => new Date().getDate();

const getProgress = () => {
  try {
    return JSON.parse($.read("aliSignProgress") || "{}");
  } catch (e) {
    return {};
  }
};
const setProgress = (mk, lastDay) => {
  $.write(JSON.stringify({ month: mk, lastDay: lastDay }), "aliSignProgress");
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ===================== 统一请求封装 ===================== */
// 返回 Promise<{ok, fatal, msg}>
const callApi = (type, body) =>
  new Promise((resolve) => {
    const ep = EP[type];
    const opt = {
      url: ep.url,
      method: "POST",
      headers: buildHeaders(),
      body: typeof body === "string" ? body : JSON.stringify(body),
    };
    let settled = false;
    const finish = (r) => {
      if (!settled) {
        settled = true;
        resolve(r);
      }
    };
    $.post(opt, (err, resp, body) => {
      if (err) {
        finish({ ok: false, fatal: false, msg: "网络错误" });
        return;
      }
      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        finish({ ok: false, fatal: false, msg: "响应解析失败" });
        return;
      }
      if (data && data.code && FATAL_CODES.includes(data.code)) {
        finish({ ok: false, fatal: true, code: data.code, msg: data.message || data.code });
        return;
      }
      const desc =
        data && data.result && (data.result.description || data.result.name || data.result.signInCount);
      if (data && (data.result || (data.success && data.success !== false))) {
        finish({ ok: true, msg: desc ? String(desc) : "" });
        return;
      }
      // 有 code 但非致命（如 AlreadyDone / 已领取）→ 视为已领取，不报错
      if (data && data.code) {
        finish({ ok: true, skipped: true, msg: data.message || data.code });
        return;
      }
      finish({ ok: false, fatal: false, msg: "未知响应" });
    });
    // 兜底超时，避免请求挂死
    setTimeout(() => finish({ ok: false, fatal: false, msg: "请求超时" }), 10000);
  });

/* ===================== 主流程 ===================== */
const getAllReward = async () => {
  try {
    if (!$.read("Cookie")) {
      $.notify(
        "XiaoMao阿里云盘",
        "Token获取失败",
        "请先前往App手动领取一次奖励获取Token",
        ""
      );
      return;
    }

    const mk = monthKey();
    const today = todayNum();
    const prog = getProgress();
    let lastOkDay = prog && prog.month === mk ? prog.lastDay || 0 : 0;
    const startDay = lastOkDay + 1;

    if (startDay > today) {
      $.notify(
        "XiaoMao阿里云盘",
        "今日奖励已领取",
        "无需补领，进度已记录到 " + mk + "/" + today,
        ""
      );
      return;
    }

    // 1) 先尝试当日签到（非致命，失败仅记录）
    let signMsg = "";
    try {
      const s = await callApi("signIn", "{}");
      signMsg = s.ok ? "当日签到: 成功" : "当日签到: " + (s.msg || "跳过");
      console.log("[签到] " + signMsg);
    } catch (e) {
      console.log("[签到] 异常: " + e);
    }

    // 2) 逐天补领主奖励 + 备份奖励
    const success = [];
    const failed = [];
    let reauth = false;

    for (let day = startDay; day <= today; day++) {
      const m = await callApi("main", { signInDay: day });
      if (m.fatal) {
        reauth = true;
        failed.push("第" + day + "天主奖励: " + m.msg);
        break;
      }
      if (m.ok) {
        lastOkDay = day; // 主奖励成功即推进进度（备份奖励尽量领取，失败不阻塞）
        success.push("第" + day + "天主奖励✅");
      } else {
        failed.push("第" + day + "天主奖励: " + m.msg);
      }

      const b = await callApi("backup", { signInDay: day });
      if (b.fatal) {
        reauth = true;
        failed.push("第" + day + "天备份: " + b.msg);
        break;
      }
      if (b.ok) success.push("第" + day + "天备份✅");
      else failed.push("第" + day + "天备份: " + b.msg);

      // 每完成一天就落盘进度，即使中途被杀也能续领
      setProgress(mk, lastOkDay);
      await sleep(200 + Math.floor(Math.random() * 200));
    }

    setProgress(mk, lastOkDay);

    // 3) 汇总通知
    if (reauth) {
      $.notify(
        "XiaoMao阿里云盘",
        "云盘临时Token已失效",
        "请前往App手动领取一次奖励进行激活！\n" + failed.slice(0, 3).join("\n"),
        ""
      );
    } else {
      const summary =
        "成功 " + success.length + " 项，失败 " + failed.length + " 项" +
        (signMsg ? "\n" + signMsg : "");
      $.notify(
        "XiaoMao阿里云盘 · 领取完成",
        summary,
        failed.length ? failed.slice(0, 5).join("\n") : "全部领取成功 🎉",
        ""
      );
    }

    success.slice(0, 12).forEach((s) => console.log("🎉" + s));
    failed.slice(0, 12).forEach((f) => console.log("❌" + f));
  } catch (e) {
    console.log("[领取流程] 异常: " + e);
  }
};

/* ===================== 入口 ===================== */
if (
  requestUrl &&
  /^https:\/\/member\.aliyundrive\.com\/v1\/activity\/sign_in_reward/.test(
    requestUrl
  )
) {
  const savedTs = $.read("x-timestamp");
  const isNewToken = savedTs !== reqHeaders["x-timestamp"];
  saveHeaders(reqHeaders);

  if (isNewToken) {
    $.notify(
      "XiaoMao阿里云盘",
      "Token获取成功",
      "已记录凭证，正在自动领取奖励…",
      ""
    );
  }

  // 先放行本次请求（用原始请求头），再在后台完成领取；领取结束再 $done
  getAllReward()
    .then(() => $.done({}))
    .catch(() => $.done({}));
}

function Env(name) {
  // 判断当前环境是否为 Loon
  const isLoon = typeof $loon !== "undefined";
  // 判断当前环境是否为 Surge
  const isSurge = typeof $httpClient !== "undefined" && !isLoon;
  // 判断当前环境是否为 QuantumultX
  const isQX = typeof $task !== "undefined";

  // 定义 read 方法，用于读取数据
  const read = (key) => {
    if (isLoon || isSurge) return $persistentStore.read(key);
    if (isQX) return $prefs.valueForKey(key);
  };

  // 定义 write 方法，用于写入数据
  const write = (value, key) => {
    if (isLoon || isSurge) return $persistentStore.write(value, key);
    if (isQX) return $prefs.setValueForKey(value, key);
  };

  // 定义 notify 方法，用于发送通知
  const notify = (
    title = "XiaoMao",
    subtitle = "",
    message = "",
    url = "",
    url2 = url
  ) => {
    if (isLoon) $notification.post(title, subtitle, message, url);
    if (isSurge) $notification.post(title, subtitle, message, { url });
    if (isQX)
      $notify(title, subtitle, message, { "open-url": url, "media-url": url2 });
  };

  // 定义 get 方法，用于发送 GET 请求
  const get = (url, callback) => {
    if (isLoon || isSurge) $httpClient.get(url, callback);
    if (isQX) {
      url.method = `GET`;
      $task
        .fetch(url)
        .then((resp) => callback(null, {}, resp.body))
        .catch((e) => callback(e, {}, null));
    }
  };

  // 定义 post 方法，用于发送 POST 请求
  const post = (url, callback) => {
    if (isLoon || isSurge) $httpClient.post(url, callback);
    if (isQX) {
      url.method = `POST`;
      $task
        .fetch(url)
        .then((resp) => callback(null, {}, resp.body))
        .catch((e) => callback(e, {}, null));
    }
  };

  // 定义 put 方法，用于发送 PUT 请求
  const put = (url, callback) => {
    if (isLoon || isSurge) $httpClient.put(url, callback);
    if (isQX) {
      url.method = "PUT";
      $task
        .fetch(url)
        .then((resp) => callback(null, {}, resp.body))
        .catch((e) => callback(e, {}, null));
    }
  };

  // 定义 toObj 方法，用于将字符串转为对象
  const toObj = (str) => JSON.parse(str);

  // 定义 toStr 方法，用于将对象转为字符串
  const toStr = (obj) => JSON.stringify(obj);

  // 定义 queryStr 方法，用于将对象转为可以请求的字符串
  const queryStr = (obj) => {
    return Object.keys(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join("&");
  };

  // 定义 log 方法，用于输出日志
  const log = (message) => console.log(message);

  // 定义 done 方法，用于结束任务
  const done = (value = {}) => $done(value);

  // 返回包含所有方法的对象
  return {
    name,
    read,
    write,
    notify,
    get,
    post,
    put,
    toObj,
    toStr,
    queryStr,
    log,
    done,
  };
}
