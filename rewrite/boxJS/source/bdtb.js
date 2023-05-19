let requestUrl = $request.url;

if (/^https?:\/\/wapp\.baidu\.com\/p\/[0-9]{3,}\?query/.test(requestUrl)) {
  let url = requestUrl.substring(0, requestUrl.indexOf("?"));

  $notify("XiaoMao提示", "", "捕捉到贴吧源地址，点击跳转!", {
    "open-url": url,
  });

  console.log("XiaoMao数据反显-贴吧源地址：" + url);
}

etTimeout(() => {
  $done({});
}, 1000);
