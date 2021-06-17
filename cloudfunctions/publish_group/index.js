// 云函数入口文件
const cloud = require('wx-server-sdk');
const sd = require('silly-datetime');

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const openid = cloud.getWXContext().OPENID;
	const { goodsname, goodsdes, d_time, pnumber, userDetail, pic_url_qr, pic_url, price, phone,discount } = event;
	let { pub_time } = event;
	if (!pub_time) {
		pub_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	}
	// const pub_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	const params = {
		goodsname,
		goodsdes,
		price,
		d_time,
		openid,
		pic_url,
		pub_time,
		userDetail,
		pic_url_qr,
		pnumber,
		pic_url_qr,
		phone,
		alradyNum: 0,
		discount,
		index: 1,
		num:0

	}
	let add_res = {};
	try {
		await db.collection('goods_group').add({
			data: params
		}).then(res => {
			add_res = res;
		});
	} catch (err) {
		console.log(err);
	}

	return add_res;

}