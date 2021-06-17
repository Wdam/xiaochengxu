// miniprogram/pages/salesDetails/salesDetails.js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {

    // checked:false,
    sale_list: [],
    good_imgs: [],
    qr_imgs: [],
    detail: {},
    isJoined: false,
    logged: false,
    goods_id: 0,
    status: 1,
    isEnd: true,
    openid: '',
    flage: false, //判断订阅状态
    joiner: [],

    isJoiner: false,
    // post:0 //发货状态，0是未发货，1是已发货

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, status } = options;

    //console.log(id,'222222222222'); 
    this.setData({
      goods_id: id,
    })

    setTimeout(() => {
      this.getGoodsdetail(status);
    }, 1000);






  },

  getGoodsdetail(status) {
    wx.showLoading({
			title: '加载中'
    });
    
    const skey = wx.getStorageSync('skey');
    const that = this;
    const id = that.data.goods_id
    const { joiner, isJoiner } = that.data
    const params = {
      skey,
      id
    }
    if (status == 0) {
      params['status'] = status;
    }
    this.setData({

      status
    })
    wx.cloud.callFunction({
      name: 'getGoods_detail',
      data: params,

      success: res => {
        const pic_url_qr = res.result.detail.data.pic_url_qr
        const good_imgs = res.result.detail.data.pic_url
        const joiner = res.result.detail.data.joiner

        if (joiner.length != 0) {
          that.setData({
            logged: app.globalData.logged,
            joiner: joiner,
            isJoiner: true

          })
          that.setData({
            good_imgs: this.data.good_imgs.concat(pic_url_qr)
          })
        } else {
          that.setData({
            isJoiner: false
          })
        }
      },
      fail: res => {
        console.log(params, '111111111111');
        console.log(res, '调用getGoods_detail失败');
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 3000)

  },

  //   getSaleList(){ 
  //     for(var index in res.result){
  //       const joiner=res.result[index].joiner;
  //       console.log(joiner[0]);  
  //     }
  // },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },





  // },
  sendMessage(openid) {
    const that = this
    //获取openid,传给sendmessage
    const { goods_id } = that.data;

    // console.log(openid,'1111111111111111111111111111');
    if (1) {
      wx.cloud.callFunction({
        name: 'sendMessage',
        data: {
          goods_id,
          openid,


        },
        success: res => {
          // console.log('111111111111111111111111');
          console.log(res, 'sendMessage正在被执行');
        },
        fail: res => {
          console.log(res, 'fail');
          // console.log('22222222222222222222222222222222');
        }
      })
    }
  },

  clickImg(e) {
    var imgUrl = e.target.dataset.url
    wx.previewImage({
      urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //移除错误成员 //不应该直接删除参与人员的数据库信息
  Remove(e) {
    console.log(e);
    const that = this;
    const openid = e.target.dataset.openid;
    wx.showModal({
      title: '警告',
      content: '移除参与者的状态不可逆转，是否确定？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          const { goods_id, joiner } = that.data
          wx.cloud.callFunction({
            name: 'Remove',
            data: {
              openid: openid,
              _id: goods_id
            },
            success: res => {
              that.getGoodsdetail();
              console.log(res, 'success');
            },
            fail: res => {
              console.log(res, 'fail');
            }
          })

          wx.showToast({
            title: '已移除',
            icon: 'success'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })









  },
  //发货按钮
  Post(e) {
    const that = this
    console.log(e);
    const openid = e.target.dataset.openid;
    const post = that.data.post;
    const goods_id = that.data.goods_id;
    const status = that.data.status
    const { index } = e.currentTarget.dataset;
    // const openid = that.data.openid
    wx.showModal({
      title: '提示',
      content: '确认发货吗？此状态不可取消',
      success(res) {
        if (res.confirm) {
          that.setData({
            openid: openid,
            post: 1
          })
          that.sendMessage(openid);
          wx.cloud.callFunction({
            name: 'changePost',
            data: {
              post: 1,
              goods_id: goods_id,
              openid: openid,
              index: index
            },
            success: res => {
              // console.log('111111111111111111111111');
              console.log(res, 'changePost');

              that.getGoodsdetail(status)
            },
            fail: res => {
              console.log(res, 'fail');
              // console.log('22222222222222222222222222222222');
            }
          })
          wx.showToast({
            title: '已发货',
            icon: 'success'
          })



        } else if (res.cancel) {
          console.log('用户点击取消')

          that.setData({
            post: 0

          })
        }
      }
    })



  }


})