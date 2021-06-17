// 云函数入口文件
const cloud = require('wx-server-sdk')
//改变收货状态，发送订阅消息
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { id, index, openid } = event

  await db.collection('joined-goods').where({
    openid: openid,
    'goods_arr.goods_id': id
  })
    .update({
      data: {
        'goods_arr.$.receive': 1
      }
    })
  const info = await db.collection('goods_group').doc(id).get()
  const { goodsname } = info.data


  await cloud.openapi.subscribeMessage.send({
    touser: openid,
    page: '../../miniprogram/pages/myGoodsList/myGoodsList',
    lang: 'zh_CN',
    data: {
      thing1: {
        value: goodsname
      },
      thing4: {
        value: '买家已确认收货'
      }

    },
    templateId: '3WqwvI0Nek7TMAKQl2dgsDCRG6UnLFkUHhPA98JHWHU',
    miniprogramState: 'developer'
  })

}