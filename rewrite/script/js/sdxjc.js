/**
 * @Author: XiaoMao
 * 闪动星剧场
 * 
 * [rewrite_local]
 * https:\/\/ts-api\.nsdk\.906you\.com\/userinfo\/center url script-response-body sdxjc.js
 * https:\/\/ts-api\.nsdk\.906you\.com\/drama\/list url script-response-body sdxjc.js
 * 
 * [mitm]
 * hostname = ts-api.nsdk.906you.com
 * 
 */

let requestUrl = $request.url;
let obj = JSON.parse($response.body);
if (/^https:\/\/ts-api\.nsdk\.906you\.com\/drama\/list?/.test(requestUrl)) {
  obj.data.List.forEach((el) => {
    el.money = 0;
    el.is_pay = 1;
  });
} else if (
  /^https:\/\/ts-api\.nsdk\.906you\.com\/userinfo\/center?/.test(requestUrl)
) {
  obj.data.money = 9000000;
  obj.data.plus_expire = 1714745802;
  obj.data.give_money = 3000000;
  obj.data.avatar = "已达成";
  obj.data.mobile = "";
  obj.data.rdate = "2023-07-04 21:42:02";
  $done({ body: JSON.stringify(obj) });
}
$done({ body: JSON.stringify(obj) });
