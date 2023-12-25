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
  const write = (key, value) => {
    if (isLoon || isSurge) return $persistentStore.write(key, value);
    if (isQX) return $prefs.setValueForKey(key, value);
  };

  // 定义 notify 方法，用于发送通知
  const notify = (title = "XiaoMao", subtitle = "", message = "", url = "",url2 = url) => {
    if (isLoon) $notification.post(title, subtitle, message, url);
    if (isSurge) $notification.post(title, subtitle, message, { url });
    if (isQX) $notify(title, subtitle, message, { "open-url": url, "media-url": url2 });
  };

  // 定义 get 方法，用于发送 GET 请求
  const get = (url, callback) => {
    if (isLoon || isSurge) $httpClient.get(url, callback);
    if (isQX) {
      url.method = `GET`;
      $task.fetch(url).then((resp) => callback(null, {}, resp.body));
    }
  };

  // 定义 post 方法，用于发送 POST 请求
  const post = (url, callback) => {
    if (isLoon || isSurge) $httpClient.post(url, callback);
    if (isQX) {
      url.method = `POST`;
      $task.fetch(url).then((resp) => callback(null, {}, resp.body));
    }
  };

  // 定义 put 方法，用于发送 PUT 请求
  const put = (url, callback) => {
    if (isLoon || isSurge) $httpClient.put(url, callback);
    if (isQX) {
      url.method = "PUT";
      $task.fetch(url).then((resp) => callback(null, {}, resp.body));
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
function getGoneDay(n = 0, yearFlag = true) {
  let myDate = new Date();
  myDate.setDate(myDate.getDate() - n);
  let month = myDate.getMonth() + 1;
  let day = myDate.getDate();
  let result =
    "" +
    (yearFlag ? myDate.getFullYear() : "") +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    (day < 10 ? "0" + day : day);
  return result;
}
let obj = JSON.parse(
  $response.body
    .replace(/\"svip\":\"\w+\"/g, '"svip":true')
    .replace(/\"vip\":\"\w+\"/g, '"vip":false')
    .replace(/\"normal\":\"\w+\"/g, '"normal":false')
    .replace(/\"in_vip\":\"\w+\"/g, '"in_vip":false')
    .replace(/\"in_svip\":\"\w+\"/g, '"in_svip":true')
    .replace(/\"in_normal\":\"\w+\"/g, '"in_normal":false')
);
let $XiaoMaoSvip = new Env("BaiDuCloud");
let appName = `XiaoMao-百度云Svip`;
let XiaoMaoSvip = "";
let XiaoMaoEndTime = null;
let SvipDate = null;
let levelList = [
  0, 1000, 3000, 7000, 15000, 27000, 43000, 56000, 68000, 100000,
];
let XiaoMaoLevel = 9;
let XiaoMaoValue = 99999;
!(async () => {
  await XiaoMaoFunction();
})()
  .catch((err) => {
    $XiaoMaoSvip.error(err);
    setTimeout(() => {
      $XiaoMaoSvip.done();
    }, 3000);
  })
  .finally(() => {
    console.log(appName + "设置成功");
    setTimeout(() => {
      $XiaoMaoSvip.done();
    }, 5000);
  });
function XiaoMaoFunction() {
  if (
    $XiaoMaoSvip.read("BaiDuSvipYear") &&
    $XiaoMaoSvip.read("BaiDuSvipMonth") &&
    $XiaoMaoSvip.read("BaiDuSvipDay")
  ) {
    SvipDate = new Date(
      $XiaoMaoSvip.read("BaiDuSvipYear") +
        "/" +
        $XiaoMaoSvip.read("BaiDuSvipMonth") +
        "/" +
        $XiaoMaoSvip.read("BaiDuSvipDay")
    ).getTime();
    if (!SvipDate) {
      $XiaoMaoSvip.notify(
        appName,
        "",
        "会员日期设置错误，请输入正确的日期范围!"
      );
      XiaoMaoSvip = getGoneDay(-1);
    } else {
      XiaoMaoSvip =
        $XiaoMaoSvip.read("BaiDuSvipYear") +
        "/" +
        $XiaoMaoSvip.read("BaiDuSvipMonth") +
        "/" +
        $XiaoMaoSvip.read("BaiDuSvipDay");
    }
  } else {
    XiaoMaoSvip = getGoneDay(-1);
  }
  if ($XiaoMaoSvip.read("BaiDuLevel")) {
    let level = parseInt($XiaoMaoSvip.read("BaiDuLevel"));
    if (level == 10) {
      XiaoMaoLevel = 10;
      XiaoMaoValue = levelList[XiaoMaoLevel - 1];
    } else {
      XiaoMaoLevel = level > 10 || level < 1 ? 9 : level;
      XiaoMaoValue =
        levelList[XiaoMaoLevel] - 1 < 0 ? 1 : levelList[XiaoMaoLevel] - 1;
    }
  }
  XiaoMaoEndTime = new Date(XiaoMaoSvip).getTime() / 1000;
}
if ($response.body) {
  let requestUrl = $request.url;
  if (
    /^https:\/\/pan\.baidu\.com\/rest\/\d\.\d\/membership\/user?/.test(
      requestUrl
    )
  ) {
    obj.hasOwnProperty("product_infos")
      ? ((obj.product_infos[1] = {
          product_name: "svip" + XiaoMaoLevel + "_nd",
          product_description: "超级会员",
          function_num: 100,
          start_time: 1553702399,
          buy_description: "",
          buy_time: 0,
          product_id: XiaoMaoLevel - 1,
          auto_upgrade_to_svip: 0,
          end_time: XiaoMaoEndTime,
          cluster: "vip",
          detail_cluster: "svip",
          status: 0,
        }),
        (obj.level_info = {
          history_value: XiaoMaoValue - 1,
          current_level: XiaoMaoLevel,
          current_value: XiaoMaoValue,
          history_level: XiaoMaoLevel,
        }),
        (obj.center_skip_config.action_url = "",url2 = url),
        (obj.user_tag = `{"has_buy_record":1,"has_buy_vip_svip_record":1,"last_buy_record_creat_time":1641279341,"is_vip":1,"is_svip":1,"last_vip_type":1,"last_vip_svip_end_time":${XiaoMaoEndTime},"is_svip_sign":1,"notify_user_type":2,"notify_user_status":2,"is_first_act":0}`))
      : "";
    obj.hasOwnProperty("vip")
      ? ((obj.vip.emotional_tip_front = "你管我失去多少"),
        (obj.vip.status = 1),
        (obj.svip.status = 1))
      : "";
    obj.hasOwnProperty("svip")
      ? (obj.svip.emotional_tip_front = "你管我失去多少")
      : "";
    obj.hasOwnProperty("tips_data_list") ? (obj.tips_data_list = []) : "";
    obj.hasOwnProperty("status_data")
      ? (obj.status_data = "你管我你管我你管我")
      : "";
    obj.hasOwnProperty("guide_data") ? (obj.guide_data = {}) : "";
    obj.hasOwnProperty("tips_data") ? (obj.tips_data = {}) : "";
    obj.hasOwnProperty("v10_guide") ? (obj.v10_guide = {}) : "";
    if (obj.hasOwnProperty("status_data_arr")) {
      let index = obj.status_data_arr.findIndex((item) =>
        item.includes("已失去特权")
      );
      index != -1 ? (obj.status_data_arr[index] = "百度网盘第一股东") : "";
    }
    obj.hasOwnProperty("new_guide_data")
      ? (obj.new_guide_data = {
          title: "精神股东",
          button: { text: "XiaoMao", action_url: "https://t.me/xiaomaoJT" },
          sub_card_list: [],
        })
      : "";
    obj.hasOwnProperty("user_info")
      ? ((obj.user_info.is_svip = 1),
        (obj.user_info.is_vip = 0),
        (obj.user_info.plus_buy_hit = 1))
      : "";
    obj.hasOwnProperty("privilege_title") ? (obj.privilege_title = {}) : "";
  } else if (
    /^https:\/\/pan\.baidu\.com\/act\/v2\/membergrow\/my?/.test(requestUrl)
  ) {
    obj.hasOwnProperty("list") ? (obj.list.length = 0) : "";
  } else if (/^https:\/\/pan\.baidu\.com\/story\/diff?/.test(requestUrl)) {
    obj.hasOwnProperty("list") ? (obj.list.length = 0) : "";
    obj.hasOwnProperty("dellist") ? (obj.dellist.length = 0) : "";
  } else if (
    /^https:\/\/pan\.baidu\.com\/dosp\/opconf\/list?/.test(requestUrl)
  ) {
    obj.hasOwnProperty("data") ? (obj.data.length = 0) : "";
  } else if (
    /^https:\/\/pan\.baidu\.com\/api\/user\/getinfo?/.test(requestUrl)
  ) {
    obj.hasOwnProperty("records")
      ? (obj.records[0].vip_level = XiaoMaoLevel)
      : "";
  } else if (
    /^https:\/\/pan\.baidu\.com\/act\/api\/activityentry?/.test(requestUrl)
  ) {
    obj.hasOwnProperty("popup_list") ? (obj.popup_list.length = 0) : "";
  } else if (
    /^https:\/\/pan\.baidu\.com\/api\/singkil\/bindquery?/.test(requestUrl)
  ) {
    obj.hasOwnProperty("svip") ? (obj.svip = 1) : "";
  }
  $done({ body: JSON.stringify(obj) });
} else {
  $done({});
}
