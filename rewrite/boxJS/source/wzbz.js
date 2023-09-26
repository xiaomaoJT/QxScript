// 获取相应数据
let obj = ($response && $response.body && JSON.parse($response.body)) || null;
// 获取请求地址
let requestUrl = $request.url;
// 判断是否为匹配项
if (
  /^https:\/\/bzpp2\.iwzbz\.com\/api\/v1.1\/user\/getvipinfo?/.test(requestUrl)
) {
  obj.data.vipLevel = 3;
  obj.data.expires = "2222-02-02 22:22:22";
}
// 重写数据
$done({ body: JSON.stringify(obj) });
