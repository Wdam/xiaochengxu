// 云函数入口文件
//删除参与者
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const { openid, _id } = event
  // //删除参与者列表
  await db.collection('goods_group').doc(_id)
    .update({
      data: {
        joiner: _.pull({
          openid: _.eq(openid)
        })
      }
    })
  //参加者减一
  await db.collection('goods_group').where({ _id: _id })
    .update({
      data: {
        alradyNum: _.inc(-1)
      }
    })

  //删除用户参与过的列表
  await db.collection('joined-goods').where({ openid: openid })
    .update({
      data: {
        goods_arr: _.pop()
      }
    })


  // //   //发送消息
  const info = await db.collection('goods_group')
    .doc(_id).get()
  const { goodsname } = info.data

  await cloud.openapi.subscribeMessage.send({
    touser: openid,
    page: '../../miniprogram/pages/groupGoodsList/groupGoodsList',
    lang: 'zh_CN',
    data: {
      thing1: {
        value: goodsname
      },

      thing5: {
        value: '您已被移出活动，请联系客服'
      }

    },
    templateId: 'I_gJvb7XsnNDzDnNGL3TAUF2i3yI23gp9vF8LbtEiis',
    miniprogramState: 'developer'
  })
}