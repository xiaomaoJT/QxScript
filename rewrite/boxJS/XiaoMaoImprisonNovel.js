/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-05-29
 *
 * 


\限\制\文\学\


仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

0 0 22 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoImprisonNovel.js, tag=🔞XiaoMao_限制文学, img-url=graduationcap.fill.system, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoImprisonNovel.js



刷不出来尝试域名走代理
host, aaanovel.com, 全球策略

********************************/

const $ = new Env("XiaoMaoImprisonNovel");

// 获取随机日期
function getRandomDate() {
  const startDate = new Date(2020, 10, 1); // Months are 0-based, so 10 is November
  const currentDate = new Date();
  const startTimestamp = startDate.getTime();
  const endTimestamp = currentDate.getTime();
  const randomTimestamp =
    Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) +
    startTimestamp;
  const randomDate = new Date(randomTimestamp);
  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(randomDate.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}
// 获取标题
function extractBookmarkTitles(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const bookmarkLinks = doc.querySelectorAll('a[rel="bookmark"]');
  const titles = Array.from(bookmarkLinks).map((link) =>
    link.getAttribute("title")
  );
  return titles ?? [];
}
// 获取随机元素
function getRandomElement(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
// 获取内容
function extractPContent(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const articles = doc.querySelectorAll("article");
  const pContents = Array.from(articles).flatMap((article) => {
    const entryContentDiv = article.querySelector("div.entry-content");
    if (entryContentDiv) {
      const pTags = entryContentDiv.querySelectorAll("p");
      return Array.from(pTags).map((p) => p.innerHTML);
    }
    return [];
  });
  const strippedContents = pContents.map((content) =>
    content
      .replace(/<[^>]*>.*?<\/[^>]*>/g, "")
      .replace(/【[^】]*】/g, "")
      .replace(/\s+/g, " ")
      .replace(/\n/g, "")
      .trim()
  );
  return strippedContents;
}
// 获取分页链接
function getLinks(params) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(params, "text/html");
  const paginationDiv = doc.querySelector("div.entry-pagination.pagination");
  const hrefs = [];
  if (paginationDiv) {
    const links = paginationDiv.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
      hrefs.push(links[i].href);
    }
  }
  return hrefs;
}
// 获取分页内容
async function getLinkContent(params, contentList2 = []) {
  let linksList = getLinks(params);
  if (linksList.length) {
    const promises = [];
    for (let index = 0; index < linksList.length; index++) {
      const el = linksList[index];
      let linksOption = {
        url: el,
        method: "GET",
      };
      const promise = new Promise((resolve, reject) => {
        $.get(linksOption, (error1, resp1, response) => {
          if (response) {
            const content = extractPContent(response);
            contentList2.push(content);
            resolve();
          } else {
            reject("Error");
          }
        });
      });
      promises.push(promise);
    }
    await Promise.all(promises);
  }
  return contentList2;
}

// 核心函数
let titleUrl = `https://aaanovel.com/${getRandomDate()}`;
let titleOption = {
  url: encodeURI(titleUrl),
  method: "GET",
};
$.get(titleOption, (error1, resp1, response) => {
  if (response) {
    let titleList = extractBookmarkTitles(response);
    if (titleList.length) {
      let titleName = getRandomElement(titleList);
      let contentUrl = `${titleUrl}/${titleName}/`;
      let contentOption = {
        url: encodeURI(contentUrl),
        method: "GET",
      };
      $.get(contentOption, async (error2, resp2, response2) => {
        if (response2) {
          let contentList1 = await extractPContent(response2);
          await getLinkContent(response2)
            .then((contentList2) => {
              let contentListAll = [];
              contentListAll.push(contentList1);
              contentListAll.push(...contentList2);
              if (contentListAll.length) {
                let textNumberTotal = 0;
                let numberParams = {
                  0: "一",
                  1: "二",
                  2: "三",
                  3: "四",
                  4: "五",
                  5: "六",
                  6: "七",
                  7: "八",
                  8: "九",
                  9: "十",
                };
                contentListAll.map((contentList, contentIndex) => {
                  if (contentList.length) {
                    let returnText = "";
                    let returnTitle = `『大师文学之${titleName}』【第${
                      numberParams[contentIndex]
                    }章节 共${numberParams[contentListAll.length - 1]}章】`;
                    contentList.map((el, i) => {
                      returnText = returnText + (i != 0 ? "\n\n" : "") + el;
                    });
                    let returnTextLength = returnText.replace(
                      /\s+/g,
                      ""
                    ).length;
                    let convertReturnText =
                      returnTitle +
                      "（本章字数:" +
                      returnTextLength +
                      "）" +
                      "\n\n" +
                      returnText;

                    textNumberTotal = textNumberTotal + returnTextLength;
                    $.notify("大师文学", "读万卷书行万里路", convertReturnText);
                  }
                });
                console.log(
                  `已完成文学作品『${titleName}』的全部内容加载，共${
                    numberParams[contentListAll.length - 1]
                  }章节，共计字数${textNumberTotal}`
                );
                $done({});
              } else {
                getError("5012");
              }
            })
            .catch((err) => {
              getError("5013");
            });
        } else {
          getError("5011");
        }
      });
    } else {
      $.notify(
        "大师文学",
        "数据获取失败❗️请重试❗️",
        "文章随机刷新，存在空白章节情况，三次刷不出来乃天命所致，要不咱就不看了？🙈"
      );
      $done({});
    }
  } else {
    getError("5001");
  }
});

function getError(err) {
  $.notify(
    "🔞XiaoMao_限制文学❗️",
    "",
    "🚧系统错误，请稍后再试❗️" + err,
    "https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg"
  );
  $done({});
}

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
