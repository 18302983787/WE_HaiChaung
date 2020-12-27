// pages/activity_signers/activity_signers.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    act_uid:{},
    user_session:"",
    activity_signers:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const eventChannel = that.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('dataFromOpenPage', function(data){
      console.log(data.item)
      that.setData({
        act_uid:data.item,
      })
    })
    this.get_activity_signers();
   },

  //获取参见当前活动的用户
  get_activity_signers:function(){
    var that = this;
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/get_activity_signers',
          data:{
            "user_session":e.data,
            "act_uid":that.data.act_uid
          },
          header:{
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method:"POST",
          success(res){
            console.log("参加活动的用户",res.data)
            that.setData({
              "activity_signers":res.data
            })
          }
        })
      }
    }) 
  },

  follow_or_not:function(e){
    var that = this
    console.log(e)
    wx.getStorage({
      key: 'user_session',
      success(sto_e){
        wx.request({
          url: 'https://haichuanghao.com/api/follow_or_not',
          data:{
            "user_session":sto_e.data,
            "fans_session":e.currentTarget.dataset.item.user_session,
          },
          header:{
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method:"POST",
          success(res){
            console.log(res)
            if (res.data.status == "success"){
              if (res.data.res==1){
                wx.showToast({
                  title: '关注成功',
                })
              }
              else{
                wx.showToast({
                  title: '取关成功',
                })
              }
              that.onLoad()
            }
          },
        })
      }
    })
  },
 
  go_back:function(){
    wx.navigateBack({
      delta: 0,
    })
  }
})