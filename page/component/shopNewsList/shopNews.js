// page/component/shopNews/shopNews.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopNewsList: [],
    newsImgsList: [],
    shopId: '',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;
    var city = 'sz' //需要读取定位信息
    var shopId = app.globalData.shopId

    wx.request({
      // url:'http://www.gdfengshuo.com/api/wx/cate-detail.txt',
     // url: 'https://www.betterguitars.com/getShopNewsList?city=' + city,
      url: 'https://www.betterguitars.com/getShopNewsList?shopId=' + shopId,
      success(res) {
        var newsImgsList = []
        var shopNewsList = res.data

        console.log(res.data)
        var len = res.data.length

       // console.log(res.data[0].newsImgs)

        for (var i = 0; i < len; i++) {
          //newsImgsList.push(res.data[i].newsImgs.split(','))
          newsImgsList.push(JSON.parse(res.data[i].newsImgs))
          shopNewsList[i]['date'] = shopNewsList[i]['creatTime'].slice(5,10)
          shopNewsList[i]['time'] = shopNewsList[i]['creatTime'].slice(-8, -3)
          
        }
        console.log(newsImgsList[0])

        self.setData({
          //detail : res.data.result
          shopNewsList: shopNewsList,
          newsImgsList: newsImgsList,
          shopId:shopId
        })

      }
    })
  
  },

  onPullDownRefresh:function(){

    var self = this;
    var city = 'sz' //需要读取定位信息
    console.log('开始下拉')
    wx.request({
      // url:'http://www.gdfengshuo.com/api/wx/cate-detail.txt',
      //url: 'https://www.betterguitars.com/getShopNewsList?city=' + city,
      url: 'https://www.betterguitars.com/getShopNewsList?shopId=' + self.data.shopId,
      success(res) {
        var newsImgsList = []
        var shopNewsList = res.data
        console.log('res.data=',res.data)
        var len = res.data.length

       // console.log(res.data[0].newsImgs)

        for (var i = 0; i < len; i++) {
          //newsImgsList.push(res.data[i].newsImgs.split(','))
          newsImgsList.push(JSON.parse(res.data[i].newsImgs))
          shopNewsList[i]['date'] = shopNewsList[i]['creatTime'].slice(5, 10)
          shopNewsList[i]['time'] = shopNewsList[i]['creatTime'].slice(-8, -3)

        }
        console.log(newsImgsList[0])

        self.setData({
          //detail : res.data.result
          shopNewsList: shopNewsList,
          newsImgsList: newsImgsList
        })

        setTimeout(function () {
          wx.stopPullDownRefresh()
        }, 500)

      }
    })

  },

  newsImgZoom: function (e) {
    var self = this
    console.log('i=', e.target.id)
    var position = e.target.id.split(':')
    var urls = self.data.newsImgsList[position[0]]
    var currentUrl = urls[position[1]]
    var urlsArr = []

    for(var key in urls){
      urlsArr.push(urls[key])
    }

    wx.previewImage({
      current: currentUrl,
      urls: urlsArr
    })
  },

  delShopNews:function(e){
    var self = this
    console.log(e.target.id)
    var id = e.target.id
    var tempList = self.data.shopNewsList
    var shopId = tempList[id]['shopId']
    var creatTime = tempList[id]['creatTime']

    wx.showModal({
      title: '提醒',
      content: '确定删除本条动态消息吗？',
      success: function (res) {
        if (res.confirm) {
          
          console.log('用户点击确定')
          console.log('delete shopNews', tempList[id])
          wx.request({
           url: 'https://www.betterguitars.com/delShopNews',
           method:'POST',
           data:{
             shopId:shopId,
             creatTime:creatTime
           },
           success: function (res) {
             console.log(res.data)
             
             setTimeout(function () {
               wx.startPullDownRefresh()
             }, 100)
           }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  
})