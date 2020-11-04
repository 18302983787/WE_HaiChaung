// pages/regist/regist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_session:"",
    sexNames: [
      { name: '男', value: '男', checked: true },
      { name: '女', value: '女' }
    ],
    formData: {
    },
    rules: [{
      name: 'username',
      rules: [{ required: true, message: '请填写姓名' }, { maxlength: 5, message: '姓名长度不超过五个字' }],
    }, {
      name: 'age',
      rules: [{ required: true, message: '请填写年龄' },{ max: 200, message: '年龄必须是数字' }],
    }, {
      name: 'phone',
      rules: [{ required: true, message: '请填写手机号' }, { mobile: true, message: '手机号格式不对' }],
    }, {
      name: 'birth',
      rules: { required: true, message: '请填写生日' },
    }, {
      name: 'graduate',
      rules: { required: true, message: '请填写毕业院校' },
    }, {
        name: 'loc',
      rules: { required: true, message: '请填写现居地' },
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserSession()
    // 初始化赋值
    this.data.formData.radio = '男'
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.sexNames;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      [`formData.birth`]: e.detail.value
    })
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {
        // wx.showToast({
        //   title: '校验通过'
        // })
        this.formSubmit()
      }
    })
  },
  formSubmit:function(e){
    console.log(e)
    console.log(this.data.formData)
    var that = this
    var username = this.data.formData.username
    console.log(username)
    var gender = this.data.formData.radio
    var age = this.data.formData.age
    var phone = this.data.formData.phone
    var birth = this.data.formData.birth
    var graduate = this.data.formData.graduate
    var loc = this.data.formData.loc
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
          wx.showToast({
            title: '注册成功'
          })
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
  gotoDirect:function(){
    wx.switchTab({
      url: '../activity/activity',
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