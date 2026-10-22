/**
 * @Author: XiaoMao
 * 文件地址：https://github.com/xiaomaoJT/QxScript/blob/main/rewrite/script/js/sign_lab.js
 * 签名算法分析实验台（逆向辅助）
 *
 * [rewrite_local]
 * ^https?:// url script-request-header https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/sign_lab.js
 *
 * [mitm]
 * hostname = *
 *
 * 说明：
 * 1. 零依赖，内联 MD5 / SHA1 / SHA256 / HMAC（QX 无内置 crypto）
 * 2. 拦截请求 → 提取参数 → 识别签名字段 → 自动穷举常见算法组合
 * 3. 与响应里的真实签名比对，命中即输出"算法+拼接顺序+盐值位置"
 * 4. 盐值字典可自行扩展（SALT_DICT），也支持从其他参数自动取盐
 *
 * 工作流：
 *   第一步 resp_inspector.js 找响应字段
 *   第二步 sign_lab.js 还原签名算法
 *   第三步 自己写脚本构造请求
 *
 */

const CONFIG = {
  // 留空 [] = 未配置：脚本只做"捕获+引导"，不处理数据；填具体 host（或 '*'）才真正生效
  hosts: [], // 例：['api.target.com'] 或 ['*.target.com']
  // BoxJS 缓存：把上次还原成功的算法配置存下来，下次同参数直接复用
  // 需要配合 BoxJS 订阅（rewrite/boxJS/XiaoMao.json）使用
  useBoxJs: true,
  boxJsKey: 'signLabResult',
  pathFilter: null, // 如 /\/api\//i
  notify: true,
  discoveryMode: false, // 未配置态是否把捕获到的 host/path + 可复制配置打到 QX 日志（不弹窗）
  // 签名字段名候选（小写比较）
  signKeys: ['sign', 'sig', 'signature', 'token', 'mac', 'hash', 'check', 'verify', 'sk'],
  // 时间戳字段候选（有些签名会把它拼进去）
  tsKeys: ['timestamp', 'ts', 'time', 'nonce', 't'],
  // 盐值字典，按你的目标补充
  saltDict: [
    '', 'salt', 'secret', 'key', 'appkey', 'app_secret',
    '123456', 'android', 'ios', 'mobile', 'client',
  ],
  // 输出最多的候选组合数
  maxCandidates: 60,
};

//==================== BoxJS 实时配置（覆盖内置默认值）====================
// 配合 BoxJS 订阅 rewrite/boxJS/XiaoMaoReverseTools.json 使用：
// 在 BoxJS 里改参数 → 脚本下次运行即生效，无需改代码。
function readBox(key, def, type) {
  let raw = null;
  try { if (typeof $prefs !== 'undefined' && $prefs) raw = $prefs.valueForKey(key); } catch (e) {}
  const empty = raw === null || raw === undefined || String(raw).trim() === '';
  const s = empty ? '' : String(raw).trim();
  try {
    switch (type) {
      case 'bool': return empty ? def : /^(1|true|yes|on)$/i.test(s);
      case 'int': { if (empty) return def; const n = parseInt(s, 10); return isNaN(n) ? def : n; }
      case 'list': {
        const src = empty ? (Array.isArray(def) ? def.join('\n') : String(def == null ? '' : def)) : s;
        return src.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
      }
      case 'regex': {
        if (empty) return def;
        if (s.charAt(0) === '/') {
          const m = s.match(/^\/(.*)\/([gimsuy]*)$/);
          return m ? new RegExp(m[1], m[2] || 'i') : new RegExp(s, 'i');
        }
        return new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      }
      case 'json': { if (empty) return def; try { return JSON.parse(s); } catch (e) { return def; } }
      case 'kv': {
        const src = empty ? (Array.isArray(def) ? def.join('\n') : String(def == null ? '' : def)) : s;
        const o = {};
        src.split(/[,\n]/).forEach((p) => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = p.slice(i + 1).trim(); });
        return o;
      }
      default: return empty ? def : s;
    }
  } catch (e) { return def; }
}

