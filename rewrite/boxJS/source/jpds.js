// 获取相应数据并改写
var obj = JSON.parse(
    $response.body
      .replace(/\"is_charge\":\"\w+\"/g, '"is_charge":"n"')
      .replace(/\"isCharge\":\"\w+\"/g, '"isCharge":"Y"')
  );

// 重写数据
$done({ body: JSON.stringify(obj) });
