// pages/recruit/recruit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // swiper
    imgUrls: [
      '../images/activity/demo_1.jpg',
      '../images/activity/demo_2.jpg',
      '../images/activity/demo_3.jpg',
    ],
    recruits:{},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("getting recs")
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
        console.log("recruits")
        console.log(res.data)
      }
    })
  },
  gotoLink:function(){
    wx.navigateTo({
      url: '../out_link/out_link',
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