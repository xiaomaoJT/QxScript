let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"isSuccess\":\w+/g, '"isSuccess":true')
        .replace(/\"vipLevel\":\w+/g, '"vipLevel":5')
        .replace(
          /\"expires\":\"1970-01-01 00:00:00\"/g,
          '"expires":"2222-02-02 22:22:22"'
        )
    )
  : $response.body;

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
