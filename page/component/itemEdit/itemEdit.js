// page/component/itemEdit/itemEdit.js
var app = getApp()
var uploadToCos = require('../../../util/upload.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {

    itemInfo: '',
    newItemId:0,
    itemId: '',
    imgJson: '',
    op:'',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    var shopId = app.globalData.shopId
    var op = options.op //0为修改，1为新建
    

    if(op==0){

        var imgJson = JSON.parse(options.imgJsonStr)
        var itemInfo = JSON.parse(options.itemInfo)

        self.setData({
          itemInfo: itemInfo,
          imgJson: imgJson,
          op:0
        })
    }else if(op==1){

      //var shopItemIds = new Array(options.shopItemIds)
      var shopItemIds = options.shopItemIds.split(',')
      //console.log('type of shopItemIds = ',typeof(shopItemIds))
      console.log(shopItemIds)
      
      var maxItemId = parseInt(shopId + '00')
      var len = shopItemIds.length
      //找出数据库中最大的itemId
      for(var i=0;i< len;i++){
         var tmpId = parseInt(shopItemIds.pop())
         // if (typeof (tmpId) == 'string') 
         //console.log(tmpId)
          if(tmpId>maxItemId){
            maxItemId = tmpId
          }
      }
      console.log('max=',maxItemId)
      
      self.setData({
        itemInfo: JSON.parse("{}"),
        imgJson: JSON.parse("{}"),
        newItemId:maxItemId+1,
        op:1
      })
    }
     
  },


  //增加图片，上限为5张
  addImg: function () {
    var self = this
    var imgJsonTemp = self.data.imgJson

    var len = 0
    for (var key in imgJsonTemp) {
      len++
    }
    console.log('len=',len)

    if (len >= 5) {
      wx.showToast({
        title: '最多限制为5张图片',
      })

      return
    }

    // 选择上传的图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {

        // 获取文件路径
        var filePath = res.tempFilePaths[0];

        console.log('filePath=', filePath)

        // 获取文件名
        var fileName = filePath.slice(-20)

        // var fileName = filePath.match(/(wxfile:\/\/)(.+)/)
        //  console.log('fileName=', fileName)

        // fileName = fileName[2]
        // //console.log('fileName=',fileName.substring(60))
        // fileName = fileName.slice(-20)

        console.log('fileName=', fileName)

        //新增一个图片
        imgJsonTemp[len] = filePath
        console.log('imgJsonTemp =', imgJsonTemp)
        self.setData({
          imgJson: imgJsonTemp
        })

      }
    })


  },

  //删除图片
  deleteImg: function (e) {
    var self = this
    console.log(e.target.id)
    var str = e.target.id
    var i = str.substring(6)

    var imgJsonTemp = self.data.imgJson

    delete imgJsonTemp[i]

    var len = 0 //删掉后的新长度
    for (var key in imgJsonTemp) {
      //console.log('key=',key)
      len++

      if (key > i) {
        imgJsonTemp[key - 1] = imgJsonTemp[key]
      }
    }
    if (i != len)  //如果删掉的不是最后一个
    {
      delete imgJsonTemp[len]
    }

    console.log('imgJsonTemp=', imgJsonTemp)
    self.setData({
      imgJson: imgJsonTemp
    })


  },

  //更换图片
  chooseImg: function (e) {
    var self = this
    console.log(e.target.id)
    var str = e.target.id
    var i = str.substring(6)

    console.log(i)
    // 选择上传的图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {

        // 获取文件路径
        var filePath = res.tempFilePaths[0];

        // // 获取文件名
        // var fileName = filePath.match(/(wxfile:\/\/)(.+)/)
        // // console.log('fileName=', fileName)

        // fileName = fileName[2]
        // //console.log('fileName=',fileName.substring(60))
        // fileName = fileName.slice(-20)
        // console.log('fileName=', fileName)

        var imgJsonTemp = self.data.imgJson
        imgJsonTemp[i] = filePath

        self.setData({
          imgJson: imgJsonTemp
        })


      }
    })
  },

