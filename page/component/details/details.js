// page/component/details/details.js

Page({
  data:{

    itemId: '',
    imgJson: '',
    imgJsonStr:'',

    itemInfo: '',
    itemInfoStr:'',
    
    interval: 3000,
    duration: 800,

    goods: {

      id: 1,
      //image: '/image/goods1.png',
      image:'http://douyamall-1254880032.cosgz.myqcloud.com/shops/10001/tmp_999742413o6zAJsx7DKMeE2HssuBM0cIr3Gxs24c36e5b32ccdcbb12fc10a060dadfb4.jpg',
      title: '新鲜梨花带雨',
      price: 0.01,
      stock: '有货',
      detail: '这里是梨花带雨详情。',
      parameter: '125g/个',
      service: '不支持退货'
    },
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var itemId = options.itemId
    var self = this;
    wx.request({
      // url:'http://www.gdfengshuo.com/api/wx/cate-detail.txt',
      url: 'https://www.betterguitars.com/itemInfo?itemId=' + itemId,
      success(res) {
        console.log(res.data)
        console.log(res.data.result)

        self.setData({
          //detail : res.data.result
          itemInfo: res.data,
          itemInfoStr:JSON.stringify(res.data),
          imgJson: JSON.parse(res.data.imgs),
          imgJsonStr:res.data.imgs,
          itemId: itemId
        })
      }
    });


  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },

  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }




  
 
})