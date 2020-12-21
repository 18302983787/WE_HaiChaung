// pages/my_follow/my_follow.js
Page({
  data: {
    my_follows:[],
  },
  onLoad: function (options) {
    this.getMyFollows();
   },

  //获取用户所有的粉丝
  getMyFollows:function(){
    var that = this;
    wx.getStorage({
      key: 'user_session',
      success(e){
        wx.request({
          url: 'https://haichuanghao.com/api/get_my_relation',
          data:{
            "type":"follows",
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
              "my_follows":res.data
            })
          }
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



