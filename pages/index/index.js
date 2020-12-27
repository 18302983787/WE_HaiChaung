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

  onLoad: function (){
  },
  

  goto_regist:function(e){
    var that = this
    this.wxlogin();
    
  },

  wxlogin: function (e) {
    var that = this;
    wx.login({
      success(res){
        if (res.code){
          wx.showLoading({
            title: '正在登录...',
          })
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
              that.setData({
                user_session:res.data.user_session,
              })
              wx.request({
                url: 'https://haichuanghao.com/api/update_head_image',
                data:{
                  "user_session":res.data.user_session,
                  "head_image_url":e.detail.userInfo.avatarUrl,
                },
                header:{
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                method:"POST",
                success(res){
                  console.log(res.data)
                }
                })
              wx.setStorageSync('user_session', res.data.user_session)
              wx.setStorageSync('head_image_url', e.detail.userInfo.avatarUrl)
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
              wx.hideLoading()
          },
          })
        } else{
          console.log("登录失败" + res.errMsg)
        }
    }
  })
}
})
