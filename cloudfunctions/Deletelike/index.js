// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {goods_id,skey} = event;
  const _ = db.command;
  let newarr = []
  const info = await db.collection('userInfo').where({
		skey: skey
	}).field({
		openid: true
	}).get();
	const idArr = new Array(goods_id);
	const { openid } = info.data[0];
  let result 
  result =  await db.collection('likes-goods').where({
    openid
  }).get()

  const goods_arr = result.data[0].goods_arr
  let i = goods_arr.indexOf(goods_id)
  goods_arr.splice(i,1)
  // return goods_arr
  await db.collection('likes-goods').where({
    openid: openid
  }).update({
    data: {
      goods_arr: goods_arr
    }
  });

  await db.collection('goods_group').doc(goods_id).update({
    data: {
      likeNum: _.inc(-1)
    }
  })


  // return{
  //   openid,
  //   goods_id
  // }
  
}