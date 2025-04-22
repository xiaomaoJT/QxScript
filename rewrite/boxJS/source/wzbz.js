// 获取请求地址
let requestUrl = $request.url;
let status = isJSON($response.body);
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/"isSuccess":\w+/g, '"isSuccess":true')
        .replace(/"code":-\d+/g, '"code":1')
    )
  : $response.body;

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

// 判断是否为匹配项
if (
  /^https:\/\/.+\.iwzbz\.com\/api\/v1.1\/user\/getvipinfo?/.test(requestUrl)
) {
  obj.data.vipLevel = 3;
  obj.data.expires = "2222-02-02 22:22:22";
}
// 重写数据
$done({ body: status ? JSON.stringify(obj) : obj });
