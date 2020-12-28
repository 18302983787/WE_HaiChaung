// pages/my_fans/my_fans.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_session:"",
    my_fans:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyFans();
   },

  //获取用户所有的粉丝
  getMyFans:function(){
    var that = this;
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/get_my_relation',
          data:{
            "type":"fans",
            "user_session":e.data,
          },
          header:{
            // 'content-type': 'application/json' // 默认值
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method:"POST",
          success(res){
            console.log(res.data)
            that.setData({
              "my_fans":res.data
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