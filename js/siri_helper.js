'use strict';
var NetConnector = function() {
  this.profile = 'uat';
  this.answerStyle = {
    'WAITING': 1,
    'ASK_HINT': 2,
    'PLAIN_TEXT': 3,
    'STOCK_QUOTATION':4,
    'HOT_STOCKS': 5,
    'STOCK_HOT': 6,
    'STOCK_FORECAST': 7
  };
};

NetConnector.prototype = {
  setToken: function(token) {
    if (token && localStorage.token !== token) {
      window.localStorage.token = token;
    }
  },

  getAjaxHost: function(profile) {
    var host = null;
    switch (profile) {
      case 'uat_ip':
        host = 'http://10.19.93.129:8090/';
        break;
      case 'uat':
        host =  'http://mtest.iqianjin.com/';
        break;
      case 'product':
        host = 'https://m.benew.com.cn/';
        break;
    }
    return host;
  },

  getQueryString: function(obj) {
    var queryString = [];
    for (key in obj) {
      var value = obj[key];
      if (value === null) {
        continue;
      }
      value = value.toString();
      if (key.length > 0 && value.length > 0) {
        queryString.push(key + '=' + obj[key]);
      }
    }
    return queryString.join('&');
  },

  _getURL: function(options) {
    var askType = options.askType;
    var host = this.getAjaxHost(this.profile);
    var token = window.localStorage.token;
    var path = null;
    switch (askType) {
      case 'FIRST_ASK':
        path = 'bot/api/v1/botServer/sessionOperator/receiveh5?' + this.getQueryString({
          'benew_id': options.benewId,
          'token': token,
          'msg': options.question
        });
        break;
      case 'ASK':
        path = 'bot/api/v1/botServer/sessionOperator/receiveh5?' + this.getQueryString({
          'token': token,
          'msg': options.question
        });
        break;
      case 'REFRESH':
        path = 'bot/api/v1/botServer/sessionOperator/flashh5?' + this.getQueryString({
          'token': token,
          'msg': options.question
        });
        break;
    }
    return host + path;
  },

  // 函数节流, 避免同一个接口短时间内被重复调用
  throttle: function(method, paramsObj) {
    if (typeof(method) !== 'function') {
      return;
    }
    clearTimeout(method.timeoutId);
    method.timeoutId = setTimeout(function() {
      try {
        if (typeof(paramsObj) === 'object') {
          method.call(null, paramsObj);
        } else {
          method.call(null);
        }
      } catch (e) {
        console.log(e);
      }
    }, 300);
  },

  askServer: function(options, cb) {
    var askType = options.askType;
    switch (askType) {
      case 'FIRST_ASK':
        this._getSIRIAnswer(options, cb);
        break;
      case 'ASK':
        this._getSIRIAnswer(options, cb);
        break;
      case 'REFRESH':
        this._getSIRIAnswer(options, cb);
        break;
      default:
        this._getSIRIAnswer(options, cb);
        // this.throttle(function() {
        //   this._getSIRIAnswer(question, cb);
        // }.bind(this));
        break;
    }
  },

  _getSIRIAnswer: function(options, cb) {
    var self = this;
    // the data from server
    // var response = this.recommendAnswer;
    // var response = this.choosedStocks;
    // var response = this.quotationAnswer;
    var successCB = function(response) {
      self.setToken(response.token);
      var contents = response.content;
      var formated_contents = [];
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
              });
              break;
            case 'forecast':
              formated_contents.push({
                style: self.answerStyle.STOCK_FORECAST,
                content: content.data.body
              });
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
    };

    var url = this._getURL(options);
    $.output(url);
    $.ajax({
      url : url,
      type : 'get',
      contentType : 'application/json;charset=utf-8',
      dataType : 'json',
      timeout: 12000,
      success : function(response) {
        $.output(response);
        if (parseInt(response.code) === 0) {
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
    body.date = $.toLocaleFormat(new Date(date), 'yyyy.MM.dd');
    body.stocks.forEach(function(it) {
      var topen = parseFloat(it.topen);
      var pchg = parseFloat(it.pchg) * 100;
      var pchg_state = '';
      it.topen = topen.toFixed(2);
      if (pchg > 0) {
        pchg = '+' + pchg.toFixed(2) + '%';
        pchg_state = 'up';
      } else if (pchg < 0) {
        pchg = pchg.toFixed(2) + '%';
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
    var tradePrice = body.tradePrice;
    body.tradePrice = tradePrice.toFixed(2);
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
      pchg = pchg.toFixed(2) + '%';
      pchg_state = 'down';
    } else {
      pchg = pchg.toFixed(2) + '%';
      pchg_state = 'stay';
    }
    body.formated_pchg = pchg;
    body.pchg_state = pchg_state;
    var change = body.change;
    if (change > 0) {
      change = '+' + change;
    }
    body.change = change;
    body.thigh = body.thigh.toFixed(2);
    body.topen = body.topen.toFixed(2);
    body.tlow = body.tlow.toFixed(2);
    body.lclose = body.lclose.toFixed(2);
    var links = [];
    predictLinks.forEach(function(it) {
      links.push(it.text);
    });
    body.links = links;
    return body;
  },
};
