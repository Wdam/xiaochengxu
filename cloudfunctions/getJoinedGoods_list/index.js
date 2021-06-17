// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
	const { skey, loadNum } = event;
	const userInfo = await db.collection('userInfo').where({
		skey: skey
	}).get();
	const { openid } = userInfo.data[0];

	const joined = await db.collection('joined-goods').where({
		openid: openid
	}).get();
	let joined_list = [];
	if (joined.data.length) {  //数据库中没有该用户的记录时joined.data.length为0
		const { goods_arr } = joined.data[0];  //喜欢商品的id数组
		let item = {};
		const len = goods_arr.length
		if (len > 0) {
			const maxIndex = len - 1 - loadNum * 10;
			const minIndex = maxIndex >= 10 ? maxIndex - 10 : -1;

			for (let i = maxIndex; i > minIndex; i--) {
				item = await db.collection('goods_group').where({
					_id: goods_arr[i].goods_id
				}).get();
				if (item.data[0] != null) {
					joined_list.push(item.data[0]);
				}
			}
		}
	}
	return {
		joined_list,
		joined
	}
}