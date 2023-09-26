// 获取相应数据并改写
var obj = $response.body
obj = 'ipsubnow=1695732913&ipsubexp=7956886942000&ipsub=1'
// 重写数据
$done({ body: obj });
