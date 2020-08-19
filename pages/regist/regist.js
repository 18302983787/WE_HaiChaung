// pages/regist/regist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_session:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserSession()
  },

  formSubmit:function(e){
    console.log(e)
    var that = this
    var username = e.detail.value.username
    var gender = e.detail.value.gender
    var age = e.detail.value.age
    var phone = e.detail.value.phone
    var birth = e.detail.value.birth
    var graduate = e.detail.value.graduate
    var loc = e.detail.value.loc
    wx.request({
      url: 'https://haichuanghao.com/api/register',
      method:"POST",
      header:{
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data:{
        "table_name":"hc_user",
        "user_session":that.data.user_session,
        "username":username,
        "gender":gender,
        "age":age,
        "phone":phone,
        "birth":birth,
        "graduate":graduate,
        "loc":loc
      },
      success(res){
        if (res.data.response=="success"){
          wx.switchTab({
            url: '../activity/activity',
          })
          }
        else{
          console.log(res.data.response)
        }
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