let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"isVip\":\w+/g, '"isVip":true')
        .replace(/\"status\":\w+/g, '"status":1')
        .replace(/\"auth\":\w+/g, '"auth":false')
        .replace(/\"code\":\w+/g, '"code":0')
        .replace(/\"useTotal\":\w+/g, '"useTotal":100000000')
        .replace(/\"vipExpire\":\w+/g, '"vipExpire":7955085722000')
    )
  : $response.body;
if (
  /^https:\/\/keyborad-api\.shengmaapp\.com\/api\/pay\/iosRecoverPay?/.test(
    requestUrl
  )
) {
  obj.code = 0;
  obj.message = "成功";
  obj.data = {
    ...DataTransfer,
    priceRate: 2.5,
    pkgId: 1,
    name: "永久会员",
    iosId: "com.yongjiukey.app",
    isVip: true,
    vipExpire: 7955085722000,
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
