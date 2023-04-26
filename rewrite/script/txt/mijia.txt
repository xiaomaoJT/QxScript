// 获取相应数据
let obj = JSON.parse($response.body);
// 获取请求地址
let requestUrl = $request.url;
// 判断是否为匹配项
if (/^https:\/\/home\.mi\.com\/cgi-op\/api\/v1\/recommendation\/myTab?/.test(requestUrl)) {
  // 判断是否存在数据
  if (obj.hasOwnProperty("data")) {
    // 删除指定数据
    delete obj.data.banners;
    // // 打印拦截结果
    // console.log("拦截成功！！！！");
    // console.log("拦截成功！！！！");
    // console.log("拦截成功！！！！");
  }
}
// 重写数据
$done({ body: JSON.stringify(obj) });


