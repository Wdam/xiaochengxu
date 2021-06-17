// 云函数入口文件
const cloud = require('wx-server-sdk')
//获取用户信息
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { openid } = event
  //  return event
  if (openid == null) {
    const openid = cloud.getWXContext().OPENID;
    return openid
  } else {
    return await db.collection('userInfo').where({
      openid: openid
    }).get()

  }


}