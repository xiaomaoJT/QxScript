let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"is_member\":\w+/g, '"is_member":true')
        .replace(/\"is_vip\":\w+/g, '"is_vip":true')
        .replace(/\"is_gray\":\w+/g, '"is_gray":false')
        .replace(/\"remain_day\":\w+/g, '"remain_day":365')
        .replace(/\"expired_at\":\w+/g, '"expired_at":"2222-02-22 08:00:00"')
        .replace(/\"vip_price\":\w+/g, '"vip_price":"0"')
        .replace(/\"is_special_sale\":\w+/g, '"is_special_sale":true')
        .replace(/\"open_vip_price\":\w+/g, '"open_vip_price":true')
        .replace(/\"is_spec\":\w+/g, '"is_spec":true')
        .replace(/\"has_evaluated\":\w+/g, '"has_evaluated":true')
        .replace(/\"is_admin\":\w+/g, '"is_admin":true')
        .replace(/\"is_blocked\":\w+/g, '"is_blocked":true')
        .replace(/\"quick_scale_state\":\w+/g, '"quick_scale_state":true')
        .replace(/\"level\":\w+/g, '"level":10')
        .replace(/\"badge_count\":\w+/g, '"badge_count":15')
        .replace(/\"rankings\":\w+/g, '"rankings":100')
    )
  : $response.body;
if (
  /^https:\/\/api\.boohee\.com\/app-interface\/v1\/user\/user_info?/.test(
    requestUrl
  )
) {
  obj.data.vip.state = "1";
  obj.data.vip.remain_day = 365;
  obj.data.vip.integral_member = {
    integral: 999999,
    level: 3,
    level_name: "蓝钻会员",
  };
  obj.data.vip.is_member = true;
  obj.data.vip.notices_tips = [];
  obj.data.vip.started_at = "2024-03-14 08:00:00";
  obj.data.vip.expired_at = "2222-02-22 08:00:00";
  obj.data.vip.not_vip_tips = "";
  obj.data.vip.colum_list = [];
  obj.data.glp_vip = {
    expired_at: "2222-02-22 08:00:00",
    remain_days: 365,
    is_vip: true,
  };
  obj.data.user.role = 1;
} else if (
  /^https:\/\/api\.boohee\.com\/app-interface\/v1\/user\/index?/.test(
    requestUrl
  )
) {
  if (obj.data.first.length) {
    obj.data.first.forEach((el) => {
      el.is_gray = false;
      el.track.track_points = [];
    });
  }
} else if (
  /^https:\/\/league\.boohee\.com\/api\/v1\/attainments?/.test(requestUrl)
) {
  if (obj.hasOwnProperty("attainments") && obj.attainments.length) {
    obj.attainments.forEach((el) => {
      el.remark = el.remark.replace(/\d/g, "99999");
    });
  }
} else if (
  /^https:\/\/healthy\.boohee\.com\/api\/(v2|v3)\/health_kit\/authorization\/status?/.test(
    requestUrl
  )
) {
  obj.data.sync_sleep = true;
  obj.data.has_authorized = true;
  obj.data.has_init = true;
  obj.data.sync_walk = true;
  obj.data.sync_other_sport = true;
  obj.data.sync_body_fat = true;
  obj.data.sync_weight = true;
  obj.data.sync_step = true;
  obj.data.current_source_type = "1";
} else if (
  /^https:\/\/api\.boohee\.com\/app-interface\/v1\/user\/contracts_status?/.test(
    requestUrl
  )
) {
  let a = {
    status: 1,
    begin_time: "2024-03-14 08:00:00",
    has_intestinal_evaluated: true,
    need_evaluation: true,
    has_immunity_evaluated: true,
    end_time: "2222-02-22 08:00:00",
    has_evaluated: true,
    has_lose_fat_evaluated: true,
    has_sleep_evaluated: true,
    fasting_status: true,
  };
  obj.data = { ...obj.data, a };
} else if (
  /^https:\/\/one\.boohee\.com\/api\/v1\/users\/plugins?/.test(requestUrl)
) {
  obj.integral_member = {
    integral: 999999,
    level: 3,
    level_name: "蓝钻会员",
  };
  obj.coupon_count = 999999;
  obj.coupon_expire = {
    success: true,
    coupons_count: 999999,
    valid_days: 365,
  };
  obj.wallet.amount = 999999;
  obj.orders_stats = {
    expired: 7955085722000,
    sent: 1,
    finished: 1,
    payed: 1,
    part_sent: 1,
    refund: 1,
    to_comment: 1,
    canceled: 1,
    total_count: 1,
    initial: 1,
  };
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
