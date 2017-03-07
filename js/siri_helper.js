var NetConnector = function() {
  this.profile = 'uat_ip';
  this.answerStyle = {
    'WAITING': 1,
    'ASK_HINT': 2,
    'PLAIN_TEXT': 3,
    'STOCK_QUOTATION':4,
    'HOT_STOCKS': 5,
    'STOCK_HOT': 6,
    'STOCK_FORECAST': 7
  };
}

NetConnector.prototype = {
  setToken: function(token) {
    // if (!localStorage.token) {
      localStorage.token = token;
    // }
  },

  getURL: function(question) {
    var host = $.getAjaxHost(this.profile);
    var path = 'bot/api/v1/botServer/sessionOperator/receiveh5?msg=' + question;
    var token = localStorage.token;
    return host + path + (token ? '&token=' + token : '');
  },

  askServer: function(options, cb) {
    var type = options.type;
    var question = options.question;
    switch (type) {
      case 'ASK_HINT':
        // this.getAskHint(cb);
        break;
      case 'ASK':
      default:
        this._getSIRIAnswer(question, cb);
        break;
    }
  },
  // getAskHint: function(cb) {
  //   var self = this;
  //   var token = localStorage.token;
  //   var url = this.getURL('recommend');
  //   $.output(url);
  //   $.ajax({
  //     url : url,
  //     type : "get",
  //     contentType : "application/json;charset=utf-8",
  //     dataType : "json",
  //     success : function(response) {
  //       $.output(response);
  //       if (response.code == 0) {
  //         if (response.token) {
  //           self.setToken(response.token);
  //         }
  //         var content = response.content;
  //         if (content[0].type === 'recommend') {
  //           cb(null, content[0]);
  //         }
  //       }
  //     },
  //     error : function(mXMLHttpRequest, mTextStatus, mErrorThrown) {
  //       cb(JSON.stringify(mXMLHttpRequest));
  //     }
  //   });
  // },
  _getSIRIAnswer: function(question, cb) {
    var self = this;
    // the data from server
    // var response = this.recommendAnswer;
    // var response = this.choosedStocks;
    // var response = this.quotationAnswer;
    var successCB = function(response) {
      self.setToken(response.token);
      var contents = response.content;
      var formated_contents = []
      for (var i = 0; i < contents.length; i++) {
        var content = contents[i];
        if ('type' in content) {
          switch(content.type) {
            case 'recommend':
              formated_contents = content;
              break;
              case 'help':
              formated_contents.push({
                style: self.answerStyle.ASK_HINT,
                content: content.data.body
              });
              break;
            case 'hot':
              formated_contents.push({
                style: self.answerStyle.STOCK_HOT,
                content: content.data.body
              })
              break;
            case 'forecast':
              formated_contents.push({
                style: self.answerStyle.STOCK_FORECAST,
                content: content.data.body
              })
              break;
            case 'plain':
              formated_contents.push({
                style: self.answerStyle.PLAIN_TEXT,
                content: content.data.body
              });
              break;
            case 'quotation':
              formated_contents.push({
                style: self.answerStyle.STOCK_QUOTATION,
                content: self._formatStockQuotation(content.data)
              });
              break;
            case 'optimization':
              formated_contents.push({
                style: self.answerStyle.HOT_STOCKS,
                content: self._formatHotStocks(content.data)
              });
              break;
          }
        }
      }
      cb(null, formated_contents);
    }

    var token = localStorage.token;
    var url = this.getURL(question);
    $.output(url);
    $.ajax({
      url : url,
      type : "get",
      contentType : "application/json;charset=utf-8",
      dataType : "json",
      timeout: 12000,
      success : function(response) {
        $.output(response);
        if (response.code == 0) {
          successCB(response);
        } else {
          cb(new Error('data not valid'));
        }
      },
      error : function(mXMLHttpRequest, mTextStatus, mErrorThrown) {
        cb(JSON.stringify(mXMLHttpRequest));
      }
    });
  },

  _formatHotStocks: function(data) {
    var body = data.body;
    var predictLinks = data.predictLinks;
    var date = body.date;
    var date = $.toLocaleFormat(new Date(date), 'yyyy.MM.dd');
    body.date = date;
    body.stocks.forEach(function(it) {
      var topen = parseFloat(it.topen);
      var pchg = parseFloat(it.pchg) * 100;
      var pchg_state = '';
      it.topen = topen.toFixed(2);
      if (pchg > 0) {
        pchg = '+' + pchg.toFixed(2) + '%';
        pchg_state = 'up';
      } else if (pchg < 0) {
        pchg = '-' + pchg.toFixed(2) + '%';
        pchg_state = 'down';
      } else {
        pchg = pchg.toFixed(2) + '%';
        pchg_state = 'stay';
      }
      it.formated_pchg = pchg;
      it.pchg_state = pchg_state;
    });
    body.link = predictLinks[0];
    return body;
  },
  _formatStockQuotation: function(data) {
    var body = data.body;
    var predictLinks = data.predictLinks;
    var stockStatus = '';
    switch (body.stockStatus.toUpperCase()) {
      case 'S':
        stockStatus = '开市前';
        break;
      case 'C':
        stockStatus = '集合竞价';
        break;
      case 'T':
        stockStatus = '交易中';
        break;
      case 'B':
        stockStatus = '休市';
        break;
      case 'E':
        stockStatus = '收盘';
        break;
      case 'P':
        stockStatus = '停牌';
        break;
    }
    body.stockStatus = stockStatus;
    var tradeDate = body.tradeDate;
    body.tradeDate = tradeDate.substr(4, 2) + '-' + tradeDate.substr(6, 2);
    var tradeTime = body.tradeTime;
    body.tradeTime = tradeTime.substr(0, 2) + ':' + tradeTime.substr(2, 2) + ':' + tradeTime.substr(4, 2);
    var pchg = body.pchg * 100;
    var pchg_state = '';
    if (pchg > 0) {
      pchg = '+' + pchg.toFixed(2) + '%';
      pchg_state = 'up';
    } else if (pchg < 0) {
      pchg = '-' + pchg.toFixed(2) + '%';
      pchg_state = 'down';
    } else {
      pchg = pchg.toFixed(2) + '%';
      pchg_state = 'stay';
    }
    body.formated_pchg = pchg;
    body.pchg_state = pchg_state;
    var links = [];
    predictLinks.forEach(function(it) {
      links.push(it.text);
    })
    body.links = links;
    return body;
  },

  set_test_data: function() {
    this.recommendAnswer =  {
      "code": 0,
      "dt": 1486624881551,
      "status": "success",
      "content": [{
        "type": "recommend",
        "data": {
          "body": [{
            "studio": "你可以这样问",
            "items": [
              "600519",
              "开户",
              "选股",
              "KDJ",
              "茅台行情"
            ]
          }, {
            "studio": "你可以这样问",
            "items": [
              "热议榜",
              "洗盘",
              "600519",
              "茅台指标",
              "茅台行情"
            ]
          }],
          "predictLink": []
        }
      }]
    };
    this.quotationAnswer = {
      "code": 0,
      "dt": 1486624881551,
      "status": "success",
      "content": [
        {
          "type": "plain", //plain或者其他没有匹配的模板统一走这个
          "data": {
            "body": "该股票行情如下：",
            "predictLink": []
          }
        }, 
        {
          "type": "quotation",
          "data": {
            "body": {
              "tradeName": "贵州茅台",
              "tradeCode": "600519",
              "stockStatus": "交易中",
              "tradePrice": 358.74,
              "change": "2.55%",
              "pchg": "10.01%",
              "tradeDate": "2017-02-22",
              "tradeTime": "10:37:03",
              "topen": 362.43,
              "lclose": 362.43,
              "thigh": 362.43,
              "tlow": 352.43
            },
            "predictLink": [{
              "text": "预测",
              "style": "isRed",
              "link": "",
              "value": "预测"
            }, {
              "text": "热点",
              "style": "",
              "link": "",
              "value": "热点"
            }, {
              "text": "选股",
              "style": "",
              "link": "http:\\#",
              "value": "选股"
            }]
          }
        }
      ]
    };
    this.choosedStocks = {
      "code": 0,
      "dt": 1486624881551,
      "status": "success",
      "content": [{
        "type": "optimization",
        "data": {
          "body": {
            "date": "2017-02-23",
            "stocks": [{
              "name": "航天电子",
              "code": "600879",
              "topen": 16.89,
              "pchg": "1.29%"
            }, {
              "name": "东方铁塔",
              "code": "002545",
              "topen": 11.82,
              "pchg": "-0.51%"
            }]
          },
          "predictLink": [{
            "text": "点击获取更多",
            "style": "link",
            "link": "http://#h5页面",
            "value": "点击获取更多"
          }]
        }
      }]
    };
  },
  createAnswer: function(e) {
    var t = $("#" + e.cardName).find(".answer_row .ans_cont").eq(1),
      s = "";
    if (t.addClass("temp_unvisible"), 1 == e.type)
      if (0 == this.sessionStatus) {
        var i = JSON.parse(e.data.SceneResult).sContent;
        t.html('<div class="ans_box">' + i + "</div>"), this.hideLoading(e), this.reSetDomStructure(e)
      } else {
        var a = {
          cardName: e.cardName,
          url: "/InvestAdvise/" + this.cardData[e.cardName].UrlKey + ".html?dt_from=" + this.from
        };
        if (this.sMultiCondition && (this.oldSMultiCondition = this.sMultiCondition), 1 == this.sessionStatus && "cardMoneyFlow" != this.cardData[e.cardName].UrlKey) {
          for (var r = 0; r < this.shareWords.length; r++) s += 0 == r ? this.shareWords[r] : "+" + this.shareWords[r];
          s += "+" + e.words, a.url = "/InvestAdvise/cardMoneyFlow.html?dt_from=" + this.from + "&words=" + encodeURIComponent(s) + "&returnPre=1"
        }
        var o = this.createIframe(a);
        $(o).appendTo(t)
      }
    else if (0 == e.type) {
      if ("" == this.cardData[e.cardName].UrlKey) return t.html('<div class="ans_box">这个问题表哥有点处理不过来，请稍后再试</div>'), this.reSetDomStructure(e), void this.hideLoading(e);
      var a = {
        cardName: e.cardName,
        url: "/InvestAdvise/" + this.cardData[e.cardName].UrlKey + ".html?dt_from=" + this.from
      };
      if ("cardMoneyFlow" == this.cardData[e.cardName].UrlKey) {
        var n = JSON.parse(e.data.SceneResult).vIAPickStock;
        if (0 == JSON.parse(e.data.SceneResult).iIsShowMultiCondCard && 1 == window.parent.intelligentAnswer.sessionStatus && (n = []), 0 == n.length) {
          for (var r = 0; r < this.shareWords.length; r++) s += 0 == r ? this.shareWords[r] : "+" + this.shareWords[r];
          "" != s ? s += "+" + e.words : s = e.words, a.url = a.url + "&words=" + encodeURIComponent(s) + "&returnPre=1"
        } else {
          this.shareWords.push(e.words);
          for (var r = 0; r < this.shareWords.length; r++) s += 0 == r ? this.shareWords[r] : "_" + this.shareWords[r];
          a.url = a.url + "&words=" + encodeURIComponent(s) + "&returnPre=0"
        }
        this.sMultiCondition && (this.oldSMultiCondition = this.sMultiCondition), this.sMultiCondition = JSON.parse(e.data.SceneResult).sMultiCondition
      }
      if (1 == this.sessionStatus && "cardMoneyFlow" != this.cardData[e.cardName].UrlKey) {
        this.sMultiCondition && (this.oldSMultiCondition = this.sMultiCondition);
        for (var r = 0; r < this.shareWords.length; r++) s += 0 == r ? this.shareWords[r] : "+" + this.shareWords[r];
        s += "+" + e.words, a.url = "/InvestAdvise/cardMoneyFlow.html?dt_from=" + this.from + "&words=" + encodeURIComponent(s) + "&returnPre=1"
      }
      var o = this.createIframe(a);
      $(o).appendTo(t)
    } else if (2 == e.type)
      if (0 == this.sessionStatus) {
        var d = JSON.parse(e.data.SceneResult);
        d = $.extend(d, e);
        var l = this;
        this.countDownJump(function() {
          l.reSetDomStructure(e)
        }, function() {
          l.reSetDomStructure(e)
        }, d)
      } else {
        var a = {
          cardName: e.cardName,
          url: "/InvestAdvise/" + this.cardData[e.cardName].UrlKey + ".html?dt_from=" + this.from
        };
        if (this.sMultiCondition && (this.oldSMultiCondition = this.sMultiCondition), 1 == this.sessionStatus && "cardMoneyFlow" != this.cardData[e.cardName].UrlKey) {
          for (var r = 0; r < this.shareWords.length; r++) s += 0 == r ? this.shareWords[r] : "+" + this.shareWords[r];
          s += "+" + e.words, a.url = "/InvestAdvise/cardMoneyFlow.html?dt_from=" + this.from + "&words=" + encodeURIComponent(s) + "&returnPre=1"
        }
        var o = this.createIframe(a);
        $(o).appendTo(t)
      }
  },
}
