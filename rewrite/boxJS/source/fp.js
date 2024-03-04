var obj = JSON.parse(
    $response.body
      .replace(/\"isFree\":\w+/g, '"isFree":true')
      .replace(/\"isDisabled\":\w+/g, '"isDisabled":false')
  );
  $done({ body: JSON.stringify(obj) });
  