let requestUrl = $request.url;
let status = isJSON($response.body);
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"status\":\"\w+\"/g, '"status":"9"')
        .replace(/\"price\":\"\w+\"/g, '"price":"0"')
        .replace(/\"user_point\":\"\w+\"/g, '"user_point":"100000"')
        .replace(/\"sell_way\":\"\w+\"/g, '"sell_way":"0"')
        .replace(/\"ptype\":\"\w+\"/g, '"ptype":"0"')
        .replace(
          /\"auto_analysis_package\":\"\w+\"/g,
          '"auto_analysis_package":"100000"'
        )
        .replace(
          /\"kefu_import_paper_number\":\"\w+\"/g,
          '"kefu_import_paper_number":"100000"'
        )
    )
  : $response.body;
if (/^https:\/\/api\.ankianki\.com\/user\/userInfo\/get?/.test(requestUrl)) {
  obj.data.vip_expiration_time = "2222-02-02 08:00:00";
  obj.data.yst_vip_expiration_time = "2222-02-02 08:00:00";
  obj.data.expiration_time = "2222-02-02 08:00:00";
  obj.data.status = "1";
  obj.data.yst_vip_type = "2";
  obj.data.user_type = "2";
  obj.data.max_paper_limit = "1000";
  obj.data.auto_analysis_package = "1000";
  obj.data.extra_exam_number = "1000";
  obj.data.remove_error_limit = "1000";
  obj.data.export_system_paper_number = "1000";
  obj.data.kefu_import_paper_number = "1000";
  obj.data.system_error_recovery = "1000";
  obj.data.smart_create_question = "1000";
  obj.data.vip_config = {
    exam_questions_limit: "10000",
    paper_create_limit: "2000",
    exam_paper_limit: "10000",
    question_limit: "150000",
    paper_collect_limit: "3000",
    exam_member_limit: "5000",
    desc: "个人用户或小微企业刷题学习",
    exam_limit: "1000",
    price: "10000",
    paper_document_limit: "200",
    exam_submit_limit: "300",
    paid_kaoshi_limit: "000",
    alert_title: "高级用户",
    paper_limit: "4000",
  };
  obj.data.is_show_ad = "0";
  obj.data.vip_type = "2";
} else if (
  /^https:\/\/api\.ankianki\.com\/user\/paper\/list?/.test(requestUrl)
) {
  obj.data.export_system_paper_number = "10000";
  obj.data.show_paper_cover = "10000";
} else if (
  /^https:\/\/api\.ankianki\.com\/system\/setPassphrase?/.test(requestUrl)
) {
  obj.data.expire_at = "2222-02-02 08:00:00";
} else if (
  /^https:\/\/api\.ankianki\.com\/help\/commonSwitch\/getConfig?/.test(
    requestUrl
  )
) {
  obj.data = {
    ai_analysis: "1000",
    recommend_tips: "11000",
    ai_analysis_sse: "11000",
  };
} else if (
  /^https:\/\/api\.ankianki\.com\/user\/userSetting\/getFreeAnalysisNumber?/.test(
    requestUrl
  )
) {
  obj.data = {
    total: "10000",
    used: "10000",
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
