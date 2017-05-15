# sage

This is the front-end part of project sage.

## 数据

|type|含义|
| ---- |:--:|
|recommend | 推荐页面|
|plain | 文本内容|
|quotation | 行情|
|hot | 热度|
|forcast | 预测|
|optimization | 选股|

## 发布
发布地址(uat及product)：<http://10.10.221.28/>

    benew-botweb-uat
    benew-botweb-prod

## 后台交互规范
1. 服务端主动提示（服务器在不能理解用户输入内容是，会给用户一个可提问问题的列表，在列表中会包含会牛的一些特色功能）

  规范：

  `使用answer_row中，通过show_ask_hint类来标示链接`

  示例：

  ```
<div data-id="971187" class="card" data-style="user_ask" style="overflow: hidden;" id="1494839192510">
  <div class="ask_row"><span>ee</span></div>
  <div class="answer_row">
    <div class="ans_logo"><i class="benew_logo"></i></div>
    <div class="ans_cont">
      <div class="ans_box">阿</div>
    </div>
  </div>
  <div class="show_ask_hint"><span>你可以这样问我 &gt;</span></div>
</div>
```

1. 文本内容(type=plain)中需要突出的部分

  规范：

  给结点添加类key_point

  示例：

  `<span class="key_point">这是文本中需要突出的部分</span>`


1. 用户点击对话的部分链接，可以直接当做用户提问。

  规范：

  添加active_link类，可以用data-question制定想问的问题，默认问题为结点内的文本。

  示例：

  ```
  <p>
    <a class="active_link" data-question="市盈率">市盈率</a>
    <a class="active_link">流通市值</a>
    <a class="active_link">前收盘价</a>
  </p>
  ```

## APP交互

1. 事件驱动<https://m.benew.com.cn/app/event-driven/event-driven.html>

  ```
if (self.platform === 'Android') {
  window.android.gotoNativeWebActivity('事件驱动', 'event-driven/event-driven.html');
} else if (self.platform === 'iOS') {
  window.webkit.messageHandlers.gotoEventDriven.postMessage({});
}
```

1. 中长线机会<https://m.benew.com.cn/app/long/long.html>

  ```
if (self.platform === 'Android') {
  window.android.gotoNativeWebActivity('中长线机会', 'long/long.html');
} else if (self.platform === 'iOS') {
  window.webkit.messageHandlers.gotoLongOpportunity.postMessage({});
}
```

1. 短线机会<https://m.benew.com.cn/app/short/short.html>

  ```
if (self.platform === 'Android') {
  window.android.gotoNativeWebActivity('短线机会', 'short/short.html');
} else if (self.platform === 'iOS') {
  window.webkit.messageHandlers.gotoShortOpportunity.postMessage({});
}
```

1. 股票池<https://m.benew.com.cn/app/stockpool-v2/stockpool.html>

  ```
  if (self.platform === 'Android') {
    window.android.gotoStockPool();
  } else if (self.platform === 'iOS') {
    window.webkit.messageHandlers.gotoStockPool.postMessage({});
  }
  ```

1. 看涨榜<https://m.benew.com.cn/#/rank/up>

  ```
if (self.platform === 'Android') {
  var url = window.__env.getOrigin() + '/#/rank/up';
  var title = '看涨榜';
  window.android.gotoWebActivity(url, title);
} else if (self.platform === 'iOS') {
  window.webkit.messageHandlers.riseRank.postMessage({});
}
```

1. 预测榜<https://m.benew.com.cn/#/rank/forecast>

  ```
if (self.platform === 'Android') {
  var url = window.__env.getOrigin() + '/#/rank/forecast';
  var title = '预测榜';
  window.android.gotoWebActivity(url, title);
} else if (self.platform === 'iOS') {
  window.webkit.messageHandlers.forecastRank.postMessage({});
}
```

1. 热议飙升<https://m.benew.com.cn/#/rank/hotrise>

  ```
if (self.platform === 'Android') {
  var url = window.__env.getOrigin() + '/#/rank/hotrise';
  var title = '热议飙升';
  window.android.gotoWebActivity(url, title);
} else if (self.platform === 'iOS') {
  window.webkit.messageHandlers.gotoHotRise.postMessage({});
}
```

1. 全网热议<https://m.benew.com.cn/#/rank/hot>

  ```
if (self.platform === 'Android') {
  var url = window.__env.getOrigin() + '/#/rank/hot';
  var title = '全网热议';
  window.android.gotoWebActivity(url, title);
} else if (self.platform === 'iOS') {
  window.webkit.messageHandlers.hotRank.postMessage({});
}
```