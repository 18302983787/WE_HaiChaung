// pages/my_identificate/my_identificate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      src_id_a:"",
      show_a:"",
      src_id_b:"",
      show_b:"",
      user_session:""
  },
  go_back:function(){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.onLoad()
    wx.navigateBack({
      delta: 0,
    })
  },

  goto_cam_a:function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        that.setData({
          user_session:e.data
        })
      }
    })
    wx.chooseImage({
      count: 1, //最多可以选的图片张数
      success:function(res){
        wx.showLoading({
          title: '人像面上传中...',
        })
        console.log("选取图片")
        that.setData({
          show_a:res.tempFilePaths[0]
        })
        wx.uploadFile({
          url: 'https://haichuanghao.com/api/upload_ocr_pic',
          filePath: res.tempFilePaths[0],
          name: 'ocr_pic_file',
          formData:{
            "user_session":that.data.user_session,
            "type":"portrait" // 人像面
          },
          success(upload_res){
            console.log("upload请求成功 返回值：",upload_res.statusCode)
            that.setData({
              src_id_a:upload_res.data
            })
            wx.hideLoading()
          }
        })
      }
    })
    

  },

  goto_cam_b:function(){
    var that = this
    wx.getStorage({
      key: 'user_session',
      success(e){
        that.setData({
          user_session:e.data
        })
      }
    })
    wx.chooseImage({
      count: 1, //最多可以选的图片张数
      success:function(res){
        wx.showLoading({
          title: '国徽面上传中...',
        })
        console.log("选取图片")
        that.setData({
          show_b:res.tempFilePaths[0]
        })
        wx.uploadFile({
          url: 'https://haichuanghao.com/api/upload_ocr_pic',
          filePath: res.tempFilePaths[0],
          name: 'ocr_pic_file',
          formData:{
            "user_session":that.data.user_session,
            "type":"national emblem" // 人像面
          },
          success(upload_res){
            console.log("upload请求成功 返回值：",upload_res.statusCode)
            that.setData({
              src_id_b:upload_res.data
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  

  identify:function(){
    var that = this
    wx.showLoading({
      title: '正在认证',
    })
    console.log(that.data.src_id_a)
    wx.request({
      url: 'https://haichuanghao.com/api/identify',
      data:{
        "user_session":that.data.user_session,
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
        console.log("1",res.data.status)
        if (res.data.status=="success") {
          console.log(res.data.status)
          wx.showToast({
            title: '认证成功',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 5000     
          })
        }
        else{
          wx.showToast({
            title: '认证失败。请尝试更换更清晰的图片。',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 5000     
          })
        }
        wx.navigateBack({
          delta: 0,
        })
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