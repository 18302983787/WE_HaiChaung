// pages/my_integral/my_integral.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:"",
    level:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/get_user_score',
          data:{
            "user_session":e.data
          },
          header:{
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method:"POST",
          success(res){
            if (res.data.status == "success"){
              that.setData({
                score:res.data.data.score,
                level:res.data.data.level,
              })
            }
          }
        })
      }
    })
  },

  daily_attendance:function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/daily_attendance',
          data:{
            "user_session":e.data
          },
          header:{
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method:"POST",
          success(res){
            console.log(res)
            if (res.data.status == "success"){
              wx.showToast({
                title: '签到成功！',
              })
            }
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

  },

  go_back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
})