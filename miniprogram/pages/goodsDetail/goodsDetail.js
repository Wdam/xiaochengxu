import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp();
const ss = require('../../utils/utils.js')

//openid获取未解决，消息通知未解决

Page({

    /**
    * 页面的初始数据
    */
    data: {
        good_imgs: [],
        qr_imgs: [],
        detail: {},
        isJoined: false,
        isLike: false,
        logged: false,
        goods_id: 0,
        status: 1,
        score: null,
        nowTime: new Date().getTime(), //获取当前日期
        endTime: null,//结束日期时间戳
        remainTime: null,
        countDownTxt: null,
        isEnd: true,
        openid: null,
        flage: false, //判断订阅状态
        joiner: {},
        //凭证图片
        Evidimg: '',
        tempFilePaths: [],

    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        console.log(options);
        const skey = wx.getStorageSync('skey');
        const that = this;
        const { id, status, remainTime, goods_id } = options;
        const params = {
            skey,
            id
        }
        if (status == 0) {
            params['status'] = status;
        }
        this.setData({
            goods_id: id,
            status
        })
        wx.cloud.callFunction({
            name: 'getGoods_detail',
            data: params,
            success: res => {
                console.log(res, 'getGoods_detail');

                const pic_url_qr = res.result.detail.data.pic_url_qr
                const good_imgs = res.result.detail.data.pic_url


                that.setData({
                    good_imgs: good_imgs,
                    qr_imgs: pic_url_qr,
                    detail: res.result.detail.data,
                    isJoined: res.result.isJoined,
                    openid: res.result.detail.data.openid,
                    logged: app.globalData.logged,

                })
              const  openid= res.result.detail.data.openid
                this.getUserInfo(openid)
                // that.setData({
                //     good_imgs:this.data.good_imgs.concat(pic_url_qr),
                // })
            },
            fail: err => {
                console.log(err);
            }
        })
        wx.cloud.callFunction({
            name: 'getOpenidtest',
            success: res => {


                // this.setData({
                //     openid:res.result.openid
                // })
                //openid = res.result.openid;

                console.log(this.data);
            },
            fail: res => {
                console.log(res,);
            }
        })

        this.getSettime(params);
        
        

        wx.cloud.callFunction({
            name: 'getLikegoods_detail',
            data: params,
            success: res => {
                console.log(res);
                that.setData({
                    isLike: res.result.isLike,
                })
            },
            fail: err => {
                console.log(err);
            }
        })



    },
    onShow: function () {
        // setTimeout(() => {
        //     this.getUserInfo()
        // }, 1000);

    },
    
    //获取评分信息
    getUserInfo(openid) {
        //const openid = this.data.openid
        wx.cloud.callFunction({
            name: 'getUserinfo',
            data: {
                openid:openid
            },
            success: res => {
                console.log(res, 'getUserinfo');
                this.setData({
                    score: res.result.data[0].score
                })
            },
            fail: err => {
                console.log(err, 'getUserinfo');
            }
        })

    },
    modifyLikeGood() {
        const { logged, isLike, goods_id, status } = this.data;
        console.log(status == 1, logged);

        if (status == 1) {
            if (logged) {
                this.setData({
                    isLike: !isLike
                });

                const skey = wx.getStorageSync('skey');
                //调用云函数添加/删除喜欢商品
                wx.cloud.callFunction({
                    name: 'saveOrDelete_likes',
                    data: {
                        goods_id,
                        skey,
                        isLike: !isLike
                    },
                    success: res => {
                        console.log(res);
                    },
                    fail: err => {
                        console.log(err);
                    }
                })


            } else {
                Dialog.alert({
                    title: '未登录',
                    message: '您暂未登录，请登录后再进行操作'
                });
            }
        }
    },

    modifyLikeGoods() {


        const { logged, isJoined, status, } = this.data;


        const that = this;
        console.log(status == 1, logged);
        if (status == 1) {
            if (logged) {
                const skey = wx.getStorageSync('skey');

                console.log(isJoined, '111111111111111');
                //弹出提示框,提示是否参加活动
                if (isJoined) {
                    wx.showModal({
                        title: '您已参与，不可重复参加',
                        content: '',
                    })
                } else {
                    that.tiaozhuan()
                }



            } else {
                Dialog.alert({
                    title: '未登录',
                    message: '您暂未登录，请登录后再进行操作'
                });
            }
        }

    },
    //获取数据库中设定好的时间
    getSettime(params) {
        wx.cloud.callFunction({
            name: 'getGoods_detail',
            data: params,

            success: res => {

                const { d_time } = res.result.detail.data
                // console.log(d_time);
                const date = new Date(d_time)
                //    console.log(date);
                const endTime = date.getTime();
                //    console.log(endTime,'1111111111111111111111111'); 
                this.setData({
                    endTime: endTime
                })
                this.setData({
                    remainTime: this.data.endTime - this.data.nowTime

                })
                ss.countDown(this);
                if (this.remainTime <= 0) {
                    this.setData({
                        isEnd: false
                    })
                }

            },


            fail: err => {
                console.log(err);
            }
        })
    },


    makePhoneCall() {
        if (this.remainTime < 0) {
            wx.showToast({
                title: '活动已经结束啦~',
                icon: 'none'
            })
        } else {
            wx.makePhoneCall({
                phoneNumber: this.data.detail.phone
            })
        }


    },
    //选择图片
    chooseEvid() {
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
                const { tempFilePaths } = that.data;

                that.setData({
                    tempFilePaths: tempFilePaths.concat(filePath)
                }, () => {
                    //console.log(that.data.tempFilePaths)

                })
            },
            fail: e => {
                console.error(e)
            }
        })
    },
    //上传购买凭证
    doUploadEvid(filePath) {
        const that = this;
        const arr = filePath.split('/');
        const name = arr[arr.length - 1];

        // const cloudPath = 'goods-pic/my-image' + filePath.match(/\.[^.]+?$/)[0];
        const cloudPath = 'group_imgs_Evi/' + name;

        wx.cloud.uploadFile({
            cloudPath,
            filePath
        }).then(res => {
            console.log('[上传文件] 成功：', res)
            //  fileid  = res.fileID //图片在云存储中的id，位置
            const { Evidimg, goods_id } = that.data;
            // const { pic_url_qr } = params;
            // Evidimg.push(res.fileID);
            that.setData({
                Evidimg: res.fileID
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
    deletePic(e) {
        console.log(e);
        const { index } = e.currentTarget.dataset;

        const { tempFilePaths, Evidimg } = this.data;
        tempFilePaths.splice(index, 1);
        this.setData({
            tempFilePaths,
            Evidimg: []
        })

    },





    tiaozhuan() {

        const that = this
        const openid = that.data.openid
        const goods_id = that.data.goods_id
        wx.navigateTo({
            url: '../paypage/paypage?goods_id=' + goods_id + '&openid=' + openid
        })
    },
    Navigator(){
        const { logged, isLike, goods_id, status } = this.data;
        if(logged){
            wx.navigateTo({
                url:'../shopcar/shopcar'
            })
        }else{
            Dialog.alert({
                title: '未登录',
                message: '您暂未登录，请登录后再进行操作'
            });
        }
      
    }
})