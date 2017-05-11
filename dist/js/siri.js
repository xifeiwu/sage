"use strict";!function(){var t=function(t){this.container=t,this.askHintDOM=$("#siri_ask_hint"),this.init()};t.prototype={init:function(){this.initDOM(),this.initEvent()},show:function(t){t?(this.askHintDOM.removeClass("hidden"),this.askHintDOM.addClass("show"),this.mySwiper.startSlide&&this.mySwiper.startSlide()):(this.askHintDOM.removeClass("show"),this.askHintDOM.addClass("hidden"),this.mySwiper.stopSlide&&this.mySwiper.stopSlide())},initDOM:function(){function t(t){function e(t){var e='<div class="swiper-slide"><ul class="hint_list move_up">';return t.forEach(function(t){e+="<li>"+t+"</li>"}),e+="</ul></div>"}for(var i="",s=0;s<t.length;s++)i+=e(t[s].items);var n='<div class="content"><h2>你可以这样问我:</h2><div class="swiper-container swiper-container-horizontal" id="swiper"><div class="swiper-wrapper ">'+i+'</div></div><div class="btn_change_wrapper"><span class="btn_change">换一换</span></div><div class="btn_close_wrapper"><span class="btn_close"></span></div></div>';return n}this.container.netConnector.askServer({askType:"ASK",question:"recommend"},function(e,i){var s=null;e?s=window.localStorage.ASK_HINT?JSON.parse(window.localStorage.ASK_HINT):[{items:["600519","开户","选股","KDJ","茅台行情"]}]:(s=i.data.body,window.localStorage.ASK_HINT=JSON.stringify(s));var n=t(s);this.askHintDOM.html(""),this.askHintDOM.append($(n)),this.mySwiper=this.addSwiper(),this.askHintDOM.addClass("hidden")}.bind(this))},addSwiper:function(){for(var t={},e=this.askHintDOM.find(".swiper-wrapper").eq(0),i=e.find(".swiper-slide"),s=e.width(),n=0;n<i.length;n++){var a=$(i[n]);a.data("swiperSlideIndex",n),a.css({transform:"translate3d("+s*n*-1+"px, 0px, 0px)"}),a.removeClass("swiper-slide-active")}return i.length>0&&(t.activeId=0,t.swiperSlides=i,t.slideNext=function(){var e=i[t.activeId],s=(t.activeId+1)%i.length;console.log(s),e.classList.remove("swiper-slide-active"),i[s].classList.add("swiper-slide-active"),t.activeId=s},t.slideNextManually=function(){t.interVal&&clearInterval(t.interVal),t.slideNext(),t.startSlide()},t.startSlide=function(){t.stopSlide(),i[t.activeId].classList.add("swiper-slide-active"),t.interVal=setInterval(t.slideNext,3e3)},t.stopSlide=function(){t.interVal&&clearInterval(t.interVal),Array.prototype.slice.call(t.swiperSlides).forEach(function(t){t.classList.remove("swiper-slide-active")})}),t},initEvent:function(){$.touchEvent(this.askHintDOM,".swiper-slide-active .hint_list li",function(t){var e=t.target.textContent;$.output(e),this.container.askSIRI(e),this.show(!1)}.bind(this)),$.touchEvent(this.askHintDOM,".btn_change_wrapper .btn_change",function(){this.mySwiper.slideNextManually&&this.mySwiper.slideNextManually()}.bind(this)),$.touchEvent(this.askHintDOM,".btn_close_wrapper .btn_close",function(){this.show(!1)}.bind(this))}};var e=function(){this.benewId=$.getQueryString("benew_id"),this.curCardID=null,this.dialogWrapper=document.getElementById("dialog_wrapper"),this.wrapperHeight=$(this.dialogWrapper).height(),this.cardStyle={SIRI_SAY:1,USER_ASK:3},this.environments=$.getEnvironments(),this.inApp=this.environments.isInApp(),this.platform=this.environments.getPlatform(),this.netConnector=new window.NetConnector({from:this.environments.getFrom()}),this.answerStyle=this.netConnector.answerStyle,this.sageSayCnt=0,this.tagSaveChatHistory=!0,this.chatHistory=null};e.prototype={init:function(){var e=this.environments.getTheme();e&&($("#main").addClass(e),$("#siri_ask_hint").addClass(e)),this.siriAskHint=new t(this),this.tagSaveChatHistory&&this.getChatHistory(),this.addEvent(),this.siriSay("hi"),this.startHeartBeat(),window.zhuge.track("sage_chat_open",{token:window.localStorage.token})},addEvent:function(){$("#input_bar .btn_go").on("click",function(){var t=$("#input_bar input");this.askSIRI(t.val()),t.val(""),t.blur()}.bind(this)),$("#input_bar input").on("keydown",function(t){var e=t||window.event;if(e&&13===e.keyCode){var i=$("#input_bar input");this.askSIRI(i.val()),i.val(""),i.blur()}}.bind(this)),$.touchEvent($("#dialog"),".show_ask_hint",function(){this.siriAskHint.show(!0)}.bind(this)),$.touchEvent($("#dialog"),".active_link",function(t){var e=t.target,i=null;i=e.dataset.question?e.dataset.question:$(e).text(),$.output(i),i&&this.askSIRI(i)}.bind(this)),$('#input_bar input[type="text"]').on("focus",function(t){var e=t.target;setTimeout(function(){e.scrollIntoView(!0)},250),this.resetSageSayCnt()}.bind(this)),$('#input_bar input[type="text"]').on("blur",function(t){window.location.hash=""}),$("a[href]").on("click",this.handleHrefClick.bind(this)),window.addEventListener("iOS"===this.platform?"pagehide":"beforeunload",function(t){this.tagSaveChatHistory&&this.saveChatHistory()}.bind(this))},handleHrefClick:function(t){var e=function(t){var e=/^https:\/\/m\.benew\.com\.cn\/(.*)$/,i=/^http:\/\/mtest\.iqianjin\.com\/(.*)$/,s=e.exec(t);return s?s[1]:(s=i.exec(t),s?s[1]:void 0)},i=function(t){var i=e(t);switch(console.log(i),console.log(this.platform),i){case"app/event-driven/event-driven.html":"Android"===this.platform?window.android.gotoNativeWebActivity("事件驱动","event-driven/event-driven.html"):"iOS"===this.platform&&window.webkit.messageHandlers.gotoEventDriven.postMessage({});break;case"app/long/long.html":"Android"===this.platform?window.android.gotoNativeWebActivity("中长线机会","long/long.html"):"iOS"===this.platform&&window.webkit.messageHandlers.gotoLongOpportunity.postMessage({});break;case"app/short/short.html":"Android"===this.platform?window.android.gotoNativeWebActivity("短线机会","short/short.html"):"iOS"===this.platform&&window.webkit.messageHandlers.gotoShortOpportunity.postMessage({});break;default:"Android"===this.platform?window.android.gotoWebActivity(t,""):"iOS"===this.platform&&window.webkit.messageHandlers.openUrl.postMessage({targetUrl:t})}},s=t.target,n=s.href;this.inApp&&(i.call(this,n),t.preventDefault(),t.stopPropagation())},getChatHistory:function(){if("chatHistory"in window.localStorage){var t=JSON.parse(window.localStorage.chatHistory);Array.isArray(t)?this.chatHistory=t.filter(function(t){return"id"in t&&"text"in t&&"number"==typeof t.id&&t.text.length>0}).sort(function(t,e){return t.id-e.id}):this.chatHistory=[]}else this.chatHistory=[];this.chatHistory.length>0&&this.chatHistory.forEach(function(t){$(t.text).insertBefore($("#bottomDiv"))})},saveChatHistory:function(){if(Array.isArray(this.chatHistory)){var t=1728e5,e=this.chatHistory[this.chatHistory.length-1].id,i=this.chatHistory.filter(function(i){var s=e-i.id<t,n="user_ask"===$(i.text).data("style");return s&&n}).sort(function(t,e){return t.id-e.id});window.localStorage.chatHistory=JSON.stringify(i)}},siriSay:function(t){this.askSIRI(t,this.cardStyle.SIRI_SAY)},askSIRI:function(t,e){if(t&&0!==t.length){e=e?e:this.cardStyle.USER_ASK,t=t.trim();var i=null;switch(e){case this.cardStyle.SIRI_SAY:i={askType:"FIRST_ASK",benewId:this.benewId,question:t};break;case this.cardStyle.USER_ASK:i={askType:"ASK",question:t}}if(t.length>0){var s=this.createCard({type:e,content:t});this.scrollAnimate(),this.netConnector.askServer(i,function(t,e){t&&(e=[{style:this.answerStyle.PLAIN_TEXT,content:"网络好像出了些问题。。。"}]),this.hideLoading(s);var i=e.map(function(t){return this.createAnswerDOM(t)}.bind(this)).join("");s.append($(i)),"dt"in e&&(s.attr("id",e.dt),this.curCardID=e.dt),this.tagSaveChatHistory&&this.chatHistory.push({id:e.dt,text:s.prop("outerHTML")}),this.scrollAnimate()}.bind(this))}}},createAnswerDOM:function(t){$.output(t);var e="",i=null;switch(t.style){case this.answerStyle.WAITING:e='<div class="ans_box"><div class="ico_dots dots_loading"><i></i><i></i><i></i></div></div>';break;case this.answerStyle.ASK_HINT:return this.createAnswerDOM({style:this.answerStyle.PLAIN_TEXT,content:t.content})+'<div class="show_ask_hint"><span>你可以这样问我 ></span></div>';case this.answerStyle.PLAIN_TEXT:e='<div class="ans_box">'+t.content+"</div>";break;case this.answerStyle.STOCK_HOT:e='<div class="ans_box" id="stock_hot">'+t.content+"</div>";break;case this.answerStyle.STOCK_FORECAST:e='<div class="ans_box" id="stock_forecast">'+t.content+"</div>";break;case this.answerStyle.STOCK_QUOTATION:i=t.content,e='<div class="ans_box" id="stock_quotation" data-code="'+i.tradeCode+'"><div class="header"><div class="title">'+i.tradeName+"&nbsp"+i.tradeCode+'</div><div class="status">'+i.stockStatus+"&nbsp&nbsp"+i.tradeDate+'&nbsp&nbsp<span class="trade_time">'+i.tradeTime+'</span></div></div> <div class="content"><div class="price item '+i.pchg_state+'"><div class="trade_price_container"><div class="trade_price"><span class="pre">'+i.tradePrice+'</span><span class="now"></span></div></div><div class="price_change"><div class="change_container"><div class="change"><span class="pre">'+i.change+'</span><span class="now">123</span></div></div><div class="pchg_container"><div class="pchg"><span class="pre">'+i.formated_pchg+'</span><span class="now">234</span></div></div></div></div><div class="item price_show"><div class="sub_item"><div><span>最&nbsp高</span><span>&nbsp'+i.thigh+"</span></div><div><span>今&nbsp开</span><span>&nbsp"+i.topen+'</span></div></div></div><div class="item price_show"><div class="sub_item"><div><span>最&nbsp低</span><span>&nbsp'+i.tlow+"</span></div><div><span>昨&nbsp收</span><span>&nbsp"+i.lclose+'</span></div></div></div></div><div class="footer">'+i.links.map(function(t){return'<div class="active_link">'+t+"</div>"}).join("")+"</div></div>";break;case this.answerStyle.HOT_STOCKS:i=t.content;var s=i.stocks.map(function(t){return'<tr><td><span class="stock_name">'+t.name+'</span>&nbsp<span class="stock_code">'+t.code+"</span></td><td>"+t.topen+'</td><td class="pchg '+t.pchg_state+'">'+t.formated_pchg+"</td></tr>"}).join("");e='<div class="ans_box" id="hot_stocks"><div class="header">会牛智选</div><div class="content"><div class="title">今日入选（'+i.date+'）</div><table class="stock_list"><tr><th>股票名称</th><th>入选价</th><th>最新涨幅</th></tr>'+s+'</table></div><a class="footer" href="'+i.link.link+'">'+i.link.text+"&nbsp></a></div>"}return'<div class="answer_row"><div class="ans_logo"><i class="benew_logo"></i></div><div class="ans_cont">'+e+"</div></div>"},limitCardNumb:function(){var t=16,e=$(".card");if(e.length>t)for(var i=0,s=e.length-t;i<s;i++)$(e[i]).remove()},createCard:function(t){var e="",i="",s="";switch(t.type){case this.cardStyle.SIRI_SAY:s="siri_say",e="",i=this.createAnswerDOM({style:this.answerStyle.WAITING});break;case this.cardStyle.USER_ASK:s="user_ask",e='<div class="ask_row"><span>'+t.content+"</span></div>",i=this.createAnswerDOM({style:this.answerStyle.WAITING})}var n=parseInt(1e6*Math.random()).toString(),a=$('<div id="'+n+'" class="card" data-style="'+s+'" style="overflow: hidden;">'+e+i+"</div>");return a.insertBefore($("#bottomDiv")),this.curCardID=n,a},hideLoading:function(t){t.find(".answer_row .ans_cont .ans_box .dots_loading").closest(".answer_row").remove()},scrollAnimate:function(){var t=!1;t?this.scrollTopAnimate():this.scrollBottomAnimate()},bottomDiv:function(){var t=$("#"+this.curCardID),e=t.height(),i=this.wrapperHeight-e;i=this.wrapperHeight-e>0?this.wrapperHeight-e:0,$("#bottomDiv").css("height",i)},scrollTopAnimate:function(t){this.bottomDiv();var e=this,i=!0,s=300,n=document.getElementById(this.curCardID).offsetTop,a=this.dialogWrapper.scrollTop,r=40,o=(n-a)/s*r,d=function(){Math.abs(a-n)>o?i?(a+=o,e.dialogWrapper.scrollTop=a,window.setTimeout(d,r)):(a=n,i=!1,e.dialogWrapper.scrollTop=a):(a=n,e.dialogWrapper.scrollTop=a,i=!1)};d(),setTimeout(function(){i=!1},s+200)},scrollBottomAnimate:function(){var t=this,e=300,i=40,s=document.getElementById(this.curCardID),n=s.offsetTop,a=n+s.clientHeight,r=this.dialogWrapper.scrollTop,o=0,d=r+this.wrapperHeight-o;if(!(d>a)){var c=!0,l=(a-d)/e*i,h=function(){Math.abs(a-d)>l?c?(r+=l,t.dialogWrapper.scrollTop=r,d+=l,window.setTimeout(h,i)):(r=r+a-d,c=!1,t.dialogWrapper.scrollTop=r):(r=r+a-d,t.dialogWrapper.scrollTop=r,c=!1)};h()}},openUrl:function(t){location.href=t.url},createIframe:function(t){var e=t.url,i=$(window).width()-50-26,s=document.createElement("iframe");return s.name=t.cardName,s.setAttribute("style","visibility:hidden;overflow: hidden;"),s.setAttribute("width",i),s.setAttribute("border","none"),s.setAttribute("frameborder","no"),s.setAttribute("src",e),s.onerror=function(){},s},showIframe:function(t){var e=$(window).width()-50-26,i=document.getElementsByName(t.cardName)[0];$(i.contentWindow.document.body).width(e+"px");var s=this;setTimeout(function(){s.updateIframe(t),$(i).attr("style","visibility：visible;overflow: hidden;")},10)},updateIframe:function(t){var e=t.cardName;if(document.getElementsByName(e).length>0){var i=document.getElementsByName(e)[0],s=$(i.contentWindow.document.body)[0].offsetHeight+12,n=$(window).width()-50-26;$(i.contentWindow.document.body).width(n+"px"),$(i).attr("height",s),$(i).attr("width",n),this.bottomDiv(t)}}};var i={refreshStockQuotationInViewport:function(){var t=function(t,e){var i=e.content,s=i.pchg_state,n=i.tradeTime,a=i.tradePrice,r=i.change,o=i.formated_pchg;$.output(s),$.output(n),$.output(a),$.output(r),$.output(o);var d=t.querySelector(".content .price"),c=t.querySelector(".header .trade_time");c&&(c.textContent=n),["up","down","stay"].forEach(function(t){d.classList.remove(t)}),d.classList.add(s);var l=d.querySelector(".trade_price"),h=l.querySelector(".pre"),p=l.querySelector(".now");h.textContent!==a?($(l).one("transitionend",function(t){var e=t.target;h.textContent=p.textContent,e.classList.remove("move_up")}),p.textContent=a,l.classList.add("move_up")):$.output("the same: trade price.");var v=d.querySelector(".price_change"),u=v.querySelector(".change"),w=u.querySelector(".pre"),g=u.querySelector(".now");parseFloat(w.textContent)!==parseFloat(r)?($(u).one("transitionend",function(t){var e=t.target;w.textContent=g.textContent,e.classList.remove("move_up")}),g.textContent=r,u.classList.add("move_up")):$.output("the same: change.");var f=v.querySelector(".pchg"),S=f.querySelector(".pre"),y=f.querySelector(".now");S.textContent!==o?($(f).one("transitionend",function(t){var e=t.target;S.textContent=y.textContent,e.classList.remove("move_up")}),y.textContent=o,f.classList.add("move_up")):$.output("the same: pchg.")};Array.prototype.slice.call(document.querySelectorAll("#stock_quotation")).forEach(function(e){if(!$.isElementNotInViewport(e)){if(!("code"in e.dataset))return;var i=e.dataset.code;this.netConnector.askServer({askType:"REFRESH",question:i},function(i,s){i||s.forEach(function(i){i.style===this.answerStyle.STOCK_QUOTATION&&t(e,i)}.bind(this))}.bind(this))}}.bind(this))},resetSageSayCnt:function(){this.sageSayCnt=0},startHeartBeat:function(){var t=0;$.output("start interval"),this.heartBeatInterval=setInterval(function(){if(t+=1,t>6&&(t=0),this.sageSayCnt+=1,this.sageSayCnt>30){var e=$.formatDate(new Date,"yyyy-MM-dd"),i=null;i=window.localStorage.tagSageSay?JSON.parse(window.localStorage.tagSageSay):{readme:"记录sage主动询问的状态"},"date"in i?i&&e!==i.date&&(i.date=e,i.sayTimes=1,this.siriSay("firstTip"),window.localStorage.tagSageSay=JSON.stringify(i)):(i.date=e,i.sayTimes=1,this.siriSay("firstTip"),window.localStorage.tagSageSay=JSON.stringify(i)),this.sageSayCnt>35&&(i&&"sayTimes"in i&&i.sayTimes<2&&(i.sayTimes=2,this.siriSay("secondTip"),window.localStorage.tagSageSay=JSON.stringify(i)),this.resetSageSayCnt())}}.bind(this),1e3)}};e.prototype=$.extend(e.prototype,i);var s=new e;s.init(),window.benewSage=s}();