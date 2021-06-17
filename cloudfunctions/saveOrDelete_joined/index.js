// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const _ = db.command;
	const receive = 0
	const { skey, goods_id, isJoined } = event;
	const info = await db.collection('userInfo').where({
		skey: skey
	}).field({
		openid: true
	}).get();
	//const idArr = new Array(goods_id);
	const idArr = {
		goods_id,
		receive
	}

	const { openid } = info.data[0];
	const joined_goods = await db.collection('joined-goods').where({
		openid: openid
	}).get();
	let res;
	if (isJoined) {
		//添加喜欢的商品
		if (!joined_goods.data.length) {
			//第一次添加
			res = await db.collection('joined-goods').add({
				data: {
					openid,
					goods_arr: idArr
				}
			});
		} else {
			//非第一次直接更新数组
			res = await db.collection('joined-goods').where({
				openid: openid
			}).update({
				data: {
					goods_arr: _.push(idArr)
				}
			});
		}

		await db.collection('goods_group').doc(goods_id).update({
			data: {
				alradyNum: _.inc(1)
			}
		})

	} else {
		//删除商品
		const joined_arr = joined_goods.data[0].goods_arr;
		const index = joined_arr.indexOf(goods_id);
		if (index !== -1) {
			const deleArr = joined_arr.splice(index, 1);
			res = await db.collection('joined-goods').where({
				openid: openid
			}).update({
				data: {
					goods_arr: joined_arr
				}
			});
		}

		await db.collection('goods_group').doc(goods_id).update({
			data: {
				alradyNum: _.inc(-1)
			}
		})
	}

	return res;

}