// page/component/shopEdit/shopEdit.js

// upload的核心代码

var app = getApp()
var uploadToCos = require('../../../util/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: '',
    shopId: '',
    imgJson: '',
    tag:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var self =this
      var op = options.op //0为修改，1为新建

      // if(op==0)
        // console.log(options.imgJsonStr.length)
        // console.log(options.shopInfo)
        // if(options.imgJsonStr = 'null'){
        // console.log(typeof options.imgJsonStr)
        // }
        if (options.imgJsonStr == '' || options.imgJsonStr == 'null' || typeof options.imgJsonStr == null){
          var imgJson = JSON.parse("{}")
          console.log('imgJson1=',imgJson)
        }else{
          var imgJson = JSON.parse(options.imgJsonStr)
        }
        
        if (options.shopInfo == '' || options.shopInfo == 'null' || typeof options.shopInfo == null) {
          var shopInfo = JSON.parse("{}")
        } else {
          var shopInfo = JSON.parse(options.shopInfo)
        }
       //console.log(imgJson)
      // console.log(shopInfo)
        
        self.setData({
          shopInfo:shopInfo,
          imgJson:imgJson,
          op:op
        })

      // }else if(op==1){
      //   self.setData({
      //     shopInfo: JSON.parse("{}"),
      //     imgJson: JSON.parse("{}"),
      //     op: 1
      //   })
      // }

  },



//增加图片，上限为5张
addImg:function(){
  var self =this
  var imgJsonTemp = self.data.imgJson

  var len =0
  for(var key in imgJsonTemp){
    len++
  }
  
  if(len>=5){
    wx.showToast({
      title: '最多限制为5张图片',
    })

    return
  }

  console.log('len=',len)
  console.log(imgJsonTemp)

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
      console.log('imgJsonTemp =',imgJsonTemp)
      self.setData({
        imgJson: imgJsonTemp
      })
       
       
      // // 文件上传cos
      // uploadToCos(filePath, fileName)
      // while(app.globalData.tempUrl == ''){
         
      // }
      
      
    }
  })


},  

//删除图片
deleteImg:function(e){
  var self = this
  console.log(e.target.id)
  var str = e.target.id
  var i = str.substring(6)

  var imgJsonTemp = self.data.imgJson

  delete imgJsonTemp[i]
  var len = 0 //删掉后的新长度
  for(var key in imgJsonTemp){
     //console.log('key=',key)
     len++

     if(key>i){
       imgJsonTemp[key - 1] = imgJsonTemp[key] 
     }
  }
  if(i!=len)  //如果删掉的不是最后一个
  {
    delete imgJsonTemp[len]
  } 

  console.log('imgJsonTemp=',imgJsonTemp)
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
    count:1,
    sizeType: ['compressed'],
    success: function (res) {

      // 获取文件路径
      var filePath = res.tempFilePaths[0];

    //   // 获取文件名
    //   var fileName = filePath.match(/(wxfile:\/\/)(.+)/)
    //  // console.log('fileName=', fileName)

    //   fileName = fileName[2]
    //   //console.log('fileName=',fileName.substring(60))
    //   fileName = fileName.slice(-20)
    //   console.log('fileName=', fileName)
    
      
      
      //如果是更换LOGO
      if(i=='Logo'){
          var shopInfo = self.data.shopInfo
          shopInfo['shopLogo'] = filePath
          console.log(shopInfo)

          self.setData({
            shopInfo: shopInfo
          })
      }else{
        var imgJsonTemp = self.data.imgJson
        imgJsonTemp[i] = filePath

        self.setData({
          imgJson: imgJsonTemp
        })

      }
      
      // // 文件上传cos
      //  var newUrl = uploadToCos(filePath, fileName)

      //  console.log('newUrl',typeof(newUrl))
    }
  })
},

//修改店铺名称
bindNameInput: function (e) {
  var shopInfoTemp = this.data.shopInfo
  shopInfoTemp["shopName"] = e.detail.value

  this.setData({
    shopInfo: shopInfoTemp
  })
},

//修改店铺介绍
bindIntroInput:function(e){
  var shopInfoTemp = this.data.shopInfo
  shopInfoTemp["shopIntroduce"] = e.detail.value

  this.setData({
    shopInfo: shopInfoTemp
  })
},

//修改店铺地址
bindAddInput: function (e) {
  var shopInfoTemp = this.data.shopInfo
  shopInfoTemp["shopAddress"] = e.detail.value

  this.setData({
    shopInfo: shopInfoTemp
  })
},

//修改店铺电话
bindTelInput: function (e) {
  var shopInfoTemp = this.data.shopInfo
  shopInfoTemp["shopTel"] = e.detail.value

  this.setData({
    shopInfo: shopInfoTemp
  })
},



//保存修改并上传
saveUpload:function(){
  var self = this
  var shopInfoTemp = self.data.shopInfo
  var logoTemp = shopInfoTemp['shopLogo'] 
  var imgJsonTemp = self.data.imgJson

  //找出需要上传的图片信息，并存为数组
  var uploadKey = []
  var uploadUrl = []

 //把需要上传的图片上传到COS，并获得图片url
  for(var key in imgJsonTemp){
    var url = imgJsonTemp[key]

    if(url.substring(0,6)=='wxfile'){
      uploadKey.push(key)
      uploadUrl.push(url)
      console.log('url=',url)
  
    } 
    // wx.hideLoading()
    
  }

  if (logoTemp.substring(0, 6) == 'wxfile') {
    uploadKey.push('logo')
    uploadUrl.push(logoTemp)
    console.log('logoTemp=', logoTemp)

  } 



  var tmpUrl = uploadUrl.pop()
  ///如果有需要上传的图片，则开始上传
  if(typeof (tmpUrl) =='string'){
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

          if(uploadKey.pop()=='logo'){
            logoTemp = urlOnline
          }else{
            imgJsonTemp[uploadKey.pop()] = urlOnline
          }
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

            shopInfoTemp["shopBanners"] = imgJsonTemp
            shopInfoTemp['shopLogo'] = logoTemp
            
            //请求服务器接口修改数据库
            wx.request({
              url: 'https://www.betterguitars.com/uploadShopInfo',
              method: 'POST',
              data: {
                shopInfo: shopInfoTemp,
                op:self.data.op
              },
              success: function (res) {
                
                app.globalData.shopInfo = shopInfoTemp

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

    }else{  //没有需要上传的图片，只删除了部分图片或者只修改了文本信息
        shopInfoTemp["shopBanners"] = imgJsonTemp
        //请求服务器接口修改数据库
        wx.request({
          url: 'https://www.betterguitars.com/uploadShopInfo',
          method: 'POST',
          data: {
            shopInfo: shopInfoTemp,
            op:self.data.op
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

  console.log('new imgJsonTemp123=',imgJsonTemp)

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