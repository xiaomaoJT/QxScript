//------ 请于此处替换抓包关键数据 -------
let names = "MagicShot"; //用于ua检测及弹窗提示 - 抓包查看ua
let productName = "com.magicshotai"; //软件bundle_id - 抓包获取数据
let productType = "com.magicshot.ai_lifetime_plan1"; // 软件订阅类型 - 抓包获取数据

let appVersion = "29"; // 软件版本
let notifyState = true; // 用于开启弹窗
let ua = false; // 用于开启ua检测
//------ 请于此处替换抓包关键数据 -------

let obj = JSON.parse($response.body);
let requestUrl = $request.url;
let $ = new Env(names);
if (
  /^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt?/.test(requestUrl) &&
  (ua ? $request.headers["User-Agent"].includes('LivonAI') : true)
) {
  let receipt = {
    receipt_type: "Production",
    bundle_id: productName,
    in_app: [
      {
        quantity: "1",
        transaction_id: "666666666666667",
        original_transaction_id: "666666666666667",
        product_id: productType,
        in_app_ownership_type: "PURCHASED",
        purchase_date: "2024-04-14 15:27:40 Etc/GMT",
        purchase_date_ms: "1691972860000",
        purchase_date_pst: "2024-04-14 08:27:40 America/Los_Angeles",
        original_purchase_date: "2024-04-14 08:24:40 Etc/GMT",
        original_purchase_date_ms: "1692026680000",
        original_purchase_date_pst: "2024-04-14 08:24:40 America/Los_Angeles",
        expires_date: "2222-02-02 02:02:02 Etc/GMT",
        expires_date_pst: "2222-02-02 02:02:02 America/Los_Angeles",
        expires_date_ms: "7955085722000",
      },
    ],
    adam_id: 1111111111,
    receipt_creation_date_pst: "2024-04-14 08:25:04 America/Los_Angeles",
    request_date: "2024-04-14 15:27:40 Etc/GMT",
    request_date_pst: "2024-04-14 08:27:40 America/Los_Angeles",
    version_external_identifier: 666666666,
    request_date_ms: "1692026860531",
    original_purchase_date_pst: "2024-04-14 08:24:40 America/Los_Angeles",
    application_version: appVersion,
    original_purchase_date_ms: "1692026680000",
    receipt_creation_date_ms: "1691972704000",
    original_application_version: appVersion,
    download_id: 666666666666666666,
    latest_receipt_info: [
      {
        quantity: "1",
        transaction_id: "666666666666667",
        original_transaction_id: "666666666666667",
        product_id: productType,
        in_app_ownership_type: "PURCHASED",
        is_in_intro_offer_period: "false",
        is_trial_period: "false",
        purchase_date: "2024-04-14 15:27:40 Etc/GMT",
        purchase_date_ms: "1691972860000",
        purchase_date_pst: "2024-04-14 08:27:40 America/Los_Angeles",
        original_purchase_date: "2024-04-14 08:24:40 Etc/GMT",
        original_purchase_date_ms: "1692026680000",
        original_purchase_date_pst: "2024-04-14 08:24:40 America/Los_Angeles",
        expires_date: "2222-02-02 02:02:02 Etc/GMT",
        expires_date_pst: "2222-02-02 02:02:02 America/Los_Angeles",
        expires_date_ms: "7955085722000",
      },
    ],
    pending_renewal_info: [
      {
        product_id: productName,
        original_transaction_id: "666666666666667",
        auto_renew_product_id: productType,
        auto_renew_status: "1",
      },
    ],
    status: 0,
    environment: "Production",
  };
  obj.latest_receipt_info = receipt.latest_receipt_info;
  obj.latest_receipt = "";
  obj.pending_renewal_info = receipt.pending_renewal_info;
  obj.receipt = receipt;
  if (notifyState) {
    $.notify(
      "XiaoMao_" + names + " 执行成功！",
      "",
      "Nice!已解锁成功，可关掉此脚本。",
      "https://i.pixiv.re/img-original/img/2021/08/01/01/43/03/91637959_p0.jpg"
    );
  }
}
$done({ body: JSON.stringify(obj) });

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
  const notify = (
    title = "XiaoMao",
    subtitle = "",
    message = "",
    url = "",
    url2 = url
  ) => {
    if (isLoon) $notification.post(title, subtitle, message, url);
    if (isSurge) $notification.post(title, subtitle, message, { url });
    if (isQX)
      $notify(title, subtitle, message, { "open-url": url, "media-url": url2 });
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
