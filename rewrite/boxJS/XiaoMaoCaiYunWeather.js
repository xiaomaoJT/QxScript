/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-01-13
 *
 * 
彩/云/天/气/S/v/i/p
仅供学习参考，请于下载后24小时内删除

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：
1、使用BoxJS增加以下脚本订阅。
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMao.json

2、通过boxjs设置天气svip到期时间
【一二此步骤可省略，会员到期时间永远定格明天，失效请重开app】

3、QX > 右下角风车 > 重写 > 规则资源 > 引用以下脚本 > 打开资源解析器
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoCaiYunWeather.js

********************************

[mitm]
hostname = biz.caiyunapp.com

[rewrite_local]
https?:\/\/biz\.caiyunapp\.com\/(membership_rights|v2\/user) url script-response-body https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoCaiYunWeather.js

 ***************/

var SCRIPT_NAME = "彩云天气";
var USER_REGEX = /https?:\/\/biz\.caiyunapp\.com\/v2\/user/;
var RIGHTS_REGEX = /https?:\/\/biz\.caiyunapp\.com\/membership_rights/;
var RESULT,
  RESULT_WT = {};
var $XiaoMaoSvip = "";
var appName = `XiaoMao-彩云天气Svip`;
var XiaoMaoSvip = "";
var RIGHTS = {
  result: [
    {
      name: "\u514d\u5e7f\u544a",
      enabled: true,
      vip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/vip-ads-free.png",
      vip: true,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee08f",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-ads-free.png",
    },
    {
      name: "\u591a\u5730\u5929\u6c14\u63a8\u9001",
      enabled: true,
      vip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/vip-custom-push.png",
      vip: true,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee090",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-custom-push.png",
    },
    {
      name: "\u964d\u6c34\u63d0\u9192",
      enabled: true,
      vip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/vip-rain-notification.png",
      vip: true,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee091",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-rain-notification.png",
    },
    {
      name: "\u536b\u661f\u4e91\u56fe",
      enabled: true,
      vip_icon: null,
      vip: false,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee092",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-satellite-clouds.png",
    },
    {
      name: "\u4e91\u91cf",
      enabled: true,
      vip_icon: null,
      vip: false,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee093",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-cloud-cover.png",
    },
    {
      name: "\u6c14\u6e29\u9884\u62a5",
      enabled: true,
      vip_icon: null,
      vip: false,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee094",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-tmp-forecast.png",
    },
    {
      name: "\u9732\u70b9\u6e29\u5ea6\u9884\u62a5",
      enabled: true,
      vip_icon: null,
      vip: false,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee095",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-dew-point-tmp-forecast.png",
    },
    {
      name: "\u77ed\u6ce2\u8f90\u5c04\u901a\u91cf",
      enabled: true,
      vip_icon: null,
      vip: false,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee096",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-short-wave-radiation.png",
    },
    {
      name: "\u6c14\u538b",
      enabled: true,
      vip_icon: null,
      vip: false,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee097",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-pressure.png",
    },
    {
      name: "\u80fd\u89c1\u5ea6",
      enabled: true,
      vip_icon: null,
      vip: false,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee098",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-visibility.png",
    },
    {
      name: "\u6e7f\u5ea6\u9884\u62a5",
      enabled: true,
      vip_icon: null,
      vip: false,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee099",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-humidity-forecast.png",
    },
    {
      name: "2\u5929\u964d\u96e8\u9884\u62a5\u56fe",
      enabled: true,
      vip_icon: null,
      vip: false,
      svip: true,
      _id: "5ee5eb091d28d2634a2ee09a",
      svip_icon:
        "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-rain-forecast.png",
    },
  ],
  rc: 0,
};
var magicJS = null;
let SvipDate = "";

!(async () => {
  await XiaoMaoFunction();
})()
  .catch((err) => {
    $XiaoMaoSvip.error(err);
    setTimeout(() => {
      $XiaoMaoSvip.done();
    }, 3000);
  })
  .finally(() => {
    console.log(appName + "设置成功");
    magicJS = MagicJS(SCRIPT_NAME);
    Main();
    setTimeout(() => {
      $XiaoMaoSvip.done();
    }, 5000);
  });

