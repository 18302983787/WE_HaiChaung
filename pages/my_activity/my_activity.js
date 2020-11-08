// pages/my_activity/my_activity.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_acts:[],
    user_session:"",
    isTabA: true,
    isTabB: false
  },
  go_back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  goto_detail:function(){
    wx.navigateTo({
      url: '../details/details',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserSession()
    this.getMyAct()
  },

  getUserSession:function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        that.setData({
          user_session:e.data
        })
      }
    })
  },

  getMyAct: function(){
    console.log(app.globalData.user_session)
    var that = this
    wx.request({
      url: 'https://haichuanghao.com/api/get_my_activity',
      data:{
        "user_session":app.globalData.user_session,
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        that.setData({
          my_acts:res.data
        })
      }
    })
  },

  gotoTab: function(e) {
    if (e.currentTarget.dataset.tab === "1") {
      this.setData({
        isTabA: true,
        isTabB: false
      })
    } else if (e.currentTarget.dataset.tab === "2") {
      this.setData({
        isTabA: false,
        isTabB: true
      })
    }
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
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        return ;
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url: '../index/index'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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