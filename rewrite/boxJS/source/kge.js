var obj = JSON.parse(
  $response.body
    .replace(/\"isSubscriber\":\w+/g, '"isSubscriber":true')
    .replace(/\"lock\":\w+/g, '"lock":false')
);

$done({ body: JSON.stringify(obj) });