////////////////////////////////////////////////////////////
  //修改商品标题
  bindTitleInput: function (e) {
    var itemInfoTemp = this.data.itemInfo
    itemInfoTemp["title"] = e.detail.value

    this.setData({
      itemInfo: itemInfoTemp
    })
  },

  //修改商品价格
  bindPriceInput: function (e) {
    var itemInfoTemp = this.data.itemInfo
    itemInfoTemp["price"] = e.detail.value

    this.setData({
      itemInfo: itemInfoTemp
    })
  },

  //修改商品当前状态
  bindStockInput: function (e) {
    var itemInfoTemp = this.data.itemInfo
    itemInfoTemp["stock"] = e.detail.value

    this.setData({
      itemInfo: itemInfoTemp
    })
  },

  //修改商品详情
  bindDetailInput: function (e) {
    var itemInfoTemp = this.data.itemInfo
    itemInfoTemp["detail"] = e.detail.value

    this.setData({
      itemInfo: itemInfoTemp
    })
  },

  //修改相关参数
  bindParameterInput: function (e) {
    var itemInfoTemp = this.data.itemInfo
    itemInfoTemp["parameter"] = e.detail.value

    this.setData({
      itemInfo: itemInfoTemp
    })
  },

  //修改售后保障
  bindServiceInput: function (e) {
    var itemInfoTemp = this.data.itemInfo
    itemInfoTemp["service"] = e.detail.value

    this.setData({
      itemInfo: itemInfoTemp
    })
  },
///////////////////////////////////////////////////////////////////

  //保存修改并上传
  saveUpload: function () {
    var self = this
    var shopId = app.globalData.shopId
    var itemInfoTemp = self.data.itemInfo
    var imgJsonTemp = self.data.imgJson

    //找出需要上传的图片信息，并存为数组
    var uploadKey = []
    var uploadUrl = []

    //把需要上传的图片上传到COS，并获得图片url
    for (var key in imgJsonTemp) {
      var url = imgJsonTemp[key]

      if (url.substring(0, 6) == 'wxfile') {
        uploadKey.push(key)
        uploadUrl.push(url)
        console.log('url=', url)

      }
      // wx.hideLoading()

    }



    var tmpUrl = uploadUrl.pop()
    ///如果有需要上传的图片，则开始上传
    if (typeof (tmpUrl) == 'string') {
      wx.showLoading({
        title: '上传中',
      })

      // 文件上传cos
      var filePath = tmpUrl
      var fileName = tmpUrl.slice(-20)

      uploadToCos(filePath, fileName)

      function uploadCheck() {
        console.log(app.globalData.tempUrl)
        var urlOnline = app.globalData.tempUrl

        if (urlOnline.length != 0) {

          imgJsonTemp[uploadKey.pop()] = urlOnline
          app.globalData.tempUrl = ''
          console.log('new imgJsonTemp0=', imgJsonTemp)

          //开始上传下一张图片
          var tmpUrl = uploadUrl.pop()
          ///如果没有需要上传的图片，则跳过此步骤
          if (typeof (tmpUrl) == 'string') {
            // 文件上传cos
            var filePath = tmpUrl
            var fileName = tmpUrl.slice(-20)
            uploadToCos(filePath, fileName)
          } else {
            //全部上传完
            clearInterval(sh)
            console.log('stop interval')
            wx.hideLoading()
            console.log('new imgJsonTemp=', imgJsonTemp)

            itemInfoTemp["imgs"] = imgJsonTemp
            //请求服务器接口修改数据库
            wx.request({
              url: 'https://www.betterguitars.com/uploadItemInfo',
              method: 'POST',
              data: {
                itemInfo: itemInfoTemp,
                newItemId:self.data.newItemId, //如果是旧商品则为0
                shopId:shopId,
                op:self.data.op
              },
              success: function (res) {
                console.log(res.data)
                wx.navigateBack({
                  delta: 1
                })
                setTimeout(function () {
                  wx.startPullDownRefresh()
                }, 300)
              }

            })

          }

        }
      }
      var sh = setInterval(uploadCheck, 100)

    } else {  //如果没有图片需要上传
      itemInfoTemp["imgs"] = imgJsonTemp
      //请求服务器接口修改数据库
      wx.request({
        url: 'https://www.betterguitars.com/uploadItemInfo',
        method: 'POST',
        data: {
          itemInfo: itemInfoTemp,
          newItemId: self.data.newItemId, //如果是旧商品则为0
          shopId:shopId,
          op: self.data.op
        },
        success: function (res) {
          console.log(res.data)
          wx.navigateBack({
            delta:1
          })
          setTimeout(function () {
            wx.startPullDownRefresh()
          }, 300)
          
        }
      })

    }

    console.log('new imgJsonTemp123=', imgJsonTemp)

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