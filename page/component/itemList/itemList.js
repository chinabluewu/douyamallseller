// page/component/itemList/itemList.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide:false,
    itemList:'',
    shopItemIds:'',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    var shopId = app.globalData.shopId
    var shopItemIds = options.shopItemIds

    wx.request({
      url: 'https://www.betterguitars.com/getItemList?shopId='+shopId,

      success:function(res){
        console.log(res.data)

        self.setData({
           itemList:res.data,
           shopItemIds:shopItemIds,
           hide:true
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
   // wx.startPullDownRefresh()
  
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
    var self = this
    var shopId = app.globalData.shopId

    wx.request({
      url: 'https://www.betterguitars.com/getItemList?shopId=' + shopId,

      success: function (res) {
        console.log(res.data)

        self.setData({
          itemList: res.data
          
        })
      

        wx.request({
          url: 'https://www.betterguitars.com/shopInfo?shopId=' + shopId,

          success: function (res) {
            console.log(res.data)
            app.globalData.shopInfo = res.data

            self.setData({
              shopItemIds: res.data.shopItemIds,
              hide:true

            })
            setTimeout(function () {
              wx.stopPullDownRefresh()
            }, 300)

          }
        })


      }
    })
  
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