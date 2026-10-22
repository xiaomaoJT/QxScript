/**
 * @Author: XiaoMao
 * 通用会员解锁引擎（QX rewrite）
 *
 * [rewrite_local]
 * ^https?:// url script-response-body vip_patch.js
 *
 * [mitm]
 * hostname = *
 *
 * 说明：
 * 1. 零依赖，一条规则 = 一个 host + path + 若干字段改写
 * 2. 内置常见字段模式的快捷开关（VIP_FIELDS / TIME_FIELDS），打开即用
 * 3. 支持三种模式：
 *    - field  改字段值（is_vip / member_type / expire_time ...）
 *    - delete 删字段（某些服务端按字段存在性判断）
 *    - whole  整体替换响应（返回一个"已付费"模板）
 * 4. 所有规则仅在响应为 JSON 时生效，非 JSON 自动跳过，不会破坏二进制流
 *
 */

//==================== 规则配置区 ====================

const RULES = [
  // ===== 示例1：常见"用户信息"接口，一次性打通常见字段 =====
  {
    name: '用户信息解锁',
    host: '*', // '*' = 匹配所有主机；也支持 '*.example.com' / 'api.*.com' 通配
    path: /\/user\/(info|profile|center)/i,

    // 快捷开关：这些字段会被置为 truthy 值（true / 1）
    vipFields: ['is_vip', 'isVip', 'vip', 'is_member', 'isMember', 'is_pro', 'isPro', 'isPay', 'is_pay'],

    // 时间类字段：置为远期时间戳（秒或毫秒自适应原值）
    timeFields: [
      'expire_time', 'expireTime', 'vip_expire_time', 'vipExpireTime',
      'expired_at', 'expiredAt', 'deadline', 'end_time', 'endTime',
      'member_end_time', 'memberEndTime', 'subscription_end',
    ],
    timeValue: '2099-12-31', // 远期时间，也可写 'now+3650d'

    // 类型/等级字段
    typeFields: { member_type: 1, vip_type: 1, user_type: 1, level: 9, vip_level: 9 },

    // 显式改写（最高优先级，会覆盖上面的快捷开关）
    patches: [
      // { path: 'data.vip_info.name', value: 'SVIP' },
      // { path: 'data.vip_info.is_forever', value: true },
    ],

    // 删除这些字段（有些接口靠"字段不存在"判定未付费）
    deletes: [
      // 'data.ad_config',
      // 'data.pay_wall',
    ],
  },

  // ===== 示例2：权益列表，把 locked 全开 =====
  {
    name: '权益列表',
    host: '*',
    path: /\/privilege|benefit|rights/i,
    patches: [
      // { path: 'data.list', transform: 'unlockAll' },
    ],
  },

  // ===== 示例3：整体替换（返回一个已付费模板）=====
  // {
  //   name: '整体替换',
  //   host: '*',
  //   path: /\/entitlement/i,
  //   whole: {
  //     code: 0,
  //     data: { vip: true, expire_time: 4102444800, level: 9 },
  //   },
  // },
];

//==================== 引擎（一般不用改）=====================

