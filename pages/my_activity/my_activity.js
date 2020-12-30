// pages/my_activity/my_activity.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_acts:[],
    user_session:"",
    isTabA: true,
    isTabB: false
  },
  go_back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  goto_detail:function(e){
    console.log("从我的活动跳转到活动页面", e)
    var act=e.currentTarget.dataset;
    wx.navigateTo({
      // url: '../details/details',
      url:'../out_link/out_link',
      success: function(res){
        res.eventChannel.emit('dataFromOpenPage',act)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyAct()
  },


  getMyAct: function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/get_my_activity',
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

  getHisoryAct: function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/get_my_activity',
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

  gotoTab: function(e) {
    if (e.currentTarget.dataset.tab === "1") {
      this.getMyAct()
      this.setData({
        isTabA: true,
        isTabB: false,
      })
    } else if (e.currentTarget.dataset.tab === "2") {
      this.getHisoryAct(),
      this.setData({
        isTabA: false,
        isTabB: true,
      })
    }
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