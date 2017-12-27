// page/component/colorList/colorList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:false,
    itemList: '',
    shopItemIds: '',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  
  },

  loadData (){
    var self = this

    wx.request({
      url: 'https://www.betterguitars.com/getColorMatters',

      success: function (res) {
        //console.log(res.data)
        var list = JSON.parse(res.data).response.publish_item_detail
        console.log(list)
        // console.log(res.data.response.publish_item_detail)
        var len = list.length
        for(var i=0;i<len;i++){
         var date = new Date(list[i].created_at*1000)  //IDE上的时间戳需要*1000
         //var date = new Date(list[i].created_at)
         list[i].createTime = date.toLocaleDateString() + ' ' + date.toTimeString().substr(0, 8);
        }

        self.setData({
          itemList: list,

          hide: true
        })

        wx.stopPullDownRefresh()

      }
    })

  },
  paintZoom:function(e){
    var self = this
    console.log(e.target.id)
    var list = []
    list.push(this.data.itemList[e.target.id].artwork_name)

    wx.previewImage({
      urls: list,
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
    this.loadData()
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