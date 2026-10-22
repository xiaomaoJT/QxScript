/**
 * @Author: XiaoMao
 * 响应体分析器（逆向辅助）
 * 拦截响应 → 递归扫描 → 标出所有会员/权限相关字段及完整 JSON 路径
 *
 * [rewrite_local]
 * ^https?://api\.example\.com/ url script-response-body resp_inspector.js
 *
 * [mitm]
 * hostname = api.example.com
 *
 * 说明：
 * 1. 零依赖。命中后自动分析，结果通过通知 + 日志输出
 * 2. 输出完整路径（如 data.vip_info.expire_time），直接拿去写解锁规则
 * 3. saveBody 为 true 时会把原始响应存到 $prefs，便于反复比对
 *
 */

const CONFIG = {
  hosts: ['api.example.com'], // 要分析的主机，支持 '*.example.com'
  pathFilter: null, // 如 /\/user\/info/i，只分析匹配的路径
  saveBody: false, // 是否保存原始响应到 $prefs（key: respInspectorBody）
  maxDepth: 8, // 递归深度上限
  notify: true, // 是否弹通知
  // 可疑字段关键词，命中即标注。大小写不敏感
  keywords: [
    'vip', 'member', 'expire', 'expiry', 'unlock', 'pro', 'privilege',
    'pay', 'paid', 'subscribe', 'subscription', 'deadline', 'endtime', 'end_time',
    'isvip', 'ismember', 'ispro', 'is_pay', 'ispay', 'vipend', 'viptype',
    'membertype', 'usertype', 'level', 'auth', 'permission', 'trial', 'forever',
  ],
  // 这些值本身就很可疑（布尔 true/时间戳/权益文案）
  valueHints: ['vip', '会员', 'svip', 'premium', '已购', '永久', 'forever', 'pro'],
};

//==================== 引擎 ====================

function matchHost(ruleHost, host) {
  if (ruleHost.indexOf('*.') === 0) {
    const suffix = ruleHost.slice(1);
    return host === suffix.slice(1) || host.endsWith(suffix);
  }
  return host === ruleHost;
}

const url = $request.url;
// QX 的 JSC 没有 URL 全局对象，用正则提取
let host = (url.match(/^https?:\/\/([^\/?#]+)/) || [])[1] || url;
host = host.split(':')[0];

const hitHost = CONFIG.hosts.some((h) => matchHost(h, host));
const hitPath = !CONFIG.pathFilter || CONFIG.pathFilter.test(url);

function main() {
  const raw = $response.body;
  let obj = null;
  let parseErr = null;
  try {
    obj = JSON.parse(raw);
  } catch (e) {
    parseErr = String(e).slice(0, 80);
  }

  if (!obj) {
    // 非 JSON：给出提示，可能是 Protobuf / 加密 / 压缩
    const size = raw.length;
    const head = raw.slice(0, 60).replace(/[^\x20-\x7e]/g, '.');
    const msg =
      '响应非 JSON（' + size + ' 字节）\n' +
      '可能是 Protobuf / 加密 / 压缩\n' +
      '头部：' + head;
    console.log('[inspector] ' + msg + (parseErr ? '\n' + parseErr : ''));
    if (CONFIG.notify) $notify('响应分析', host + ' 非 JSON', msg);
    $done({});
    return;
  }

  const found = [];
  const seen = new Set();

  function kwIn(key) {
    const k = String(key).toLowerCase().replace(/[_\-\s]/g, '');
    return CONFIG.keywords.some((w) => k.indexOf(w.toLowerCase().replace(/[_\-\s]/g, '')) >= 0);
  }

  function valHint(v) {
    if (typeof v === 'boolean') return true;
    if (typeof v === 'number' && v > 1e9) return '时间戳';
    if (typeof v === 'string') {
      const s = v.toLowerCase();
      if (CONFIG.valueHints.some((h) => s.indexOf(h.toLowerCase()) >= 0)) return true;
      // 看起来像日期
      if (/^\d{4}-\d{2}-\d{2}/.test(v)) return '日期';
      if (/^\d{10,13}$/.test(v)) return '时间戳';
    }
    return false;
  }

  function walk(node, path, depth) {
    if (depth > CONFIG.maxDepth || node == null) return;
    if (Array.isArray(node)) {
      if (node.length > 50) return; // 大数组跳过，避免噪音
      node.forEach((v, i) => walk(v, path + '[' + i + ']', depth + 1));
      return;
    }
    if (typeof node !== 'object') return;

    for (const k of Object.keys(node)) {
      const v = node[k];
      const p = path ? path + '.' + k : k;
      const keyHit = kwIn(k);
      const vh = valHint(v);

      if ((keyHit || vh) && !seen.has(p)) {
        seen.add(p);
        found.push({
          path: p,
          key: k,
          value: typeof v === 'object' ? '[object]' : v,
          reason: keyHit ? '字段名' : (typeof vh === 'string' ? vh : '值类型'),
        });
      }
      if (v && typeof v === 'object') walk(v, p, depth + 1);
    }
  }

  walk(obj, '', 0);

  // 按可疑度排序：字段名命中 > 时间戳/日期 > 布尔
  const rank = { '字段名': 0, 时间戳: 1, 日期: 1, 值类型: 2 };
  found.sort((a, b) => (rank[a.reason] ?? 9) - (rank[b.reason] ?? 9));

  const lines = [];
  lines.push('URL: ' + url.slice(0, 120));
  lines.push('命中字段：' + found.length + ' 个');
  lines.push('');
  found.slice(0, 40).forEach((f, i) => {
    lines.push(
      (i + 1) + '. ' + f.path +
      '\n     值 = ' + JSON.stringify(f.value) +
      '  [' + f.reason + ']'
    );
  });
  if (found.length > 40) lines.push('... 其余 ' + (found.length - 40) + ' 个见日志');

  const out = lines.join('\n');
  console.log('[inspector]\n' + out);

  if (CONFIG.notify) {
    $notify('响应分析 · ' + found.length + ' 个可疑字段', host, out.slice(0, 900));
  }

  if (CONFIG.saveBody) {
    try {
      $prefs.setValueForKey(raw, 'respInspectorBody');
      console.log('[inspector] 原始响应已存至 $prefs: respInspectorBody');
    } catch (e) {}
  }

  $done({});
}

if (hitHost && hitPath) {
  main();
} else {
  $done({});
}
