var app = getApp()

Page({
  data: {
    shopInfoStr: '',
    imgJsonStr: '',
    shopInfo: '',
    imgJson: '',
    shopItemIds:[],

    shopId: '' ,

    imgUrls: [
      '/image/b1.jpg',
      '/image/b2.jpg',
      '/image/b3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },

  onShareAppMessage: function () {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    var shopId = app.globalData.shopId 
    // app.globalData.shopId = shopId
    // self.setData({
    //   shopId:shopId
    // })
    
    if (app.globalData.shopId == '') {
      wx.redirectTo({
        url: '../login',
      })
    }else{
    wx.request({
      url: 'https://www.betterguitars.com/shopInfo?shopId=' + shopId,

      success: function (res) {
        console.log(res.data)
        app.globalData.shopInfo = res.data
        
        self.setData({
          shopItemIds:res.data.shopItemIds,
          shopInfoStr: JSON.stringify(res.data),
          imgJsonStr: res.data.shopBanners,
          shopInfo: res.data,
          imgJson: JSON.parse(res.data.shopBanners),
          
        })
      }
    })
    }

  },
  onPullDownRefresh:function(){

    var self = this
    var shopId = app.globalData.shopId 

    wx.request({
      url: 'https://www.betterguitars.com/shopInfo?shopId=' + shopId,

      success: function (res) {
        console.log(res.data)
        app.globalData.shopInfo = res.data

        self.setData({
          shopItemIds: res.data.shopItemIds,
          shopInfoStr: JSON.stringify(res.data),
          imgJsonStr: res.data.shopBanners,
          shopInfo: res.data,
          imgJson: JSON.parse(res.data.shopBanners),

        })
        setTimeout(function(){
          wx.stopPullDownRefresh()
          },300)
        
      }
    })

    
  },

  onShow:function(){
    if (app.globalData.shopId == '') {
      wx.redirectTo({
        url: '../login',
      })
    }

  },


})