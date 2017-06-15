"use strict";!function(){var t=function(t){this.container=t,this.askHintDOM=$("#siri_ask_hint"),this.init()};t.prototype={init:function(){this.initDOM(),this.initEvent()},show:function(t){t?(this.askHintDOM.removeClass("hidden"),this.askHintDOM.addClass("show"),this.mySwiper.startSlide&&this.mySwiper.startSlide()):(this.askHintDOM.removeClass("show"),this.askHintDOM.addClass("hidden"),this.mySwiper.stopSlide&&this.mySwiper.stopSlide())},initDOM:function(){function t(t){for(var e="",i=0;i<t.length;i++)e+=function(t){var e='<div class="swiper-slide"><ul class="hint_list move_up">';return t.forEach(function(t){e+="<li>"+t+"</li>"}),e+="</ul></div>"}(t[i].items);return'<div class="content"><h2>你可以这样问我:</h2><div class="swiper-container swiper-container-horizontal" id="swiper"><div class="swiper-wrapper ">'+e+'</div></div><div class="btn_change_wrapper"><span class="btn_change">换一换</span></div><div class="btn_close_wrapper"><span class="btn_close"></span></div></div>'}this.container.askServer({askType:this.container.askType.ASK,question:"recommend"},{},function(e,i){var s=null;e?s=window.localStorage.ASK_HINT?JSON.parse(window.localStorage.ASK_HINT):[{items:["600519","开户","选股","KDJ","茅台行情"]}]:(s=i.data.body,window.localStorage.ASK_HINT=JSON.stringify(s));var a=t(s);this.askHintDOM.html(""),this.askHintDOM.append($(a)),this.mySwiper=this.addSwiper(),this.askHintDOM.addClass("hidden")}.bind(this))},addSwiper:function(){for(var t={},e=this.askHintDOM.find(".swiper-wrapper").eq(0),i=e.find(".swiper-slide"),s=e.width(),a=0;a<i.length;a++){var n=$(i[a]);n.data("swiperSlideIndex",a),n.css({transform:"translate3d("+s*a*-1+"px, 0px, 0px)"}),n.removeClass("swiper-slide-active")}return i.length>0&&(t.activeId=0,t.swiperSlides=i,t.slideNext=function(){var e=i[t.activeId],s=(t.activeId+1)%i.length;console.log(s),e.classList.remove("swiper-slide-active"),i[s].classList.add("swiper-slide-active"),t.activeId=s},t.slideNextManually=function(){t.interVal&&clearInterval(t.interVal),t.slideNext(),t.startSlide()},t.startSlide=function(){t.stopSlide(),i[t.activeId].classList.add("swiper-slide-active"),t.interVal=setInterval(t.slideNext,3e3)},t.stopSlide=function(){t.interVal&&clearInterval(t.interVal),Array.prototype.slice.call(t.swiperSlides).forEach(function(t){t.classList.remove("swiper-slide-active")})}),t},initEvent:function(){this.askHintDOM.on("click",".swiper-slide-active .hint_list li",function(t){var e=t.target.textContent;$.output(e),this.container.userAsk(e),this.show(!1)}.bind(this)),this.askHintDOM.on("click",".btn_change_wrapper .btn_change",function(){this.mySwiper.slideNextManually&&this.mySwiper.slideNextManually()}.bind(this)),this.askHintDOM.on("click",".btn_close_wrapper .btn_close",function(){this.show(!1)}.bind(this))}};var e=function(){this.benewID=$.getQueryString("benew_id"),this.lastRandomID=null,this.dialogWrapper=document.getElementById("dialog_wrapper"),this.wrapperHeight=$(this.dialogWrapper).height(),this.cardStyle={SIRI_SAY:1,USER_ASK:3},this.environments=$.getEnvironments(),this.env={inAPP:this.environments.isInApp(),platform:this.environments.getPlatform(),from:this.environments.getFrom(),action:this.environments.getAction(),theme:this.environments.getTheme(),appInfo:this.environments.getAppInfo()},this.netConnector=new window.NetConnector({from:this.env.from}),this.askType=this.netConnector.askType,this.answerStyle=this.netConnector.answerStyle,this.sageSayCnt=0,this.tagSaveChatHistory=!0,this.chatHistory=null};e.prototype={init:function(){var e=this.env.theme;switch(e?"app"!==e&&($("#main").removeClass("app"),$("#siri_ask_hint").removeClass("app"),$("#main").addClass(e),$("#siri_ask_hint").addClass(e)):($("#main").removeClass("app"),$("#siri_ask_hint").removeClass("app")),this.siriAskHint=new t(this),this.tagSaveChatHistory&&this.getChatHistory(),this.addEvent(),this.env.action){case"feedback":this.userAsk({toShow:"我要反馈",toAsk:"我要反馈 "+this.env.from},{SEND_BENEW_ID:{benewID:this.benewID}});break;default:this.siriSay("hi",{SEND_BENEW_ID:{benewID:this.benewID}})}this.startHeartBeat(),window.zhuge.track("sage_chat_open",{token:window.localStorage.token})},addEvent:function(){$("#input_bar .btn_go").on("click",function(){var t=$("#input_bar input");this.userAsk(t.val()),t.val(""),t.blur()}.bind(this)),$("#input_bar input").on("keydown",function(t){var e=t||window.event;if(e&&13===e.keyCode){var i=$("#input_bar input");this.userAsk(i.val()),i.val(""),i.blur()}}.bind(this)),$("#dialog").on("click",".card .show_ask_hint",function(){this.siriAskHint.show(!0)}.bind(this)),$("#dialog").on("click",".card .active_link",function(t){var e=t.target,i=null;i=e.dataset.question?e.dataset.question:$(e).text(),$.output(i),i&&this.userAsk(i)}.bind(this)),$('#input_bar input[type="text"]').on("focus",function(t){var e=t.target;setTimeout(function(){e.scrollIntoView(!0)},250),this.resetSageSayCnt()}.bind(this)),$('#input_bar input[type="text"]').on("blur",function(t){window.location.hash=""}),$("#dialog").on("click",".card a[href]",this.handleHrefClick.bind(this)),window.addEventListener("iOS"===this.env.platform?"pagehide":"beforeunload",function(t){this.tagSaveChatHistory&&this.saveChatHistory()}.bind(this))},handleHrefClick:function(t){var e=function(t){var e=/(^https:\/\/m\.benew\.com\.cn\/)(.*)$/,i=/(^http:\/\/mtest\.iqianjin\.com\/)(.*)$/,s=e.exec(t);return s||((s=i.exec(t))||t)},i=function(t){"Android"===this.env.platform?window.android.gotoWebActivity(t,""):"iOS"===this.env.platform&&window.webkit.messageHandlers.openUrl.postMessage({targetUrl:t})},s=function(t){var s=this.env.appInfo,a=null;a="appVersion"in s?s.appVersion:"1.5.0";var n=e(t),r=null,o=null;if(3===n.length&&(r=n[1],o=n[2]),console.log(this.env.platform),r&&o)switch(o){case"app/stockpool-v2/stockpool.html":switch(a){case"1.5.0":o="app/golden/golden.html"}i.call(this,r+o);break;case"app/short/short.html":switch(a){case"1.5.0":o="app/short-v2/short-v2.html"}i.call(this,r+o);break;default:i.call(this,t)}else i.call(this,t)},a=t.target,n=a.href;this.env.inApp&&(s.call(this,n),t.preventDefault(),t.stopPropagation())},getChatHistory:function(){if("chatHistory"in window.localStorage){var t=JSON.parse(window.localStorage.chatHistory);Array.isArray(t)?this.chatHistory=t.filter(function(t){return"id"in t&&"text"in t&&"number"==typeof t.id&&t.text.length>0}).sort(function(t,e){return t.id-e.id}):this.chatHistory=[]}else this.chatHistory=[];if(this.chatHistory.length>0){var e=this.chatHistory.map(function(t){return t.text}).join("");$(e).insertBefore($("#bottomDiv")),this.lastRandomID=document.getElementById(this.chatHistory[this.chatHistory.length-1].id).dataset.id,this.scrollAnimate(!1)}},saveChatHistory:function(){if(Array.isArray(this.chatHistory)){var t=this.chatHistory[this.chatHistory.length-1].id,e=this.chatHistory.filter(function(e){var i=t-e.id<1728e5,s="user_ask"===$(e.text).data("style");return i&&s}).sort(function(t,e){return t.id-e.id});window.localStorage.chatHistory=JSON.stringify(e)}},siriSay:function(t,e){this.userAsk({type:this.cardStyle.SIRI_SAY,question:t},e)},userAsk:function(t,e){var i=this.cardStyle.USER_ASK,s="",a="";if("string"==typeof t?s=a=t.trim():"object"==typeof t&&(i="type"in t?t.type:i,"toAsk"in t&&"toAsk"in t?(s=t.toShow.trim(),a=t.toAsk.trim()):"question"in t&&("string"==typeof t.question?s=a=t.question.trim():"object"==typeof t.question&&(s=t.question.toShow.trim(),a=t.question.toAsk.trim()))),e||(e={}),s.length>0&&a.length>0){var n=this.createCard({type:i,content:s});i===this.cardStyle.USER_ASK&&this.scrollAnimate(),this.askServer({askType:this.askType.ASK,question:a},e,function(t,e){t&&(e=[{style:this.answerStyle.PLAIN_TEXT,content:"网络好像出了些问题。。。"}]),this.hideLoading(n);var i=e.map(function(t){return this.createAnswerDOM(t)}.bind(this)).join("");n.append($(i)),"dt"in e&&n.attr("id",e.dt),this.tagSaveChatHistory&&!t&&(this.chatHistory.push({id:e.dt,text:n.prop("outerHTML")}),this.saveChatHistory()),this.scrollAnimate()}.bind(this))}},askServer:function(t,e,i){if("askType"in t&&"question"in t){var s=t.askType,a=t.question;this.netConnector.askServer(s,a,e,i)}},createAnswerDOM:function(t){$.output(t);var e="",i=null;switch(t.style){case this.answerStyle.WAITING:e='<div class="ans_box"><div class="ico_dots dots_loading"><i></i><i></i><i></i></div></div>';break;case this.answerStyle.ASK_HINT:return this.createAnswerDOM({style:this.answerStyle.PLAIN_TEXT,content:t.content})+'<div class="show_ask_hint"><span>你可以这样问我 ></span></div>';case this.answerStyle.PLAIN_TEXT:e='<div class="ans_box">'+t.content+"</div>";break;case this.answerStyle.STOCK_HOT:e='<div class="ans_box" id="stock_hot">'+t.content+"</div>";break;case this.answerStyle.STOCK_FORECAST:e='<div class="ans_box" id="stock_forecast">'+t.content+"</div>";break;case this.answerStyle.STOCK_QUOTATION:i=t.content,e='<div class="ans_box" id="stock_quotation" data-code="'+i.tradeCode+'"><div class="header"><div class="title">'+i.tradeName+"&nbsp"+i.tradeCode+'</div><div class="status">'+i.stockStatus+"&nbsp&nbsp"+i.tradeDate+'&nbsp&nbsp<span class="trade_time">'+i.tradeTime+'</span></div></div> <div class="content"><div class="price item '+i.pchg_state+'"><div class="trade_price_container"><div class="trade_price"><span class="pre">'+i.tradePrice+'</span><span class="now"></span></div></div><div class="price_change"><div class="change_container"><div class="change"><span class="pre">'+i.change+'</span><span class="now">123</span></div></div><div class="pchg_container"><div class="pchg"><span class="pre">'+i.formated_pchg+'</span><span class="now">234</span></div></div></div></div><div class="item price_show"><div class="sub_item"><div><span>最&nbsp高</span><span>&nbsp'+i.thigh+"</span></div><div><span>今&nbsp开</span><span>&nbsp"+i.topen+'</span></div></div></div><div class="item price_show"><div class="sub_item"><div><span>最&nbsp低</span><span>&nbsp'+i.tlow+"</span></div><div><span>昨&nbsp收</span><span>&nbsp"+i.lclose+'</span></div></div></div></div><div class="footer">'+i.links.map(function(t){return'<div class="active_link">'+t+"</div>"}).join("")+"</div></div>";break;case this.answerStyle.HOT_STOCKS:i=t.content;var s=i.stocks.map(function(t){return'<tr><td><span class="stock_name">'+t.name+'</span>&nbsp<span class="stock_code">'+t.code+"</span></td><td>"+t.topen+'</td><td class="pchg '+t.pchg_state+'">'+t.formated_pchg+"</td></tr>"}).join("");e='<div class="ans_box" id="hot_stocks"><div class="header">会牛智选</div><div class="content"><div class="title">今日入选（'+i.date+'）</div><table class="stock_list"><tr><th>股票名称</th><th>入选价</th><th>最新涨幅</th></tr>'+s+'</table></div><a class="footer" href="'+i.link.link+'">'+i.link.text+"&nbsp></a></div>"}return'<div class="answer_row"><div class="ans_logo"><i class="benew_logo"></i></div><div class="ans_cont">'+e+"</div></div>"},limitCardNumb:function(){var t=$(".card");if(t.length>16)for(var e=0,i=t.length-16;e<i;e++)$(t[e]).remove()},createCard:function(t){var e="",i="",s="";switch(t.type){case this.cardStyle.SIRI_SAY:s="siri_say",e="",i=this.createAnswerDOM({style:this.answerStyle.WAITING});break;case this.cardStyle.USER_ASK:s="user_ask",e='<div class="ask_row"><span>'+t.content+"</span></div>",i=this.createAnswerDOM({style:this.answerStyle.WAITING})}var a=parseInt(1e6*Math.random()).toString(),n=$('<div data-id="'+a+'" class="card" data-style="'+s+'" style="overflow: hidden;">'+e+i+"</div>");return n.insertBefore($("#bottomDiv")),this.lastRandomID=a,n},hideLoading:function(t){t.find(".answer_row .ans_cont .ans_box .dots_loading").closest(".answer_row").remove()},scrollAnimate:function(t){void 0===t&&(t=!0);this.scrollBottomAnimate(t)},bottomDiv:function(){var t=$('[data-id="'+this.lastRandomID+'"'),e=t.height(),i=this.wrapperHeight-e;i=this.wrapperHeight-e>0?this.wrapperHeight-e:0,$("#bottomDiv").css("height",i)},scrollTopAnimate:function(t){this.bottomDiv();var e=this,i=!0,s=document.querySelector('[data-id="'+this.lastRandomID+'"');cardTop=s.offsetTop,wrapperTop=this.dialogWrapper.scrollTop,interval=40,step=(cardTop-wrapperTop)/300*interval;var a=function(){Math.abs(wrapperTop-cardTop)>step?i?(wrapperTop+=step,e.dialogWrapper.scrollTop=wrapperTop,window.setTimeout(a,interval)):(wrapperTop=cardTop,i=!1,e.dialogWrapper.scrollTop=wrapperTop):(wrapperTop=cardTop,e.dialogWrapper.scrollTop=wrapperTop,i=!1)};a(),setTimeout(function(){i=!1},500)},scrollBottomAnimate:function(t){var e=this,i=document.querySelector('[data-id="'+this.lastRandomID+'"]');if(null!==i){var s=i.offsetTop,a=s+i.clientHeight,n=this.dialogWrapper.scrollTop,r=n+this.wrapperHeight-0;if(!(r>a)){var o=!0,c=(a-r)/300*40,l=function(){Math.abs(a-r)>c?o?(n+=c,e.dialogWrapper.scrollTop=n,r+=c,window.setTimeout(l,40)):(n=n+a-r,o=!1,e.dialogWrapper.scrollTop=n):(n=n+a-r,e.dialogWrapper.scrollTop=n,o=!1)};t?l():e.dialogWrapper.scrollTop=n+a-r}}},openUrl:function(t){location.href=t.url},createIframe:function(t){var e=t.url,i=$(window).width()-50-26,s=document.createElement("iframe");return s.name=t.cardName,s.setAttribute("style","visibility:hidden;overflow: hidden;"),s.setAttribute("width",i),s.setAttribute("border","none"),s.setAttribute("frameborder","no"),s.setAttribute("src",e),s.onerror=function(){},s},showIframe:function(t){var e=$(window).width()-50-26,i=document.getElementsByName(t.cardName)[0];$(i.contentWindow.document.body).width(e+"px");var s=this;setTimeout(function(){s.updateIframe(t),$(i).attr("style","visibility：visible;overflow: hidden;")},10)},updateIframe:function(t){var e=t.cardName;if(document.getElementsByName(e).length>0){var i=document.getElementsByName(e)[0],s=$(i.contentWindow.document.body)[0].offsetHeight+12,a=$(window).width()-50-26;$(i.contentWindow.document.body).width(a+"px"),$(i).attr("height",s),$(i).attr("width",a),this.bottomDiv(t)}}};var i={refreshStockQuotationInViewport:function(){var t=function(t,e){var i=e.content,s=i.pchg_state,a=i.tradeTime,n=i.tradePrice,r=i.change,o=i.formated_pchg;$.output(s),$.output(a),$.output(n),$.output(r),$.output(o);var c=t.querySelector(".content .price"),l=t.querySelector(".header .trade_time");l&&(l.textContent=a),["up","down","stay"].forEach(function(t){c.classList.remove(t)}),c.classList.add(s);var d=c.querySelector(".trade_price"),h=d.querySelector(".pre"),p=d.querySelector(".now");h.textContent!==n?($(d).one("transitionend",function(t){var e=t.target;h.textContent=p.textContent,e.classList.remove("move_up")}),p.textContent=n,d.classList.add("move_up")):$.output("the same: trade price.");var v=c.querySelector(".price_change"),u=v.querySelector(".change"),w=u.querySelector(".pre"),f=u.querySelector(".now");parseFloat(w.textContent)!==parseFloat(r)?($(u).one("transitionend",function(t){var e=t.target;w.textContent=f.textContent,e.classList.remove("move_up")}),f.textContent=r,u.classList.add("move_up")):$.output("the same: change.");var m=v.querySelector(".pchg"),y=m.querySelector(".pre"),S=m.querySelector(".now");y.textContent!==o?($(m).one("transitionend",function(t){var e=t.target;y.textContent=S.textContent,e.classList.remove("move_up")}),S.textContent=o,m.classList.add("move_up")):$.output("the same: pchg.")};Array.prototype.slice.call(document.querySelectorAll("#stock_quotation")).forEach(function(e){if(!$.isElementNotInViewport(e)){if(!("code"in e.dataset))return;var i=e.dataset.code;this.askServer({askType:this.askType.REFRESH,question:i},{},function(i,s){i||s.forEach(function(i){i.style===this.answerStyle.STOCK_QUOTATION&&t(e,i)}.bind(this))}.bind(this))}}.bind(this))},resetSageSayCnt:function(){this.sageSayCnt=0},startHeartBeat:function(){var t=0;$.output("start interval"),this.heartBeatInterval=setInterval(function(){if(t+=1,t>6&&(t=0),this.sageSayCnt+=1,this.sageSayCnt>30){var e=$.formatDate(new Date,"yyyy-MM-dd"),i=null;i=window.localStorage.tagSageSay?JSON.parse(window.localStorage.tagSageSay):{readme:"记录sage主动询问的状态"},"date"in i?i&&e!==i.date&&(i.date=e,i.sayTimes=1,this.siriSay("firstTip"),window.localStorage.tagSageSay=JSON.stringify(i)):(i.date=e,i.sayTimes=1,this.siriSay("firstTip"),window.localStorage.tagSageSay=JSON.stringify(i)),this.sageSayCnt>35&&(i&&"sayTimes"in i&&i.sayTimes<2&&(i.sayTimes=2,this.siriSay("secondTip"),window.localStorage.tagSageSay=JSON.stringify(i)),this.resetSageSayCnt())}}.bind(this),1e3)}};e.prototype=$.extend(e.prototype,i);var s=new e;s.init(),window.benewSage=s}();