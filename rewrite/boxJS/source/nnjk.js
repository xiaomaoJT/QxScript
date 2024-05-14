let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(
          /\"vip_end_time\":\w+/g,
          '"vip_end_time":"2222-02-22 22:22:22"'
        )
        .replace(
          /\"experience_vip_end_time\":\w+/g,
          '"experience_vip_end_time":"2222-02-22 22:22:22"'
        )
        .replace(/\"is_experience_vip\":\w+/g, '"is_experience_vip":true')
        .replace(/\"is_vip\":\w+/g, '"is_vip":true')
        .replace(/\"is_permanent_vip\":\w+/g, '"is_permanent_vip":1')
        .replace(/\"is_trial\":\w+/g, '"is_trial":1')
        .replace(/\"vip_type\":\w+/g, '"vip_type":1')
        .replace(
          /\"remove_wrongbook_times\":\w+/g,
          '"remove_wrongbook_times":999999'
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
