//app.js
App({
  globalData:{
    user_session:""
  },
  onLaunch: function () {
    var _this=this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },  
})