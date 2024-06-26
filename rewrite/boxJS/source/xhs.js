let status = isJSON($response.body);
let requestUrl = $request.url;
const url = $request.url;
let names = "XiaoHongShu";
let $ = new Env(names);
var obj = status
  ? JSON.parse(removeExtraSpaces($response.body))
  : $response.body;

let typeObj = {
  1: {
    label: "原始分辨率",
    value: "imageView2/0/format/png",
  },
  2: {
    label: "高质量压缩",
    value: "imageMogr2/format/png/quality/100",
  },
  3: {
    label: "高像素输出",
    value: "imageView2/2/w/1920/h/1080/format/png",
  },
  4: {
    label: "平衡配置",
    value: "imageMogr2/thumbnail/!50p/quality/100/format/png",
  },
};
let HighType = 1;
let BerserkMode = 0;
$.read("HighType") ? (HighType = $.read("HighType")) : "";
$.read("BerserkMode") ? (HighType = $.read("BerserkMode")) : "";

if (BerserkMode == 0) {
  if (
    /^https:\/\/edith\.xiaohongshu\.com\/api\/sns\/v2\/note\/widgets?/.test(
      requestUrl
    )
  ) {
    if (
      obj.data.hasOwnProperty("image_stickers") &&
      obj.data.image_stickers.length
    ) {
      obj.data.image_stickers.map((el, index) => {
        $.notify(
          "🏅️小红书高清图片捕获成功",
          "标准捕获模式：" + typeObj[HighType].label,
          `共捕获图片${obj.data.image_stickers.length}张，当前第${index + 1}张`,
          `http://sns-img-bd.xhscdn.com/${el.fileid}?${typeObj[HighType].value}`
        );
      });
    }
  }
} else {
  if (/^http:\/\/sns-img-hw\.xhscdn.com\/.+?imageView2?/.test(requestUrl)) {
    const regex = /http:\/\/sns-img-hw\.xhscdn\.com\/([^?]+)/;
    const match = requestUrl.match(regex);
    let imageId = null;
    if (match && match[1]) {
      imageId = match[1];
    }
    if (imageId) {
      $.notify(
        "🏅️小红书高清图片捕获成功",
        "狂暴捕获模式：" + typeObj[HighType].label,
        `又有好图？我收下了！`,
        `http://sns-img-bd.xhscdn.com/${imageId}?${typeObj[HighType].value}`
      );
    }
  }
}

