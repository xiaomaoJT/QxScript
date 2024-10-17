let status = isJSON($response.body);
let requestUrl = $request.url;
var obj = status
  ? JSON.parse(
      removeExtraSpaces($response.body)
        .replace(/\"isAuth\":false/g, '"isAuth":true')
        .replace(/\"isValid\":\w+/g, '"isValid":1')
        .replace(/\"isValid\":\"0\"/g, '"isValid":1')
        .replace(/\"isSubscribe\":\w+/g, '"isSubscribe":1')
        .replace(/\"isSubscribe\":\"0\"/g, '"isSubscribe":1')
        .replace(/\"isAuth\":\w+/g, '"isAuth":1')
        .replace(/\"isAuth\":\"0\"/g, '"isAuth":1')
        .replace(/\"isVip\":\w+/g, '"isVip":1')
        .replace(/\"isVip\":\"0\"/g, '"isVip":1')
        .replace(/\"vipGrade\":\w+/g, '"vipGrade":2')
        .replace(/\"vipGrade\":\"0\"/g, '"vipGrade":2')
        .replace(/\"vipExpire\":\w+/g, '"vipExpire":1726411565000')
        .replace(/\"vipExpire\":\"0\"/g, '"vipExpire":1726411565000')
        .replace(/\"jobBianzhiOpt\":\w+/g, '"jobBianzhiOpt":1')
        .replace(/\"jobBianzhiOpt\":0/g, '"jobBianzhiOpt":1')
    )
  : $response.body;
if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/v.+\/user\/getInfo?/.test(requestUrl)
) {
  obj.data.userInfo.nickname = obj.data.userInfo.nickname;
  obj.data.userInfo.vipGrade = 2;
  obj.data.userInfo.vipExpire = 1726411565000;
  obj.data.userInfo.isVip = 1;
  obj.data.userInfo.homePageStatus = 0;
  obj.data.userInfo.recommendStatus = 0;
  obj.data.userInfo.vipGradeList = [
    {
      vipExpire: 1726411565000,
      vipGradeName: "黄金VIP",
      vipGrade: 1,
      remainDays: 365,
      isVip: 1,
    },
    {
      vipExpire: 1726411565000,
      vipGradeName: "星钻VIP",
      vipGrade: 2,
      remainDays: 365,
      isVip: 1,
    },
  ];
} else if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/v5_4_5\/sets\/getFilterPackage?/.test(
    requestUrl
  )
) {
  function setGrade(list) {
    list.forEach((el) => {
      if (el.hasOwnProperty("vipGrade")) {
        el.vipGrade = 0;
      }
      if (el.hasOwnProperty("childList")) {
        setGrade(el.childList);
      }
      if (el.hasOwnProperty("hotRecommendation")) {
        setGrade(el.hotRecommendation);
      }
    });
  }
  setGrade(obj.data.list);
} else if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/home\/v5\/index?/.test(requestUrl)
) {
  obj.data.needAuth = [];
} else if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/v.+\/sets\/getFilterResult?/.test(
    requestUrl
  )
) {
  obj.data.jobStaff.vipGrade = 0;
  obj.data.articleStaff.vipGrade = 0;
} else if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/v.+\/exam\/getExamList?/.test(
    requestUrl
  )
) {
  obj.data.isValid = 1;
  obj.data.result.status = 200;
  obj.data.vipAuthList.articleBianzhiSort = 1;
} else if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/v.+\/exam\/jobSearchList?/.test(
    requestUrl
  )
) {
  obj.data.isValid = 1;
  obj.data.result.status = 200;
  obj.data.vipAuthList.jobBianzhiOpt = 1;
} else if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/v.+\/my\/vipCardInfo?/.test(
    requestUrl
  )
) {
  obj.data.btnScheme = "";
  obj.data.greetingMsg = "超级星钻会员";
  obj.data.btnText = "星钻VIP";
  obj.data.bottomList = [];
} else if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/v.+\/exam\/jobDetail?/.test(
    requestUrl
  )
) {
  obj.data.vipAuthList = {
    historyCompetitionData: 1,
    jobEnrollForecast: 1,
    historyInterviewScoreInfo: 1,
  };
} else if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/v.+\/subscribe\/jobHot?/.test(
    requestUrl
  )
) {
  obj.data.isVip = 1;
  obj.data.hasUnlock = true;
} else if (
  /^https:\/\/api\.gongkaoleida\.com\/api\/v5_2_6\/jobHistory\/getJobHistory?/.test(
    requestUrl
  )
) {
  obj.data.vipInfo.vipExpireDate = 1726411565000;
  obj.data.vipInfo.vipExpire = 1;
  obj.data.vipInfo.isVip = 1;
  obj.data.vipInfo.vipGrade = 2;
  obj.data.isAuth = true;
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
