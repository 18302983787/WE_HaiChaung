// pages/my_fans/my_fans.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // banner
    imgUrls: [
      '../images/activity/demo_1.jpg',
      '../images/activity/demo_2.jpg',
      '../images/activity/demo_3.jpg',
    ],
    indicatorDots: true, //是否显示面板指示点
    // autoplay: true, //是否自动切换
    // interval: 3000, //自动切换时间间隔,3s
    // duration: 1000, //  滑动动画时长1s
    jobs:{},
    user_session:"",
    is_signed:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getActData();
    this.getUserSession(); 
  },
  getActData:function(){
    var that = this;
    console.log(this.data.user_session)
    wx.request({
      url: 'https://haichuanghao.com/api/get_my_relation',
      data:{
        // "table":"hc_activity"
        "type":"fans",
        "user_session":this.data.user_session,
      },
      header:{
        // 'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success(res){
        that.setData({
          jobs:res.data
        })
      }
    })
  },
  getUserSession:function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        console.log(e.data)
        that.setData({
          user_session:e.data
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