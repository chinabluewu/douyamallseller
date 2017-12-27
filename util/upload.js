var app = getApp()

/**
 * 最终上传到cos的URL
 * 把以下字段配置成自己的cos相关信息，详情可看API文档 https://www.qcloud.com/document/product/436/6066
 * REGION: cos上传的地区
 * APPID: 账号的appid
 * BUCKET_NAME: cos bucket的名字
 * DIR_NAME: 上传的文件目录
 */
// var cosUrl = "https://" + REGION + ".file.myqcloud.com/files/v2/" + APPID + "/" + BUCKET_NAME + DIR_NAME


var cosUrl = "https://" + "gz" + ".file.myqcloud.com/files/v2/" + "1254880032" + "/" + "douyamall" + "/shops"

//var cosUrl = "https://douyamall-1254880032.cosgz.myqcloud.com"

//填写自己的鉴权服务器地址
//var cosSignatureUrl = 'https://www.xxxx.com' 
var cosSignatureUrl = 'https://www.betterguitars.com/uploadAuth' 

var shopId = app.globalData.shopId

/**
 * 上传方法
 * filePath: 上传的文件路径
 * fileName： 上传到cos后的文件名
 */
function upload(filePath, fileName) {

    // 鉴权获取签名
    wx.request({
        url: cosSignatureUrl,
        success: function(cosRes) {

            // 签名
            var signature = cosRes.data.sign
            
             //console.log('sign=',signature)

            // 头部带上签名，上传文件至COS
            wx.uploadFile({
                url: cosUrl + '/'+shopId+'/' + fileName,
                //url: cosUrl ,

                filePath: filePath,
                
                header: {
                    'Authorization': signature
                },
                name: 'filecontent',
                formData: {
                    op: "upload"
                },
                success: function(uploadRes){
                  var data = uploadRes.data
                    //console.log('uploadRes.data=', uploadRes.data)
                    //console.log('filePath=',filePath)

                  console.log('uploadRes.data.data=', JSON.parse(uploadRes.data).data)    
                  var tempUrl = JSON.parse(uploadRes.data).data.access_url
                console.log('tempUrl=', tempUrl)
                    //do something
                  // wx.showToast({
                  //   title: '上传成功',
                  // }) 
                 app.globalData.tempUrl = tempUrl
                 
                 return JSON.parse(uploadRes.data).data
                },
                fail: function(e) {
                    console.log('e', e)
                }
            })
        }
    })
}

module.exports = upload