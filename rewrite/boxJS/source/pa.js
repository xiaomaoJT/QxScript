var body = JSON.parse(
  (typeof $response != "undefined" && $response.body) || null
);
var headers = $request && $request.headers;
var obj = {};
let requestUrl = $request.url;

let AppName = "Pandora";
let entId = "all";
let subType = "lifetime";

if (
  /^https:\/\/api\.revenuecat\.com\/v1\/(subscribers|receipts)?/.test(
    requestUrl
  )
) {
  if (typeof $response == "undefined") {
    delete headers["x-revenuecat-etag"];
    delete headers["X-RevenueCat-ETag"];
    obj.headers = headers;
  } else if (body && body.subscriber) {
    let subscriberData = {
      original_purchase_date: "2023-09-18T10:19:12Z",
      purchase_date: "2023-09-18T10:19:12Z",
      expires_date: "2222-02-02T02:02:02Z",
      store: "app_store",
      ownership_type: "PURCHASED",
    };
    body.subscriber.subscriptions[subType] = subscriberData;
    body.subscriber.entitlements[entId] = subscriberData;
    body.subscriber.entitlements[entId].product_identifier = subType;
    obj.body = JSON.stringify(body);
    $notify(
      "XiaoMao_" + AppName + " 执行成功！",
      "",
      "Nice!已解锁成功，可关掉此脚本。",
      {
        "open-url":
          "https://i.pixiv.re/img-original/img/2022/12/19/00/06/12/103718184_p0.png",
        "media-url":
          "https://i.pixiv.re/img-original/img/2022/12/19/00/06/12/103718184_p0.png",
      }
    );
  }
}
$done(obj);
