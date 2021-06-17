// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {


    const { goods_id, openid } = event

    //通过goodsid获取截至日期dtime
    const info = await db.collection('goods_group').doc(goods_id).get({})

    const { goodsname, d_time } = info.data

    try {
        const result = await cloud.openapi.subscribeMessage.send({
            touser: openid,
            page: 'page/home/home',
            lang: 'zh_CN',
            data: {
                thing1: {
                    value: goodsname
                },
                time2: {
                    value: d_time
                },
                thing3: {
                    value: '卖家已发货，活动结束'
                }

            },
            templateId: '9MNTPD9oQEaQ-K0W7pd7rvZcbzyF2raAwRpjMiKXKrI',
            miniprogramState: 'developer'
        })

        return result
    }
    catch (err) {

        return err
    }


}