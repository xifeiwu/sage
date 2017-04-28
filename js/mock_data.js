/* jshint ignore:start */
var mockData = {
  'recommend': {
    "code": "0",
    "dt": 1493357767093,
    "status": "success",
    "token": "F16C043B843E46858E82B3005D99C167",
    "content": [{
      "type": "recommend",
      "data": {
        "body": [{
          "studio": "你可以这样问",
          "items": ["600519", "热议", "选股", "开户", "预测"]
        }, {
          "studio": "你可以这样问",
          "items": ["选股", "洗盘", "乐视网", "市盈率", "热议"]
        }],
        "predictLinks": []
      }
    }]
  },

  'hi': {
    "code": "0",
    "dt": 1493357767111,
    "status": "success",
    "token": "F16C043B843E46858E82B3005D99C167",
    "content": [{
      "type": "plain",
      "data": {
        "body": "您好，我是哲，您的私人投资专家，有证券投资问题都可以问我",
        "predictLinks": []
      }
    }, {
      "type": "plain",
      "data": {
        "body": "今天我学习了回答股票行情明细，快来试试吧 <p>你可以这样问>></p><p><a class=\"active_link\">市盈率</a> <a class=\"active_link\">流通市值</a> <a class=\"active_link\">前收盘价</a></p>",
        "predictLinks": []
      }
    }]
  },

  'stock_quotation': {
    "code": "0",
    "dt": 1493358939114,
    "status": "success",
    "token": "F16C043B843E46858E82B3005D99C167",
    "content": [{
      "type": "plain",
      "data": {
        "body": "这是<span class=\"stock_code\">300386</span><span class=\"stock_name\">飞天诚信</span>的行情",
        "predictLinks": []
      }
    }, {
      "type": "quotation",
      "data": {
        "body": {
          "tradeVolume": 800,
          "sd2": 0,
          "turnRate": 0.009958,
          "secode": "2010008260",
          "thigh": 19.53,
          "pchg": -0.00463,
          "tradeNum": 1844,
          "limitUp": 21.38,
          "buyVolume5": [1500, 4100, 6522, 18200, 4400],
          "totalMarketValue": 808915.1400000001,
          "sellVol": 1005864,
          "limitDown": 17.5,
          "totalAskVolume": 0,
          "buyVol": 690818,
          "totalValueTraded": 32917791,
          "tradeName": "飞天诚信",
          "tlow": 19.25,
          "sellVolume5": [20000, 7600, 900, 1500, 2000],
          "stockStatus": "T",
          "syl2": 0,
          "buyPrice5": [19.34, 19.32, 19.31, 19.3, 19.29],
          "iopv": 0,
          "syl1": 6763,
          "stockAmplitude": 0.014403,
          "totalBidVolume": 0,
          "yieldToMaturity": 0,
          "windCode": "300386.SZ",
          "stockType": "SZMD002",
          "sellPrice5": [19.41, 19.4, 19.39, 19.38, 19.35],
          "change": -0.09,
          "topen": 19.44,
          "tradeCode": "300386",
          "tradeValue": 15480,
          "tradeDate": "20170428",
          "infoPrefix": "....",
          "version": "V1",
          "timeShort": "1355",
          "weightedAvgBidPrice": 0,
          "tradeTime": "135533000",
          "tradeMinute": "1355",
          "tradeTotalVolume": 1696682,
          "circulationMarketValue": 329683.75587000005,
          "weightedAvgAskPrice": 0,
          "tradePrice": 19.35,
          "lclose": 19.44
        },
        "predictLinks": [{
          "text": "预测",
          "style": "btn",
          "link": "",
          "value": "预测"
        }, {
          "text": "热度",
          "style": "btn",
          "link": "",
          "value": "热度"
        }]
      }
    }]
  },
}
/* jshint ignore:end */