function getGoneDay(n = 0, yearFlag = true) {
  let myDate = new Date();
  myDate.setDate(myDate.getDate() - n);
  let month = myDate.getMonth() + 1;
  let day = myDate.getDate();
  let result =
    "" +
    (yearFlag ? myDate.getFullYear() : "") +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    (day < 10 ? "0" + day : day);
  return result;
}

let requestUrl = $request.url;
let obj = JSON.parse($response.body);
if (/^https:\/\/new\.vip\.weibo\.cn\/aj\/appicon\/list?/.test(requestUrl)) {
  obj.data.list.forEach((el) => {
    el.status = 1;
    el.cardType = "2";
    el.tag = "大佬尊享";
    el.hasOwnProperty("endTime")
      ? (el.endTime = new Date(getGoneDay(-100)) / 1000)
      : "";
  });
} else if (/^https:\/\/api\.weibo\.cn\/device\/get?/.test(requestUrl)) {
  obj.devices.forEach((el) => {
    el.vip = 0;
  });
  obj.cards = [];
}
$done({ body: JSON.stringify(obj) });
