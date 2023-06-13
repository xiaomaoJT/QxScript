/**************************
 *  * @Author: XiaoMao
 * @LastMod: 2023-06-13
 *
 * 

\1\8\🈲️\采\精\车\

仅供学习参考，请于下载后24小时内删除
请注意劳逸结合

********************************
# 小版本更新请查看更新日志 ｜ 或加入xiaomao组织⬇️
# 微信公众号 【小帽集团】
# XiaoMao · Tg频道频道：https://t.me/xiaomaoJT
# XiaoMao · GitHub仓库：https://github.com/xiaomaoJT/QxScript


使用方法：

⚠️ 配置文件 [task_local] 标签添加

* * 0,1,2,20,21,22,23 * * ? https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoSCV.js, tag=🚗XiaoMao学习车, img-url=https://raw.githubusercontent.com/LovedGM/Quantumult-X-TuBiao/main/zishi-cs/zs3.png, enabled=true

单独脚本地址：
https://raw.githubusercontent.com/xiaomaoJT/QxScript/main/rewrite/boxJS/XiaoMaoSCV.js

********************************/






let url="https://missav.com/random/"+(Math.random()*100).toFixed(0).toString();let option={url:encodeURI(url),method:"GET",headers:{"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",},};$task.fetch(option).then((response)=>{let obj=response.body;const regExp=/<img[^>]+src=['"]([^'"]+)['"]+/g;const regExp2=/<a[^>]+href=['"]([^'"]+)['"]+/g;const regExp3=/<img[^>]+alt=['"]([^'"]+)['"]+/g;const result=[],result2=[],result3=[];let temp;while((temp=regExp.exec(obj))!=null){result.push(temp[1])}while((temp=regExp2.exec(obj))!=null){if(!result2.includes(temp[1])){result2.push(temp[1])}}while((temp=regExp3.exec(obj))!=null){result3.push(temp[1])}let list=[];let img="";let resultText="🛟 复制感兴趣的地址前往浏览器查看吧，请注意劳逸结合哟～"+"\n\n";if(result.length){result.forEach((el,index)=>{list.push({imgUrl:el,videoUrl:result2&&result2[index],title:result3&&result3[index],})});list.forEach((el,index)=>{if(index==0){img=el.imgUrl}resultText=resultText+"⛽️第"+(index+1)+"车："+el.title+"\n"+"📀视频地址："+el.videoUrl+"\n\n\n"});$notify("🚗XiaoMao_采精车发车成功❗️","🚧请注意控制车速❗️",resultText,{"media-url":img})}}).catch((err)=>{$notify("🚨XiaoMao_采精车发车失败❗️","","🚧抛锚了，请尝试重新点火❗️",{"open-url":"https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg","media-url":"https://i.pixiv.re/img-original/img/2022/10/14/00/15/07/101911915_p1.jpg",})});setTimeout(()=>{$done({})},2000);