function Main() {
  if (magicJS.isResponse) {
    if (USER_REGEX.test(magicJS.request.url)) {
      try {
        let obj = JSON.parse(magicJS.response.body);
        Object.assign(obj["result"], RESULT);
        Object.assign(obj["result"]["wt"], RESULT_WT);
        let body = JSON.stringify(obj);
        magicJS.done({ body });
      } catch (err) {
        magicJS.log(`解锁SVIP失败，异常信息${err}`);
        magicJS.done();
      }
    }
    if (RIGHTS_REGEX.test(magicJS.request.url)) {
      let body = JSON.stringify(RIGHTS);
      magicJS.done({ body });
    }
  }
}

function getGoneDay(n = 0, yearFlag = true) {
  let myDate = new Date();
  myDate.setDate(myDate.getDate() - n);
  let month = myDate.getMonth() + 1;
  let day = myDate.getDate();
  let result =
    "" +
    (yearFlag ? myDate.getFullYear() : "") +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    (day < 10 ? "0" + day : day);
  return result;
}

function XiaoMaoFunction(){$XiaoMaoSvip=API("XiaoMao");if($XiaoMaoSvip.read("CaiYunSvipYear")&&$XiaoMaoSvip.read("CaiYunSvipMonth")&&$XiaoMaoSvip.read("CaiYunSvipDay")){SvipDate=new Date($XiaoMaoSvip.read("CaiYunSvipYear")+"/"+$XiaoMaoSvip.read("CaiYunSvipMonth")+"/"+$XiaoMaoSvip.read("CaiYunSvipDay")).getTime();if(!SvipDate){$XiaoMaoSvip.notify(appName,"","会员日期设置错误，请输入正确的日期范围!");XiaoMaoSvip=getGoneDay(-1)}else{XiaoMaoSvip=$XiaoMaoSvip.read("CaiYunSvipYear")+"/"+$XiaoMaoSvip.read("CaiYunSvipMonth")+"/"+$XiaoMaoSvip.read("CaiYunSvipDay")}}else{XiaoMaoSvip=getGoneDay(-1)}RESULT={is_vip:true,vip_type:"s",svip_expired_at:new Date(XiaoMaoSvip).getTime()/1000,};RESULT_WT={vip:{enable:true,svip_expired_at:new Date(XiaoMaoSvip).getTime()/1000,},}}

