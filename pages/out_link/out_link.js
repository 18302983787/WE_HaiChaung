// pages/out_link/out_link.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    out_link:"",
  },
  onLoad: function(options){
    var that = this;
    const eventChannel = that.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('dataFromOpenPage', function(data){
      console.log(data.item.link) 
      that.setData({
        out_link:data.item.link,
      })
      wx.request({
        url: 'https://haichuanghao.com/api/view_plus_one',     
        data:{
          "rec_uid":data.item.uid,
        },
        header:{
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method:"POST",
        success(res){
          console.log("rec_uid",data.item.uid)
          console.log("stauts:", res.data.status)
        }
      })
    })
  },
})

