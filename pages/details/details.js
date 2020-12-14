// pages/details/details.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    act_detail:{},
    user_session:"",
    uid:"",
  },
  go_back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options){
    var that = this;
    const eventChannel = that.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('dataFromOpenPage', function(data){
      console.log(data.item)
      that.setData({
        act_detail:data,
      })
    })
  },

  signUp:function(){
    var that = this
      wx.getStorage({
        key: 'user_session',
        success(e_u_s){
          wx.request({
            url: 'https://haichuanghao.com/api/sign_up',
            data:{
              "act_uid":that.data.act_detail.item.uid,
              "table_name":"hc_activity_sign",
              "user_session":e_u_s.data,
            },
            header:{
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method:"POST",
            success(res){
              console.log("res:", res.data.status)
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