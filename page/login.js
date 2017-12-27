//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    phone: '',
    password: '',
    thumb:'',
    nickname:'',
    loading:false,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
     // url: '../logs/logs'
      url: 'component/index'
    })
  },


  onLoad: function () {

    var self = this;
    /**
     * 获取用户信息
     */
    // wx.getUserInfo({
    //   success: function (res) {
    //     self.setData({
    //       thumb: res.userInfo.avatarUrl,
    //       nickname: res.userInfo.nickName
    //     })
    //   }
    // })
    

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }

    }


    
    
  },

  

  onReady:function(){

  },


  loginShop:function(phone,password){
    var self = this
    self.setData({
      loading:true
    })
    wx.request({
      url: 'https://www.betterguitars.com/shopLogin',
      method: 'POST',
      data: {
        phoneNumber: phone,
        password: password,

      },

      success: function (res) {
        console.log(res.data)
        console.log(res.data.msg)
        
        if (res.data.result == 1) {
          console.log('result=', res.data.result)
          // wx.navigateTo({

          //   url: 'component/index?shopId=10001',
          // })

          wx.showToast({
            title: res.data.msg,
            
          })
        app.globalData.shopId = res.data.shopId
         
          setTimeout(function () {
            wx.reLaunch({
              url: 'component/index' 
            })
          }, 500)
          
        }else{ //登录失败
          wx.showToast({
            title: res.data.msg,
            icon:'loading'
          })

        }
        self.setData({
          loading: false
        })
      }
    })
  },

  getUserInfo: function (e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

  },



  // 获取输入账号 
  phoneInput:function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput:function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function () {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else if (this.data.phone.length !=11){

      wx.showToast({
        title: '手机号码有误，请重新输入',
        icon: 'loading',
        duration: 2000
      })
      
    }else {
      // 这里修改成跳转的页面 
      // wx.showToast({
      //   title: '登录成功',
      //   icon: 'success',
      //   duration: 2000
      // })
      this.loginShop(this.data.phone,this.data.password)
    }
  },

  customerService:function(){
    
  }
 

})