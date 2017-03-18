'use strict';
! function() {
  var SIRIAskHint = function(container) {
    console.log(container);
    this.container = container;
    this.askHintDOM = $('#siri_ask_hint');
    this.init();
  };
  SIRIAskHint.prototype = {
    init: function() {
      this.initDOM();
      this.initEvent();
    },
    show: function(showMe) {
      if (showMe) {
        this.askHintDOM.removeClass('hidden');
        this.askHintDOM.addClass('show');
        this.mySwiper.startSlide && this.mySwiper.startSlide();
      } else {
        this.askHintDOM.removeClass('show');
        this.askHintDOM.addClass('hidden');
        this.mySwiper.stopSlide && this.mySwiper.stopSlide();
      }
    },
    initDOM: function() {
      function getAskHintDOM(resData) {
        function ulGenerator(items) {
          var str = '<div class="swiper-slide"><ul class="hint_list move_up">';
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
        var answerDom = 
'<div class="content">' +
  '<h2>你可以这样问我:</h2>' +
  '<div class="swiper-container swiper-container-horizontal" id="swiper">' +
    '<div class="swiper-wrapper ">' + ulstr +
   '</div>' +
  '</div>' +
  '<div class="btn_change_wrapper">' +
      '<span class="btn_change">换一换</span>' +
  '</div>' +
  '<div class="btn_close_wrapper"><span class="btn_close"></span></div>' +
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
          if (window.localStorage.ASK_HINT) {
            resData = JSON.parse(window.localStorage.ASK_HINT);
          } else {
            resData = [
            {items: ['600519', '开户', '选股', 'KDJ', '茅台行情']}
            ];
          }
        } else {
          resData = content.data.body;
          window.localStorage.ASK_HINT = JSON.stringify(resData);
        }
        var answerDom = getAskHintDOM(resData);
        this.askHintDOM.html('');
        this.askHintDOM.append($(answerDom));
        this.mySwiper = this.addSwiper();
        this.askHintDOM.addClass('hidden');
      }.bind(this));
    },
    addSwiper: function() {
      var swiper = {};
      var swiperWrapper = this.askHintDOM.find('.swiper-wrapper').eq(0);
      var swiperSlides = swiperWrapper.find('.swiper-slide');
      var slideWidth = swiperWrapper.width();
      for (var i = 0; i < swiperSlides.length; i++) {
        var slide = $(swiperSlides[i]);
        slide.data('swiperSlideIndex', i);
        slide.css({
          'transform': 'translate3d(' + slideWidth * i * -1 +'px, 0px, 0px)'
        });
        slide.removeClass('swiper-slide-active');
      }

      if (swiperSlides.length > 0) {
        swiper.activeId = 0;
        swiper.swiperSlides = swiperSlides;
        swiper.slideNext = function() {
          var activeSlide = swiperSlides[swiper.activeId];
          var nextId = (swiper.activeId + 1) % swiperSlides.length;
          console.log(nextId);
          activeSlide.classList.remove('swiper-slide-active');
          swiperSlides[nextId].classList.add('swiper-slide-active');
          swiper.activeId = nextId;
        };
        swiper.slideNextManually = function() {
          swiper.interVal && clearInterval(swiper.interVal);
          swiper.slideNext();
          swiper.startSlide();
        };
        swiper.startSlide = function() {
          swiper.stopSlide();
          swiperSlides[swiper.activeId].classList.add('swiper-slide-active');
          swiper.interVal = setInterval(swiper.slideNext, 3000);
        };
        swiper.stopSlide = function() {
          swiper.interVal && clearInterval(swiper.interVal);
          Array.prototype.slice.call(swiper.swiperSlides).forEach(function(it) {
            it.classList.remove('swiper-slide-active');
          });
        };
      }
      return swiper;
    },
    initEvent: function() {
      $.touchEvent(this.askHintDOM, '.swiper-slide-active .hint_list li', function(evt) {
        var question = evt.target.textContent;
        $.output(question);
        this.container.askSIRI(question);
        this.show(false);
      }.bind(this));
      $.touchEvent(this.askHintDOM, '.btn_change_wrapper .btn_change', function() {
        this.mySwiper.slideNextManually && this.mySwiper.slideNextManually();
      }.bind(this));
      $.touchEvent(this.askHintDOM, '.btn_close_wrapper .btn_close', function() {
        this.show(false);
      }.bind(this));
    }
  }


  var BenewSIRI = function() {
    this.from =  null === $.getQueryString('from') || 'app' == $.getQueryString('from') ? 'app' : 'web';
    this.env = $.getQueryString('env');
    this.cardCnt = 1;
    this.cardName = 'card_1';
    this.dialogWrapper = document.getElementById('dialog_wrapper');
    this.wrapperHeight = $(this.dialogWrapper).height();
    this.cardStyle = {
      'SIRI_SAY': 1,
      // 'SIRI_ASK_HINT': 2,
      'USER_ASK': 3,
    };
    this.netConnector = new NetConnector();
    this.answerStyle = this.netConnector.answerStyle;
    this.sageSayCnt = 0;
  };
  BenewSIRI.prototype = {
    init: function() {
      this.siriAskHint = new SIRIAskHint(this);
      this.addEvent();
      this.siriSay('hi');
      this.startHeartBeat();
    },
    addEvent: function() {
      $('#input_bar .btn_go').on('click', function() {
        var inputBar = $('#input_bar input');
        this.askSIRI(inputBar.val());
        inputBar.val('');
        inputBar.blur();
      }.bind(this));
      $('#input_bar input').on('keydown', function(t) {
        var s = t || window.event;
        if (s && 13 === s.keyCode) {
          var inputBar = $('#input_bar input');
          this.askSIRI(inputBar.val());
          inputBar.val('');
          inputBar.blur();
        }
      }.bind(this));
      $.touchEvent($('#dialog'), '.show_ask_hint', function() {
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
      $('#input_bar input[type="text"]').on('focus', function(evt) {
        var target = evt.target;
        setTimeout(function() {
          target.scrollIntoView(true);
          // window.location.hash = '';
          // window.location.hash = 'input_bar';
        }, 250);
        this.resetSageSayCnt();
      }.bind(this));
      $('#input_bar input[type="text"]').on('blur', function(evt) {
        window.location.hash = '';
      });

      // can not be triggered
      // $('.ans_box .content .price .trade_price').on('transitionend webkitTransitionEnd oTransitionEnd', function(evt) {
      //   console.log('transitionend');
      // });
    },
    refreshStockQuotationInViewport: function() {
      var updateStockQuotationNode = function(node, item) {
        var content = item.content;
        var pchg_state = content.pchg_state;
        var tradeTime = content.tradeTime;
        var tradePrice = content.tradePrice;
        var change = content.change;
        var formated_pchg = content.formated_pchg;
        $.output(pchg_state);
        $.output(tradeTime);
        $.output(tradePrice);
        $.output(change);
        $.output(formated_pchg);
        var priceNode = node.querySelector('.content .price');
        var tradeTimeNode = node.querySelector('.header .trade_time');
        if (tradeTimeNode) {
          tradeTimeNode.textContent = tradeTime;
        }
        ['up', 'down', 'stay'].forEach(function(it) {
          priceNode.classList.remove(it);
        });
        priceNode.classList.add(pchg_state);

        var tradePriceNode = priceNode.querySelector('.trade_price');
        var prePriceNode = tradePriceNode.querySelector('.pre');
        var nowPriceNode = tradePriceNode.querySelector('.now');
        if (prePriceNode.textContent !== tradePrice) {
          $(tradePriceNode).one('transitionend', function(evt) {
            var target = evt.target;
            prePriceNode.textContent = nowPriceNode.textContent;
            target.classList.remove('move_up');
            console.log('transitionend');
          });
          nowPriceNode.textContent = tradePrice;
          tradePriceNode.classList.add('move_up');
        } else {
          $.output('the same: trade price.');
        }

        var priceChangeNode = priceNode.querySelector('.price_change');

        var changeNode = priceChangeNode.querySelector('.change');
        var preChangeNode = changeNode.querySelector('.pre');
        var nowChangeNode = changeNode.querySelector('.now');
        if (preChangeNode.textContent !== change) {
          $(changeNode).one('transitionend', function(evt) {
            var target = evt.target;
            preChangeNode.textContent = nowChangeNode.textContent;
            target.classList.remove('move_up');
            console.log('transitionend');
          });
          nowChangeNode.textContent = change;
          changeNode.classList.add('move_up');
        } else {
          $.output('the same: change.');
        }

        var pchgNode = priceChangeNode.querySelector('.pchg');
        var prePchgNode = pchgNode.querySelector('.pre');
        var nowPchgNode = pchgNode.querySelector('.now');
        if (prePchgNode.textContent !== formated_pchg) {
          $(pchgNode).one('transitionend', function(evt) {
            var target = evt.target;
            prePchgNode.textContent = nowPchgNode.textContent;
            target.classList.remove('move_up');
            console.log('transitionend');
          });
          nowPchgNode.textContent = formated_pchg;
          pchgNode.classList.add('move_up');
        } else {
          $.output('the same: pchg.');
        }

      };
      Array.prototype.slice.call(document.querySelectorAll('#stock_quotation')).forEach(function(quotationNode) {
        if (! $.isElementNotInViewport(quotationNode)) {
          if (! 'code' in quotationNode.dataset) {
            return;
          }
          var secode = quotationNode.dataset.code;
          this.netConnector.askServer({
            type: 'ASK',
            question: secode
          }, function(err, formated_contents) {
            if (err) {
              return;
            }
            formated_contents.forEach(function(formated_content) {
              if (formated_content.style === this.answerStyle.STOCK_QUOTATION) {
                updateStockQuotationNode(quotationNode, formated_content);
              }
            }.bind(this));
          }.bind(this));
        }
      }.bind(this));
    },
    resetSageSayCnt: function() {
      this.sageSayCnt = 0;
    },
    startHeartBeat: function() {
      var stockQuotationCnt = 0;
      $.output('start interval');
      this.heartBeatInterval = setInterval(function() {
        stockQuotationCnt += 1;
        if (stockQuotationCnt > 6) {
          stockQuotationCnt = 0;
          this.refreshStockQuotationInViewport();
        }
        this.sageSayCnt += 1;
        $.output(this.sageSayCnt);
        if (this.sageSayCnt > 30) {
          var today = $.toLocaleFormat(new Date(), 'yyyy-MM-dd');
          var tagSageSay = null;
          if (window.localStorage.tagSageSay) {
            tagSageSay = JSON.parse(window.localStorage.tagSageSay);
          } else {
            tagSageSay = {
              'readme': '记录sage主动询问的状态'
            }
          }
          // the first tip
          if (!'date' in tagSageSay) {
            tagSageSay.date = today;
            tagSageSay.sayTimes = 1;
            this.siriSay('firstTip');
            window.localStorage.tagSageSay = JSON.stringify(tagSageSay);
          } else if (tagSageSay && today !== tagSageSay.date) {
            tagSageSay.date = today;
            tagSageSay.sayTimes = 1;
            this.siriSay('firstTip');
            window.localStorage.tagSageSay = JSON.stringify(tagSageSay);
          }
          // the second tip
          if (this.sageSayCnt > 35) {
            if (tagSageSay && 'sayTimes' in tagSageSay && tagSageSay.sayTimes < 2) {
              tagSageSay.sayTimes = 2;
              this.siriSay('secondTip');
              window.localStorage.tagSageSay = JSON.stringify(tagSageSay);
            }
            this.resetSageSayCnt();
          }
        }
      }.bind(this), 1000);
    },
    siriSay: function(content) {
      if (!content || content.length === 0) {
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
              style: this.answerStyle.PLAIN_TEXT,
              content: '您好，我是哲，私人理财专家，有关股票证券问题都可以问我。'
            }];
          }
          var cardNode = this.createCard({
            type: this.cardStyle.SIRI_SAY,
            content: formated_contents,
          });
          this.scrollAnimate();
        }.bind(this));
      }
    },
    askSIRI: function(question) {
      if (!question || question.length === 0) {
        return;
      }
      question = question.trim();
      if (question.length > 0) {
        var cardNode = this.createCard({
          type: this.cardStyle.USER_ASK,
          content: question,
        });
        // scroll ask first
        this.scrollAnimate();
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
          // hide loading of current card.
          this.hideLoading(cardNode);
          var answerDOM = formated_contents.map(function(it) {
            return this.createAnswerDOM(it);
          }.bind(this)).join('');
          cardNode.append($(answerDOM));
          this.scrollAnimate();
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
          // no break; is needed as return before
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
          '<div class="ans_box" id="stock_quotation" data-code="' + content.tradeCode + '">' +
            '<div class="header">' +
              '<div class="title">' + content.tradeName + '&nbsp' + content.tradeCode + '</div>' +
              '<div class="status">' + content.stockStatus + '&nbsp&nbsp' + content.tradeDate + '&nbsp&nbsp<span class="trade_time">' + content.tradeTime + '</span></div>' +
            '</div>' +
           ' <div class="content">' +
              '<div class="price item ' + content.pchg_state +'">' +
                '<div class="trade_price_container">' +
                  '<div class="trade_price"><span class="pre">' + content.tradePrice + '</span><span class="now"></span></div>' +
                '</div>' +
                '<div class="price_change">' +
                  '<div class="change_container">' +
                    '<div class="change"><span class="pre">' + content.change + '</span><span class="now">123</span></div>' +
                  '</div>' +
                  '<div class="pchg_container">' +
                    '<div class="pchg"><span class="pre">' + content.formated_pchg + '</span><span class="now">234</span></div>' +
                  '</div>' +
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
              '<td>' + it.topen + '</td><td class="pchg ' + it.pchg_state +'">' + it.formated_pchg + '</td></tr>';
          }).join('');
          var answerDom = 
          '<div class="ans_box" id="hot_stocks">' +
            '<div class="header">会牛智选</div>' +
            '<div class="content">' +
              '<div class="title">今日入选（'  + content.date + '）</div>' +
              '<table class="stock_list">' +
              '<tr><th>股票名称</th><th>入选价</th><th>最新涨幅</th></tr>' + tableContent +
              '</table>' +
            '</div>' +
            '<a class="footer" href="' + content.link.link + '">' + content.link.text +'&nbsp></a>' +
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
      var e = 16,
        t = $(".card");
      if (t.length > e) {
        for (var s = 0, i = t.length - e; s < i; s++) {
          $(t[s]).remove();
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
          askDom = '<div class="ask_row"><span>' + options.content + '</span></div>';
          answerDom = this.createAnswerDOM({
            style: this.answerStyle.WAITING,
          });
          break;
      }
      if ('selectStockTips' == options.type) {
        askDom = '';
        answerDom = this.createAnswerDOM(options);
      } else if ('onlyAnswer' == options.type) {
        askDom = '';
        answerDom = this.createAnswerDOM(options);
      }
      var card = $('<div id="' + this.cardName + '" class="card" style="overflow: hidden;">' + askDom + answerDom + '</div>');
      card.insertBefore($('#bottomDiv'));
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
    hideLoading: function(cardNode) {
      cardNode.find('.answer_row .ans_cont .ans_box .dots_loading').closest('.answer_row').remove();
    },
    scrollAnimate: function() {
      var scrollTop = false;
      if (scrollTop) {
        this.bottomDiv();
        this.scrollTopAnimate();
      } else {
        this.scrollBottomAnimate();
      }
    },
    bottomDiv: function() {
      var curCard = $('#' + this.cardName);
      var cardHeight = curCard.height();
      var bootomHeight = this.wrapperHeight - cardHeight;
      if ((this.wrapperHeight - cardHeight) > 0) {
        bootomHeight = this.wrapperHeight - cardHeight;
      } else {
        bootomHeight = 0;
      }
      $('#bottomDiv').css('height', bootomHeight);
    },
    scrollTopAnimate: function(e) {
      var self = this;
      var goOn = true,
        timeUsed = 300,
        cardTop = document.getElementById(this.cardName).offsetTop,
        wrapperTop = this.dialogWrapper.scrollTop,
        interval = 40,
        step = (cardTop - wrapperTop) / timeUsed * interval;
      var scrollFunc = function() {
        if (Math.abs(wrapperTop - cardTop) > step) {
          if (goOn) {
            wrapperTop += step;
            self.dialogWrapper.scrollTop = wrapperTop;
            window.setTimeout(scrollFunc, interval);
          } else {
            wrapperTop = cardTop;
            goOn = false;
            self.dialogWrapper.scrollTop = wrapperTop;
          } 
        } else {
          wrapperTop = cardTop;
          self.dialogWrapper.scrollTop = wrapperTop;
          goOn = false;
        }
      };
      scrollFunc();
      setTimeout(function() {
        goOn = false;
      }, timeUsed + 200);
    },
    scrollBottomAnimate: function() {
      var self = this;
      var timeUsed = 300;
      var  interval = 40;
      var cardDOM = document.getElementById(this.cardName);
      var cardTop = cardDOM.offsetTop;
      var cardBottom = cardTop + cardDOM.clientHeight;
      var wrapperTop = this.dialogWrapper.scrollTop;
      var bottomDivHeight = 0;
      var wrapperBottom = wrapperTop + this.wrapperHeight - bottomDivHeight;
      if (wrapperBottom > cardBottom) {
        return;
      }
      var goOn = true;
      var step = (cardBottom - wrapperBottom) / timeUsed * interval;
      var scrollFunc = function() {
        if (Math.abs(cardBottom - wrapperBottom) > step) {
          if (goOn) {
            wrapperTop += step;
            self.dialogWrapper.scrollTop = wrapperTop;
            wrapperBottom += step;
            window.setTimeout(scrollFunc, interval);
          } else {
            wrapperTop = wrapperTop + cardBottom - wrapperBottom;
            goOn = false;
            self.dialogWrapper.scrollTop = wrapperTop;
          }
        } else {
          wrapperTop = wrapperTop + cardBottom - wrapperBottom;
          self.dialogWrapper.scrollTop = wrapperTop;
          goOn = false;
        }
      };
      scrollFunc();
    },
    openUrl: function(e) {
      location.href = e.url;
    },
    createIframe: function(e) {
      var t = e.url,
        s = $(window).width() - 50 - 26,
        i = document.createElement('iframe');
      return i.name = e.cardName, i.setAttribute('style', 'visibility:hidden;overflow: hidden;'), i.setAttribute('width', s), i.setAttribute('border', 'none'), i.setAttribute('frameborder', 'no'), i.setAttribute('src', t), i.onerror = function() {}, i
    },
    showIframe: function(e) {
      var t = $(window).width() - 50 - 26,
        s = document.getElementsByName(e.cardName)[0];
      $(s.contentWindow.document.body).width(t + 'px');
      var i = this;
      setTimeout(function() {
        i.updateIframe(e), $(s).attr('style', 'visibility：visible;overflow: hidden;');
      }, 10);
    },
    updateIframe: function(e) {
      var t = e.cardName;
      if (document.getElementsByName(t).length > 0) {
        var s = document.getElementsByName(t)[0],
          i = $(s.contentWindow.document.body)[0].offsetHeight + 12,
          a = $(window).width() - 50 - 26;
        $(s.contentWindow.document.body).width(a + 'px'), $(s).attr('height', i), $(s).attr('width', a), this.bottomDiv(e);
      }
    },
  };
  var benewSIRI = new BenewSIRI();
  benewSIRI.init();
  window.benewSIRI = benewSIRI;
}();
