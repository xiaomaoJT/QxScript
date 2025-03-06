function Env(name) {
  // 判断当前环境是否为 Loon
  const isLoon = typeof $loon !== "undefined";
  // 判断当前环境是否为 Surge
  const isSurge = typeof $httpClient !== "undefined" && !isLoon;
  // 判断当前环境是否为 QuantumultX
  const isQX = typeof $task !== "undefined";

  // 定义 read 方法，用于读取数据
  const read = (key) => {
    if (isLoon || isSurge) return $persistentStore.read(key);
    if (isQX) return $prefs.valueForKey(key);
  };

  // 定义 write 方法，用于写入数据
  const write = (key, value) => {
    if (isLoon || isSurge) return $persistentStore.write(key, value);
    if (isQX) return $prefs.setValueForKey(key, value);
  };

  // 定义 notify 方法，用于发送通知
  const notify = (
    title = "XiaoMao",
    subtitle = "",
    message = "",
    url = "",
    url2 = url
  ) => {
    if (isLoon) $notification.post(title, subtitle, message, url);
    if (isSurge) $notification.post(title, subtitle, message, { url });
    if (isQX)
      $notify(title, subtitle, message, { "open-url": url, "media-url": url2 });
  };

  // 定义 get 方法，用于发送 GET 请求
  const get = (url, callback) => {
    if (isLoon || isSurge) $httpClient.get(url, callback);
    if (isQX) {
      url.method = `GET`;
      $task.fetch(url).then((resp) => callback(null, {}, resp.body));
    }
  };

  // 定义 post 方法，用于发送 POST 请求
  const post = (url, callback) => {
    if (isLoon || isSurge) $httpClient.post(url, callback);
    if (isQX) {
      url.method = `POST`;
      $task.fetch(url).then((resp) => callback(null, {}, resp.body));
    }
  };

  // 定义 put 方法，用于发送 PUT 请求
  const put = (url, callback) => {
    if (isLoon || isSurge) $httpClient.put(url, callback);
    if (isQX) {
      url.method = "PUT";
      $task.fetch(url).then((resp) => callback(null, {}, resp.body));
    }
  };

  // 定义 toObj 方法，用于将字符串转为对象
  const toObj = (str) => JSON.parse(str);

  // 定义 toStr 方法，用于将对象转为字符串
  const toStr = (obj) => JSON.stringify(obj);

  // 定义 queryStr 方法，用于将对象转为可以请求的字符串
  const queryStr = (obj) => {
    return Object.keys(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join("&");
  };

  // 定义 log 方法，用于输出日志
  const log = (message) => console.log(message);

  // 定义 done 方法，用于结束任务
  const done = (value = {}) => $done(value);

  // 返回包含所有方法的对象
  return {
    name,
    read,
    write,
    notify,
    get,
    post,
    put,
    toObj,
    toStr,
    queryStr,
    log,
    done,
  };
}

const $ = new Env("XiaoMaoAvCode");
let requestUrl = $request.url;
let avCode = requestUrl.split("%23")[1];
if (avCode) {
  let mainOption = {
    url: encodeURI(
      "https://client-rapi-missav.recombee.com/missav-default/search/users/b73beab7-af71-4c67-bfb2-fd8207262db5/items/?frontend_timestamp=1741185136&frontend_sign=e7a1fa07ee822a1ed8bd57de5c80f96162b42383"
    ),
    method: "POST",
    headers: {
      "Sec-Fetch-Dest": `empty`,
      Connection: `keep-alive`,
      "Accept-Encoding": `gzip, deflate, br`,
      "Content-Type": `application/json`,
      "Sec-Fetch-Site": `cross-site`,
      Origin: `https://missav.ws`,
      "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1`,
      "Sec-Fetch-Mode": `cors`,
      Host: `client-rapi-missav.recombee.com`,
      Referer: `https://missav.ws/`,
      "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
      Accept: `application/json`,
    },
    body: JSON.stringify({
      searchQuery: avCode,
      count: 1,
      scenario: "search",
      returnProperties: true,
      includedProperties: [
        "title",
        "duration",
        "has_chinese_subtitle",
        "has_english_subtitle",
        "is_uncensored_leak",
        "dm",
      ],
      cascadeCreate: true,
    }),
  };

  $.post(mainOption, (err, resp, response) => {
    if (response) {
      let obj = JSON.parse(response);
      if (obj?.recomms && obj.recomms.length) {
        obj.recomms.map((el, index) => {
          $.notify(
            `车牌${avCode}读取完毕`,
            `${el.values.title}`,
            `正在加载视频地址，此操作需要代理网络！`,
            `https://fourhoi.com/${el.id}/cover-t.jpg`
          );
          $.get(
            { url: encodeURI(`https://missav.ws/cn/${el.id}`) },
            (err2, resp2, response2) => {
              let thumbnailText = response2.split("thumbnail:")[1];
              if (thumbnailText) {
                const uuidRegex =
                  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
                const matches = thumbnailText.match(uuidRegex);
                if (matches && matches.length > 0) {
                  let matchUUID = Array.from(new Set(matches))[
                    new Set(matches).size - 1
                  ];
                  $.notify(
                    `片名：${el.values.title}`,
                    `是86，86上山了`,
                    `点击观影～`,
                    `https://surrit.com/${matchUUID}/720p/video.m3u8`
                  );
                } else {
                  getError("未找到视频UUID");
                }
              } else {
                getError("视频结果为空");
              }
            }
          );
        });
      } else {
        getError("搜索结果为空");
      }
    } else {
      getError("请求失败，请稍后重试");
    }
  });
} else {
  $done();
}

function getError(params = "") {
  $.notify(
    "🔞XiaoMao_车牌搜索",
    "",
    "🚧获取失败，错误：" + params + "❗️",
    "https://i.pixiv.re/img-original/img/2022/09/19/08/00/04/101330591_p0.png"
  );
  $done();
}
setTimeout(() => {
  getError("超时终止，请检查代理网络或稍后再试～");
}, 8000);
