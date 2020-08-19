// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    act_detail:{},
    user_session:"",
  },
  go_back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const eventChannel = that.getOpenerEventChannel()
    that.getUserSession()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('dataFromOpenPage', function(data) {
      that.setData({
        act_detail:data,
      })
      console.log(data)
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
      }
    })
  },

  signUp:function(e){
    var that = this
    wx.request({
      url: 'https://haichuanghao.com/api/sign_up',
      data:{
        "act_uid":e.currentTarget.dataset.uid,
        "table_name":"hc_activitySign",
        "user_session":this.data.user_session,
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        if (res.data.response=="success"){
          wx.showToast({
            title: '报名成功',
            icon: '',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        }   
        else{
          wx.showToast({
            title: '已经报名过啦',
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