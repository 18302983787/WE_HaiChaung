// pages/my_recruit/my_recruit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_recs:[],
    user_session:"",
    isTabA: true,
    isTabB: false
  },
  go_back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },

  gotoTab: function(e) {
    if (e.currentTarget.dataset.tab === "1") {
      this.getMyRec()
      this.setData({
        isTabA: true,
        isTabB: false
      })
    } else if (e.currentTarget.dataset.tab === "2") {
      this.getHisoryRec()
      this.setData({
        isTabA: false,
        isTabB: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyRec()
  },

  getMyRec: function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/get_my_recruit',
          data:{
            "user_session": e.data, 
            "get_type":"ongoing",
          },
          header:{
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method:"POST",
          success(res){
            that.setData({
              my_acts:res.data
            })
            console.log("res",res.data)
          }
        })
      }
    })
  },

  getHisoryRec: function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/get_my_recruit',
          data:{
            "user_session": e.data, 
            "get_type":"expired",
          },
          header:{
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method:"POST",
          success(res){
            that.setData({
              my_acts:res.data
            })
            console.log("res",res.data)
          }
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