let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status ? JSON.parse($response.body) : $response.body;
if (/^https:\/\/weather\.aviatorassistant\.com?/.test(requestUrl)) {
  if (
    obj.hasOwnProperty("status") &&
    obj.hasOwnProperty("data") &&
    obj.data.hasOwnProperty("user")
  ) {
    obj.data.user.is_internal_subscription_free_user = 1;
    obj.data.user.subscription_expiration = "2222-02-22T07:56:01.669Z";
    obj.data.hasOwnProperty("active_free_promos")
      ? (obj.data.active_free_promos = [])
      : "";
  }
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
