/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2024-08-09
 *
 * 


\巴\黎\奥\运\会\ 
\奖\牌\榜\
\中\国\榜\
\进\行\中\赛\程\



仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · TG通知频道：https://t.me/xiaomaoJT
# XiaoMao · Tg脚本频道：https://t.me/XiaoMaoScript
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、⚠️ 配置文件 [task_local] 标签添加

0 0 10 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoParisOlympicGames.js, tag=🇫🇷XiaoMao_巴黎奥运会, img-url=https://gips1.baidu.com/it/u=3839228000,1883517164&fm=3028&app=3028&f=PNG&fmt=auto&q=100&size=f360_360, enabled=true



********************************/

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

function getEmojiByCountry(country) {
  let LEmoji = {
    "🏳️‍🌈": [
      "其他",
      "流量",
      "套餐",
      "剩余",
      "重置",
      "到期",
      "时间",
      "应急",
      "过期",
      "Bandwidth",
      "expire",
      "Traffic",
      "traffic",
    ],
    "🇴🇲": ["阿曼", " OM "],
    "🇦🇩": ["安道尔", "Andorra"],
    "🇦🇿": ["阿塞拜疆", "Azerbaijan"],
    "🇦🇹": ["奥地利", "奧地利", "Austria", "维也纳"],
    "🇦🇺": [
      "澳大利亚",
      "AU",
      "Australia",
      "Sydney",
      "澳洲",
      "墨尔本",
      "悉尼",
      "土澳",
      "京澳",
      "廣澳",
      "滬澳",
      "沪澳",
      "广澳",
    ],
    "🇧🇪": ["比利时", "BE", "比利時", "Belgium"],
    "🇧🇬": ["保加利亚", "保加利亞", "Bulgaria"],
    "🇵🇰": ["巴基斯坦", "Pakistan", "PAKISTAN"],
    "🇧🇭": ["巴林", "Bahrain"],
    "🇵🇾": ["巴拉圭", "Paraguay"],
    "🇰🇭": ["柬埔寨", "Cambodia"],
    "🇺🇦": ["烏克蘭", "乌克兰", "Ukraine"],
    "🇺🇿": ["乌兹别克斯坦", "烏茲別克斯坦", "Uzbekistan"],
    "🇭🇷": ["克罗地亚", "HR", "克羅地亞", "Croatia"],
    "🇨🇦": [
      "加拿大",
      "CA",
      "Canada",
      "CANADA",
      "CAN",
      "Waterloo",
      "蒙特利尔",
      "温哥华",
      "楓葉",
      "枫叶",
      "滑铁卢",
      "多伦多",
    ],
    "🇨🇭": ["瑞士", "苏黎世", "Switzerland", "CH "],
    "🇳🇬": ["尼日利亚", "NG", "尼日利亞", "拉各斯", "Nigeria"],
    "🇨🇿": ["捷克", "Czechia"],
    "🇸🇰": ["斯洛伐克", "SK", "Slovakia"],
    "🇸🇮": ["斯洛文尼亚", "斯洛文尼亞", "Slovenia"],
    "🇦🇲": ["亚美尼亚", "亞美尼亞", "Armenia"],
    "🇷🇸": ["塞尔维亚", "RS ", "RS_", "塞爾維亞", "Seville", "Sevilla"],
    "🇲🇩": ["摩爾多瓦", "MD", "摩尔多瓦", "Moldova"],
    "🇩🇪": [
      "德国",
      "DE ",
      "DE-",
      "DE_",
      "German",
      "GERMAN",
      "德國",
      "法兰克福",
      "京德",
      "滬德",
      "廣德",
      "沪德",
      "广德",
    ],
    "🇩🇰": ["丹麦", "DK", "DNK", "丹麥", "Denmark"],
    "🇪🇸": ["西班牙", "ES", "Spain"],
    "🇪🇺": ["欧洲", "EU", "欧盟", "欧罗巴", "European"],
    "🇫🇮": ["芬兰", "Finland", "芬蘭", "赫尔辛基"],
    "🇫🇷": ["法国", "FR", "France", "法國", "巴黎"],
    "🇷🇪": ["留尼汪", "留尼旺", "Réunion", "Reunion"],
    "🇨🇼": ["库拉索", "庫拉索", "Curaçao"],
    "🇬🇧": ["英国", "UK", "GB ", "England", "United Kingdom", "伦敦", "英"],
    "🇲🇴": ["澳门", "MO", "Macao", "Macau", "MAC", "澳門", "CTM"],
    "🇰🇿": ["哈萨克斯坦", "哈薩克斯坦", "Kazakhstan"],
    "🇱🇦": ["老挝", "老挝", "Laos"],
    "🇭🇺": ["匈牙利", "Hungary"],
    "🇱🇹": ["立陶宛", "Lithuania"],
    "🇱🇰": ["斯里兰卡", "斯里蘭卡", "Sri Lanka"],
    "🇧🇾": [
      "白俄罗斯",
      "BY",

      "白俄羅斯",
      "White Russia",
      "Republic of Belarus",
      "Belarus",
    ],
    "🇷🇺": [
      "俄罗斯",
      "RU ",
      "RU-",
      "RU_",
      "RUS",
      "Russia",
      "毛子",
      "俄国",
      "俄羅斯",
      "伯力",
      "莫斯科",
      "圣彼得堡",
      "西伯利亚",
      "新西伯利亚",
      "京俄",
      "杭俄",
      "廣俄",
      "滬俄",
      "广俄",
      "沪俄",
    ],
    "🇸🇬": [
      "新加坡",
      "SG",
      "Singapore",
      "SINGAPORE",
      "狮城",
      "沪新",
      "京新",
      "泉新",
      "穗新",
      "深新",
      "杭新",
      "广新",
      "廣新",
      "滬新",
    ],
    "🇺🇸": [
      "美国",
      "US",
      "USA",
      "America",
      "United States",
      "美",
      "京美",
      "波特兰",
      "达拉斯",
      "俄勒冈",
      "凤凰城",
      "费利蒙",
      "硅谷",
      "矽谷",
      "拉斯维加斯",
      "洛杉矶",
      "圣何塞",
      "圣荷西",
      "圣克拉拉",
      "西雅图",
      "芝加哥",
      "沪美",
      "哥伦布",
      "纽约",
    ],
    "🇹🇼": [
      "台湾",
      "TW",
      "Taiwan",
      "TAIWAN",
      "台北",
      "台中",
      "新北",
      "彰化",
      "CHT",
      "台",
      "HINET",
    ],
    "🇮🇩": ["印度尼西亚", "ID ", "IDN ", "Indonesia", "印尼", "雅加达"],
    "🇮🇪": ["爱尔兰", "Ireland", "IRELAND", "IE ", "愛爾蘭", "都柏林"],
    "🇮🇱": ["以色列", "Israel"],
    "🇮🇳": ["印度", "India", "IND", "INDIA", "孟买", "Mumbai", "IN "],
    "🇮🇸": ["冰岛", "IS", "ISL", "冰島", "Iceland"],
    "🇰🇵": ["KP", "朝鲜", "North Korea"],
    "🇰🇷": ["韩国", "KR", "Korea", "KOR", "首尔", "韩", "韓", "春川"],
    "🇬🇭": ["加纳", "Ghana"],
    "🇱🇺": ["卢森堡", "LU ", "Luxembourg"],
    "🇱🇻": ["拉脱维亚", "Latvia", "Latvija"],
    "🇧🇩": ["孟加拉", "Bengal"],
    "🇲🇽️": ["墨西哥", " MEX", "MX", "Mexico", "MEXICO"],
    "🇲🇾": [
      "马来西亚",
      " MY",
      "Malaysia",
      "MALAYSIA",
      "马来",
      "馬來",
      "大马",
      "大馬",
      "馬來西亞",
      "吉隆坡",
    ],
    "🇳🇱": ["荷兰", " NL", "Netherlands", "荷蘭", "尼德蘭", "阿姆斯特丹"],
    "🇵🇭": ["菲律宾", " PH", "Philippines", "菲律賓"],
    "🇷🇴": ["罗马尼亚", " RO ", "Rumania"],
    "🇸🇦": ["沙特", "利雅得", "Saudi Arabia", "Saudi"],
    "🇸🇪": ["瑞典", "SE", "Sweden"],
    "🇹🇭": ["泰国", " TH", "Thailand", "泰國", "曼谷"],
    "🇹🇷": ["土耳其", "TR ", "TR-", "TR_", "TUR", "Turkey", "伊斯坦布尔"],
    "🇻🇳": ["越南", "VN", "胡志明市", "Vietnam"],
    "🇮🇹": ["意大利", "Italy", " IT ", "Nachash", "米兰", "義大利"],
    "🇿🇦": ["南非", "South Africa", "Johannesburg"],
    "🇦🇪": ["阿联酋", "United Arab Emirates", "AE ", "迪拜", "Dubai"],
    "🇧🇷": ["巴西", "BR", "Brazil", "圣保罗"],
    "🇯🇵": [
      "日本",
      "JP",
      "Japan",
      "JAPAN",
      "东京",
      "大阪",
      "埼玉",
      "京日",
      "苏日",
      "沪日",
      "上日",
      "穗日",
      "川日",
      "中日",
      "泉日",
      "杭日",
      "深日",
      "辽日",
      "广日",
      "Tokyo",
    ],
    "🇦🇷": ["阿根廷", "AR", "Argentina"],
    "🇳🇴": ["挪威", "Norway", "NO"],
    "🇵🇱": ["波兰", " PL", "POL", "波蘭", "Poland"],
    "🇨🇱": ["智利", "Chile", "CHILE"],
    "🇳🇿": ["新西蘭", "新西兰", "New Zealand"],
    "🇬🇷": ["希腊", "希臘", "Greece"],
    "🇪🇬": ["埃及", "Egypt"],
    "🇮🇲": ["马恩岛", "馬恩島", "Isle of Man", "Mannin"],
    "🇵🇹": ["葡萄牙", "Portugal"],
    "🇲🇳": ["蒙古", "Mongolia"],
    "🇵🇪": ["秘鲁", "祕魯", "Peru"],
    "🇨🇴": ["哥伦比亚", "Colombia"],
    "🇪🇪": ["爱沙尼亚", "Estonia"],
    "🇱🇾": ["利比亚", "Libya"],
    "🇲🇰": ["马其顿", "馬其頓", "Macedonia"],
    "🇲🇹": ["马耳他", "Malta"],
    "🇻🇪": ["委内瑞拉", "Venezuela"],
    "🇧🇦": ["波黑共和国", "波黑", "Bosnia and Herzegovina"],
    "🇬🇪": ["格魯吉亞", "格鲁吉亚", "Georgia"],
    "🇦🇱": ["阿爾巴尼亞", "阿尔巴尼亚", "Albania"],
    "🇨🇾": ["塞浦路斯", "CY", "Cyprus"],
    "🇨🇷": ["哥斯达黎加", "Costa Rica"],
    "🇹🇳": ["突尼斯", "Tunisia"],
    "🇻🇦": ["梵蒂冈"],
    "🇷🇼": ["卢旺达"],
    "🇵🇦": ["巴拿马", "巴拿馬", "Panama"],
    "🇮🇷": ["伊朗", "Iran"],
    "🇯🇴": ["约旦", "約旦", "Jordan"],
    "🇺🇾": ["乌拉圭", "烏拉圭", "Uruguay"],
    "🇰🇪": ["肯尼亚", "肯尼亞", "Kenya"],
    "🇰🇬": ["吉尔吉斯坦", "吉尔吉斯斯坦", "Kyrghyzstan"],
    "🇳🇵": ["尼泊尔", "Nepal"],
    "🇽🇰": ["科索沃", "Kosovo"],
    "🇲🇦": ["摩洛哥", "Morocco"],
    "🇪🇨": ["厄瓜多尔", "EC", "Ecuador"],
    "🇲🇺": ["毛里求斯", "Mauritius"],
    "🇵🇷": ["波多黎各", "PR", "Puerto Rico"],
    "🇬🇹": ["危地马拉", " GT "],
    "🇭🇰": [
      "香港",
      "HK",
      "Hongkong",
      "Hong Kong",
      "HongKong",
      "HONG KONG",
      "深港",
      "沪港",
      "呼港",
      "HKT",
      "HKBN",
      "HGC",
      "WTT",
      "CMI",
      "穗港",
      "京港",
      "港",
    ],
    "🇨🇳": [
      "中国",
      "CN",
      "China",
      "回国",
      "中國",
      "江苏",
      "北京",
      "上海",
      "广州",
      "深圳",
      "杭州",
      "徐州",
      "青岛",
      "宁波",
      "镇江",
      "back",
    ],
    "🇱🇧": ["黎巴嫩", "LB", "Lebanon"],
    "🇧🇳": ["文莱", "BRN", "Negara Brunei Darussalam"],
    "🌏": ["亚洲", "Asia"],
  };
  for (let emoji in LEmoji) {
    if (LEmoji[emoji].includes(country)) {
      return emoji + country;
    }
  }
  return "🏳️‍🌈" + country;
}
function padToSixChineseChars(input, Length = 6) {
  const targetLength = Length;
  const paddingChar = "　";
  const currentLength = input.length;
  if (currentLength < targetLength) {
    const paddingLength = targetLength - currentLength;
    const paddedString = "" + paddingChar.repeat(paddingLength) + " ";
    return paddedString;
  }
  return " ";
}
const $ = new Env("XiaoMaoParisOlympicGames");

