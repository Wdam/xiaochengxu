// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
	const { skey, id, status } = event;  // skey用于判断该用户是否收藏了该商品
	
	let detail;
	if (status == 0) { //status为0，表示已下架的商品
		detail = await db.collection('unsale-goods').doc(id).get();
	} else {
		detail = await db.collection('goods_group').doc(id).get();
	}

	let isJoined = false;
	if (skey) {
		const info = await db.collection('userInfo').where({
			skey: skey
		}).field({
			openid: true
		}).get();
		if (info.data.length) {
			const { openid } = info.data[0];
		
			const  joined = await db.collection('joined-goods').where({
				
				'goods_arr.goods_id':id
			}).get();

			if(joined.data.length != 0){
				isJoined = true
			}
		
			// if (joined.data.length) {
			// 	const joined_arr = joined.data[0].goods_arr;
			// 	return joined_arr
				



			// }
		}
	}
	return {
		
		detail,
		isJoined,
	};
}