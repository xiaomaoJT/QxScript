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
              l.onTimeout(), s(`${t}URL:${a.url}exceeds the timeout ${c}ms`)
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
        const s = a + (h ? `\n点击跳转:${h}` : "") + (c ? `\n多媒体:${c}` : "");
        if (r) {
          const o = require("push");
          o.schedule({ title: e, body: (t ? t + "\n" : "") + s });
        } else console.log(`${e}\n${t}\n${s}\n\n`);
      }
    }
    log(e) {
      this.debug && console.log(`[${this.name}]LOG:${this.stringify(e)}`);
    }
    info(e) {
      console.log(`[${this.name}]INFO:${this.stringify(e)}`);
    }
    error(e) {
      console.log(`[${this.name}]ERROR:${this.stringify(e)}`);
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
var obj = JSON.parse($response.body);
var $XiaoMaoSvip = "";
var appName = `XiaoMao-ALiCloudvip`;
var XiaoMaoSvip = "";
let XiaoMaoEndTime = null;
let ALiCloudSpace = 0;
let ALiCloudIcon = 0;
let AliLink = 0;
let ALiCloudDistinct = 1;
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
    setTimeout(() => {
      $XiaoMaoSvip.done();
    }, 5000);
  });

  function XiaoMaoFunction(){$XiaoMaoSvip=API("XiaoMao");if($XiaoMaoSvip.read("ALiCloudVipYear")&&$XiaoMaoSvip.read("ALiCloudVipMonth")&&$XiaoMaoSvip.read("ALiCloudVipDay")){SvipDate=new Date($XiaoMaoSvip.read("ALiCloudVipYear")+"/"+$XiaoMaoSvip.read("ALiCloudVipMonth")+"/"+$XiaoMaoSvip.read("ALiCloudVipDay")).getTime();if(!SvipDate){$XiaoMaoSvip.notify(appName,"","会员日期设置错误，请输入正确的日期范围!");XiaoMaoSvip=getGoneDay(-7)}else{XiaoMaoSvip=$XiaoMaoSvip.read("ALiCloudVipYear")+"/"+$XiaoMaoSvip.read("ALiCloudVipMonth")+"/"+$XiaoMaoSvip.read("ALiCloudVipDay")}}else{XiaoMaoSvip=getGoneDay(-7)}if($XiaoMaoSvip.read("ALiCloudSpace")){ALiCloudSpace=parseInt(parseInt($XiaoMaoSvip.read("ALiCloudSpace"))*1024*1024*1024*1024)}if($XiaoMaoSvip.read("ALiCloudIcon")){ALiCloudIcon=parseInt($XiaoMaoSvip.read("ALiCloudIcon"))}if($XiaoMaoSvip.read("ALiCloudDistinct")){ALiCloudDistinct=parseInt($XiaoMaoSvip.read("ALiCloudDistinct"))}if($XiaoMaoSvip.read("ALiCloudLink")){AliLink=parseInt($XiaoMaoSvip.read("ALiCloudLink"))?1:0}XiaoMaoEndTime=new Date(XiaoMaoSvip).getTime()/1000}if($response.body){let requestUrl=$request.url;if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/apps\/v1\/users\/apps\/welcome?/.test(requestUrl)){obj.hasOwnProperty("description")?(obj.description="XiaoMao"):""}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/v2\/databox\/get_personal_info?/.test(requestUrl)){let privileges=[{feature_id:"download",feature_attr_id:"speed_limit",quota:-1},{feature_id:"drive",feature_attr_id:"size_limit",quota:107374182400,},{feature_id:"safe_box",feature_attr_id:"size_limit",quota:53687091200,},{feature_id:"upload",feature_attr_id:"size_limit",quota:2199023255552,},{feature_id:"video",feature_attr_id:"backup",quota:1},{feature_id:"video",feature_attr_id:"clarity_limit",quota:3},];obj.hasOwnProperty("personal_rights_info")?((obj.personal_rights_info.is_expires=false),(obj.personal_rights_info.privileges=privileges),(obj.personal_rights_info.spu_id="svip"),(obj.personal_rights_info.name="超级会员")):"";obj.hasOwnProperty("personal_space_info")&&ALiCloudSpace!=0?(obj.personal_space_info.total_size=ALiCloudSpace):""}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1.0\/users\/vip\/info?/.test(requestUrl)){let vipList=[{code:"svip",promotedAt:1660233280,expire:XiaoMaoEndTime,name:"20TB超级会员",},{code:"svip.8t",promotedAt:1680970202,expire:XiaoMaoEndTime,name:"超级会员",},];obj.hasOwnProperty("icon")?(obj.icon="https://gw.alicdn.com/imgextra/i3/O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png"):"";obj.hasOwnProperty("mediumIcon")?(obj.mediumIcon="https://gw.alicdn.com/imgextra/i4/O1CN01Mk916Y1c99aVBrgxM_!!6000000003557-2-tps-222-60.png"):"";obj.hasOwnProperty("status")?(obj.status="normal"):"";obj.hasOwnProperty("identity")?(obj.identity="svip"):"";obj.hasOwnProperty("level")?(obj.level="8t"):"";obj.hasOwnProperty("vipList")?(obj.vipList=vipList):""}else if(/^https:\/\/member\.(aliyundrive|alipan)\.com\/v1\/users\/tools?/.test(requestUrl)){let moreToolsList=[];obj.hasOwnProperty("result")?(delete obj.result.guideInfo,obj.result.commonTools.forEach((el)=>{el.profitDesc=null;el.version=null}),obj.result.moreTools.forEach((el)=>{if(el.name!="好运瓶"&&el.name!="达人中心"&&el.name!="帮助与反馈"&&el.name!="特惠流量包"){el.profitDesc=null;el.version=null;moreToolsList.push(el)}}),(obj.result.moreTools=moreToolsList),ALiCloudIcon==1?((obj.result.moreTools=moreToolsList.concat(obj.result.commonTools)),(obj.result.commonTools=[])):""):""}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1\/users\/me\/vip\/info?/.test(requestUrl)){let vipInfoObj={rightButtonText:"SVIP",identity:"svip",level:"8t",titleNotice:"第一股东",titleImage:"https://gw.alicdn.com/imgextra/i1/O1CN01Z2Yv4u1jrJ5S5TYpo_!!6000000004601-2-tps-216-60.png",description:"终身会员-铭牌：No.01",};obj=vipInfoObj}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1.1\/users\/me\/vip\/info?/.test(requestUrl)){obj.description="";obj.titleNotice="";obj.activityAction="";obj.rightButtonText="第一股东";obj.activityText="";obj.identity="svip";obj.backgroundImage="https://gw.alicdn.com/imgextra/i4/O1CN01cwAW0u1GPG2oa6WW7_!!6000000000614-2-tps-654-212.png";obj.titleImage="https://gw.alicdn.com/imgextra/i2/O1CN01snE6rA1pVg95HyRBl_!!6000000005366-2-tps-214-49.png"}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/adrive\/v2\/user\/get?/.test(requestUrl)){obj.hasOwnProperty("vip_identity")?(obj.vip_identity="svip"):"";obj.hasOwnProperty("role")?(obj.role="administrator"):"";obj.hasOwnProperty("expired_at")?(obj.expired_at=XiaoMaoEndTime):""}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1.0\/users\/feature\/list?/.test(requestUrl)){obj.hasOwnProperty("identity")?(obj.identity="svip"):"";if(obj.features.length){obj.features.forEach((el)=>{el.trialStatus="allowTrial";el.intercept=false;el.name="大佬尊享";if(el.hasOwnProperty("features")&&el.features.length){el.features.forEach((kid)=>{kid.trialStatus="allowTrial";kid.intercept=false;kid.name="大佬尊享"})}})}}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/business\/v1.0\/users\/feature\/trial?/.test(requestUrl)){obj.trialStartTime=new Date(getGoneDay(-100)).getTime()/1000;obj.trialDuration=20000000;obj.trialStatus="onTrial"}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/apps\/v1\/users\/home\/widgets?/.test(requestUrl)){obj.hasOwnProperty("coreFeatures")?(obj.coreFeatures.items=[]):"";obj.hasOwnProperty("activities")?delete obj.activities:"";obj.hasOwnProperty("recentSaved")?(obj.recentSaved={items:obj.recentSaved.items}):"";obj.hasOwnProperty("signIn")?(obj.signIn.description="大佬您好"):""}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/adrive\/v1\/app\/logos?/.test(requestUrl)){if(obj.items&&obj.items.length){obj.items.forEach((el)=>{el.labelText="已获得";el.labelCode="acquired"})}}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/v2\/file\/get_video_preview_play_info?/.test(requestUrl)){if(obj.video_preview_play_info.live_transcoding_task_list.length){let videoUrl=obj.video_preview_play_info.live_transcoding_task_list[0].url;if(ALiCloudDistinct){obj.video_preview_play_info.live_transcoding_task_list.forEach((el,i)=>{if(i>0){el.url=videoUrl;el.status="finished";el.stage="stage_all"}})}else{console.log("视频在线播放清晰度解锁已关闭，需开启请前往XiaoMaoBoxJs手动开启！请查看脚本注释https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoALiCloud.js")}let resultText="已捕捉到当前视频源m3u8地址，请注意源链接仅为临时链接具有时效性且无法在线播放，仅可用于m3u8相关软件进行多线程下载。"+"\n\n"+"m3u8源地址："+"\n"+videoUrl;AliLink?$notify("🚨XiaoMao_阿里云盘","m3u8地址获取成功❗️",resultText):console.log("视频m3u8地址获取已关闭，需开启请前往XiaoMaoBoxJs手动开启！请查看脚本注释https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoALiCloud.js")}}else if(/^https:\/\/api\.(aliyundrive|alipan)\.com\/adrive\/v2\/batch?/.test(requestUrl)){delete obj.distributorCouponInfo}else if(/^https:\/\/member\.alipan\.com\/v2\/activity\/sign_in_info?/.test(requestUrl)){obj.result.blessing="大佬您好！";let list=[];if(obj.result.rewards.length){obj.result.rewards.forEach((el)=>{if(el.type!="vipDay"&&el.type!="dailyBuyVip"){list.push(el)}});obj.result.rewards=list}}else if(/^https:\/\/member\.aliyundrive\.com\/v2\/activity\/sign_in_list?/.test(requestUrl)){if(obj.result.signInInfos.length){obj.result.signInInfos.forEach((el)=>{if(el.rewards.length){let list=[];el.rewards.forEach((i)=>{if(i.type!="vipDay"&&i.type!="dailyBuyVip"){list.push(i)}});el.rewards=list}})}}else if(/^https:\/\/member\.alipan\.com\/v1\/users\/me?/.test(requestUrl)){obj.no=1;obj.subTitle="第一体验官";obj.membershipIdentity="svip";obj.badges=[{code:"member-ship",defaultIcon:"https://gw.alicdn.com/imgextra/i3/O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png",iconText:null,iconTemplate:null,},{code:"beta-user",defaultIcon:"https://gw.alicdn.com/imgextra/i1/O1CN01cwg2Bj1JTKPDiiSHb_!!6000000001029-2-tps-40-40.png",iconText:null,iconTemplate:null,},];obj.followingCount=parseInt(Math.random()*9999999);obj.membershipIcon="https://gw.alicdn.com/imgextra/i3/O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png"}else if(/^https:\/\/api\.alipan\.com\/adrive\/v1\/timeline\/user\/get?/.test(requestUrl)){obj.followingCount=parseInt(Math.random()*9999999)}let FinishBody=JSON.stringify(obj);$done(FinishBody)}else{$done({})}