function MagicJS(scriptName = "MagicJS", logLevel = "INFO") {
  return new (class {
    constructor() {
      this.scriptName = scriptName;
      this.logLevel = this.getLogLevels(logLevel.toUpperCase());
      this.node = { request: undefined, fs: undefined, data: {} };
      if (this.isNode) {
        this.node.fs = require("fs");
        this.node.request = require("request");
        try {
          this.node.fs.accessSync("./magic.json");
        } catch (err) {
          this.logError(err);
          this.node.fs.writeFileSync("./magic.json", "{}");
        }
        this.node.data = require("./magic.json");
      }
      if (this.isJSBox) {
        if (!$file.exists("drive://MagicJS")) {
          $file.mkdir("drive://MagicJS");
        }
        if (!$file.exists("drive://MagicJS/magic.json")) {
          $file.write({
            data: $data({ string: "{}" }),
            path: "drive://MagicJS/magic.json",
          });
        }
      }
    }

    get version() {
      return "v2.1.4";
    }

    get isSurge() {
      return typeof $httpClient !== "undefined" && !this.isLoon;
    }

    get isQuanX() {
      return typeof $task !== "undefined";
    }

    get isLoon() {
      return typeof $loon !== "undefined";
    }

    get isJSBox() {
      return typeof $drive !== "undefined";
    }

    get isNode() {
      return typeof module !== "undefined" && !this.isJSBox;
    }

    get isRequest() {
      return (
        typeof $request !== "undefined" && typeof $response === "undefined"
      );
    }

    get isResponse() {
      return typeof $response !== "undefined";
    }

    get request() {
      return typeof $request !== "undefined" ? $request : undefined;
    }

    get response() {
      if (typeof $response !== "undefined") {
        if ($response.hasOwnProperty("status"))
          $response["statusCode"] = $response["status"];
        if ($response.hasOwnProperty("statusCode"))
          $response["status"] = $response["statusCode"];
        return $response;
      } else {
        return undefined;
      }
    }

    get logLevels() {
      return {
        DEBUG: 4,
        INFO: 3,
        WARNING: 2,
        ERROR: 1,
        CRITICAL: 0,
      };
    }

    getLogLevels(level) {
      try {
        if (this.isNumber(level)) {
          return level;
        } else {
          let levelNum = this.logLevels[level];
          if (typeof levelNum === "undefined") {
            this.logError(
              `获取MagicJS日志级别错误，已强制设置为DEBUG级别。传入日志级别：${level}。`
            );
            return this.logLevels.DEBUG;
          } else {
            return levelNum;
          }
        }
      } catch (err) {
        this.logError(
          `获取MagicJS日志级别错误，已强制设置为DEBUG级别。传入日志级别：${level}，异常信息：${err}。`
        );
        return this.logLevels.DEBUG;
      }
    }

    read(key, session = "") {
      let val = "";
      // 读取原始数据
      if (this.isSurge || this.isLoon) {
        val = $persistentStore.read(key);
      } else if (this.isQuanX) {
        val = $prefs.valueForKey(key);
      } else if (this.isNode) {
        val = this.node.data;
      } else if (this.isJSBox) {
        val = $file.read("drive://MagicJS/magic.json").string;
      }
      try {
        // Node 和 JSBox数据处理
        if (this.isNode) val = val[key];
        if (this.isJSBox) val = JSON.parse(val)[key];
        // 带Session的情况
        if (!!session) {
          if (typeof val === "string") val = JSON.parse(val);
          val = !!val && typeof val === "object" ? val[session] : null;
        }
      } catch (err) {
        this.logError(`raise exception: ${err}`);
        val = !!session ? {} : null;
        this.del(key);
      }
      if (typeof val === "undefined") val = null;
      try {
        if (!!val && typeof val === "string") val = JSON.parse(val);
      } catch (err) {}
      this.logDebug(
        `read data [${key}]${
          !!session ? `[${session}]` : ""
        }(${typeof val})\n${JSON.stringify(val)}`
      );
      return val;
    }

    write(key, val, session = "") {
      let data = !!session ? {} : "";
      // 读取原先存储的JSON格式数据
      if (!!session && (this.isSurge || this.isLoon)) {
        data = $persistentStore.read(key);
      } else if (!!session && this.isQuanX) {
        data = $prefs.valueForKey(key);
      } else if (this.isNode) {
        data = this.node.data;
      } else if (this.isJSBox) {
        data = JSON.parse($file.read("drive://MagicJS/magic.json").string);
      }
      if (!!session) {
        // 有Session，要求所有数据都是Object
        try {
          if (typeof data === "string") data = JSON.parse(data);
          data = typeof data === "object" && !!data ? data : {};
        } catch (err) {
          this.logError(`raise exception: ${err}`);
          this.del(key);
          data = {};
        }
        if (this.isJSBox || this.isNode) {
          // 构造数据
          if (!data.hasOwnProperty(key) || typeof data[key] != "object") {
            data[key] = {};
          }
          if (!data[key].hasOwnProperty(session)) {
            data[key][session] = null;
          }
          // 写入或删除数据
          if (typeof val === "undefined") {
            delete data[key][session];
          } else {
            data[key][session] = val;
          }
        } else {
          // 写入或删除数据
          if (typeof val === "undefined") {
            delete data[session];
          } else {
            data[session] = val;
          }
        }
      }
      // 没有Session时
      else {
        if (this.isNode || this.isJSBox) {
          // 删除数据
          if (typeof val === "undefined") {
            delete data[key];
          } else {
            data[key] = val;
          }
        } else {
          // 删除数据
          if (typeof val === "undefined") {
            data = null;
          } else {
            data = val;
          }
        }
      }
      // 数据回写
      if (typeof data === "object") data = JSON.stringify(data);
      if (this.isSurge || this.isLoon) {
        $persistentStore.write(data, key);
      } else if (this.isQuanX) {
        $prefs.setValueForKey(data, key);
      } else if (this.isNode) {
        this.node.fs.writeFileSync("./magic.json", data);
      } else if (this.isJSBox) {
        $file.write({
          data: $data({ string: data }),
          path: "drive://MagicJS/magic.json",
        });
      }
      this.logDebug(
        `write data [${key}]${
          !!session ? `[${session}]` : ""
        }(${typeof val})\n${JSON.stringify(val)}`
      );
    }

    del(key, session = "") {
      this.logDebug(`delete key [${key}]${!!session ? `[${session}]` : ""}`);
      this.write(key, undefined, session);
    }

    /**
     * iOS系统通知
     * @param {*} title 通知标题
     * @param {*} subTitle 通知副标题
     * @param {*} body 通知内容
     * @param {*} options 通知选项，目前支持传入超链接或Object
     * Surge不支持通知选项，Loon仅支持打开URL，QuantumultX支持打开URL和多媒体通知
     * options "applestore://" 打开Apple Store
     * options "https://www.apple.com.cn/" 打开Apple.com.cn
     * options {'open-url': 'https://www.apple.com.cn/'} 打开Apple.com.cn
     * options {'open-url': 'https://www.apple.com.cn/', 'media-url': 'https://raw.githubusercontent.com/Orz-3/mini/master/Apple.png'} 打开Apple.com.cn，显示一个苹果Logo
     */
    notify(title = this.scriptName, subTitle = "", body = "", options = "") {
      let convertOptions = (_options) => {
        let newOptions = "";
        if (typeof _options === "string") {
          if (this.isLoon) newOptions = _options;
          else if (this.isQuanX) newOptions = { "open-url": _options };
        } else if (typeof _options === "object") {
          if (this.isLoon)
            newOptions = !!_options["open-url"] ? _options["open-url"] : "";
          else if (this.isQuanX)
            newOptions =
              !!_options["open-url"] || !!_options["media-url"] ? _options : {};
        }
        return newOptions;
      };
      options = convertOptions(options);
      // 支持单个参数通知
      if (arguments.length == 1) {
        title = this.scriptName;
        (subTitle = ""), (body = arguments[0]);
      }
      if (this.isSurge) {
        $notification.post(title, subTitle, body);
      } else if (this.isLoon) {
        // 2020.08.11 Loon2.1.3(194)TF 如果不加这个log，在跑测试用例连续6次通知，会漏掉一些通知，已反馈给作者。
        this.logInfo(
          `title: ${title}, subTitle：${subTitle}, body：${body}, options：${options}`
        );
        if (!!options) $notification.post(title, subTitle, body, options);
        else $notification.post(title, subTitle, body);
      } else if (this.isQuanX) {
        $notify(title, subTitle, body, options);
      } else if (this.isNode) {
        this.log(`${title} ${subTitle}\n${body}`);
      } else if (this.isJSBox) {
        let push = {
          title: title,
          body: !!subTitle ? `${subTitle}\n${body}` : body,
        };
        $push.schedule(push);
      }
    }

    log(msg, level = "INFO") {
      if (this.logLevel >= this.getLogLevels(level.toUpperCase()))
        console.log(`[${level}] [${this.scriptName}]\n${msg}\n`);
    }

    logDebug(msg) {
      this.log(msg, "DEBUG");
    }

    logInfo(msg) {
      this.log(msg, "INFO");
    }

    logWarning(msg) {
      this.log(msg, "WARNING");
    }

    logError(msg) {
      this.log(msg, "ERROR");
    }

    get(options, callback) {
      let _options =
        typeof options === "object" ? Object.assign({}, options) : options;
      this.logDebug(`http get: ${JSON.stringify(_options)}`);
      if (this.isSurge || this.isLoon) {
        $httpClient.get(_options, callback);
      } else if (this.isQuanX) {
        if (typeof _options === "string") _options = { url: _options };
        _options["method"] = "GET";
        $task.fetch(_options).then(
          (resp) => {
            resp["status"] = resp.statusCode;
            callback(null, resp, resp.body);
          },
          (reason) => callback(reason.error, null, null)
        );
      } else if (this.isNode) {
        return this.node.request.get(_options, callback);
      } else if (this.isJSBox) {
        _options = typeof _options === "string" ? { url: _options } : _options;
        options["header"] = _options["headers"];
        delete _options["headers"];
        _options["handler"] = (resp) => {
          let err = resp.error ? JSON.stringify(resp.error) : undefined;
          let data =
            typeof resp.data === "object"
              ? JSON.stringify(resp.data)
              : resp.data;
          callback(err, resp.response, data);
        };
        $http.get(_options);
      }
    }

    post(options, callback) {
      let _options =
        typeof options === "object" ? Object.assign({}, options) : options;
      this.logDebug(`http post: ${JSON.stringify(_options)}`);
      if (this.isSurge || this.isLoon) {
        $httpClient.post(_options, callback);
      } else if (this.isQuanX) {
        if (typeof _options === "string") _options = { url: _options };
        if (
          _options.hasOwnProperty("body") &&
          typeof _options["body"] !== "string"
        )
          _options["body"] = JSON.stringify(_options["body"]);
        _options["method"] = "POST";
        $task.fetch(_options).then(
          (resp) => {
            resp["status"] = resp.statusCode;
            callback(null, resp, resp.body);
          },
          (reason) => {
            callback(reason.error, null, null);
          }
        );
      } else if (this.isNode) {
        if (typeof _options.body === "object")
          _options.body = JSON.stringify(_options.body);
        return this.node.request.post(_options, callback);
      } else if (this.isJSBox) {
        _options = typeof _options === "string" ? { url: _options } : _options;
        _options["header"] = _options["headers"];
        delete _options["headers"];
        _options["handler"] = (resp) => {
          let err = resp.error ? JSON.stringify(resp.error) : undefined;
          let data =
            typeof resp.data === "object"
              ? JSON.stringify(resp.data)
              : resp.data;
          callback(err, resp.response, data);
        };
        $http.post(_options);
      }
    }

    done(value = {}) {
      if (typeof $done !== "undefined") {
        $done(value);
      }
    }

    isToday(day) {
      if (day == null) {
        return false;
      } else {
        let today = new Date();
        if (typeof day == "string") {
          day = new Date(day);
        }
        if (
          today.getFullYear() == day.getFullYear() &&
          today.getMonth() == day.getMonth() &&
          today.getDay() == day.getDay()
        ) {
          return true;
        } else {
          return false;
        }
      }
    }

    isNumber(val) {
      return parseFloat(val).toString() === "NaN" ? false : true;
    }

    /**
     * 对await执行中出现的异常进行捕获并返回，避免写过多的try catch语句
     * @param {*} promise Promise 对象
     * @param {*} defaultValue 出现异常时返回的默认值
     * @returns 返回两个值，第一个值为异常，第二个值为执行结果
     */
    attempt(promise, defaultValue = null) {
      return promise
        .then((args) => {
          return [null, args];
        })
        .catch((ex) => {
          this.log("raise exception:" + ex);
          return [ex, defaultValue];
        });
    }

    /**
     * 重试方法
     * @param {*} fn 需要重试的函数
     * @param {number} [retries=5] 重试次数
     * @param {number} [interval=0] 每次重试间隔
     * @param {function} [callback=null] 函数没有异常时的回调，会将函数执行结果result传入callback，根据result的值进行判断，如果需要再次重试，在callback中throw一个异常，适用于函数本身没有异常但仍需重试的情况。
     * @returns 返回一个Promise对象
     */
    retry(fn, retries = 5, interval = 0, callback = null) {
      return (...args) => {
        return new Promise((resolve, reject) => {
          function _retry(...args) {
            Promise.resolve()
              .then(() => fn.apply(this, args))
              .then((result) => {
                if (typeof callback === "function") {
                  Promise.resolve()
                    .then(() => callback(result))
                    .then(() => {
                      resolve(result);
                    })
                    .catch((ex) => {
                      if (retries >= 1 && interval > 0) {
                        setTimeout(() => _retry.apply(this, args), interval);
                      } else if (retries >= 1) {
                        _retry.apply(this, args);
                      } else {
                        reject(ex);
                      }
                      retries--;
                    });
                } else {
                  resolve(result);
                }
              })
              .catch((ex) => {
                if (retries >= 1 && interval > 0) {
                  setTimeout(() => _retry.apply(this, args), interval);
                } else if (retries >= 1) {
                  _retry.apply(this, args);
                } else {
                  reject(ex);
                }
                retries--;
              });
          }

          _retry.apply(this, args);
        });
      };
    }

    formatTime(time, fmt = "yyyy-MM-dd hh:mm:ss") {
      var o = {
        "M+": time.getMonth() + 1,
        "d+": time.getDate(),
        "h+": time.getHours(),
        "m+": time.getMinutes(),
        "s+": time.getSeconds(),
        "q+": Math.floor((time.getMonth() + 3) / 3),
        S: time.getMilliseconds(),
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (time.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    }

    now() {
      return this.formatTime(new Date(), "yyyy-MM-dd hh:mm:ss");
    }

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }
  })(scriptName);
}

function ENV() {
  const e = "function" == typeof require && "undefined" != typeof $jsbox;
  return {
    isQX: "undefined" != typeof $task,
    isLoon: "undefined" != typeof $loon,
    isSurge: "undefined" != typeof $httpClient && "undefined" == typeof $loon,
    isBrowser: "undefined" != typeof document,
    isNode: "function" == typeof require && !e,
    isJSBox: e,
    isRequest: "undefined" != typeof $request,
    isScriptable: "undefined" != typeof importModule,
  };
}
function HTTP(e = { baseURL: "" }) {
  function t(t, a) {
    a = "string" == typeof a ? { url: a } : a;
    const h = e.baseURL;
    h && !d.test(a.url || "") && (a.url = h ? h + a.url : a.url),
      a.body &&
        a.headers &&
        !a.headers["Content-Type"] &&
        (a.headers["Content-Type"] = "application/x-www-form-urlencoded"),
      (a = { ...e, ...a });
    const c = a.timeout,
      l = {
        onRequest: () => {},
        onResponse: (e) => e,
        onTimeout: () => {},
        ...a.events,
      };
    let f, y;
    if ((l.onRequest(t, a), s)) f = $task.fetch({ method: t, ...a });
    else if (o || n)
      f = new Promise((e, s) => {
        $httpClient[t.toLowerCase()](a, (t, o, n) => {
          t
            ? s(t)
            : e({
                statusCode: o.status || o.statusCode,
                headers: o.headers,
                body: n,
              });
        });
      });
    else if (r) {
      const e = require("got"),
        s = require("iconv-lite");
      f = new Promise((o, n) => {
        e[t.toLowerCase()](a)
          .then((e) =>
            o({
              statusCode: e.statusCode,
              headers: e.headers,
              body: s.decode(e.rawBody, "utf-8"),
            })
          )
          .catch(n);
      });
    } else if (i) {
      const e = new Request(a.url);
      (e.method = t),
        (e.headers = a.headers),
        (e.body = a.body),
        (f = new Promise((t, s) => {
          e.loadString()
            .then((s) => {
              t({
                statusCode: e.response.statusCode,
                headers: e.response.headers,
                body: s,
              });
            })
            .catch((e) => s(e));
        }));
    } else
      u &&
        (f = new Promise((e, s) => {
          fetch(a.url, { method: t, headers: a.headers, body: a.body })
            .then((e) => e.json())
            .then((t) =>
              e({ statusCode: t.status, headers: t.headers, body: t.data })
            )
            .catch(s);
        }));
    const p = c
      ? new Promise((e, s) => {
          y = setTimeout(
            () => (
              l.onTimeout(), s(`${t} URL: ${a.url} exceeds the timeout ${c} ms`)
            ),
            c
          );
        })
      : null;
    return (
      p ? Promise.race([p, f]).then((e) => (clearTimeout(y), e)) : f
    ).then((e) => l.onResponse(e));
  }
  const {
      isQX: s,
      isLoon: o,
      isSurge: n,
      isScriptable: i,
      isNode: r,
      isBrowser: u,
    } = ENV(),
    a = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    d =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    h = {};
  return a.forEach((e) => (h[e.toLowerCase()] = (s) => t(e, s))), h;
}
function API(e = "untitled", t = !1) {
  const {
    isQX: s,
    isLoon: o,
    isSurge: n,
    isNode: i,
    isJSBox: r,
    isScriptable: u,
  } = ENV();
  return new (class {
    constructor(e, t) {
      (this.name = e),
        (this.debug = t),
        (this.http = HTTP()),
        (this.env = ENV()),
        (this.node = (() => {
          if (i) {
            const e = require("fs");
            return { fs: e };
          }
          return null;
        })()),
        this.initCache();
      const s = (e, t) =>
        new Promise(function (s) {
          setTimeout(s.bind(null, t), e);
        });
      Promise.prototype.delay = function (e) {
        return this.then(function (t) {
          return s(e, t);
        });
      };
    }
    initCache() {
      if (
        (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")),
        (o || n) &&
          (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")),
        i)
      ) {
        let e = "root.json";
        this.node.fs.existsSync(e) ||
          this.node.fs.writeFileSync(
            e,
            JSON.stringify({}),
            { flag: "wx" },
            (e) => console.log(e)
          ),
          (this.root = {}),
          (e = `${this.name}.json`),
          this.node.fs.existsSync(e)
            ? (this.cache = JSON.parse(
                this.node.fs.readFileSync(`${this.name}.json`)
              ))
            : (this.node.fs.writeFileSync(
                e,
                JSON.stringify({}),
                { flag: "wx" },
                (e) => console.log(e)
              ),
              (this.cache = {}));
      }
    }
    persistCache() {
      const e = JSON.stringify(this.cache, null, 2);
      s && $prefs.setValueForKey(e, this.name),
        (o || n) && $persistentStore.write(e, this.name),
        i &&
          (this.node.fs.writeFileSync(
            `${this.name}.json`,
            e,
            { flag: "w" },
            (e) => console.log(e)
          ),
          this.node.fs.writeFileSync(
            "root.json",
            JSON.stringify(this.root, null, 2),
            { flag: "w" },
            (e) => console.log(e)
          ));
    }
    write(e, t) {
      if ((this.log(`SET ${t}`), -1 !== t.indexOf("#"))) {
        if (((t = t.substr(1)), n || o)) return $persistentStore.write(e, t);
        if (s) return $prefs.setValueForKey(e, t);
        i && (this.root[t] = e);
      } else this.cache[t] = e;
      this.persistCache();
    }
    read(e) {
      return (
        this.log(`READ ${e}`),
        -1 === e.indexOf("#")
          ? this.cache[e]
          : ((e = e.substr(1)),
            n || o
              ? $persistentStore.read(e)
              : s
              ? $prefs.valueForKey(e)
              : i
              ? this.root[e]
              : void 0)
      );
    }
    delete(e) {
      if ((this.log(`DELETE ${e}`), -1 !== e.indexOf("#"))) {
        if (((e = e.substr(1)), n || o)) return $persistentStore.write(null, e);
        if (s) return $prefs.removeValueForKey(e);
        i && delete this.root[e];
      } else delete this.cache[e];
      this.persistCache();
    }
    notify(e, t = "", a = "", d = {}) {
      const h = d["open-url"],
        c = d["media-url"];
      if (
        (s && $notify(e, t, a, d),
        n &&
          $notification.post(e, t, a + `${c ? "\n多媒体:" + c : ""}`, {
            url: h,
          }),
        o)
      ) {
        let s = {};
        h && (s.openUrl = h),
          c && (s.mediaUrl = c),
          "{}" === JSON.stringify(s)
            ? $notification.post(e, t, a)
            : $notification.post(e, t, a, s);
      }
      if (i || u) {
        const s =
          a + (h ? `\n点击跳转: ${h}` : "") + (c ? `\n多媒体: ${c}` : "");
        if (r) {
          const o = require("push");
          o.schedule({ title: e, body: (t ? t + "\n" : "") + s });
        } else console.log(`${e}\n${t}\n${s}\n\n`);
      }
    }
    log(e) {
      this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`);
    }
    info(e) {
      console.log(`[${this.name}] INFO: ${this.stringify(e)}`);
    }
    error(e) {
      console.log(`[${this.name}] ERROR: ${this.stringify(e)}`);
    }
    wait(e) {
      return new Promise((t) => setTimeout(t, e));
    }
    done(e = {}) {
      s || o || n
        ? $done(e)
        : i &&
          !r &&
          "undefined" != typeof $context &&
          (($context.headers = e.headers),
          ($context.statusCode = e.statusCode),
          ($context.body = e.body));
    }
    stringify(e) {
      if ("string" == typeof e || e instanceof String) return e;
      try {
        return JSON.stringify(e, null, 2);
      } catch (e) {
        return "[object Object]";
      }
    }
  })(e, t);
}
