var obj = JSON.parse(
  $response.body
    .replace(/"premium":false/g, '"premium":true')
    .replace(/"adsEnabled":true/g, '"adsEnabled":false')
    .replace(/"loadAdsOnStartup":true/g, '"loadAdsOnStartup":false')
    .replace(/"adTimerEnabled":true/g, '"adTimerEnabled":false')
    .replace(/You don't have enough permissions./g, "我也想看，但也没辙～")
);
$done({ body: JSON.stringify(obj) });
