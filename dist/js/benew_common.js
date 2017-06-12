"use strict";!function(e){e.extend(e,{getQueryString:function(e){var n=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),t=window.location.search.substr(1).match(n);if(null!==t){var o=t[2];return o=o.replace(/(%22|%3E|%3C|<|>)/g,"MM"),""===o?null:decodeURIComponent(o)}return null},touchEvent:function(e,n,t,o){function i(e){$(e).off(s),$(e).off(u),$(e).off(l)}function r(e){e.stopPropagation();var n=e.touches?e.touches[0]:e,r=n.clientX,a=n.clientY,c=!1,g=this;$(g).addClass("active"),$(this).on(s,function(e){var n=e.touches?e.touches[0]:e,t=n.clientX,s=n.clientY;r===t&&a===s||(c=!0,$(g).removeClass("active"),o?o({distanceX:t-r,distanceY:s-a}):i(g))}),$(this).on(u,function(){o?t(e):c||($(g).removeClass("active"),t(e)),i(g)}),$(this).on(l,function(){o&&o({distanceX:0,distanceY:0}),$(g).removeClass("active"),i(g)})}var a="ontouchstart"in window,c=a?"touchstart":"mousedown",s=a?"touchmove":"mousemove",u=a?"touchend":"mouseup",l=a?"touchcancel":"mouseup";n?e.on(c,n,r):e.on(c,r)},cookie:{getCookie:function(e){var n=new RegExp("(?:^"+e+"|;\\s*"+e+")=(.*?)(?:;|$)","g"),t=n.exec(document.cookie);return null===t?null:unescape(t[1])},setCookie:function(e,n,t,o,i){var r=e+"="+escape(n)+";";t&&t instanceof Date&&(r+="expires="+t.toGMTString()+";"),o=o||"/",r+="path="+o+";",i&&(r+="domain="+i+";"),document.cookie=r},delCookie:function(e,n,t,o){if(this.getCookie(e)){var i=new Date;i.setTime(i.getTime()+-1e4),t=t||"",n=n||"/";var r=escape(e)+"="+escape("")+(i?"; expires="+i.toGMTString():"")+"; path="+n+(t?"; domain="+t:"")+(o?"; secure":"");document.cookie=r}}},getEnvironments:function(){var e=-1!==window.navigator.userAgent.toLowerCase().indexOf("micromessenger"),n=null;/iPhone/.test(window.navigator.userAgent)?n="iOS":/Android/.test(window.navigator.userAgent)&&(n="Android");var t=void 0!==window.android&&void 0!==window.android.addEvent||void 0!==window.webkit&&void 0!==window.webkit.messageHandlers&&void 0!==window.webkit.messageHandlers.addiOSTrackEvent;return t=!e&&t,"iOS"===n&&window.BenewiOS&&window.BenewiOS.appInfo&&window.BenewiOS.appInfo.length>0&&(t=!0),{isInApp:function(){return t},getPlatform:function(){return n},getTheme:function(){var e=$.getQueryString("theme");return e||t&&(e="app"),e},getFrom:function(){var n=null;return t?n="app":e&&(n="wechat"),n},getAction:function(){return $.getQueryString("action")},getAppInfo:function(){var e={};switch("appInfo"in localStorage&&(e=JSON.parse(localStorage.appInfo)),n){case"Android":try{var t=JSON.parse(window.android.getNativeParams());"env"in t&&void 0!==t.env&&(e.buildType=t.env,localStorage.appInfo=JSON.stringify(e)),"version"in t&&void 0!==t.version&&(e.appVersion=t.version,localStorage.appInfo=JSON.stringify(e))}catch(e){}break;case"iOS":"object"==typeof window.BenewiOS&&("string"==typeof window.BenewiOS.env&&(e.buildType=window.BenewiOS.env,localStorage.appInfo=JSON.stringify(e)),"string"==typeof window.BenewiOS.version&&(e.appVersion=window.BenewiOS.version,localStorage.appInfo=JSON.stringify(e)),localStorage.appInfo=JSON.stringify(e))}return e},getOrigin:function(e){var n=null;switch(e){case"uat":n="http://mtest.iqianjin.com";break;case"product":n="https://m.benew.com.cn";break;default:n="http://mtest.iqianjin.com"}return n}}},getVersion:function(){var n="",t=e.Deferred();return beacon.getAccountInfo({},function(e){var o=decodeURIComponent(e.DUA),i=new RegExp("(^|&)VN=([^&]*)(&|$)","i"),r=o.match(i);null!=r?(n=r[2],n=n.substr(0,3)):n=null,t.resolve(n)}),t.promise()},isIOS:function(){return!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)},mobileConsole:function(e){console.log(e)},output:function(e){console.log(JSON.stringify(e))},formatDate:function(e,n){var t={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(n)&&(n=n.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)));for(var o in t)new RegExp("("+o+")").test(n)&&(n=n.replace(RegExp.$1,1===RegExp.$1.length?t[o]:("00"+t[o]).substr((""+t[o]).length)));return n},isElementNotInViewport:function(e){var n=!0,t=e.getBoundingClientRect();return t.top+t.height<0&&(n=!1),t.bottom-t.height>document.body.clientHeight&&(n=!1),t.left+t.width<0&&(n=!1),t.right-t.width>document.body.clientWidth&&(n=!1),!n},weixinSDKRegister:function(n){if("undefined"!=typeof wx&&("web"===e.getQueryString("dt_from")||"nod"===e.getQueryString("dt_from"))){var t=location.href,o={url:e.getAjaxHost("common")+"getWxConfig",data:{action:"JsConfig",shareUrl:encodeURIComponent(t)},success:function(t){if(""!=t.content){var o=JSON.parse(t.content);wx.config({debug:!1,appId:o.sAppID,timestamp:o.lTimeStamp,nonceStr:o.sNonceStr,signature:o.sSignature,jsApiList:["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ"]});var i={title:"会牛-SIRI",desc:"会牛-SIRI",imgUrl:"",link:location.href,type:"link",dataUrl:""};e.extend(i,n),wx.ready(function(){wx.onMenuShareTimeline({title:i.title,link:i.link,imgUrl:i.imgUrl,success:function(){},cancel:function(){}}),wx.onMenuShareAppMessage({title:i.title,desc:i.desc,link:i.link,imgUrl:i.imgUrl,type:i.type,dataUrl:i.dataUrl,success:function(){},cancel:function(){}}),wx.onMenuShareQQ({title:i.title,desc:i.desc,link:i.link,imgUrl:i.imgUrl,success:function(){},cancel:function(){}})}),wx.error(function(e){})}},error:function(e){}};e.getData(o)}}})}(Zepto),function(){var e=function(){};e.prototype={refresh:function(e){var n={hideLoadingToast:!!e};console.log(n)},refreshWithParams:function(e){console.log(e)},scrollTop:function(){console.log("scrollTop")},getPageStatus:function(){console.log("getPageStatus")}},window.BenewH5=new e}();