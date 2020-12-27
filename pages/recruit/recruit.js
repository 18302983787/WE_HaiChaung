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

  getInterested:function(e){
    var that = this
    console.log(e.currentTarget.dataset.item.uid)
    console.log(that.data.user_session)
    wx.request({
      url: 'https://haichuanghao.com/api/get_interested',
      data:{
        "rec_id":e.currentTarget.dataset.item.uid,
        "usr_session":that.data.user_session,
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        console.log(res.data.status)
        if (res.data.status=="success"){
          wx.showToast({
            title: '关注成功',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
          that.onLoad()
        } else if (res.data.status=="signed"){
          wx.showToast({
            title: '已关注',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        } else if (res.data.status=="error"){
          wx.showToast({
            title: '关注失败，请稍后重试',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        } else{
          wx.showToast({
            title: '未知错误，错误已上报',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        }
      }
    })
  },

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
    this.getUserSession();
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
    console.log("调用页面监听")
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