// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { goods_id, openid,num } = event
  const newnum = Number(num)
  let res = {}
  let list = await db.collection('goods_group')
    .aggregate()
    .match({
      _id: goods_id
    })
    .project({
      _id: 0,
      pic_url_qr: 1,
      discount:1
    }).end()
  const qr_imgs = list.list[0].pic_url_qr //图片地址
  const discount  = list.list[0].discount
  //拉地址
  const address = await db.collection('userInfo')
    .aggregate()
    .match({
      openid: openid
    })
    .project({
      detailInfo: 1,
      _id: 0
    })
    .end()
  const dormitoryArea = address.list[0].detailInfo.dormitoryArea //宿舍区

    // await db.collection('goods_group').where({
    //   _id: goods_id
    // }).update({
    //   data:{
    //     num:_.inc(newnum)
    //   }
    // })
  return {
    qr_imgs,
    dormitoryArea,
    discount,
   
  }
}