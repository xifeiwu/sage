'use strict';
/* jshint ignore:start */
! function(e) {
  e.extend(e, {
  getQueryString: function(e) {
    var t = new RegExp('(^|&)' + e + '=([^&]*)(&|$)', 'i'),
    n = window.location.search.substr(1).match(t);
    if (null !== n) {
    var o = n[2];
    return o = o.replace(/(%22|%3E|%3C|<|>)/g, 'MM'), '' === o ? null : decodeURIComponent(o);
    }
    return null;
  },
  // touchEvent: function() {
  //   function t(e, t) {
  //     '' === t ? e.on(r, n) : e.on(r, t, n);
  //   }
  //   function n(t) {
  //     var n = t.touches ? t.touches[0] : t,
  //       a = n.clientX,
  //       r = n.clientY,
  //       l = !1,
  //       u = this,
  //       f = setTimeout(function() {
  //         l || e(u).addClass('active');
  //       }, 80);
  //     e(this).on(i, function(t) {
  //       var n = t.touches ? t.touches[0] : t,
  //         i = n.clientX,
  //         s = n.clientY;
  //       a === i && r === s || (clearTimeout(f), l = !0, e(u).removeClass('active'), o(u));
  //     }), e(this).on(s, function() {
  //       clearTimeout(f), l || (e(u).removeClass('active'), d.call(u, t)), o(u);
  //     }), e(this).on(c, function() {
  //       clearTimeout(f);
  //       e(u).removeClass('active');
  //       o(u);
  //     })
  //   }
  //   function o(t) {
  //     e(t).off(i), e(t).off(s), e(t).off(c)
  //   }
  //   var a = 'ontouchstart' in window,
  //     r = a ? 'touchstart' : 'mousedown',
  //     i = a ? 'touchmove' : 'mousemove',
  //     s = a ? 'touchend' : 'mouseup',
  //     c = a ? 'touchcancel' : 'mouseup';
  //   if (2 == arguments.length) {
  //     var l = arguments[0],
  //       d = arguments[1];
  //     t(l, '')
  //   } else if (3 == arguments.length) {
  //     var l = arguments[0], u = arguments[1], d = arguments[2];
  //     t(l, u)
  //   }
  // },
  // endCB can not be null when moveCB is set.
  // evt is passed to endCB, custom parameters is sent to moveCB.
  touchEvent: function(ele, filter, endCB, moveCB) {
    var touchStyle = 'ontouchstart' in window,
      startEvent = touchStyle ? 'touchstart' : 'mousedown',
      moveEvent = touchStyle ? 'touchmove' : 'mousemove',
      endEvent = touchStyle ? 'touchend' : 'mouseup',
      cancelEvent = touchStyle ? 'touchcancel' : 'mouseup';

    function removeListener(t) {
      $(t).off(moveEvent);
      $(t).off(endEvent);
      $(t).off(cancelEvent);
    }
    function addListener(evt) {
      evt.stopPropagation();
      var pos = evt.touches ? evt.touches[0] : evt;
      var startX = pos.clientX;
      var startY = pos.clientY;
      var ignoreEndCB = false;
      var self = this;
      $(self).addClass('active');
      // var tagAddActive = setTimeout(function() {
      //   if (!ignoreEndCB) {
      //     $(self).addClass('active');
      //   }
      // }, 80);
      $(this).on(moveEvent, function(evt) {
        var pos = evt.touches ? evt.touches[0] : evt;
        var moveX = pos.clientX;
        var moveY = pos.clientY;
        if (startX === moveX && startY === moveY) {
        } else {
          // clearTimeout(tagAddActive);
          ignoreEndCB = true;
          $(self).removeClass('active');
          // remove listener if not concern on moveCB.
          if (moveCB) {
            moveCB({
              distanceX: moveX - startX,
              distanceY: moveY - startY
            });
          } else {
            removeListener(self);
          }
        }
      });
      $(this).on(endEvent, function() {
        // clearTimeout(tagAddActive);
        // remove listener if not concern on moveCB.
        if (moveCB) {
          endCB(evt);
        } else if (!ignoreEndCB) {
          $(self).removeClass('active');
          endCB(evt);
        }
        removeListener(self);
      });
      $(this).on(cancelEvent, function() {
        // clearTimeout(tagAddActive);
        if (moveCB) {
          moveCB({
            distanceX: 0,
            distanceY: 0
          });
        }
        $(self).removeClass('active');
        removeListener(self);
      });
    }
    if (filter) {
      ele.on(startEvent, filter, addListener);
    } else {
      ele.on(startEvent, addListener);
    }
  },

  cookie: {
    getCookie: function(e) {
    var t = new RegExp('(?:^' + e + '|;\\s*' + e + ')=(.*?)(?:;|$)', 'g'),
      n = t.exec(document.cookie);
    return null === n ? null : unescape(n[1])
    },
    setCookie: function(e, t, n, o, a) {
    var r = e + '=' + escape(t) + ';';
    n && n instanceof Date && (r += 'expires=' + n.toGMTString() + ';'), o = o ? o : '/', r += 'path=' + o + ';', a && (r += 'domain=' + a + ';'), document.cookie = r
    },
    delCookie: function(e, t, n, o) {
    if (this.getCookie(e)) {
      var a = new Date;
      a.setTime(a.getTime() + -1e4), n = n ? n : '', t = t ? t : '/';
      var r = escape(e) + '=' + escape('') + (a ? '; expires=' + a.toGMTString() : '') + '; path=' + t + (n ? '; domain=' + n : '') + (o ? '; secure' : '');
      document.cookie = r
    }
    }
  },

  getEnvironments: function() {
    var inWechat = window.navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1;
    var platform = null;
    if (/iPhone/.test(window.navigator.userAgent)) {
    platform = 'iOS';
    } else if (/Android/.test(window.navigator.userAgent)) {
    platform = 'Android';
    }
    var inApp = (typeof (window.android) !== 'undefined' && typeof (window.android.addEvent) !== 'undefined') ||
    (typeof (window.webkit) !== 'undefined' &&
    typeof (window.webkit.messageHandlers) !== 'undefined' &&
    typeof (window.webkit.messageHandlers.addiOSTrackEvent) !== 'undefined');
    inApp = inWechat ? false : inApp;

    if (platform === 'iOS' && window.BenewiOS && window.BenewiOS['appInfo'] && window.BenewiOS['appInfo'].length > 0) {
    inApp = true;
    }

    return {
    isInApp: function() {
      return inApp;
    },
    getPlatform: function() {
      return platform;
    },
    getTheme: function() {
      var theme = $.getQueryString('from');
      if (!theme) {
      if (inApp) {
        theme = 'app';
      }
      }
      return theme;
    },
    getFrom: function() {
      var from = null;
      if (inApp) {
      from = 'app';
      } else if (inWechat) {
      from = 'wechat';
      }
      return from;
    },
    getAppBuildType: function() {
      var buildType = null;
      switch(platform) {
      case 'Android':
        // 从安卓app获取参数
        try {
        var envObj = JSON.parse(window.android.getNativeParams());
        if ('env' in envObj && typeof(envObj['env']) !== 'undefined') {
          buildType = envObj['env'];
        }
        } catch(e) {
        buildType = null;
        }
        break;
      case 'iOS':
        // 从ios app获取参数
        if (typeof(window.BenewiOS) === 'object' && typeof(window.BenewiOS['env']) === 'string') {
        buildType = window.BenewiOS['env'];
        }
        break;
      }
      return buildType;
    },
    getOrigin: function(buildType) {
      var origin = null;
      switch (buildType) {
      case 'uat':
        origin = 'http://mtest.iqianjin.com';
        break;
      case 'product':
        origin = 'https://m.benew.com.cn';
        break;
      default:
        origin = 'http://mtest.iqianjin.com';
        break;
      }
      return origin;
    }
    };
  },

  getVersion: function() {
    var t = '',
    n = e.Deferred();
    return beacon.getAccountInfo({}, function(e) {
    var o = decodeURIComponent(e.DUA),
      a = new RegExp('(^|&)VN=([^&]*)(&|$)', 'i'),
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
    console.log(JSON.stringify(msg));
    }
  },

  formatDate: function(date, fmt) {
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
    if ('undefined' !== typeof wx && ('web' === e.getQueryString('dt_from') || 'nod' === e.getQueryString('dt_from'))) {
    var n = location.href,
      o = {
      url: e.getAjaxHost('common') + 'getWxConfig',
      data: {
        action: 'JsConfig',
        shareUrl: encodeURIComponent(n)
      },
      success: function(n) {
        if ('' != n.content) {
        var o = JSON.parse(n.content);
        wx.config({
          debug: !1,
          appId: o.sAppID,
          timestamp: o.lTimeStamp,
          nonceStr: o.sNonceStr,
          signature: o.sSignature,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ']
        });
        var a = {
          title: '会牛-SIRI',
          desc: '会牛-SIRI',
          imgUrl: '',
          link: location.href,
          type: 'link',
          dataUrl: ''
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
/* jshint ignore:end */

(function() {
  var NativeAPI = function() {
  };
  NativeAPI.prototype = {
  // 刷新数据
  refresh: function (hideLoadingToast) {
    var params = {
    'hideLoadingToast': hideLoadingToast ? true : false
    };
    console.log(params);
  },

  // 刷新数据 for iOS only - 参数类型：object
  refreshWithParams: function (params) {
    console.log(params);
  },

  scrollTop: function () {
    console.log('scrollTop');
  },

  getPageStatus: function () {
    console.log('getPageStatus');
  },
  };
  window.BenewH5 = new NativeAPI();
})();
