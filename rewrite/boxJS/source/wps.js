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
var obj = JSON.parse($response.body);
var $XiaoMaoSvip = new Env("wps");
var appName = `XiaoMao-WpsVip`;
var XiaoMaoSvip = "";
let XiaoMaoEndTime = null;
let WpsCloudSpace = 0;
let SvipDate = null;
!(async () => {
  await XiaoMaoFunction();
})()
  .catch((err) => {
    $XiaoMaoSvip.log(err);
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
    $XiaoMaoSvip.read("WpsVipYear") &&
    $XiaoMaoSvip.read("WpsVipMonth") &&
    $XiaoMaoSvip.read("WpsVipDay")
  ) {
    SvipDate = new Date(
      $XiaoMaoSvip.read("WpsVipYear") +
        "/" +
        $XiaoMaoSvip.read("WpsVipMonth") +
        "/" +
        $XiaoMaoSvip.read("WpsVipDay")
    ).getTime();
    if (!SvipDate) {
      $XiaoMaoSvip.notify(
        appName,
        "",
        "会员日期设置错误，请输入正确的日期范围!"
      );
      XiaoMaoSvip = getGoneDay(-8);
    } else {
      XiaoMaoSvip =
        $XiaoMaoSvip.read("WpsVipYear") +
        "/" +
        $XiaoMaoSvip.read("WpsVipMonth") +
        "/" +
        $XiaoMaoSvip.read("WpsVipDay");
    }
  } else {
    XiaoMaoSvip = getGoneDay(-8);
  }
  if ($XiaoMaoSvip.read("WpsCloudSpace")) {
    WpsCloudSpace = parseInt(
      parseInt($XiaoMaoSvip.read("WpsCloudSpace")) * 1024 * 1024 * 1024
    );
  }
  XiaoMaoEndTime = new Date(XiaoMaoSvip).getTime() / 1000;
}
if ($response.body) {
  let requestUrl = $request.url;
  let vipModify = {
    enabled: [
      { name: "超级会员Pro", memberid: 60, expire_time: XiaoMaoEndTime },
      { name: "超级会员", memberid: 40, expire_time: XiaoMaoEndTime },
      { name: "WPS会员", memberid: 20, expire_time: XiaoMaoEndTime },
      { name: "稻壳会员", memberid: 12, expire_time: XiaoMaoEndTime },
    ],
    memberid: 60,
    name: "超级会员Pro",
    has_ad: 0,
    expire_time: XiaoMaoEndTime,
  };
  let privilegeModify = [
    { times: 2, spid: "data_recover", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "ocr", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf_merge", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf_split", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf_edit", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "merge_sheet", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pic_doc", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "jianli", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "banner_charts", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "photos", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "signonline", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf2ppt", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf2cad", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "audio_shorthand", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "extract_pics", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pic2xls", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf_extract_text", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "recovery_file", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "audio_input_recognizer", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "imagecompression", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "enproofreading", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "doc_fix", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "translate", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "doc_downsizing", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "cnproofreading", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf2xls", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf_page_adjust", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf_annotation", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pages_export", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf_sign", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pic2doc", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pic2ppt", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "merge_sheet", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "image_splicing", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf_edit", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "extract_file", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "export_pic_file", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "process_on", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf_add_text", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "cad2pdf", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pdf2doc", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "pic2pdf", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "play_record", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "resume_layout", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "beauty_template", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "image_resource", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "cloud_font", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "gradients", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "paper_layout", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "export_resume", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "page_background", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "identification_photo", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "online_icon", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "docer_library", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "resume_score", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "super_ppt", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "typesetter", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "art_font", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "resume_beautify", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "free_template", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "resume_assistant", expire_time: XiaoMaoEndTime },
    { times: 2, spid: "art_font", expire_time: XiaoMaoEndTime },
  ];
  if (
    /^https:\/\/account\.wps\.(com|cn)\/api\/users\/(.+)\/overview?/.test(
      requestUrl
    )
  ) {
    obj.hasOwnProperty("vip") ? (obj.vip = vipModify) : "";
    obj.hasOwnProperty("privilege") ? (obj.privilege = privilegeModify) : "";
    obj.hasOwnProperty("level") ? (obj.level = 12) : "";
    obj.hasOwnProperty("total_cost") ? (obj.total_cost = 99999) : "";
    obj.hasOwnProperty("total_buy") ? (obj.total_buy = 62) : "";
  } else if (
    /^https:\/\/account\.wps\.cn\/api\/v3\/mine\/vips?/.test(requestUrl)
  ) {
    let vipsModify = [
      { name: "超级会员Pro", memberid: 60, expire_time: XiaoMaoEndTime },
      { name: "超级会员", memberid: 40, expire_time: XiaoMaoEndTime },
      { name: "WPS会员", memberid: 20, expire_time: XiaoMaoEndTime },
      { name: "稻壳会员", memberid: 12, expire_time: XiaoMaoEndTime },
    ];
    obj.hasOwnProperty("vips") ? (obj.vips = vipsModify) : "";
  } else if (/^https:\/\/vip\.wps\.cn\/userinfo?/.test(requestUrl)) {
    obj.hasOwnProperty("data")
      ? ((obj.data.privilege = privilegeModify),
        (obj.data.vip = vipModify),
        (obj.data.level = 12))
      : "";
  } else if (
    /^https:\/\/vas\.wps\.cn\/query\/api\/v1\/list_purchase_info?/.test(
      requestUrl
    )
  ) {
    let merchandises = [
      {
        sku_key: "vip_pro_plus",
        expire_time: XiaoMaoEndTime,
        effect_time: 1567334996,
        name: "超级会员Pro",
        type: "vip",
      },
      {
        sku_key: "vip_pro",
        expire_time: XiaoMaoEndTime,
        effect_time: 1567334996,
        name: "超级会员",
        type: "vip",
      },
      {
        sku_key: "20",
        expire_time: XiaoMaoEndTime,
        effect_time: 1567334996,
        name: "WPS会员",
        type: "vip",
      },
      {
        sku_key: "12",
        expire_time: XiaoMaoEndTime,
        effect_time: 1567334996,
        name: "稻壳会员",
        type: "vip",
      },
      {
        sku_key: "cloud_space",
        expire_time: XiaoMaoEndTime,
        effect_time: 1678785508,
        name: "超级会员空间",
        type: "vip",
      },
    ];
    obj.data.hasOwnProperty("merchandises")
      ? (obj.data.merchandises = merchandises)
      : "";
  } else if (
    /^https:\/\/vipapi\.wps\.cn\/payment_config\/v1\/client\/conf?/.test(
      requestUrl
    )
  ) {
    try {
      obj.data.extra_params = {};
      obj.data.ui_setting = {};
      obj.data.privilege_details = {};
      if (obj.data.payconfig.price_batch.length) {
        obj.data.payconfig.price_batch.forEach((el) => {
          if (el.price_list.length) {
            el.price_list.forEach((i) => {
              i.angle = "";
              i.cost_fee = 0;
              i.enable_coupon = 9;
              i.total_fee = 0;
            });
          }
          el.extra_params.content =
            "页面已被脚本改动，有订购需求请先关闭脚本@XiaoMao";
        });
      }
    } catch (e) {
      console.log(e);
    }
  } else if (
    /^https:\/\/s4\.vip\.wpscdn\.cn\/vipapi\/banner\/v1\/config?/.test(
      requestUrl
    ) ||
    /^https:\/\/s6\.vip\.wpscdn\.cn\/vipapi\/banner\/v1\/config?/.test(
      requestUrl
    )
  ) {
    obj.data.hasOwnProperty("adposition") ? (obj.data.adposition = {}) : "";
  } else if (/^https:\/\/drive\.wps\.cn\/api\/v3\/spaces?/.test(requestUrl)) {
    obj.hasOwnProperty("total") && parseInt(WpsCloudSpace) != 0
      ? (obj.total = parseInt(WpsCloudSpace))
      : "";
  } else if (
    /^https:\/\/wenk\.ios\.wpscdn\.cn\/config\/purchase_config.json?/.test(
      requestUrl
    )
  ) {
    let lowestPerMonth = { wps: "0.01", docer: "0.01", super: "0.01" };
    obj.hasOwnProperty("lowestPerMonth")
      ? (obj.lowestPerMonth = lowestPerMonth)
      : "";
    obj.hasOwnProperty("rate")
      ? (obj.rate = obj.rate.map((el) => {
          return el * 0;
        }))
      : "";
    obj.hasOwnProperty("price")
      ? (obj.price = obj.price.map((el) => {
          return 0;
        }))
      : "";
    if (obj.hasOwnProperty("freeTryDays")) {
      for (let i in obj.freeTryDays) {
        if (obj.freeTryDays.hasOwnProperty(i)) {
          obj.freeTryDays[i] = 2;
        }
      }
    }
    obj.hasOwnProperty("sourceConfig") ? (obj.sourceConfig = {}) : "";
    obj.hasOwnProperty("preferential")
      ? (obj.preferential = obj.preferential.map((el) => {
          return 2;
        }))
      : "";
  }
  $done({ body: JSON.stringify(obj) });
} else {
  $done({});
}
