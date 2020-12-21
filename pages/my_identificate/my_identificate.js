// pages/my_identificate/my_identificate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      src_id_a:"",
      src_id_b:""
  },

  goto_cam_a:function(){
    var that = this
    wx.chooseImage({
      count: 1,
      success:function(res){
        console.log("选取图片")
        that.setData({
          src_id_a:res.tempFilePaths[0]
        })
      }
    })
  },
  goto_cam_b:function(){
    var that = this
    wx.chooseImage({
      count: 1,
      success:function(res){
        console.log("选取图片:", res)
        console.log(res.tempFilePaths)
        that.setData({
          src_id_b:res.tempFilePaths
        })
        // wx.uploadFile({
        //   filePath: 'filePath',
        //   name: 'name',
        //   url: 'url',
        // })
      }
    })
  },

  identify:function(){
    var that = this
    console.log(that.data.src_id_a)
    wx.request({
      url: 'https://haichuanghao.com/api/identify',
      data:{
        "id_a":that.data.src_id_a,
        "id_b":that.data.src_id_b,
      },
      header:{
        // 'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        console.log(res.data)
        var status = res.status
      }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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