// 用 BoxJS 订阅里的值覆盖内置默认；未配置则保持内置默认（向后兼容）
CONFIG.hosts = readBox('signlabHosts', CONFIG.hosts, 'list');
CONFIG.pathFilter = readBox('signlabPathFilter', CONFIG.pathFilter, 'regex');
CONFIG.signKeys = readBox('signlabSignKeys', CONFIG.signKeys, 'list');
CONFIG.tsKeys = readBox('signlabTsKeys', CONFIG.tsKeys, 'list');
CONFIG.saltDict = readBox('signlabSaltDict', CONFIG.saltDict, 'list');
CONFIG.maxCandidates = readBox('signlabMaxCandidates', CONFIG.maxCandidates, 'int');
CONFIG.notify = readBox('signlabNotify', CONFIG.notify, 'bool');
CONFIG.discoveryMode = readBox('signlabDiscovery', CONFIG.discoveryMode, 'bool');
CONFIG.useBoxJs = readBox('signlabUseBoxJs', CONFIG.useBoxJs, 'bool');

// 能力增强：筛选穷举空间（不配置则全开，行为与原版一致）
const BOX_ALGOS = readBox('signlabAlgos', 'md5,sha1,sha256,hmac-md5,hmac-sha1,hmac-sha256', 'list');
const BOX_ORDERS = readBox('signlabOrders', 'dict,raw', 'list');
const BOX_JOINS = readBox('signlabJoins', 'k=v&', 'list');
const BOX_SALTPOS = (readBox('signlabSaltPos', 'both', 'str') || 'both').toLowerCase();
const BOX_OUTCASE = (readBox('signlabOutCase', 'lower', 'str') || 'lower').toLowerCase();
const JOIN_MAP = {
  'k=v&': { name: 'k=v&k=v', fn: (k, v) => k + '=' + v },
  'v&v': { name: 'v&v', fn: (k, v) => String(v) },
  'k&v': { name: 'k&v', fn: (k, v) => k + String(v) },
  'kv拼接': { name: 'kv拼接', fn: (k, v) => k + v },
  '无分隔': { name: '无分隔', fn: (k, v) => k + v },
};

//==================== 内联 Crypto（已用 Node crypto 63 例对拍通过）=====================

// 经过 Node crypto 逐字节对拍的 SHA 家族实现（含 HMAC）
// 用法：node sha.js   （自检）

function toBytes(str) {
  if (Array.isArray(str)) return str.slice();
  const out = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return out;
}

function rotl(x, n) {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}
function rotr(x, n) {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}
function hex32(n) {
  return (n >>> 0).toString(16).padStart(8, '0');
}
function bytesFromWords(words, littleEndian) {
  const out = [];
  for (const w of words) {
    for (let i = 0; i < 4; i++) {
      const b = littleEndian ? ((w >>> (i * 8)) & 0xff) : ((w >>> ((3 - i) * 8)) & 0xff);
      out.push(b);
    }
  }
  return out;
}
function toHex(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += (bytes[i] & 0xff).toString(16).padStart(2, '0');
  return s;
}

// 通用填充：追加 0x80 + 0x00 到 56 mod 64，再追加 64 位大端长度
// 长度用字符串累加，避免大数精度丢失（支持任意长输入）
function pad(msg) {
  const out = msg.slice();
  out.push(0x80);
  while (out.length % 64 !== 56) out.push(0);
  // 64 位大端：高 32 位置 0（输入不可能超过 512MB），低 32 位为 bitLen
  const bitLen = msg.length * 8;
  out.push(0, 0, 0, 0);
  out.push((bitLen >>> 24) & 0xff, (bitLen >>> 16) & 0xff, (bitLen >>> 8) & 0xff, bitLen & 0xff);
  return out;
}

//==================== MD5 ====================
function md5Bytes(msg) {
  const m = msg.slice();
  const bitLen = m.length * 8;
  m.push(0x80);
  while (m.length % 64 !== 56) m.push(0);
  for (let i = 0; i < 4; i++) m.push((bitLen >>> (i * 8)) & 0xff);

  const S = [
    7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
    5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
    4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
    6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21,
  ];
  const K = [];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let off = 0; off < m.length; off += 64) {
    const M = [];
    for (let i = 0; i < 16; i++) {
      M[i] = ((m[off + i * 4] | (m[off + i * 4 + 1] << 8) | (m[off + i * 4 + 2] << 16) | (m[off + i * 4 + 3] << 24)) >>> 0);
    }
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + rotl(F, S[i])) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  // MD5 输出为小端
  const le = (n) => {
    let s = '';
    for (let i = 0; i < 4; i++) s += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    return s;
  };
  return bytesFromWords([a0,b0,c0,d0], true);
}

