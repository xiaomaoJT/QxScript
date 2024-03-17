let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status
  ? JSON.parse(
      $response.body
        .replace(/\"status\":\w+/g, '"status":1')
        .replace(/\"unlocked\":\w+/g, '"unlocked":1')
        .replace(/\"price\":\w+/g, '"price":0')
        .replace(/\"diamonds\":\w+/g, '"diamonds":99999')
        .replace(/\"expiry_time\":\w+/g, '"expiry_time":7955085722000')
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
