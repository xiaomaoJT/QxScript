var obj = JSON.parse(
  $response.body
    .replace(/\"is_vip\":0/g, '"is_vip":1')
    .replace(/\"is_paid\":0/g, '"is_paid":1')
    .replace(/\"vip_expired\":0/g, '"vip_expired":1726411565000')
);

$done({ body: JSON.stringify(obj) });
