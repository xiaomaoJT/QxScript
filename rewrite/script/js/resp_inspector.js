/**
 * @Author: XiaoMao
 * 文件地址：https://github.com/xiaomaoJT/QxScript/blob/main/rewrite/script/js/resp_inspector.js
 * 响应体分析器（逆向辅助）
 * 拦截响应 → 递归扫描 → 标出所有会员/权限相关字段及完整 JSON 路径
 *
 * [rewrite_local]
 * ^https?:// url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/resp_inspector.js
 *
 * [mitm]
 * hostname = *
 *
 * 说明：
 * 1. 零依赖。命中后自动分析，结果通过通知 + 日志输出
 * 2. 输出完整路径（如 data.vip_info.expire_time），直接拿去写解锁规则
 * 3. saveBody 为 true 时会把原始响应存到 $prefs，便于反复比对
 *
 */

const CONFIG = {
  // 留空 [] = 未配置：脚本只做"捕获+引导"，不处理数据；填具体 host（或 '*'）才真正生效
  hosts: [], // 例：['api.target.com'] 或 ['*.target.com']
  pathFilter: null, // 如 /\/user\/info/i，只分析匹配的路径
  saveBody: false, // 是否保存原始响应到 $prefs（key: respInspectorBody）
  maxDepth: 8, // 递归深度上限
  notify: true, // 是否弹通知
  discoveryMode: false, // 未配置态是否把捕获到的 host/path + 可复制配置打到 QX 日志（不弹窗）
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
  // 仅显式填 '*' 才全匹配；留空视为"未配置"，不在此兜底
  if (ruleHost === '*') return true;
  // 前缀 '*.'(如 '*.example.com') → 后缀匹配（含多级子域）
  if (ruleHost.indexOf('*.') === 0) {
    const suffix = ruleHost.slice(1); // '.example.com'
    return host === suffix.slice(1) || host.endsWith(suffix);
  }
  // 任意位置 '*' 通配（如 'api.*.com' 'a*.example.com'）
  if (ruleHost.indexOf('*') >= 0) {
    const re = new RegExp(
      '^' +
        ruleHost
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // 转义正则元字符
          .replace(/\*/g, '[^.]*') + // '*' = 任意非点字符段
        '$'
    );
    return re.test(host);
  }
  return host === ruleHost;
}

// 路径前两段生成可复制正则（去掉动态 id，用户可再微调）
function buildPathRegex(path) {
  const segs = path.split('/').filter(Boolean).slice(0, 2);
  const lit = segs.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\/');
  return '/' + lit + '/i';
}

// 生成"可复制的专属配置"引导文本（捕获真实 host/path 后给出）
// file 传完整远程地址（资源引入方式，QX 直接拉取执行）
function buildConfigGuide(host, path, file, qxType, scriptCfg) {
  const esc = host.replace(/\./g, '\\.');
  const name = file.split('/').pop();
  return [
    '【' + name + ' · 捕获到目标】',
    'host = ' + host,
    'path = ' + path,
    '',
    '复制下面这段到 QX 配置，即可锁定你的专属目标（脚本名已是完整远程地址，QX 资源引入直接拉取）：',
    '',
    '[rewrite_local]',
    '^https?://' + esc + '/ url ' + qxType + ' ' + file,
    '',
    '[mitm]',
    'hostname = ' + host,
    '',
    '// ' + name + ' 配置区',
    scriptCfg,
    '',
  ].join('\n');
}

const url = $request.url;
// QX 的 JSC 没有 URL 全局对象，用正则提取
let host = (url.match(/^https?:\/\/([^\/?#]+)/) || [])[1] || url;
host = host.split(':')[0];
const _path = (url.match(/^https?:\/\/[^\/?#]+([^?#]*)/) || [,'/'])[1] || '/';

const hitHost = CONFIG.hosts.length > 0 && CONFIG.hosts.some((h) => matchHost(h, host));
const hitPath = !CONFIG.pathFilter || CONFIG.pathFilter.test(url);

// 未锁定到任何 host 时：
// - discoveryMode=false（默认）→ 静默放行，不弹通知、不刷日志
// - discoveryMode=true → 仅把捕获到的 host/path + 可复制配置打到 QX 日志（不弹窗），供你之后锁定目标
const _setupKey = 'respInspector_setup_hint';
if (!hitHost) {
  if (CONFIG.discoveryMode) {
    const _gk = 'respInspector_cap_' + host;
    if (!$prefs.valueForKey(_gk)) {
      $prefs.setValueForKey('1', _gk);
      const g = buildConfigGuide(
        host, _path, 'https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/resp_inspector.js', 'script-response-body',
        "hosts: ['" + host + "'],\n  pathFilter: " + buildPathRegex(_path) + ','
      );
      console.log('[inspector · 发现] ' + g);
    }
  } else if (!$prefs.valueForKey(_setupKey)) {
    $prefs.setValueForKey('1', _setupKey);
    console.log('[inspector] 未配置 hosts，已静默放行。把 CONFIG.hosts 填入目标域名后生效；开启 CONFIG.discoveryMode=true 可在 QX 日志查看捕获到的 host/path。');
  }
}

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
