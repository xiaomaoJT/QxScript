// 获取相应数据并改写
var obj = JSON.parse($response.body);
let requestUrl = $request.url;
if (
  /^https:\/\/rzres86api\.imendon\.com\/v2\/purchase\/vip\/verification?/.test(
    requestUrl
  )
) {
  obj.data.isValid = 1;
}
// 重写数据
$done({ body: JSON.stringify(obj) });
