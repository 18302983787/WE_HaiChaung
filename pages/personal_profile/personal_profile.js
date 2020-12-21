// pages/personal_profile/personal_profile.js
var app = getApp()
Page({
 data:{
   user_info:"",
 },


  go_back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },

  onLoad: function (options) {
    this.getUserSession()
  },

  getUserSession:function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/get_personal_info',
          method:"POST",
          header:{
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data:{
            "table":"hc_user",
            "user_session":e.data,
          },
          success(res){
            console.log(res.data)
            that.setData({
              user_info:res.data.data
            })
          }
        })
      }
    })
  }
})

