// 云函数入口文件
const cloud = require('wx-server-sdk')
//往goods数据库里加人员信息
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = db.command;

  const { joiner, goods_id, isJoined, openid } = event;
  const detailArr = new Array(joiner.joinedUserdetail)
  const res = await db.collection('goods_group').where({
    _id: goods_id
  }).get();

  // await db.collection('goods_group').add({
  //   // data:{
  //   //   joiner:detailArr
  //   // }
  // })
  if (isJoined) {
    await db.collection('goods_group').where({
      _id: goods_id
    }).update({
      data: {
        joiner: _.push(detailArr)
      }
    })
  } else {
    await db.collection('goods_group').where({
      _id: goods_id
    }).update({
      data: {
        joiner: _.pop(detailArr)
      }
    })
  }



  return {

    isJoined

  }

}
