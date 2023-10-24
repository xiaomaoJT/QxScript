$done({
  body: $response.body
    .replace(/\"isLimitFree\":\w+/g, '"isLimitFree":true')
    .replace(/\"hasRight\":\w+/g, '"hasRight":true')
    .replace(/false/g, "true"),
});
