// miniprogram/pages/Score/score.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: {},
    isChange: true, //是否可以更改分数
    score: 0,
    score_1: null,
    openid: '',
    checkboxItems: [
      { name: '很好', value: 'great' },
      { name: '不错', value: 'good' },
      { name: '一般', value: 'common' },
      { name: '很差', value: 'bad' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const { openid } = options
    const { detailInfo, score } = this.data
    wx.cloud.callFunction({
      name: 'getUserinfo',
      data: {
        openid: openid
      },
      success: res => {
        console.log(res, 'getUserinfo');
        this.setData({
          detailInfo: res.result.data[0].detailInfo,
          score_1: res.result.data[0].score,
          openid: openid
        })
      },
      fail: res => {
        console.log(res, 'getUserinfo');
      }
    })
    setTimeout(() => {
      this.CheckInfo()
    }, 1000);
  },
  checkboxChange: function (e) {
    var that = this;
    let checkboxValues = null;
    let checkboxItems = this.data.checkboxItems, values = e.detail.value
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      if (checkboxItems[i].value == values[values.length - 1]) {
        checkboxItems[i].checked = true;
        checkboxValues = checkboxItems[i].value;
      }
      else {
        checkboxItems[i].checked = false;
      }
    }
    console.log(checkboxValues)
    that.setData({ checkboxItems, checkboxValues })
    if (checkboxValues == 'great') {
      that.setData({
        score: 2
      })
    } else if (checkboxValues == 'good') {
      that.setData({
        score: 1
      })
    } else if (checkboxValues == 'common') {
      that.setData({
        score: 0
      })
    } else if (checkboxValues == 'bad') {
      that.setData({
        score: -1
      })
    }
  },
  //提交前检查评分是否到上下限
  CheckInfo() {
    const that = this
    const { openid } = that.data
    wx.cloud.callFunction({
      name: 'getUserinfo',
      data: {
        openid: openid
      },
      success: res => {
        console.log(res, 'CheckInfo');
        const score = res.result.data[0].score
        if (score > 10 || score < -5) {
          that.setData({
            isChange: false
          })
        }
        else {
          that.setData({
            isChange: true
          })
        }
      },
      fail: err => {
        console.log(err, 'CheckInfo');
      }
    })

  },


  Change() {
    const that = this
    const { score, openid, isChange } = that.data
    wx.showModal({
      title: '提示',
      content: '确认提交吗？',
      success(res) {
        if (res.confirm && isChange) {


          wx.cloud.callFunction({
            name: 'changeScore',//changeReceive
            data: {
              score,
              openid
            },

            success: res => {
              console.log(res, 'changeScore');
            },
            fail: res => {
              console.log(res, 'changeScore');
            }
          })
          wx.showToast({
            title: '已确认',
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            });
          }, 1500);


        } else if (isChange == false) {
          wx.showToast({
            title: '已确认',
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            });
          }, 1500);


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