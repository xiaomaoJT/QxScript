// 获取相应数据
let obj = JSON.parse($response.body);
// 获取请求地址
let requestUrl = $request.url;
// 判断是否为匹配项
if (/^https:\/\/book\.haitunwallet\.com\/app\/vip\/status?/.test(requestUrl)) {
  obj.data.status = 1;
  obj.data.startTime = "2023-10-30";
  obj.data.endTime = "2222-02-22";
  obj.data.openTime = "2023-10-30";
  obj.data.level = 3;
} else if (
  /^https:\/\/book\.haitunwallet\.com\/app\/launchad?/.test(requestUrl)
) {
  obj.data.ads = [];
  obj.data.adInfo.showAd = false;
} else if (
  /^https:\/\/book\.haitunwallet\.com\/app\/config?/.test(requestUrl)
) {
  let list = {
    show_daka: "0",
    show_share: "0",
    show_wallet: "0",
    show_grade: "0",
    show_ad: "0",
  };

  obj.data = list;
}
// 重写数据
$done({ body: JSON.stringify(obj) });
