// miniprogram/pages/openid/openid.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        openid:null
  },

  getOpenid(){
    wx.cloud.callFunction({
      name:'getOpenidtest'
    })
    .then(res =>{
      console.log(res);
      this.setData({
       openid:res.result.openid
      })
    })
    .catch(res =>{
      console.log(res);
    })
  },
getShouquan(){
  wx.requestSubscribeMessage({
    tmplIds:['jt_YG67Ubc-KsFkbdtAwjVtYQRvvqaPzsx1J8NiPVeo'],
    success: function(res) {
      console.log(res,'success');
    },
    fail: function(res) {
      console.log(res,'fail');
      
    }
  })
},
pushMessage(){
  wx.cloud.callFunction({
      // name:'getOpenidtest',
      name:'sendMessage',
      data:{
          goods_id:"b00064a760476a0a092bd89c0a0be324",
          openid:'o5pq45DjUZDFfSAZQhtidavBUCBI'
      },
     success:res =>{
          console.log(res,'success');
     },
     fail:res =>{
         console.log(res,'fail');
     }
  })
}

})