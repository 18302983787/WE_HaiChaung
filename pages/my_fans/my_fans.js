// pages/my_fans/my_fans.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_session:"",
    my_fans:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserSession();
    this.getMyFans();
   },

  getUserSession:function(){
    var that = this;
    wx.getStorage({
      key: 'user_session',
      success(e){
        that.setData({
          "user_session":e.data
        })
      }
    })
  },
  //获取用户所有的粉丝
  getMyFans:function(){
    var that = this;
    // console.log("current user session:");
    // console.log(app.globalData.user_session);
    wx.request({
      url: 'https://haichuanghao.com/api/get_my_relation',
      data:{
        "type":"fans",
        "user_session":"test_user_session_tony",
      },
      header:{
        // 'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        console.log(res.data)
        that.setData({
          "my_fans":res.data
        })
      }
    })
  },
 
  go_back:function(){
    wx.navigateBack({
      delta: 0,
    })
  }
})