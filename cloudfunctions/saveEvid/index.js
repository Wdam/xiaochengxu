// 云函数入口文件
//上传保存购买凭证
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { goods_id, Evidimg } = event

  await db.collection('goods_group').where({
    _id: goods_id
  })
    .update({
      data: {
        Evidimg: Evidimg
      }
    })


  return {
    Evidimg
  }
}