//==================== SHA1 ====================
function sha1Bytes(msg) {
  const m = pad(msg);
  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;

  for (let off = 0; off < m.length; off += 64) {
    const w = [];
    for (let i = 0; i < 16; i++) {
      w[i] = (((m[off + i * 4] << 24) | (m[off + i * 4 + 1] << 16) | (m[off + i * 4 + 2] << 8) | m[off + i * 4 + 3]) >>> 0);
    }
    for (let i = 16; i < 80; i++) {
      w[i] = rotl((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) >>> 0, 1);
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4;
    for (let i = 0; i < 80; i++) {
      let f, k;
      if (i < 20) { f = ((b & c) | (~b & d)) >>> 0; k = 0x5a827999; }
      else if (i < 40) { f = (b ^ c ^ d) >>> 0; k = 0x6ed9eba1; }
      else if (i < 60) { f = ((b & c) | (b & d) | (c & d)) >>> 0; k = 0x8f1bbcdc; }
      else { f = (b ^ c ^ d) >>> 0; k = 0xca62c1d6; }
      const t = (rotl(a, 5) + f + e + k + w[i]) >>> 0;
      e = d; d = c; c = rotl(b, 30); b = a; a = t;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
  }
  return bytesFromWords([h0,h1,h2,h3,h4], false);
}

//==================== SHA256 ====================
const K256 = [
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
];

function sha256Bytes(msg) {
  const m = pad(msg);
  let h = [
    0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
    0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19,
  ];
  for (let off = 0; off < m.length; off += 64) {
    const w = new Array(64);
    for (let i = 0; i < 16; i++) {
      w[i] = (((m[off + i * 4] << 24) | (m[off + i * 4 + 1] << 16) | (m[off + i * 4 + 2] << 8) | m[off + i * 4 + 3]) >>> 0);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = (rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)) >>> 0;
      const s1 = (rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)) >>> 0;
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (let i = 0; i < 64; i++) {
      const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
      const ch = ((e & f) ^ (~e & g)) >>> 0;
      const t1 = (hh + S1 + ch + K256[i] + w[i]) >>> 0;
      const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      const t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e;
      e = (d + t1) >>> 0;
      d = c; c = b; b = a;
      a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
  }
  return bytesFromWords(h, false);
}

//==================== HMAC（全程字节）====================
function hmac(hashBytesFn, blockSize, key, msg) {
  let k = toBytes(String(key));
  if (k.length > blockSize) k = toBytes(hashBytesFn(k));
  while (k.length < blockSize) k.push(0);
  const ipad = k.map((x) => (x ^ 0x36) & 0xff);
  const opad = k.map((x) => (x ^ 0x5c) & 0xff);
  const inner = hashBytesFn(ipad.concat(toBytes(String(msg))));
  return toHex(hashBytesFn(opad.concat(toBytes(inner))));
}

function md5(s) { return toHex(md5Bytes(toBytes(s))); }
function sha1(s) { return toHex(sha1Bytes(toBytes(s))); }
function sha256(s) { return toHex(sha256Bytes(toBytes(s))); }


//==================== 算法表 ====================
const HASHES = {
  md5: (m) => toHex(md5Bytes(toBytes(m))),
  sha1: (m) => toHex(sha1Bytes(toBytes(m))),
  sha256: (m) => toHex(sha256Bytes(toBytes(m))),
  // hmac() 内部已返回 hex 字符串，不要再包 toHex
  'hmac-md5': (m, k) => hmac(md5Bytes, 64, k, m),
  'hmac-sha1': (m, k) => hmac(sha1Bytes, 64, k, m),
  'hmac-sha256': (m, k) => hmac(sha256Bytes, 64, k, m),
};

//==================== 参数提取 ====================

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

//==================== BoxJS 缓存 ====================

const BJ = {
  get(k) {
    if (!CONFIG.useBoxJs) return null;
    try {
      const v = $prefs.valueForKey(k);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  },
  set(k, v) {
    if (!CONFIG.useBoxJs) return;
    try {
      $prefs.setValueForKey(JSON.stringify(v), k);
    } catch (e) {}
  },
};

//==================== 运行时引导 ====================

function guide(title, lines) {
  const body = lines.filter(Boolean).join('\n');
  console.log('[sign_lab] ' + title + '\n' + body);
  if (CONFIG.notify) $notify(title, host, body.slice(0, 900));
}

const url = $request.url;

// QX 的 JSC 没有 URL 全局对象，用正则提取 host 和 query
function parseUrl(u) {
  const m = /^https?:\/\/([^\/?#]+)([^?#]*)(\?[^#]*)?/.exec(u) || [];
  const host = (m[1] || '').split(':')[0];
  const q = {};
  const qs = m[3] || '';
  if (qs.length > 1) {
    qs.slice(1).split('&').forEach((kv) => {
      const i = kv.indexOf('=');
      if (i > 0) q[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
    });
  }
  return { host: host, query: q };
}

const _pu = parseUrl(url);
let host = _pu.host || url;
let query = _pu.query;
const _path = (url.match(/^https?:\/\/[^\/?#]+([^?#]*)/) || [,'/'])[1] || '/';

const hitHost = CONFIG.hosts.length > 0 && CONFIG.hosts.some((h) => matchHost(h, host));
const hitPath = !CONFIG.pathFilter || CONFIG.pathFilter.test(url);

// 未锁定到任何 host 时：
// - discoveryMode=false（默认）→ 静默放行，不弹通知、不刷日志
// - discoveryMode=true → 仅把捕获到的 host/path + 可复制配置打到 QX 日志（不弹窗），供你之后锁定目标
const _setupKey = 'signLab_setup_hint';
if (!hitHost) {
  // 首次进入未配置态：弹一次提醒（告知当前状态 + 用完及时关掉 MITM），避免只在日志里没人看到
  if (!$prefs.valueForKey(_setupKey)) {
    $prefs.setValueForKey('1', _setupKey);
    const modeTxt = CONFIG.discoveryMode
      ? '发现模式已开启：会在 QX 日志打印捕获到的 host/path（不弹窗）。拿到目标后请在 BoxJS 关掉『发现模式』并填『目标域名』；研究完毕请及时关闭 MITM / 本工具，勿长期用 * 抓全量流量。'
      : '未配置目标域名，当前静默放行（不处理任何请求）。请到 BoxJS『签名还原』卡片的『目标域名』填入你的目标 host 锁定目标；研究完毕请及时关闭 MITM / 本工具，勿长期用 * 抓全量流量。';
    $notify('逆向工具箱 · 未配置提醒（仅提示一次）', host, modeTxt.slice(0, 900));
  }
  if (CONFIG.discoveryMode) {
    const _gk = 'signLab_cap_' + host;
    if (!$prefs.valueForKey(_gk)) {
      $prefs.setValueForKey('1', _gk);
      const g = buildConfigGuide(
        host, _path, 'https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/script/js/sign_lab.js', 'script-request-header',
        "hosts: ['" + host + "'],\n  pathFilter: " + buildPathRegex(_path) + ','
      );
      console.log('[sign_lab · 发现] ' + g);
    }
  } else {
    console.log('[sign_lab] 未配置目标域名，已静默放行。到 BoxJS『签名还原』卡片填『目标域名』后生效；开启『发现模式』可在 QX 日志查看捕获到的 host/path。');
  }
}

// 命中主机，先看有没有缓存过结论
const cached = BJ.get(CONFIG.boxJsKey);

function main() {

// body 参数
let bodyParams = {};
if ($request.body) {
  const b = $request.body;
  if (b.trim().charAt(0) === '{') {
    try {
      bodyParams = JSON.parse(b);
    } catch (e) {}
  } else {
    b.split('&').forEach((kv) => {
      const i = kv.indexOf('=');
      if (i > 0) bodyParams[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
    });
  }
}

const all = Object.assign({}, query, bodyParams);
const keys = Object.keys(all);

// 找签名字段
let signKey = null;
let signVal = '';
for (const k of keys) {
  if (CONFIG.signKeys.indexOf(k.toLowerCase()) >= 0) {
    signKey = k;
    signVal = String(all[k]);
    break;
  }
}

if (!signKey) {
  guide('未识别到签名字段', [
    '参数：' + keys.join(', '),
    '',
    '下一步：',
    '1. 把签名参数名加进 CONFIG.signKeys',
    '2. 或该接口本就不用签名，跳过',
  ]);
  $done({});
  return;
}

// 参与签名的参数（排除签名字段本身）
const signParams = {};
for (const k of keys) {
  if (k !== signKey) signParams[k] = all[k];
}
const pKeys = Object.keys(signParams).sort();
const pKeysRaw = Object.keys(signParams);

// 候选组合（排序/拼接/盐位置均来自 BoxJS 配置，未配则全开）
function* candidates() {
  const orders = BOX_ORDERS.map((nm) => {
    if (nm === 'reverse') return { name: '逆序', keys: pKeys.slice().reverse() };
    if (nm === 'raw') return { name: '原始序', keys: pKeysRaw };
    return { name: '字典序', keys: pKeys };
  }).filter(Boolean);
  const joins = BOX_JOINS.map((nm) => JOIN_MAP[nm]).filter(Boolean);
  if (!joins.length) joins.push(JOIN_MAP['k=v&']);

  for (const o of orders) {
    for (const j of joins) {
      for (const salt of CONFIG.saltDict) {
        const body = o.keys.map((k) => j.fn(k, signParams[k])).join(j.name === 'k=v&k=v' ? '&' : '');
        const variants = [];
        if (BOX_SALTPOS !== 'post') variants.push({ pre: salt + body, post: body });
        if (BOX_SALTPOS !== 'pre') variants.push({ pre: body, post: body + salt });
        for (const v of variants) {
          yield {
            order: o.name,
            join: j.name,
            salt: salt,
            body: body,
            pre: v.pre,
            post: v.post,
          };
        }
      }
    }
  }
}

const target = signVal.toLowerCase();
const hits = [];
let tried = 0;
const algos = BOX_ALGOS.filter((a) => HASHES[a]);
for (const c of candidates()) {
  tried++;
  for (const algo of algos) {
    // HMAC 走 key 通道（用盐值当 key，同时试 pre/post 两种拼法）；
    // 普通 hash 只算 input 本身，盐已包含在 c.pre / c.post 里
    const isHmac = algo.indexOf('hmac-') === 0;
    const inputs = isHmac
      ? [
          { text: c.body, key: c.salt, variant: 'key' },
          { text: c.salt + c.body, key: c.salt, variant: 'key' },
        ]
      : [
          { text: c.pre, key: '', variant: 'pre' },
          { text: c.post, key: '', variant: 'post' },
        ];
    for (const it of inputs) {
      let out;
      try {
        out = HASHES[algo](it.text, it.key);
      } catch (e) {
        continue;
      }
      if (String(out).toLowerCase() === target) {
        hits.push({ algo: algo, variant: it.variant, ...c });
      }
    }
  }
  if (hits.length >= 5) break;
  if (tried >= CONFIG.maxCandidates) break;
}

const lines = [];
lines.push('URL: ' + url.slice(0, 100));
lines.push('签名字段: ' + signKey + ' = ' + signVal.slice(0, 60));
lines.push('参数: ' + keys.join(', '));
lines.push('');
if (hits.length) {
  lines.push('✅ 命中 ' + hits.length + ' 种组合：');
  hits.forEach((h) => {
    const pos =
      h.algo.indexOf('hmac-') === 0
        ? 'HMAC key'
        : h.variant === 'pre'
        ? '前置'
        : '后置';
    lines.push(
      '  算法=' + h.algo +
      ' 盐位置=' + pos +
      ' 盐值="' + h.salt + '"' +
      ' 排序=' + h.order +
      ' 拼接=' + h.join
    );
    lines.push('    原文: ' + (h.variant === 'pre' ? h.salt + h.body : h.body + h.salt));
  });
} else {
  lines.push('❌ 未命中，已尝试 ' + tried + ' 组 × ' + algos.length + ' 算法');
  lines.push('');
  lines.push('下一步：');
  lines.push('  1. 扩充 CONFIG.saltDict（试试 App 里硬编码的 key）');
  lines.push('  2. 看是否只对部分参数签名（改 signParams 过滤）');
  lines.push('  3. 可能是 HMAC：确认 key 而非 salt 拼接');
  lines.push('  4. 可能是自定义算法（RC4/AES/xor），需动态分析');
}

const out = lines.join('\n');

if (hits.length) {
  BJ.set(CONFIG.boxJsKey, {
    url: url.split('?')[0],
    signKey: signKey,
    algo: hits[0].algo,
    salt: hits[0].salt,
    variant: hits[0].variant,
    order: hits[0].order,
    join: hits[0].join,
    time: Date.now(),
  });
  guide('签名还原成功', [
    out,
    '',
    '下一步：',
    '1. 已缓存到 BoxJS，可直接照此算法构造请求',
    '2. 用 vip_patch.js 配同一 host 改会员字段',
    '3. 要改请求参数就自己写 script-request-body',
  ]);
} else {
  guide('签名未命中', [
    out,
    '',
    '下一步（按顺序试）：',
    '1. 把 App 里硬编码的 key 加进 CONFIG.saltDict',
    '2. 有些签名只取部分参数，改 signParams 过滤时间戳',
    '3. HMAC 已覆盖；还不行可能是自定义算法',
    '4. 终极手段：frida hook 对应 native/so 方法',
  ]);
}

}

if (hitHost && hitPath) {
  main();
} else {
  $done({});
}
