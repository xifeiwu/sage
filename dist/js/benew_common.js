"use strict";!function(e){e.extend(e,{getQueryString:function(e){var n=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),t=window.location.search.substr(1).match(n);if(null!==t){var o=t[2];return o=o.replace(/(%22|%3E|%3C|<|>)/g,"MM"),""===o?null:decodeURIComponent(o)}return null},touchEvent:function(){function n(e,n){""===n?e.on(r,t):e.on(r,n,t)}function t(n){var t=n.touches?n.touches[0]:n,i=t.clientX,r=t.clientY,s=!1,d=this,g=setTimeout(function(){s||e(d).addClass("active")},80);e(this).on(c,function(n){var t=n.touches?n.touches[0]:n,c=t.clientX,a=t.clientY;i===c&&r===a||(clearTimeout(g),s=!0,e(d).removeClass("active"),o(d))}),e(this).on(a,function(){clearTimeout(g),s||(e(d).removeClass("active"),l.call(d,n)),o(d)}),e(this).on(u,function(){clearTimeout(g),e(d).removeClass("active"),o(d)})}function o(n){e(n).off(c),e(n).off(a),e(n).off(u)}var i="ontouchstart"in window,r=i?"touchstart":"mousedown",c=i?"touchmove":"mousemove",a=i?"touchend":"mouseup",u=i?"touchcancel":"mouseup";if(2==arguments.length){var s=arguments[0],l=arguments[1];n(s,"")}else if(3==arguments.length){var s=arguments[0],d=arguments[1],l=arguments[2];n(s,d)}},cookie:{getCookie:function(e){var n=new RegExp("(?:^"+e+"|;\\s*"+e+")=(.*?)(?:;|$)","g"),t=n.exec(document.cookie);return null===t?null:unescape(t[1])},setCookie:function(e,n,t,o,i){var r=e+"="+escape(n)+";";t&&t instanceof Date&&(r+="expires="+t.toGMTString()+";"),o=o?o:"/",r+="path="+o+";",i&&(r+="domain="+i+";"),document.cookie=r},delCookie:function(e,n,t,o){if(this.getCookie(e)){var i=new Date;i.setTime(i.getTime()+-1e4),t=t?t:"",n=n?n:"/";var r=escape(e)+"="+escape("")+(i?"; expires="+i.toGMTString():"")+"; path="+n+(t?"; domain="+t:"")+(o?"; secure":"");document.cookie=r}}},getEnvironments:function(){var e=window.navigator.userAgent.toLowerCase().indexOf("micromessenger")!==-1,n="undefined"!=typeof window.android&&"undefined"!=typeof window.android.addEvent||"undefined"!=typeof window.webkit&&"undefined"!=typeof window.webkit.messageHandlers&&"undefined"!=typeof window.webkit.messageHandlers.addiOSTrackEvent;n=!e&&n;var t=null;return e?t="wechat":n&&(/iPhone/.test(window.navigator.userAgent)?t="iOS":/Android/.test(window.navigator.userAgent)&&(t="Android")),{isInApp:function(){return n},getPlatform:function(){return t},getTheme:function(){var e=$.getQueryString("from");return e||n&&(e="app"),e},getFrom:function(){var t=null;return n?t="app":e&&(t="wechat"),t},getAppBuildType:function(){var e=null;switch(t){case"Android":try{var n=JSON.parse(window.android.getNativeParams());"env"in n&&"undefined"!=typeof n.env&&(e=n.env)}catch(n){e=null}break;case"iOS":"object"==typeof window.BenewiOS&&"string"==typeof window.BenewiOS.env&&(e=window.BenewiOS.env)}return e},getOrigin:function(e){var n=null;switch(e){case"uat":n="http://mtest.iqianjin.com";break;case"product":n="https://m.benew.com.cn";break;default:n="http://mtest.iqianjin.com"}return n}}},getVersion:function(){var n="",t=e.Deferred();return beacon.getAccountInfo({},function(e){var o=decodeURIComponent(e.DUA),i=new RegExp("(^|&)VN=([^&]*)(&|$)","i"),r=o.match(i);null!=r?(n=r[2],n=n.substr(0,3)):n=null,t.resolve(n)}),t.promise()},isIOS:function(){var e=navigator.userAgent;return!!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)},mobileConsole:function(e){console.log(e)},output:function(e){console.log(JSON.stringify(e))},formatDate:function(e,n){var t={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(n)&&(n=n.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)));for(var o in t)new RegExp("("+o+")").test(n)&&(n=n.replace(RegExp.$1,1===RegExp.$1.length?t[o]:("00"+t[o]).substr((""+t[o]).length)));return n},isElementNotInViewport:function(e){var n=!0,t=e.getBoundingClientRect();return t.top+t.height<0&&(n=!1),t.bottom-t.height>document.body.clientHeight&&(n=!1),t.left+t.width<0&&(n=!1),t.right-t.width>document.body.clientWidth&&(n=!1),!n},weixinSDKRegister:function(n){if("undefined"!=typeof wx&&("web"===e.getQueryString("dt_from")||"nod"===e.getQueryString("dt_from"))){var t=location.href,o={url:e.getAjaxHost("common")+"getWxConfig",data:{action:"JsConfig",shareUrl:encodeURIComponent(t)},success:function(t){if(""!=t.content){var o=JSON.parse(t.content);wx.config({debug:!1,appId:o.sAppID,timestamp:o.lTimeStamp,nonceStr:o.sNonceStr,signature:o.sSignature,jsApiList:["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ"]});var i={title:"会牛-SIRI",desc:"会牛-SIRI",imgUrl:"",link:location.href,type:"link",dataUrl:""};e.extend(i,n),wx.ready(function(){wx.onMenuShareTimeline({title:i.title,link:i.link,imgUrl:i.imgUrl,success:function(){},cancel:function(){}}),wx.onMenuShareAppMessage({title:i.title,desc:i.desc,link:i.link,imgUrl:i.imgUrl,type:i.type,dataUrl:i.dataUrl,success:function(){},cancel:function(){}}),wx.onMenuShareQQ({title:i.title,desc:i.desc,link:i.link,imgUrl:i.imgUrl,success:function(){},cancel:function(){}})}),wx.error(function(e){})}},error:function(e){}};e.getData(o)}}})}(Zepto);