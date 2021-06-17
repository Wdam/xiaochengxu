// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const { openid, id } = event

  let receives = []
  let res = await db.collection('joined-goods').where({
    openid: openid,
  }).get()

  for (var i = 0; i < res.data[0].goods_arr.length; ++i) {
    let { receive } = res.data[0].goods_arr[i]
    receives.push(receive)

  }



  return {
    receives: receives,


  }


}