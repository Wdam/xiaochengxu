// miniprogram/paypage/paypage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goods_id:'',
      openid:'',
      dormitoryArea:'',
      qr_imgs:[],
      tempFilePaths: [],
      Evidimg:'',
      joiner:{},
      isJoined:false,
      post:0,
      text:null, //备注留言
      num:1, //购买数量
      discount:null //折扣信息
     
      //"cloud://yougoudemo-0ge0k7sj9e6e9e97.796f-yougoudemo-0ge0k7sj9e6e9e97-1305003213/group_imgs_QR/tmp_e2382d6490312cbffb327dc75ca8f8f66f3289b1bc48ff40.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options);
     const {num} = options
    //调用云函数，拉取付款二维码，拉一个地址信息，回传一个付款信息，跳回商品详情，isJoined = ture
    this.setData({
      // goods_id:options.goodsid,
      goods_id:options.goods_id,
      openid:options.openid,
      num:num
    })
    wx.cloud.callFunction({
      name:'payFunction',
      data:{
        goods_id:options.goods_id,
        openid:options.openid,
        
      },
      success:res => {
        //console.log(res,'12333333333333333333');
        const {dormitoryArea,qr_imgs,discount} = res.result;
        // this.setData({
        //   dormitoryArea:dormitoryArea,
        //   qr_img:qr_img
        // })
        if(dormitoryArea==''){
          wx.showModal({
            title: '警告',
            content: '地址为空',
            success(res) {
              if(res.confirm){
                wx.redirectTo({
                  //注意解开这里注释
                  url: '../userInfo/userInfo'
                })
              } else if(res.cancel){
                  console.log('用户点击取消');
                 wx.navigateBack({
                   delta: 1
                 });
              }
            }
          })
        }
        else{
          this.setData({
            dormitoryArea:dormitoryArea,
            qr_imgs:qr_imgs,
            discount:discount
          })
       
        }
       
        
      },
      fail: res => {
        console.log(res);
      }
    })
    // console.log(this.data);
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  chooseEvid(){
    const that = this;
    wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
            const filePath = res.tempFilePaths;
            //将选择的图片上传
            filePath.forEach((path, index) => {
                that.doUploadEvid(path);
            });
            const {tempFilePaths} = that.data;
            
            that.setData({
                tempFilePaths: tempFilePaths.concat(filePath)
            },()=>{
                //console.log(that.data.tempFilePaths)
               
            })
        },
        fail: e => {
            console.error(e)
        }
    })
  },
//上传购买凭证
doUploadEvid(filePath){
    const that = this;
    const arr = filePath.split('/');
    const name = arr[arr.length-1];
    
    // const cloudPath = 'goods-pic/my-image' + filePath.match(/\.[^.]+?$/)[0];
    const cloudPath = 'group_imgs_Evi/' + name;

    wx.cloud.uploadFile({
        cloudPath,
        filePath
    }).then(res => {
        console.log('[上传文件] 成功：', res)
        //  fileid  = res.fileID //图片在云存储中的id，位置
        const { Evidimg,goods_id } = that.data;
        // const { pic_url_qr } = params;
        // Evidimg.push(res.fileID);
        that.setData({
            Evidimg:res.fileID
        })
        
    }).catch(error => {
        console.error('[上传文件] 失败：', error);
        wx.showToast({
            icon: 'none',
            title: '上传失败',
            duration: 1000
        })
    })
},
deletePic(e){
    console.log(e);
    const {index} = e.currentTarget.dataset;
   
    const {tempFilePaths, Evidimg} = this.data;
    tempFilePaths.splice(index,1);
    this.setData({
        tempFilePaths,
        Evidimg:[]
    })
  
  },
  Confirm(e){
    const that = this;
    const skey = wx.getStorageSync('skey');
    const{joiner,goods_id,openid,Evidimg,isJoined,dormitoryArea,post, text}=this.data;
    const {nickName, avatarUrl} = app.globalData.userInfo;
    joiner.joinedUserdetail = {
      nickName,
      avatarUrl,
      openid,
      Evidimg,
      dormitoryArea,
      post,
      text,
      num:1
      
  }
     //弹出订阅提醒
     wx.requestSubscribeMessage({
      tmplIds:['9MNTPD9oQEaQ-K0W7pd7rvZcbzyF2raAwRpjMiKXKrI','I_gJvb7XsnNDzDnNGL3TAUF2i3yI23gp9vF8LbtEiis'],
      success(res){
      console.log('success',res);
      // that.setData({
      //     flage:true
      // })
      },
      fail(res){
          console.log('fail',res);
      }
  })
    //判断凭证是否为空
    if(Evidimg != ''){
      wx.showModal({
        title: '提示',
        content: '确认参加吗',
        success(res) {
          if(res.confirm){
            //调用云函数添加/删除
            wx.cloud.callFunction({
              name: 'saveOrDelete_joined',
              data: {
                  goods_id,
                  skey,
                  isJoined: !isJoined
              },
              success: res => {
                  //console.log(this.data);
                  //console.log(res,'2222222222222222');
              },
              fail: err => {
                  console.log(err);
              }
          });
           //如果确认
           wx.cloud.callFunction({
            name:'pushJoiner',
            data:{
                joiner:joiner,
                goods_id:goods_id,
                isJoined: !isJoined,
                openid:openid
            },
            success:res=>{
              that.setData({
                isJoined:!isJoined
              })
                console.log(res,'success');
                wx.showToast({
                  title: '参与成功',
                  icon: 'success'
                })
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2];
                prevPage.setData({
                  isJoined: !isJoined,
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1,
                })
              }, 1000)
               

            },
            fail:res => {
                console.log(res,'fail',that.data.joiner);
                
            }
        })
          } else if(res.cancel){
             
          }
        }
      })
    }else{
      wx.showToast({
        title: '凭证为空',
        icon: 'none'
      })
    }

  },

  liuyanInput(e){
    console.log(e);
    const text = e.detail.value
    this.setData({
      text:text
    
    })
  },



















  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})