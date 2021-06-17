// miniprogram/pages/shopcar/shopcar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list: [],
		loadNum: 0,
		lastData: false,
		goods_id:null,
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    notes:false,
    isLike: false,
		
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		const skey = wx.getStorageSync('skey');
    // this.getTotalPrice();
   
		if (skey) {
			const { loadNum } = this.data;
			this.getGoods_list(loadNum);
		}
  },
/**
*上拉加载
*/
onReachBottom() {
  const { lastData } = this.data;
  const { loadNum } = this.data;
  if (!lastData) {
    this.getGoods_list(loadNum);
  }

},

/**
*下拉刷新
*/
onPullDownRefresh() {
  this.getGoods_list(0);
},

getGoods_list(loadNum) {
  wx.showLoading({
    title: '加载中'
  });
  const skey = wx.getStorageSync('skey');
  const that = this;
  wx.cloud.callFunction({
    name: 'getLikeGoods_list',
    data: {
      skey,
      loadNum
    },
    success: res => {
      wx.stopPullDownRefresh(); // 停止下拉刷新
      wx.hideLoading();
      console.log(res);
      let list = res.result;
      let lastData = false;
      if (res.result.length < 10) {
        lastData = true;
      }
      if (loadNum) {
        const { goods_list } = that.data;
        list = goods_list.concat(list);
      }
      that.setData({
        goods_list: list,
        loadNum: loadNum + 1,
        lastData: lastData,
        hasList: true
      })
    },
    fail: err => {
      wx.hideLoading();
      console.log(err);
    }
  })

},
 /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let goods_list = this.data.goods_list;
    const selected = goods_list[index].selected;
    goods_list[index].selected = !selected;
    this.setData({
      goods_list: goods_list
    });
    this.getTotalPrice();
  },
/**
   * 删除购物车当前商品
   */
 deleteList(e) {
  const index = e.currentTarget.dataset.index;
  let goods_list = this.data.goods_list;
  let goods_id = goods_list[index]._id;
  const skey = wx.getStorageSync('skey');
  goods_list.splice(index,1);
  this.setData({
    goods_list: goods_list
  });
  if(!goods_list.length){
    this.setData({
      hasList: false
    });

  }else{
    this.getTotalPrice();
    wx.cloud.callFunction({
      name:'Deletelike',
      data:{
        goods_id,
        skey
      },
      success: res => {
        console.log(res,'Deletelike');
    },
    fail: err => {
        console.log(err);
    }
    })
  }
},
/**
   * 购物车全选事件
   */
 selectAll(e) {
  let selectAllStatus = this.data.selectAllStatus;
  selectAllStatus = !selectAllStatus;
  let goods_list = this.data.goods_list;

  for (let i = 0; i < goods_list.length; i++) {
    goods_list[i].selected = selectAllStatus;
  }
  this.setData({
    selectAllStatus: selectAllStatus,
    goods_list: goods_list
  });
  this.getTotalPrice();
},
/**
   * 绑定加数量事件
   */
 addCount(e) {
  const index = e.currentTarget.dataset.index;
  let goods_list = this.data.goods_list;
  let num = goods_list[index].num;
  num = num + 1;
  goods_list[index].num = num;
  this.setData({
    goods_list: goods_list
  });
  this.getTotalPrice();
},
 /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let goods_list = this.data.goods_list;
    let num = goods_list[index].num;
    if(num < 1){
      return false;
    }
    num = num - 1;
    goods_list[index].num = num;
    this.setData({
      goods_list: goods_list
    });
    this.getTotalPrice();
  },
  /**
   * 计算总价
   */
   getTotalPrice() {
    let goods_list = this.data.goods_list;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<goods_list.length; i++) {         // 循环列表得到每个数据
      if(goods_list[i].selected) {                     // 判断选中才会计算价格
        if(goods_list[i].discount ){
          console.log(goods_list[i].discount);
          this.setData({
            notes:true
          })
        }
        total += goods_list[i].num * goods_list[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      goods_list: goods_list,
      totalPrice: total.toFixed(2)
    });
  },
  toPay(e){
    console.log(e);
    const id= e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const openid = e.currentTarget.dataset.openid
    const num = this.data.goods_list[index].num
    wx.navigateTo({
      url: '../paypage/paypage?goods_id='+id+'&num='+num+'&openid='+openid
    })
  },






  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})