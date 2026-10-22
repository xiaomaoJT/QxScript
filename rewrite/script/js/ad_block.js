/**
 * @Author: XiaoMao
 * 文件地址：https://github.com/xiaomaoJT/QxScript/blob/main/rewrite/script/js/ad_block.js
 * 通用广告拦截引擎（QX rewrite）
 *
 * [rewrite_local]
 * ^https?:// url script-response-body ad_block.js
 *
 * [mitm]
 * hostname = *
 *
 * 说明：
 * 1. 零依赖，配置化规则，加目标只需在 RULES 里加一条
 * 2. 支持四种动作：删广告项 / 清空列表 / 改字段 / 正则替换
 * 3. 响应非 JSON 时自动走正则替换分支，不会破坏 Protobuf 等二进制流
 *
 */

//==================== 规则配置区 ====================

const RULES = [
  // 示例1：信息流列表，删掉标记为广告的项
  {
    name: '信息流去广告',
    host: '', // 留空 = 未配置；改成你的目标 host 才生效（支持 '*.example.com' / 'api.*.com'）
    path: /\/feed\/list/i, // 匹配 URL 路径
    action: 'remove_ads',
    listPath: 'data.list', // 数组所在路径，点号分隔
    adFlag: 'is_ad', // 广告标记字段，为真即删
    adType: 1, // 或按类型值判断，如 type===1 是广告，可省略
  },

  // 示例2：开屏/启动页广告，直接清空
  {
    name: '开屏广告',
    host: '',
    path: /\/splash/i,
    action: 'empty_list',
    listPath: 'data.ads',
  },

  // 示例3：改字段（如关闭倒计时、隐藏 Banner）
  {
    name: '启动倒计时',
    host: '',
    path: /\/config/i,
    action: 'set_field',
    fieldPath: 'data.ad_duration',
    value: 0,
  },

  // 示例4：正则替换，适合非 JSON 响应
  {
    name: '文本替换',
    host: '',
    path: /\.js$/i,
    action: 'regex',
    pattern: 'splash_ad',
    replacement: '',
  },
];

//==================== 引擎（一般不用改）=====================

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
function buildConfigGuide(host, path, file, qxType, scriptCfg) {
  const esc = host.replace(/\./g, '\\.');
  return [
    '【' + file + ' · 捕获到目标】',
    'host = ' + host,
    'path = ' + path,
    '',
    '复制下面这段到 QX 配置 + 脚本顶部，即可锁定你的专属目标：',
    '',
    '[rewrite_local]',
    '^https?://' + esc + '/ url ' + qxType + ' ' + file,
    '',
    '[mitm]',
    'hostname = ' + host,
    '',
    '// ' + file + ' 配置区',
    scriptCfg,
    '',
    '（资源引入方式：把上面脚本名换成你的远程订阅地址）',
  ].join('\n');
}

// 取路径 a.b.c
function pick(obj, path) {
  if (!path) return obj;
  const ks = path.split('.');
  let cur = obj;
  for (const k of ks) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

// 设路径 a.b.c
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

function isAd(item, rule) {
  if (!item || typeof item !== 'object') return false;
  if (rule.adFlag && item[rule.adFlag]) return true;
  if (rule.adType != null && item.type === rule.adType) return true;
  if (rule.adTypeStr && String(item.type) === String(rule.adTypeStr)) return true;
  if (rule.adFieldEq && item[rule.adField] === rule.adFieldEq) return true;
  return false;
}

let body = $response.body;
let url = $request.url;

// QX 的 JSC 没有 URL 全局对象，用正则提取
let host = (url.match(/^https?:\/\/([^\/?#]+)/) || [])[1] || url;
host = host.split(':')[0];
const _path = (url.match(/^https?:\/\/[^\/?#]+([^?#]*)/) || [,'/'])[1] || '/';

let hit = null;
for (const r of RULES) {
  if (!r.host) continue; // 未配置 host 的规则跳过，仅作引导
  if (!matchHost(r.host, host)) continue;
  if (r.path && !r.path.test(url)) continue;
  hit = r;
  break;
}

// 没命中任何已配置规则时，捕获真实 host/path 输出可复制配置，引导你自己配
if (!hit) {
  const gk = 'adblock_guide_' + host;
  if (!$prefs.valueForKey(gk)) {
    $prefs.setValueForKey('1', gk);
    const scriptCfg =
      "RULES: [\n" +
      "  {\n" +
      "    name: '我的去广告',\n" +
      "    host: '" + host + "',\n" +
      "    path: " + buildPathRegex(_path) + ",\n" +
      "    action: 'remove_ads',\n" +
      "    listPath: 'data.list',\n" +
      "    adFlag: 'is_ad',\n" +
      "  },\n" +
      "]";
    const g = buildConfigGuide(host, _path, 'ad_block.js', 'script-response-body', scriptCfg);
    console.log('[ad_block] ' + g);
    if (typeof $notify === 'function') $notify('ad_block · 配置引导', host, g.slice(0, 900));
  }
}

function main() {
if (hit) {
  if (hit.action === 'regex') {
    // 正则/字符串替换，适合 JS、CSS、非 JSON 响应
    try {
      const flags = hit.flags || 'g';
      body = body.replace(new RegExp(hit.pattern, flags), hit.replacement || '');
      console.log('[ad_block] ' + hit.name + ' 正则替换完成');
    } catch (e) {
      console.log('[ad_block] ' + hit.name + ' 正则失败：' + e);
    }
  } else {
    let obj = null;
    let parseOk = true;
    try {
      obj = JSON.parse(body);
    } catch (e) {
      // 非 JSON：如果是正则规则之外的动作，跳过避免破坏二进制
      parseOk = false;
      console.log('[ad_block] ' + hit.name + ' 响应非 JSON，跳过');
    }

    if (parseOk && obj) {
      let changed = false;
      const target = pick(obj, hit.listPath || hit.fieldPath);

      if (hit.action === 'remove_ads' && Array.isArray(target)) {
        const before = target.length;
        const kept = target.filter((it) => !isAd(it, hit));
        if (kept.length !== before) {
          setPath(obj, hit.listPath, kept);
          changed = true;
          console.log('[ad_block] ' + hit.name + ' 删除 ' + (before - kept.length) + ' 条广告');
        }
      } else if (hit.action === 'empty_list' && Array.isArray(target)) {
        if (target.length) {
          setPath(obj, hit.listPath, []);
          changed = true;
          console.log('[ad_block] ' + hit.name + ' 清空 ' + target.length + ' 条');
        }
      } else if (hit.action === 'set_field') {
        setPath(obj, hit.fieldPath, hit.value);
        changed = true;
        console.log('[ad_block] ' + hit.name + ' 设置 ' + hit.fieldPath + '=' + hit.value);
      }

      if (changed) {
        $done({ body: JSON.stringify(obj) });
        return;
      }
    }
  }
}

$done({});
}

main();
