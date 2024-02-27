var obj = JSON.parse(
  $response.body
    .replace(/"isBuy":false/g, '"isBuy":true')
    .replace(/"isTry":false/g, '"isTry":true')
    .replace(/"isAllow":false/g, '"isAllow":true')
    .replace(/"isNew":"false"/g, '"isNew":"true"')
);
let requestUrl = $request.url;

if (/^http:\/\/api\.crevalue\.cn\/sup\/v2\/user\/account?/.test(requestUrl)) {
  obj.isVerified = 1;
  obj.isValid = 1;
  obj.vip = true;
}
$done({ body: JSON.stringify(obj) });
