/**
 * tgbot-cors.js — Quantumult X 本地 CORS 代理 / Telegram Bot API 网关
 *
 * 作用：浏览器里的 JS 无法直接调用 api.telegram.org（官方未返回 CORS 头，
 * 浏览器会拦截响应）。本脚本被 rewrite 的 script-echo-response 命中后，
 * 由 Quantumult X 在本地代替浏览器发起真实请求，并补齐 CORS 响应头，
 * 从而让被注入的面板「像同源请求一样」读写你的 Bot。
 *
 * 配置位置：
 *   [rewrite_local]
 *   ^https://api\.telegram\.org/bot url script-echo-response tgbot-cors.js
 *
 * 注意：token 永远从 URL 里取，脚本本身不硬编码 token。
 * 可选：在脚本顶部填入 DEFAULT_TOKEN 作为兜底（面板未传 token 时使用）。
 */

// —— 可选：默认 token（留空则必须由面板传入）——
var DEFAULT_TOKEN = "";

var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Expose-Headers": "*",
};

function respond(statusCode, bodyObj) {
  $done({
    status: "HTTP/1.1 " + statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(bodyObj),
  });
}

function respondRaw(statusCode, bodyText) {
  $done({
    status: "HTTP/1.1 " + statusCode,
    headers: CORS_HEADERS,
    body: bodyText,
  });
}

try {
  var rawUrl = $request.url || "";

  // 预检请求：直接放行，避免浏览器二次拦截
  if (($request.method || "GET").toUpperCase() === "OPTIONS") {
    $done({ status: "HTTP/1.1 204 No Content", headers: CORS_HEADERS, body: "" });
  } else {
    var qIndex = rawUrl.indexOf("?");
    var pathPart = qIndex === -1 ? rawUrl : rawUrl.slice(0, qIndex);
    var queryPart = qIndex === -1 ? "" : rawUrl.slice(qIndex);

    // 从 /bot<token>/<method> 中解析
    var m = pathPart.match(/\/bot([^/]+)\/([^/?#]+)$/);
    if (!m) {
      respond(400, { ok: false, error_code: 400, description: "bad bot api path" });
    } else {
      var token = m[1] === "__QX_TOKEN__" ? DEFAULT_TOKEN : m[1];
      var method = m[2];

      if (!token) {
        respond(401, { ok: false, error_code: 401, description: "missing bot token" });
      } else {
        var realUrl = "https://api.telegram.org/bot" + token + "/" + method + queryPart;

        var headers = {
          "Content-Type": "application/json",
          "User-Agent": "QuantumultX-TGBot/1.0",
        };

        // 转发请求体（POST 时面板传来的 JSON）
        var body = $request.body;
        if (body === undefined || body === null) body = "";

        $task
          .fetch({
            url: realUrl,
            method: ($request.method || "GET").toUpperCase(),
            headers: headers,
            body: body,
            opts: { redirection: true, "skip-cert-verify": false },
          })
          .then(function (resp) {
            // 原样回传 Telegram 的 JSON，但对上游错误（如 404）也保持 200，
            // 让前端始终能拿到结构化的 {ok:false, description}
            respondRaw(200, resp.body || "{}");
          })
          .catch(function (err) {
            respond(502, {
              ok: false,
              error_code: 502,
              description:
                "upstream fetch failed: " + (err && err.error ? err.error : String(err)),
            });
          });
      }
    }
  }
} catch (e) {
  respond(500, {
    ok: false,
    error_code: 500,
    description: "script error: " + (e && e.message ? e.message : String(e)),
  });
}