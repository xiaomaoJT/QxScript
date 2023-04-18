var body = $response.body;
var obj = JSON.parse(body);

obj.result = "ok";

body = JSON.stringify(obj);
$done({ body });