function matchHost(ruleHost, host) {
  // 空 / '*' → 匹配所有主机（通用模式）
  if (!ruleHost || ruleHost === '*') return true;
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

function pick(obj, path) {
  const ks = path.split('.');
  let cur = obj;
  for (const k of ks) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

function setPath(obj, path, val) {
  const ks = path.split('.');
  let cur = obj;
  for (let i = 0; i < ks.length - 1; i++) {
    const k = ks[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[ks[ks.length - 1]] = val;
}

function delPath(obj, path) {
  const ks = path.split('.');
  let cur = obj;
  for (let i = 0; i < ks.length - 1; i++) {
    if (cur == null) return;
    cur = cur[ks[i]];
  }
  if (cur) delete cur[ks[ks.length - 1]];
}

// 递归查找所有同名 key 并改写（不关心层级）
function patchByKey(node, key, fn, depth) {
  if (!node || typeof node !== 'object' || depth > 8) return 0;
  let n = 0;
  if (Array.isArray(node)) {
    node.forEach((v) => {
      n += patchByKey(v, key, fn, depth + 1);
    });
    return n;
  }
  for (const k of Object.keys(node)) {
    if (k === key && typeof node[k] !== 'object') {
      node[k] = fn(node[k]);
      n++;
    }
    if (node[k] && typeof node[k] === 'object') {
      n += patchByKey(node[k], key, fn, depth + 1);
    }
  }
  return n;
}

// 解锁数组里所有项（用于权益列表）
function unlockAll(list) {
  if (!Array.isArray(list)) return 0;
  let n = 0;
  list.forEach((it) => {
    if (it && typeof it === 'object') {
      ['locked', 'is_lock', 'isLock', 'is_locked', 'need_vip', 'needVip', 'restricted'].forEach((k) => {
        if (k in it) {
          it[k] = false;
          n++;
        }
      });
      ['unlocked', 'is_unlock', 'isUnlock', 'owned', 'has_right', 'available'].forEach((k) => {
        if (k in it) {
          it[k] = true;
          n++;
        }
      });
      if ('status' in it && (it.status === 0 || it.status === 2)) {
        it.status = 1;
        n++;
      }
    }
  });
  return n;
}

// 把时间值统一成秒/毫秒时间戳（跟随原值量级）
function toStamp(dateStr, ref) {
  const t = new Date(dateStr.replace(/-/g, '/')).getTime();
  if (isNaN(t)) return ref;
  return t > 1e12 ? Math.floor(t / 1000) : Math.floor(t / 1000);
}

function timePatchFn(ref) {
  return function (v) {
    if (typeof v !== 'number') return v;
    // 原值是毫秒（13位）就返回毫秒，秒（10位）就返回秒
    const base = toStamp(CONFIG_TIME_VALUE, v);
    return String(v).length >= 13 ? base * 1000 : base;
  };
}

let CONFIG_TIME_VALUE = '2099-12-31';

const url = $request.url;
// QX 的 JSC 没有 URL 全局对象，用正则提取
let host = (url.match(/^https?:\/\/([^\/?#]+)/) || [])[1] || url;
host = host.split(':')[0];

let hit = null;
for (const r of RULES) {
  if (!matchHost(r.host, host)) continue;
  if (r.path && !r.path.test(url)) continue;
  hit = r;
  break;
}

function main() {
if (hit.whole) {
  console.log('[vip_patch] ' + hit.name + ' 整体替换');
  $done({ body: JSON.stringify(hit.whole) });
  return;
}

let obj = null;
try {
  obj = JSON.parse($response.body);
} catch (e) {
  console.log('[vip_patch] ' + hit.name + ' 响应非 JSON，跳过');
  $done({});
  return;
}

if (hit.timeValue) CONFIG_TIME_VALUE = hit.timeValue;

let changes = [];

// 1. 快捷开关：VIP 布尔字段
(hit.vipFields || []).forEach((k) => {
  const n = patchByKey(obj, k, () => true);
  if (n) changes.push(k + '→true (' + n + ')');
});

// 2. 时间字段
(hit.timeFields || []).forEach((k) => {
  const n = patchByKey(obj, k, timePatchFn());
  if (n) changes.push(k + '→' + CONFIG_TIME_VALUE + ' (' + n + ')');
});

// 3. 类型/等级字段
if (hit.typeFields) {
  for (const k of Object.keys(hit.typeFields)) {
    const n = patchByKey(obj, k, () => hit.typeFields[k]);
    if (n) changes.push(k + '→' + hit.typeFields[k] + ' (' + n + ')');
  }
}

// 4. 显式改写
(hit.patches || []).forEach((p) => {
  if (!p || !p.path) return;
  if (p.transform === 'unlockAll') {
    const n = unlockAll(pick(obj, p.path));
    if (n) changes.push(p.path + ' unlockAll (' + n + ')');
    return;
  }
  setPath(obj, p.path, p.value);
  changes.push(p.path + '→' + JSON.stringify(p.value));
});

// 5. 删除字段
(hit.deletes || []).forEach((p) => {
  delPath(obj, p);
  changes.push(p + ' deleted');
});

if (changes.length) {
  console.log('[vip_patch] ' + hit.name + '\n  ' + changes.join('\n  '));
  $done({ body: JSON.stringify(obj) });
} else {
  console.log('[vip_patch] ' + hit.name + ' 无字段命中（规则与响应结构不匹配）');
  $done({});
}
}

if (hit) {
  main();
} else {
  $done({});
}
