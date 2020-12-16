//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    motto: '海归必加，高层次人才必加平台',
    userInfo: {},
    user_session:"",
    user_head_image:"",
    is_regist:false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
  },
  
  goto_regist:function(){
    this.wxlogin();
  },

  wxlogin: function () {
    var that = this;
    wx.login({
      success(res){
        // wx.getUserInfo({
        //   success: function (res) {
        //     console.log(res);
        //     var avatarUrl = 'userInfo.avatarUrl';
        //     var nickName = 'userInfo.nickName';
        //     that.setData({
        //       [avatarUrl]: res.userInfo.avatarUrl,
        //       [nickName]: res.userInfo.nickName,
        //     })
        //   }
        // })
        if (res.code){
          wx.request({
            url: 'https://haichuanghao.com/api/onLogin',
            method:"POST",
            header:{
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data:{
              "code":res.code,
            },
            success(res){
              app.globalData.user_session = res.data.user_session
              that.setData({
                user_session:res.data.user_session,
              })
              wx.setStorageSync('user_session', res.data.user_session)
              if (res.data.status === 'success'){
              console.log("登录成功")
              wx.switchTab({
                url: '../activity/activity',
              })
              }
              else{
                console.log("用户未注册，无法登录")
                wx.redirectTo({
                  url: '../regist/regist',
                })
              }
          },
          })
        } else{
          console.log("登录失败" + res.errMsg)
        }
    }
  })
}
})
