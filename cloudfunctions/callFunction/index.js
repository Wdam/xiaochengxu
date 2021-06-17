// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // const _id = event.actionFilter._id
  // return cloud.callFunction({
  //   name:'cms-test',
  //   data:{
  //     _id
  //   }
  // })
 
}