// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const id = event.actionFilter;
   const _id = event.actionFilter._id
  // const _id = event._id
  const info = await db.collection('goods_group').doc(_id).get();
  const openid= info.data.openid;
  const goodsname= info.data.goodsname;
  // return openid
   
    
  
//   try {
//     const result = await cloud.openapi.subscribeMessage.send({
//         touser: openid,
//         page: 'page/home/home',
//         lang: 'zh_CN',
//         data: {
//             name1: {
//                 value: goodsname
//             },
//             thing2: {
//                 value: '不符合平台规范'
//             },
//             thing6: {
//                 value: '尽快联系客服'
//             }

//         },
//         templateId: 'y4yi_hX_KsE4X3xQHtes6oeJrMRfTHfW4oKS1K9Ch9o',
//         miniprogramState: 'developer'
//     })

//     return result
// }
// catch (err) {

//     return err
// }
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

/*
 //const {_id} = JSON.stringify(event.actionFilter).toString();
  // return id
  //const _id = id.substring(1,id.length-1);

       { event:
        { action: 'deleteOne',
          actionFilter: { _id: '79550af260ac6e8019f568035ba8141e' }, //被删除货物的id
          actionRes: { deleted: 1, requestId: '306650aa9333d-179a190620c_7c' },
          collection: 'goods_group',
          source: 'CMS_WEBHOOK_FUNCTION',
          userInfo: { appId: 'wx2f95531f52f71e9d' } } }

          {"_id":"cbddf0af60ac556a0b54d3f7714d56cb"}




          { data:
   { _id: 'cbddf0af60ac556a0b54d3f7714d56cb',
     goodsname: '测试内容111111111',
     goodsdes: '测试标题11',
     price: '20',
     d_time: '2021-06-25 09:31:00',
     openid: 'o5pq45DjUZDFfSAZQhtidavBUCBI',
     pic_url:
      [ 'cloud://yougoudemo-0ge0k7sj9e6e9e97.796f-yougoudemo-0ge0k7sj9e6e9e97-1305003213/group_imgs/jhb7YYHEAvv2cd80910cd3763d6659838ee76104d5cd.jpg' ],
     pub_time: '2021-05-25 09:39:51',
     userDetail:
      { avatarUrl:
         'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJQmAQiaLWxfrI5r7QNaxiaWSb0Pwve2JCPWbBeb3H9vzwZx6ibTv9QojqMwCaFsoweQCYVUVFspvic8A/132',
        nickName: 'Wdam',
        score: 3 },
     pic_url_qr:
      [ 'cloud://yougoudemo-0ge0k7sj9e6e9e97.796f-yougoudemo-0ge0k7sj9e6e9e97-1305003213/group_imgs_QR/aVTDJHzS16Ir2cbac5b8fc1774a0097078cdd445054e.png' ],
     pnumber: '10',
     phone: '15373319813',
     alradyNum: 0,
     discount: '满100-10',
     index: 1,
     num: 0,
     _updateTime: 1621934058557 },
  errMsg: 'document.get:ok' }


*/