// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
   const wxContext = cloud.getWXContext()
   const { post, openid, goods_id, index } = event



   await db.collection('goods_group').where({
      _id: goods_id

   }).update({
      data: {
         ["joiner." + [index] + ".post"]: 1
      }
   })


   return goods_id




}