let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"userType\":\w+/g, '"userType":2')
        .replace(/\"level\":\w+/g, '"level":10')
        .replace(/\"downloadCount\":\w+/g, '"downloadCount":99999')
        .replace(/\"point\":\w+/g, '"point":99999')
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
