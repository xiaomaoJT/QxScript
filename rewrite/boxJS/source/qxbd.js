let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"is_hdimg\":\"\w+\"/g, '"is_hdimg":"0"')
        .replace(/\"is_check_vip\":\"\w+\"/g, '"is_check_vip":"0"')
        .replace(/\"is_check_sf\":\"\w+\"/g, '"is_check_sf":"0"')
        .replace(/\"is_check_zy\":\"\w+\"/g, '"is_check_zy":"0"')
        .replace(/\"is_check_sj\":\"\w+\"/g, '"is_check_sj":"0"')
        .replace(/\"is_master\":\"\w+\"/g, '"is_master":"1"')
        .replace(/\"jingyan\":\w+/g, '"jingyan":"999999"')
        .replace(/\"is_buy\":0/g, '"is_buy":1')
        .replace(/\"is_vip\":0/g, '"is_vip":1')
        .replace(/\"vip\":0/g, '"vip":1')
        .replace(/\"status\":1/g, '"status":0')
        .replace(/\"moderator_type\":0/g, '"moderator_type":1')
        .replace(/\"active_medal\":\"0\"/g, '"active_medal":"9"')
        .replace(/\"zhiye_zhuangtai\":\"0\"/g, '"zhiye_zhuangtai":"1"')
        .replace(/\"yearly_medal\":\"0\"/g, '"yearly_medal":"9"')
        .replace(/\"normal_medal\":\"0\"/g, '"normal_medal":"9"')
        .replace(/\"is_control\":\"0\"/g, '"is_control":"0"')
        .replace(/\"type\":\"\w+\"/g, '"type":"1"')
        .replace(/\"qy_status\":\"\"/g, '"qy_status":"1"')
        .replace(/\"qy_name\":\"\"/g, '"qy_name":"高级用户"')
        .replace(/\"dashi_zhuangtai\":\"0\"/g, '"dashi_zhuangtai":"1"')
        .replace(/\"tuiguang_app\":\"0\"/g, '"tuiguang_app":"1"')
        .replace(/\"rz_zhuangtai\":\"0\"/g, '"rz_zhuangtai":"1"')
        .replace(/\"shenfen_zhuangtai\":\"0\"/g, '"shenfen_zhuangtai":"1"')
        .replace(/\"master_medal\":\"0\"/g, '"master_medal":"9"')
        .replace(/\"star\":\"\w+\"/g, '"star":"999999"')
        .replace(/\"experience\":\w+/g, '"experience":"999999"')
        .replace(/\"tuiguang\":\"\w+\"/g, '"tuiguang":"999999"')
        .replace(/\"fensi\":\"\w+\"/g, '"fensi":"999999"')
        .replace(/\"friends\":\"\w+\"/g, '"friends":"999999"')
        .replace(/\"vip\":\"0\"/g, '"vip":"1"')
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
