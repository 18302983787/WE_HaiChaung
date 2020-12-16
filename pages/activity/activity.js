// pages/activity/activity.js
var app = getApp()
Page({
  goto_activity:function(e){
    console.log(e)
    var act=e.currentTarget.dataset;
    wx.navigateTo({
      url: '../details/details',
      success: function(res){
        res.eventChannel.emit('dataFromOpenPage',act)
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    // banner
    imgUrls: [
      '../images/activity/demo_1.jpg',
      '../images/activity/demo_2.jpg',
      '../images/activity/demo_3.jpg',
    ],
    indicatorDots: true, //是否显示面板指示点
    // autoplay: true, //是否自动切换
    // interval: 3000, //自动切换时间间隔,3s
    // duration: 1000, //  滑动动画时长1s
    activities:{},
    user_session:"",
    is_signed:"",
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserSession();
  },

  getActData:function(){
    var that = this;
    wx.request({
      url: 'https://haichuanghao.com/api/request_info',
      data:{
        "table":"hc_activity"
      },
      header:{
        // 'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        that.setData({
          activities:res.data
        })
      }
    })
  },

  getUserSession:function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        that.setData({
          user_session:e.data
        })
        that.getActData();
      }
    })
  },


  signUp:function(e){
    console.log(e.currentTarget.dataset.uid)
    var that = this
    wx.request({
      url: 'https://haichuanghao.com/api/sign_up',
      data:{
        "act_uid":e.currentTarget.dataset.uid,
        "table_name":"hc_activity_sign",
        "user_session":that.data.user_session,
      },
      header:{
        // 'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        console.log("res", res.data.status)
        if (res.data.status=="success"){
          wx.showToast({
            title: '报名成功',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        } else if (res.data.status=="signed"){
          wx.showToast({
            title: '已经报名过啦',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        } else if (res.data.status=="full"){
          wx.showToast({
            title: '报名人数已满',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        } else if (res.data.status=="error"){
          wx.showToast({
            title: '报名失败，请稍后重试',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        } else{
          wx.showToast({
            title: '未知错误，请联系相关技术人员',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        }
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