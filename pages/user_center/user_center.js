// pages/user_center/user_center.js
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info:"",
  },

  goto_follow:function(){
    wx.navigateTo({
      url: '../my_follow/my_follow',
    })
  },
  goto_fans:function(){
    wx.navigateTo({
      url: '../my_fans/my_fans',
    })
  },
  goto_points:function(){
    wx.navigateTo({
      url: '../my_follow/my_follow',
    })
  },
  goto_pf:function(){
    wx.navigateTo({
      url: '../personal_profile/personal_profile',
    })
  },
  goto_act:function(){
    wx.navigateTo({
      url: '../my_activity/my_activity',
    })
  },
  goto_recruit:function(){
    wx.navigateTo({
      url: '../my_recruit/my_recruit',
    })
  },
  goto_identificate:function(){
    wx.navigateTo({
      url: '../my_identificate/my_identificate',
    })
  },
  goto_config:function(){
    wx.navigateTo({
      url: '../my_config/my_config',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getUserData()
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
  getUserData:function(){
    var that = this;
    wx.getStorage({
      key: 'user_session',
      success(e){
        that.setData({
          user_session:e.data
        })
      }
    }),
    console.log(that.data.user_session)
    wx.request({
      url: 'https://haichuanghao.com/api/get_user_info',
      data:{
        "user_session":"090e54a81a91aa89172202a90c1f2ba6"
      },
      header:{
        // 'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        console.log(res.data.data)
        that.setData({
          user_info:res.data.data
        })
      }
    })
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