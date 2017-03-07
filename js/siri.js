! function() {
  var SIRIAskHint = function(container) {
    console.log(container);
    this.container = container;
    this.askHint = $('#siri_ask_hint');
    this.init();
  }
  SIRIAskHint.prototype = {
    init: function() {
      this.initDOM();
      this.initEvent();
    },
    show: function(showMe) {
      if (showMe) {
        this.askHint.removeClass('hidden');
        this.askHint.addClass('show');
      } else {
        this.askHint.removeClass('show');
        this.askHint.addClass('hidden');
      }
    },
    initDOM: function() {
      function getAskHintDOM(resData) {
        function ulGenerator(items) {
          var str = '<div class="swiper-slide"><ul class="hint_list move_up">'
          items.forEach(function(it) {
            str += '<li>' + it + '</li>';
          });
          str += '</ul></div>';
          return str;
        }
        var ulstr = '';
        for (var i = 0; i < resData.length; i++) {
          ulstr += ulGenerator(resData[i].items);
        }
        answerDom = 
'<div class="content">' +
  '<h2>你可以这样问我:</h2>' +
  '<div class="swiper-container swiper-container-horizontal" id="swiper">' +
    '<div class="swiper-wrapper ">' + ulstr +
   '</div>' +
  '</div>' +
  '<div class="btn_change_slider" id="btnChange">' +
    '<div class="btn_change_inside">' +
      '<span>换一换</span></div>' +
  '</div>' +
  '<div class="close"><div class="btn"></div></div>' +
'</div>';
        return answerDom;
      }
      this.container.netConnector.askServer({
        type: 'ASK',
        question: 'recommend'
      }, function(err, content) {
        // $.output(content);
        var resData = null;
        if (err) {
          if (localStorage.ASK_HINT) {
            resData = JSON.parse(localStorage.ASK_HINT);
          } else {
            resData = [
            {items: ['600519', '开户', '选股', 'KDJ', '茅台行情']}
            ];
          }
        } else {
          resData = content.data.body;
          localStorage.ASK_HINT = JSON.stringify(resData);
        }
        var answerDom = getAskHintDOM(resData);
        this.askHint.html('');
        this.askHint.append($(answerDom));
        try {
          this.mySwiper = new Swiper(".swiper-container", {
            autoplay: 3000,
            speed: 800,
            loop: true,
            onlyExternal: !0,
            onDestroy: function(e) {},
            autoplayDisableOnInteraction: !1,
            effect: "fade",
            fade: {
              crossFade: !0
            },
            direction: "horizontal"
          })
        } catch (p) {
          $.mobileConsole(p)
        }
      }.bind(this));
    },
    initEvent: function() {
      $.touchEvent(this.askHint, '.hint_list li', function(evt) {
        this.container.askSIRI(evt.target.textContent)
        this.show(false);
      }.bind(this));
      $.touchEvent(this.askHint, '#btnChange .btn_change_inside', function() {
        this.mySwiper.slideNext()
      }.bind(this));
      $.touchEvent(this.askHint, '.close', function() {
        this.show(false);
      }.bind(this));
    }
  }


  var BenewSIRI = function() {
    this.from =  null == $.getQueryString("from") || "app" == $.getQueryString("from") ? "app" : "web";
    this.env = $.getQueryString("env");
    this.cardCnt = 1;
    this.cardName = "card_1";
    this.sessionAjaxCount = 0;
    this.sessionStatus = 0;
    this.dialogWrapper = document.getElementById('dialog_wrapper');
    this.wrapperHeight = $(this.dialogWrapper).height();
    this.cardStyle = {
      'SIRI_SAY': 1,
      // 'SIRI_ASK_HINT': 2,
      'USER_ASK': 3,
    };
    this.netConnector = new NetConnector();
    this.answerStyle = this.netConnector.answerStyle;
  }
  BenewSIRI.prototype = {
    init: function() {
      this.siriAskHint = new SIRIAskHint(this);
      this.addEvent();
      this.siriSay('hi');
    },
    addEvent: function() {
      $("#input_bar .btn_go").on("click", function() {
        var inputBar = $("#input_bar input");
        this.askSIRI(inputBar.val());
        inputBar.val('');
        inputBar.blur();
      }.bind(this));
      $("#input_bar input").on('keydown', function(t) {
        var s = t || window.event;
        if (s && 13 == s.keyCode) {
          var inputBar = $('#input_bar input');
          this.askSIRI(inputBar.val());
          inputBar.val('');
          inputBar.blur();
        }
      }.bind(this));
      $.touchEvent($("#dialog"), ".show_ask_hint", function() {
        this.siriAskHint.show(true);
      }.bind(this));
      $.touchEvent($('#dialog'), '.active_link', function(evt) {
        var target = evt.target;
        var question = null;
        if (target.dataset.question) {
          question = target.dataset.question;
        } else {
          question = $(target).text();
        }
        $.output(question);
        if (question) {
          this.askSIRI(question);
        }
      }.bind(this));
      // $('#dialog').on('tap', function(evt) {
      //   console.log(evt);
      // })
      // $(window).focus(function() {
        // $.isIOS() && e.mySwiper.animating && (e.mySwiper.animating = !1, e.mySwiper.stopAutoplay(), e.mySwiper.startAutoplay())
      // });

      // $.touchEvent($("#dailog"), ".answer_row a", function() {
      //   var t = $(this).attr("data-href");
      //   if (null != t) {
      //     var s = e.jumpUrlDeal(t);
      //     location.href = s
      //   }
      // });
    },
    siriSay: function(content) {
      if (!content || content.length == 0) {
        return;
      }
      content = content.trim();
      if (content.length > 0) {
        this.netConnector.askServer({
          type: 'ASK',
          question: content
        }, function(err, formated_contents) {
          if (err) {
            formated_contents = [{
              type: this.answerStyle.PLAIN_TEXT,
              content: '您好，我是哲，私人理财专家，有关股票证券问题都可以问我。'
            }];
          }
          var cardNode = this.createCard({
            type: this.cardStyle.SIRI_SAY,
            content: formated_contents,
          });
          this.bottomDiv({
            cardName: this.cardName
          });
          this.scrollTopAnimate({
            cardName: this.cardName,
            callBack: function() {}
          });
        }.bind(this));

      }
    },
    askSIRI: function(question) {
      if (!question || question.length == 0) {
        return;
      }
      question = question.trim();
      if (question.length > 0) {
        var cardNode = this.createCard({
          type: this.cardStyle.USER_ASK,
          content: question,
        });
        this.netConnector.askServer({
          type: 'ASK',
          question: question
        }, function(err, formated_contents) {
          if (err) {
            formated_contents = [{
              style: this.answerStyle.PLAIN_TEXT,
              content: '网络好像出了些问题。。。'
            }];
          }
          this.hideLoading();
          var answerDOM = formated_contents.map(function(it) {
            return this.createAnswerDOM(it);
          }.bind(this)).join('');
          cardNode.append($(answerDOM));
          this.bottomDiv({
            cardName: this.cardName
          });
          this.scrollTopAnimate({
            cardName: this.cardName,
            callBack: function() {}
          });
        }.bind(this));
      }
    },
    createAnswerDOM: function(options) {
      var answerDom = '';
      $.output(options);
      switch (options.style) {
        case this.answerStyle.WAITING:
          answerDom = 
          '<div class="ans_box">' +
            '<div class="ico_dots dots_loading">' +
              '<i></i><i></i><i></i>' +
            '</div>' +
          '</div>';
          break;
        case this.answerStyle.ASK_HINT:
          return this.createAnswerDOM({
            style: this.answerStyle.PLAIN_TEXT,
            content: options.content
          }) + '<div class="show_ask_hint"><span>你可以这样问我 ></span></div>';
          break;
        case this.answerStyle.PLAIN_TEXT:
          answerDom = '<div class="ans_box">' + options.content + '</div>';
          break;
        case this.answerStyle.STOCK_HOT:
          answerDom = '<div class="ans_box" id="stock_hot">' + options.content + '</div>';
          break;
        case this.answerStyle.STOCK_FORECAST:
          answerDom = '<div class="ans_box" id="stock_forecast">' + options.content + '</div>';
          break;
        case this.answerStyle.STOCK_QUOTATION:
        var content = options.content;
        answerDom = 
        '<div class="ans_box" id="stock_quotation">' +
          '<div class="header">' +
            '<div class="title">' + content.tradeName + '&nbsp' + content.tradeCode + '</div>' +
            '<div class="status">' + content.stockStatus + '&nbsp' + content.tradeDate + '&nbsp' + content.tradeTime + '</div>' +
          '</div>' +
         ' <div class="content">' +
            '<div class="first item">' +
              '<div class="trade_price">' + content.tradePrice + '</div>' +
              '<div class="price_change">' +
                '<div class="change">' + content.change + '</div>' +
                '<div class="pchg">' + content.formated_pchg + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="item price_show">' +
              '<div class="sub_item">' +
                '<div><span>最&nbsp高</span><span>&nbsp' + content.thigh + '</span></div>' +
                '<div><span>今&nbsp开</span><span>&nbsp' + content.topen + '</span></div>' +
              '</div>' +
            '</div>' +
            '<div class="item price_show">' +
              '<div class="sub_item">' +
                '<div><span>最&nbsp低</span><span>&nbsp' + content.tlow + '</span></div>' +
                '<div><span>昨&nbsp收</span><span>&nbsp' + content.lclose + '</span></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="footer">' +
          content.links.map(function(it) {
            return '<div class="active_link">' + it + '</div>';
          }).join('') +
          '</div>' +
        '</div>';
          break;
        case this.answerStyle.HOT_STOCKS:
          var content = options.content;
          var tableContent = content.stocks.map(function(it) {
            return '<tr><td><span class="stock_name">' + it.name + 
              '</span>&nbsp<span class="stock_code">' + it.code + '</span></td>' +
              '<td>' + it.topen + '</td><td class="pchg">' + it.pchg + '</td></tr>';
          }).join('');
          var answerDom = 
          '<div class="ans_box" id="hot_stocks">' +
            '<div class="stock_qutation">' +
              '<div class="top">会牛智选</div>' +
              '<div class="content">' +
                '<div class="title">今日入选（'  + content.date + '）</div>' +
                '<div class="list">' +
                '<table class="stock_list">' +
                '<tr><th>股票名称</th><th>入选价</th><th>最新涨幅</th></tr>' + tableContent +
                '</table>' +
                '</div>' +
              '</div>' +
              '<div class="footer active_link">点击获取更多&nbsp></div>' +
            '</div>' +
          '</div>';
          break;
      }
      return '<div class="answer_row">' +
              '<div class="ans_logo">' +
                '<i class="benew_logo"></i>' +
              '</div>' +
              '<div class="ans_cont">' + answerDom + '</div>' +
             '</div>';
    },

    limitCardNumb: function() {
      var e = 10,
        t = $(".card");
      if (t.length > e) {
        for (var s = 0, i = t.length - e; s < i; s++) {
          $(t[s]).remove()
        }
      }
    },
    createCard: function(options) {
      this.limitCardNumb();
      this.cardCnt += 1;
      this.cardName = 'card_' + this.cardCnt;
      var askDom = '';
      var answerDom = '';
      switch (options.type) {
        case this.cardStyle.SIRI_SAY:
          askDom = '';
          var contents = options.content;
          answerDom = contents.map(function(it) {
            return this.createAnswerDOM({
              style: it.style,
              content: it.content
            });
          }.bind(this)).join('');
        break;
        case this.cardStyle.USER_ASK:
          askDom = '<div class="ask_row"><span>' + options.content + '</span></div>'
          answerDom = this.createAnswerDOM({
            style: this.answerStyle.WAITING,
          });
          break;
      }
      if ("selectStockTips" == options.type) {
        askDom = '';
        answerDom = this.createAnswerDOM(options);
      } else if ("onlyAnswer" == options.type) {
        askDom = '';
        answerDom = this.createAnswerDOM(options);
      }
      var card = $("<div id='" + this.cardName + "' class='card' style='overflow: hidden;'>" + askDom + answerDom + "</div>");
      card.insertBefore($("#bottomDiv"))
      // if ("firstTips" != options.type && "onlyAnswer" != options.type && "selectStockTips" != options.type) {
      // } else {
      //   this.bottomDiv({
      //     cardName: this.cardName
      //   });
      //   this.scrollTopAnimate({
      //     cardName: this.cardName,
      //     callBack: function() {}
      //   });
      // }
      return card;
    },
    hideLoading: function() {
      $('.answer_row .ans_cont .ans_box .dots_loading').closest('.answer_row').remove();
    },
    createIframe: function(e) {
      var t = e.url,
        s = $(window).width() - 50 - 26,
        i = document.createElement("iframe");
      return i.name = e.cardName, i.setAttribute("style", "visibility:hidden;overflow: hidden;"), i.setAttribute("width", s), i.setAttribute("border", "none"), i.setAttribute("frameborder", "no"), i.setAttribute("src", t), i.onerror = function() {}, i
    },
    showIframe: function(e) {
      var t = $(window).width() - 50 - 26,
        s = document.getElementsByName(e.cardName)[0];
      $(s.contentWindow.document.body).width(t + "px");
      var i = this;
      setTimeout(function() {
        i.updateIframe(e), $(s).attr("style", "visibility：visible;overflow: hidden;")
      }, 10)
    },
    updateIframe: function(e) {
      var t = e.cardName;
      if (document.getElementsByName(t).length > 0) {
        var s = document.getElementsByName(t)[0],
          i = $(s.contentWindow.document.body)[0].offsetHeight + 12,
          a = $(window).width() - 50 - 26;
        $(s.contentWindow.document.body).width(a + "px"), $(s).attr("height", i), $(s).attr("width", a), this.bottomDiv(e)
      }
    },
    scrollTopAnimate: function(e) {
      var self = this;
      var goOn = true,
        timeUsed = 300,
        cardTop = document.getElementById(this.cardName).offsetTop,
        wrapperTop = this.dialogWrapper.scrollTop,
        iterval = 40,
        step = (cardTop - wrapperTop) / timeUsed * iterval;
      v = function() {
        if (Math.abs(wrapperTop - cardTop) > step) {
          if (goOn) {
            wrapperTop += step;
            self.dialogWrapper.scrollTop = wrapperTop;
            window.setTimeout(v, iterval);
          } else {
            wrapperTop = cardTop;
            goOn = false;
            self.dialogWrapper.scrollTop = wrapperTop;
            e.callBack();
          } 
        } else {
          wrapperTop = cardTop;
          self.dialogWrapper.scrollTop = wrapperTop;
          goOn = false;
        }
      };
      v();
      setTimeout(function() {
        goOn = false;
      }, timeUsed + 200);
    },
    bottomDiv: function(e) {
      var curCard = $('#' + this.cardName);
      var cardHeight = curCard.height();
      var bootomHeight = this.wrapperHeight - cardHeight
      if ((this.wrapperHeight - cardHeight) > 0) {
        bootomHeight = this.wrapperHeight - cardHeight;
      } else {
        bootomHeight = 0;
      }
      $('#bottomDiv').css('height', bootomHeight);
    },
    openUrl: function(e) {
      location.href = e.url
    },
  };
  benewSIRI = new BenewSIRI();
  benewSIRI.init();
  window.benewSIRI = benewSIRI;
}();
