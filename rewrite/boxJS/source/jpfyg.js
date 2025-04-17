let status = isJSON($response.body);
console.log(status);
let requestUrl = $request.url;
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"isVip\":\w+/g, '"isVip":1')
        .replace(/\"expiresDate\":\w+/g, '"expiresDate":7955085722000')
    )
  : $response.body;

if (
  /^https:\/\/api\.helix\.ymxiaoze\.top\/v1\/apple\/subscriptions?/.test(
    requestUrl
  )
) {
  let objChange = {
    request_date: "2025-04-15T08:08:08Z",
    status: "ACTIVE",
    bundle_id: "com.gold.medal.translator",
    receipt_creation_date: "2025-04-15T08:08:08Z",
    latest_receipt: {
      product_id: "permanent_1",
      quantity: 1,
      transaction_id: "280000000000000",
      in_app_ownership_type: "PURCHASED",
      expires_date: "2122-02-22T22:22:22Z",
      is_trial_period: false,
      original_purchase_date: "2122-02-22T22:22:22Z",
      original_transaction_id: "280000000000000",
      purchase_date: "2122-02-22T22:22:22Z",
    },
    expires_date: "2122-02-22T22:22:22Z",
    subscription: {
      product_name: {
        default: "Lifetime VIP",
        es: "VIP de por vida",
        vi_VN: "Lifetime VIP",
        fr_CN: "VIP à vie",
        ko_KR: "평생 VIP",
        fr: "VIP à vie",
        "zh-Hans_US": "终身会员",
        "zh-Hans_FR": "终身会员",
        "zh-Hans_NG": "终身会员",
        "zh-Hans_HK": "终身会员",
        "zh-Hans-CN": "终身会员",
        "zh-Hans_JP": "终身会员",
        en: "Lifetime VIP",
        zh_CN: "终身会员",
        "en_US@rg=dezzzz": "Lifetime VIP",
        "vi_US@rg=fizzzz": "Lifetime VIP",
        "zh-Hans_AE": "终身会员",
        ja: "生涯VIP",
        ar: "VIP مدى الحياة",
        ko: "평생 VIP",
        zh_SG: "终身会员",
        en_EG: "Lifetime VIP",
        en_CN: "Lifetime VIP",
        ru: "Пожизненный VIP",
        "zh-Hant": "終身會員",
        en_VN: "Lifetime VIP",
        hi: "आजीवन वीआईपी",
        zh: "终身会员",
        de_AT: "Lebenslanger VIP",
        pt: "VIP vitalício",
        en_US: "Lifetime VIP",
        de: "Lebenslanger VIP",
      },
      product_id: "permanent_1",
      period: "Lifetime",
    },
    environment: "Production",
    user_id: "cccccccc-eeee-4444-bbbb-dddddddddddd",
    user_id_display: "dddddddddddd",
    receipt_type: "Production",
  };

  obj.data = objChange;
}

$done({ body: status ? JSON.stringify(obj) : obj });

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function removeExtraSpaces(jsonString) {
  var jsonObj = JSON.parse(jsonString);
  return JSON.stringify(jsonObj, function (key, value) {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  });
}
