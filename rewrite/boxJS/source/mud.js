//------ 请于此处替换抓包关键数据 -------
let names = "MusicDownload"; //用于ua检测及弹窗提示 - 抓包查看ua
let productName = "premium"; //软件bundle_id - 抓包获取数据
let productType = "nova_lifetime"; // 软件订阅类型 - 抓包获取数据
let appVersion = null; // 软件版本
let notifyState = true; // 用于开启弹窗
let ua = true; // 用于开启ua检测
//------ 请于此处替换抓包关键数据 -------

let obj = JSON.parse($response.body);
let $ = new Env(names);
obj.subscriber = {
  non_subscriptions: {},
  first_seen: "2024-03-08T04:44:30Z",
  original_application_version: appVersion,
  other_purchases: {
    [productType]: {
      price: {
        amount: 0,
        currency: "USD",
      },
      display_name: null,
      purchase_date: "2024-03-08T04:44:44Z",
    },
  },
  management_url: null,
  subscriptions: {},
  entitlements: {},
  original_purchase_date: "2024-03-08T04:44:14Z",
  original_app_user_id: "$RCAnonymousID:0400000000000000000000000000000",
  last_seen: "2024-03-08T04:44:30Z",
};

obj.subscriber.non_subscriptions[productType] = [
  {
    id: "aaaaaaaaaa",
    is_sandbox: false,
    price: {
      amount: 0,
      currency: "USD",
    },
    display_name: null,
    purchase_date: "2024-03-08T04:44:44Z",
    original_purchase_date: "2024-03-08T04:44:44Z",
    store: "app_store",
    store_transaction_id: "280000000000000",
  },
];

obj.subscriber.entitlements[productName] = {
  grace_period_expires_date: null,
  purchase_date: "2024-03-08T04:44:44Z",
  product_identifier: productType,
  expires_date: null,
};

$.notify(
  "XiaoMao_" + names + " 执行成功！",
  "",
  "Nice!已解锁成功，可关掉此脚本。",
  "https://i.pixiv.re/img-original/img/2022/12/19/00/06/12/103718184_p0.png"
);

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