// 去广告
if (url.includes("/v1/note/imagefeed") || url.includes("/v2/note/feed")) {
  // 信息流 图片
  if (obj?.data?.length > 0) {
    let data0 = obj.data[0];
    if (data0?.note_list?.length > 0) {
      for (let item of data0.note_list) {
        if (item?.media_save_config) {
          // 水印开关
          item.media_save_config.disable_save = false;
          item.media_save_config.disable_watermark = true;
          item.media_save_config.disable_weibo_cover = true;
        }
        if (item?.share_info?.function_entries?.length > 0) {
          // 下载限制
          const additem = { type: "video_download" };
          let func = item.share_info.function_entries[0];
          if (func?.type !== "video_download") {
            // 向数组开头添加对象
            item.share_info.function_entries.unshift(additem);
          }
        }
      }
    }
    // 写入持久化存储
    if (isQuanX) {
      $prefs.removeValueForKey("redBookLivePhoto");
      $prefs.setValueForKey(
        JSON.stringify(obj.data[0].note_list[0].images_list),
        "redBookLivePhoto"
      );
    } else {
      $persistentStore.write("", "redBookLivePhoto");
      $persistentStore.write(
        JSON.stringify(obj.data[0].note_list[0].images_list),
        "redBookLivePhoto"
      );
    }
  }
} else if (url.includes("/v1/note/live_photo/save")) {
  // 实况照片保存请求
  let livePhoto;
  let newDatas = [];
  // 读取持久化存储
  if (isQuanX) {
    livePhoto = JSON.parse($prefs.valueForKey("redBookLivePhoto"));
  } else {
    livePhoto = JSON.parse($persistentStore.read("redBookLivePhoto"));
  }
  if (livePhoto?.length > 0) {
    // 持久化存储
    for (let item of livePhoto) {
      if (item.live_photo_file_id) {
        let myData = {
          file_id: item.live_photo_file_id,
          video_id: item.live_photo.media.video_id,
          url: item.live_photo.media.stream.h265[0].master_url,
        };
        newDatas.push(myData);
      }
    }
  }
  if (obj?.data?.datas?.length > 0) {
    // 原始数据没问题 交换url数据
    obj.data.datas.forEach((itemA) => {
      newDatas.forEach((itemB) => {
        if (itemB.file_id === itemA.file_id && itemA.url.includes(".mp4")) {
          itemA.url = itemA.url.replace(/^https?:\/\/.*\.mp4$/g, itemB.url);
        }
      });
    });
  } else {
    // 原始数据有问题 强制返回成功响应
    obj = { code: 0, success: true, msg: "成功", data: { datas: newDatas } };
  }
} else if (url.includes("/v1/search/banner_list")) {
  if (obj?.data) {
    obj.data = {};
  }
} else if (url.includes("/v1/search/hot_list")) {
  // 热搜列表
  if (obj?.data?.items?.length > 0) {
    obj.data.items = [];
  }
} else if (url.includes("/v1/system_service/config")) {
  // 整体配置
  const item = ["app_theme", "loading_img", "splash", "store"];
  if (obj?.data) {
    for (let i of item) {
      delete obj.data[i];
    }
  }
} else if (url.includes("/v2/note/widgets")) {
  // 详情页小部件
  const item = ["cooperate_binds", "generic", "note_next_step"];
  // cooperate_binds合作品牌 note_next_step活动
  if (obj?.data) {
    for (let i of item) {
      delete obj.data[i];
    }
  }
} else if (url.includes("/v2/system_service/splash_config")) {
  // 开屏广告
  if (obj?.data?.ads_groups?.length > 0) {
    for (let i of obj.data.ads_groups) {
      i.start_time = 3818332800; // Unix 时间戳 2090-12-31 00:00:00
      i.end_time = 3818419199; // Unix 时间戳 2090-12-31 23:59:59
      if (i?.ads?.length > 0) {
        for (let ii of i.ads) {
          ii.start_time = 3818332800; // Unix 时间戳 2090-12-31 00:00:00
          ii.end_time = 3818419199; // Unix 时间戳 2090-12-31 23:59:59
        }
      }
    }
  }
} else if (url.includes("/v2/user/followings/followfeed")) {
  // 关注页信息流 可能感兴趣的人
  if (obj?.data?.items?.length > 0) {
    // 白名单
    obj.data.items = obj.data.items.filter(
      (i) => i?.recommend_reason === "friend_post"
    );
  }
} else if (url.includes("/v3/note/videofeed")) {
  // 信息流 视频
  if (obj?.data?.length > 0) {
    for (let item of obj.data) {
      if (item?.media_save_config) {
        // 水印开关
        item.media_save_config.disable_save = false;
        item.media_save_config.disable_watermark = true;
        item.media_save_config.disable_weibo_cover = true;
      }
      if (item?.share_info?.function_entries?.length > 0) {
        // 下载限制
        const additem = { type: "video_download" };
        let func = item.share_info.function_entries[0];
        if (func?.type !== "video_download") {
          // 向数组开头添加对象
          item.share_info.function_entries.unshift(additem);
        }
      }
    }
  }
} else if (url.includes("/v4/followfeed")) {
  // 关注列表
  if (obj?.data?.items?.length > 0) {
    // recommend_user可能感兴趣的人
    obj.data.items = obj.data.items.filter(
      (i) => !["recommend_user"]?.includes(i.recommend_reason)
    );
  }
} else if (url.includes("/v4/search/hint")) {
  // 搜索栏填充词
  if (obj?.data?.hint_words?.length > 0) {
    obj.data.hint_words = [];
  }
} else if (url.includes("/v4/search/trending")) {
  // 搜索栏
  if (obj?.data?.queries?.length > 0) {
    obj.data.queries = [];
  }
  if (obj?.data?.hint_word) {
    obj.data.hint_word = {};
  }
} else if (url.includes("/v5/recommend/user/follow_recommend")) {
  // 用户详情页 你可能感兴趣的人
  if (
    obj?.data?.title === "你可能感兴趣的人" &&
    obj?.data?.rec_users?.length > 0
  ) {
    obj.data = {};
  }
} else if (url.includes("/v6/homefeed")) {
  if (obj?.data?.length > 0) {
    // 信息流广告
    let newItems = [];
    for (let item of obj.data) {
      if (item?.model_type === "live_v2") {
        // 信息流-直播
        continue;
      } else if (item.hasOwnProperty("ads_info")) {
        // 信息流-赞助
        continue;
      } else if (item.hasOwnProperty("card_icon")) {
        // 信息流-带货
        continue;
      } else if (item?.note_attributes?.includes("goods")) {
        // 信息流-商品
        continue;
      } else if (item.hasOwnProperty("is_ads") && item.is_ads) {
        // 广告标识
        continue;
      } else {
        if (item?.related_ques) {
          delete item.related_ques;
        }
        newItems.push(item);
      }
    }
    obj.data = newItems;
  }
} else if (url.includes("/v10/search/notes")) {
  // 搜索结果
  if (obj?.data?.items?.length > 0) {
    obj.data.items = obj.data.items.filter((i) => i.model_type === "note");
  }
}

$done({ body: status ? JSON.stringify(obj) : obj });

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function removeExtraSpaces(jsonString) {
  var jsonObj = JSON.parse(jsonString);
  return JSON.stringify(jsonObj, function (key, value) {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  });
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