let url =
  "https://tiyu.baidu.com/al/major/home?page=home&match=2024%E5%B9%B4%E5%B7%B4%E9%BB%8E%E5%A5%A5%E8%BF%90%E4%BC%9A&tab=%E5%A5%96%E7%89%8C%E6%A6%9C&&tab_type=single&request__node__params=1";
// 核心函数
let option = {
  url: url,
  method: "GET",
};

let option2 = {
  url: "https://tiyu.baidu.com/al/major/home?match=2024%E5%B9%B4%E5%B7%B4%E9%BB%8E%E5%A5%A5%E8%BF%90%E4%BC%9A&tab=%E8%B5%9B%E7%A8%8B&&async_source=h5&tab_type=single&from=baidu_shoubai_na&request__node__params=1&getAll=1",
  method: "GET",
};

let option3 = {
  url: "https://gw.m.163.com/newsapp-olympic/api/v1/medal/country?country=29",
  method: "GET",
};

$.get(option, (error1, resp1, res) => {
  let response = JSON.parse(res);
  if (response && response?.tplData?.data?.header) {
    let resHeader = response.tplData.data.header;
    let resTabsList = response.tplData.data.tabsList[0].data.medalList[0];
    let notifyTitle = "🇫🇷巴黎奥运会";
    let notifySubtitle = "🏟️" + response.tplData.data.shareInfo.abstract;

    let notifyContent =
      `「${getEmojiByCountry(resHeader.rankInfo.country)}」「${
        resHeader.rankInfo.rank
      }」「🥇${resHeader.medalInfo.gold}」「🥈${
        resHeader.medalInfo.silver
      }」「🥉${resHeader.medalInfo.bronze}」「🏅${
        parseInt(resHeader.medalInfo.gold) +
        parseInt(resHeader.medalInfo.silver) +
        parseInt(resHeader.medalInfo.bronze)
      }」` +
      "\n\n" +
      "🎖️2024巴黎奥运会-奖牌榜" +
      "\n\n";
    if (resTabsList && resTabsList.length) {
      resTabsList.map((el) => {
        notifyContent =
          notifyContent +
          `「${
            getEmojiByCountry(el.countryName) +
            "」" +
            padToSixChineseChars(el.countryName)
          }「第${String(el.rank).padStart(2, " ")}名」「🥇${String(
            el.gold
          ).padStart(2, " ")}」「🥈${String(el.silver).padStart(
            2,
            " "
          )}」「🥉${String(el.bronze).padStart(2, " ")}」「🏅${String(
            el.total
          ).padStart(2, " ")}」` +
          "\n";
      });
    }

    let listCountry = "\n\n" + "🎖️2024巴黎奥运会-中国榜" + "\n\n";

    try {
      $.get(option3, (error2, resp2, res2) => {
        let response2 = JSON.parse(res2);
        if (response2 && response2?.data?.medalList?.length) {
          let list = response2.data.medalList;
          if (list.length) {
            list.map((el) => {
              listCountry =
                listCountry +
                `「${
                  el.disciplineName +
                  "」" +
                  padToSixChineseChars(el.disciplineName, 8)
                }「第${String(el.rank).padStart(2, " ")}名」「🥇${String(
                  el.gold
                ).padStart(2, " ")}」「🥈${String(el.silver).padStart(
                  2,
                  " "
                )}」「🥉${String(el.bronze).padStart(2, " ")}」「🏅${String(
                  el.total
                ).padStart(2, " ")}」` +
                "\n";
            });
          }
          getListContent();
        }
      });
    } catch (error) {
      getListContent();
    }

    function getListContent() {
      let listContent =
        listCountry + "\n\n" + "🆚2024巴黎奥运会-进行中赛程" + "\n\n";
      try {
        $.get(option2, (error2, resp2, res2) => {
          let response2 = JSON.parse(res2);
          if (response2 && response2?.tplData?.data?.tabsList) {
            let list =
              response2.tplData.data.tabsList[0].dateList[0].scheduleList.filter(
                (el) => el.eventStatusId == "1"
              );
            if (list.length) {
              list.map((el) => {
                listContent =
                  listContent +
                  `[${el.startTime}]「${el.matchName}」(${el.participant})` +
                  "\n" +
                  el.desc +
                  "\n\n";
              });
            }

            $.log(notifyContent + listContent);
            $.notify(notifyTitle, notifySubtitle, notifyContent + listContent);
            $done({});
          }
        });
      } catch (error) {
        $.log(notifyContent);
        $.notify(notifyTitle, notifySubtitle, notifyContent + listContent);
        $done({});
      }
    }
  } else {
    getError("5001");
  }
});

setTimeout(() => {
  $done({});
}, 8000);
function getError(err) {
  $.notify(
    "🇫🇷XiaoMao_巴黎奥运会❗️",
    "",
    "🚧系统错误，请稍后再试❗️" + err,
    "https://i.pixiv.re/img-original/img/2020/10/14/16/34/51/85008145_p0.jpg"
  );
  $done({});
}
