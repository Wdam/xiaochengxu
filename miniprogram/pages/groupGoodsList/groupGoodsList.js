const app = getApp();
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		goods_list: [],
		goods_arr: [],
		loadNum: 0,
		lastData: false,
		openid: '',
		receives: [],
		id: ''

	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		const { openid, id } = this.data

		const skey = wx.getStorageSync('skey');
		if (skey) {
			const { loadNum } = this.data;
			this.getGoods_list(loadNum);
		}

		wx.cloud.callFunction({
			name: 'getUserinfo',

			success: res => {
				console.log(res, 'getUserinfo');
				this.setData({
					openid: res.result

				})
			},
			fail: res => {
				console.log(res, 'getUserinfo');
			}
		})

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
			name: 'getJoinedGoods_list',
			data: {
				skey,
				loadNum
			},
			success: res => {
				wx.stopPullDownRefresh(); // 停止下拉刷新
				wx.hideLoading();
				console.log(res, 'getJoinedGoods_list');
				let list = res.result.joined_list;
				let joinedlist = res.result.joined.data[0].goods_arr
				let lastData = false;
				if (res.result.length < 10) {
					lastData = true;
				}
				if (loadNum) {
					const { goods_list } = that.data;
					const { goods_arr } = that.data
					list = goods_list.concat(list);
					joinedlist = goods_arr.concat(joinedlist)
				}
				that.setData({
					goods_list: list,
					loadNum: loadNum + 1,
					lastData: lastData,
					goods_arr: joinedlist
				})
			},
			fail: err => {
				wx.hideLoading();
				console.log(err, 'getJoinedGoods_list');
			}
		})

	},



	tapToUserInfo(e) {
		const { userid } = e.currentTarget.dataset;
		wx.navigateTo({
			url: `../userCenter/userCenter?userId=${userid}`
		})
	},



	//确认签收按钮 

	Receive(e) {
		const that = this
		//console.log(that.data.goods_list);
		//console.log(e);

		const index = e.target.dataset.index //获取id和index
		const id = e.currentTarget.dataset.id //货物id
		const { openid } = that.data
		//const{openid} =this.data.goods_list[index] //应该是触发页面人的openid
		//console.log(openid);
		//const {openid} = joiner[index]
		that.setData({
			//openid:openid,
			id: id
		})

		//console.log(openid);
		//console.log(id);
		wx.showModal({
			title: '提示',
			content: '确认收货吗？请检查物品完好',
			success(res) {
				if (res.confirm) {

					console.log(id, index, openid);
					wx.cloud.callFunction({
						name: 'changeReceive',//changeReceive
						data: {
							id: id,
							index: index,
							openid
						},

						success: res => {
							console.log(res, 'changeReceive');
							//that.sendMessage(openid,id)



						},
						fail: res => {
							console.log(res, 'changeReceive');
						}
					})
					wx.showToast({
						title: '已确认',
						icon: 'success'
					})
					setTimeout(() => {
						wx.navigateTo({
							url: '../Score/score?openid=' + openid
						})
					}, 1500);


				} else if (res.cancel) {
					console.log('用户点击取消')


				}
			}
		})



	}
})