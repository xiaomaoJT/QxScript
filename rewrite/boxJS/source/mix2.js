let obj=JSON.parse($response.body);let requestUrl=$request.url;if(/^https:\/\/bmall\.camera360\.com\/api\/iap\/check-receipt?/.test(requestUrl)){obj.data={errorCode:0,sandbox:0,isTrialPeriod:0,purchaseTime:1692026680,expireTime:7955085722,appleExpireTime:7955085722,originalTransactionId:"444444444444444",productId:"VIP_yearly_29.99",appleVip:1,operationVip:1,giftVip:1,}}$done({body:JSON.stringify(obj)});