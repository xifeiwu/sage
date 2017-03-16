! function(e) {
  e.extend(e, {
    getQueryString: function(e) {
      var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)", "i"),
        n = window.location.search.substr(1).match(t);
      if (null != n) {
        var o = n[2];
        return o = o.replace(/(%22|%3E|%3C|<|>)/g, "MM"), "" == o ? null : decodeURIComponent(o)
      }
      return null
    },
    touchEvent: function() {
      function t(e, t) {
        "" == t ? e.on(r, n) : e.on(r, t, n)
      }
      function n(t) {
        var n = t.touches ? t.touches[0] : t,
          a = n.clientX,
          r = n.clientY,
          l = !1,
          u = this,
          f = setTimeout(function() {
            l || e(u).addClass("active")
          }, 80);
        e(this).on(i, function(t) {
          var n = t.touches ? t.touches[0] : t,
            i = n.clientX,
            s = n.clientY;
          a == i && r == s || (clearTimeout(f), l = !0, e(u).removeClass("active"), o(u))
        }), e(this).on(s, function() {
          clearTimeout(f), l || (e(u).removeClass("active"), d.call(u, t)), o(u)
        }), e(this).on(c, function() {
          clearTimeout(f), e(u).removeClass("active"), o(u)
        })
      }
      function o(t) {
        e(t).off(i), e(t).off(s), e(t).off(c)
      }
      var a = "ontouchstart" in window,
        r = a ? "touchstart" : "mousedown",
        i = a ? "touchmove" : "mousemove",
        s = a ? "touchend" : "mouseup",
        c = a ? "touchcancel" : "mouseup";
      if (2 == arguments.length) {
        var l = arguments[0],
          d = arguments[1];
        t(l, "")
      } else if (3 == arguments.length) {
        var l = arguments[0],
          u = arguments[1],
          d = arguments[2];
        t(l, u)
      }
    },
    cookie: {
      getCookie: function(e) {
        var t = new RegExp("(?:^" + e + "|;\\s*" + e + ")=(.*?)(?:;|$)", "g"),
          n = t.exec(document.cookie);
        return null === n ? null : unescape(n[1])
      },
      setCookie: function(e, t, n, o, a) {
        var r = e + "=" + escape(t) + ";";
        n && n instanceof Date && (r += "expires=" + n.toGMTString() + ";"), o = o ? o : "/", r += "path=" + o + ";", a && (r += "domain=" + a + ";"), document.cookie = r
      },
      delCookie: function(e, t, n, o) {
        if (this.getCookie(e)) {
          var a = new Date;
          a.setTime(a.getTime() + -1e4), n = n ? n : "", t = t ? t : "/";
          var r = escape(e) + "=" + escape("") + (a ? "; expires=" + a.toGMTString() : "") + "; path=" + t + (n ? "; domain=" + n : "") + (o ? "; secure" : "");
          document.cookie = r
        }
      }
    },
    getVersion: function() {
      var t = "",
        n = e.Deferred();
      return beacon.getAccountInfo({}, function(e) {
        var o = decodeURIComponent(e.DUA),
          a = new RegExp("(^|&)VN=([^&]*)(&|$)", "i"),
          r = o.match(a);
        null != r ? (t = r[2], t = t.substr(0, 3)) : t = null, n.resolve(t)
      }), n.promise()
    },
    isIOS: function() {
      var e = navigator.userAgent;
      return !!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    },
    mobileConsole: function(msg) {
      console.log(msg);
    },
    output: function(msg) {
      if (false) {
        console.log(msg);
      }
    },
    toLocaleFormat: function(date, fmt) {
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        'S': date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
      return fmt;
    },
    isElementNotInViewport: function(el) {
      var isInViewport = true;
      var rect = el.getBoundingClientRect();
      if ((rect.top + rect.height) < 0) {
        isInViewport = false;
      }
      if ((rect.bottom - rect.height) > document.body.clientHeight) {
        isInViewport = false;
      }
      if ((rect.left + rect.width) < 0) {
        isInViewport = false;
      }
      if ((rect.right - rect.width) > document.body.clientWidth) {
        isInViewport = false;
      }
      return !isInViewport;
    },
    weixinSDKRegister: function(t) {
      if ("undefined" != typeof wx && ("web" == e.getQueryString("dt_from") || "nod" == e.getQueryString("dt_from"))) {
        var n = location.href,
          o = {
            url: e.getAjaxHost("common") + "getWxConfig",
            data: {
              action: "JsConfig",
              shareUrl: encodeURIComponent(n)
            },
            success: function(n) {
              if ("" != n.content) {
                var o = JSON.parse(n.content);
                wx.config({
                  debug: !1,
                  appId: o.sAppID,
                  timestamp: o.lTimeStamp,
                  nonceStr: o.sNonceStr,
                  signature: o.sSignature,
                  jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ"]
                });
                var a = {
                  title: "会牛-SIRI",
                  desc: "会牛-SIRI",
                  imgUrl: "",
                  link: location.href,
                  type: "link",
                  dataUrl: ""
                };
                e.extend(a, t), wx.ready(function() {
                  wx.onMenuShareTimeline({
                    title: a.title,
                    link: a.link,
                    imgUrl: a.imgUrl,
                    success: function() {},
                    cancel: function() {}
                  }), wx.onMenuShareAppMessage({
                    title: a.title,
                    desc: a.desc,
                    link: a.link,
                    imgUrl: a.imgUrl,
                    type: a.type,
                    dataUrl: a.dataUrl,
                    success: function() {},
                    cancel: function() {}
                  }), wx.onMenuShareQQ({
                    title: a.title,
                    desc: a.desc,
                    link: a.link,
                    imgUrl: a.imgUrl,
                    success: function() {},
                    cancel: function() {}
                  })
                }), wx.error(function(e) {})
              }
            },
            error: function(e) {}
          };
        e.getData(o)
      }
    },
  })
}(Zepto);