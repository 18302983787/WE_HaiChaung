// pages/recruit/recruit.js
Page({
  goto_recruit:function(e){
    console.log(e)
    var act=e.currentTarget.dataset;
    wx.navigateTo({
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
    currentTab: 1,
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

    // swiper
    imgUrls: [
      'http://haichuanghao.com/images/recruit_posters/recruit_posters_1.jpg',
      'http://haichuanghao.com/images/recruit_posters/recruit_posters_1.png',
    ],
    recruits:{},
    user_session:"",
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
    this.getActData();
  },

  getActData:function(){
    var that = this;
    wx.request({
      url: 'https://haichuanghao.com/api/request_info',
      data:{
        "table":"hc_recruit"
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        that.setData({
          recruits:res.data
        })
        console.log("recruit_data:", res.data)
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("调用页面隐藏")
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