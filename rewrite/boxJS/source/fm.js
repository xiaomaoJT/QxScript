let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status ? JSON.parse($response.body) : $response.body;
if (/^https:\/\/appv2\.filmix\.com\.cn\/api\/v2\/users?/.test(requestUrl)) {
  obj.is_vip = true;
  obj.vip_start_time = "2024-04-02T10:10:10.101198+08:00";
  obj.vip_end_time = "2222-02-02T15:33:15.101198+08:00";
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
