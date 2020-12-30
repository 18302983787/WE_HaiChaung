// pages/user_center/user_center.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
     // 自定义tarbar
     currentTab: 2,
     items: [
       {
         "text": "活动",
         "iconPath": "/pages/images/tabBar/activity_n.png",
         "selectedIconPath": "/pages/images/tabBar/activity.png"
       },
       {
         "text": "招聘",
         "iconPath": "/pages/images/tabBar/job_n.png",
         "selectedIconPath": "/pages/images/tabBar/job.png"
       },
       {
         "text": "我的",
         "iconPath": "/pages/images/tabBar/me_n.png",
         "selectedIconPath": "/pages/images/tabBar/me.png"
       }
     ],
    user_info:"",
  },

  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current==0){
        wx.navigateTo({
          url: '/pages/static_act/static_act',
        })
      } else if (e.target.dataset.current==1){
        wx.navigateTo({
          url: '/pages/static_recruit/static_recruit',
        })
      } else if (e.target.dataset.current==2){
        wx.navigateTo({
          url: '/pages/static_user_center/static_user_center',
        })
      }
    }
  },

  wxlogin: function (e) {
    console.log(e)
    var that = this;
    wx.login({
      success(res){
      console.log("login success res:", res)

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
              console.log("onlogin success res:", res)
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("监听到onShow函数")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("监听到页面隐藏")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("监听到页面卸载")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})