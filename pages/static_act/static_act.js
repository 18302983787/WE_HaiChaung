// pages/static_act/static_act.js
var app = getApp()
Page({
  goto_activity:function(e){
    console.log("goto activity", e)
    var act=e.currentTarget.dataset;
    wx.navigateTo({
      // url: '../details/details',
      url: '../out_link/out_link',
      success: function(res){
        res.eventChannel.emit('dataFromOpenPage',act)
      }
    })
  }, 
  
  /**
   * 页面的初始数据
   */
  data: {
    // 自定义tarbar
    currentTab: 0,
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
    // banner
    imgUrls: [
    ],
    indicatorDots: true, //是否显示面板指示点
    // autoplay: true, //是否自动切换
    // interval: 3000, //自动切换时间间隔,3s
    // duration: 1000, //  滑动动画时长1s
    activities:{},
    user_session:"",
    is_signed:"",
 },

  swichNav: function (e) {
    console.log("static rec e:",e)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        wx.switchTab({
          url: '../activity/activity',
        })
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        return ;
      }
    })
    this.getActData();
  },

  getActData:function(){
  var that = this;
  wx.request({
    url: 'https://haichuanghao.com/api/get_activity',
    data:{
      "user_session":that.data.user_session
    },
    header:{
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    method:"POST",
    success(res){
      console.log(res)
      that.setData({
        activities:res.data.data
      })
    },
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