// pages/test/test.js
const app = getApp();
Page({


    data: {
        params: {
            goodsname: '',
            goodsdes: '',
            d_time: '',
            price: 0,
            pnumber: 0,
            pic_url: new Array(),
            pic_url_qr: new Array(),
            phone: '',
            index: '1',
            discount:null,
            num:0



        },
        openid: '',
        score: 0,
        tempFilePaths: [],
        tempFilePaths1: [],
        minDate: new Date(2000, 1, 1).getTime(),
        maxDate: new Date(2030, 12, 31).getTime(),
        currentDate: new Date().getTime(),
        showDatePicker: false,
        d_time: '',
        goodsname_err: '',
        goodsdes_err: '',
        price_err: '',
        pnumber_err: '',
        phone_err: ''
    },


    closeDatePicker() {
        this.setData({
            showDatePicker: false
        })
    },
    toShowDatePicker() {
        this.setData({
            showDatePicker: true
        })
    },


    chooseDate(e) {
        const { params } = this.data;
        params['d_time'] = this.timeConvert(new Date(e.detail));

        this.setData({

            currentDate: e.detail,
            showDatePicker: false,
            params
        })
    },
    //时间戳
    timeConvert(time) {
        const changeTime = num => {
            if (num < 10) {
                num = `0${num}`;
            }
            return num;
        }
        const y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let s = time.getSeconds();
        m = changeTime(m);
        d = changeTime(d);
        h = changeTime(h);
        mm = changeTime(mm);
        s = changeTime(s);
        return `${y}-${m}-${d} ${h}:${mm}:${s}`;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取发布人的openid

        wx.cloud.callFunction({
            name: 'getUserinfo',
            data: {
                openid: null
            },
            success: res => {
                console.log(res);

                this.setData({
                    openid: res.result
                })
                wx.cloud.callFunction({
                    name: 'getUserinfo',
                    data: {
                        openid: this.data.openid
                    },
                    success: res => {
                        console.log(res, 'openid');
                        this.setData({
                            score: res.result.data[0].score
                        })



                    },
                    fail: res => {
                        console.log(res, 'getUserinfo');
                    }

                })


            },
            fail: res => {
                console.log(res, 'getUserinfo');
            }

        })
    },
    saveMessage(e) {
        console.log(e);
        const { type } = e.currentTarget.dataset;
        const { params } = this.data;
        console.log(params);
        params[type] = e.detail;

        this.setData({

        })
    },

    // 选择图片
    chooseImage: function () {
        const that = this;
        wx.chooseImage({
            count: 3,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                const filePath = res.tempFilePaths;
                //将选择的图片上传
                filePath.forEach((path, index) => {
                    that.doUpload(path);
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

    // 上传图片
    doUpload(filePath) {
        const that = this;
        const arr = filePath.split('/');
        const name = arr[arr.length - 1];

        // const cloudPath = 'goods-pic/my-image' + filePath.match(/\.[^.]+?$/)[0];
        const cloudPath = 'group_imgs/' + name;

        wx.cloud.uploadFile({
            cloudPath,
            filePath
        }).then(res => {
            console.log('[上传文件] 成功：', res)
            //  fileid  = res.fileID //图片在云存储中的id，位置
            const { params } = that.data;
            const { pic_url } = params;
            pic_url.push(res.fileID);
            params['pic_url'] = pic_url;
            that.setData({
                params
            });
        }).catch(error => {
            console.error('[上传文件] 失败：', error);
            wx.showToast({
                icon: 'none',
                title: '上传失败',
                duration: 1000
            })
        })

    },
    //选择二维码
    chooseQRcode() {
        const that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                const filePath = res.tempFilePaths;
                //将选择的图片上传
                filePath.forEach((path, index) => {
                    that.doUploadQR(path);
                });
                const { tempFilePaths1 } = that.data;

                that.setData({
                    tempFilePaths1: tempFilePaths1.concat(filePath)
                }, () => {
                    //console.log(that.data.tempFilePaths)

                })
            },
            fail: e => {
                console.error(e)
            }
        })
    },
    doUploadQR(filePath) {
        const that = this;
        const arr = filePath.split('/');
        const name = arr[arr.length - 1];

        // const cloudPath = 'goods-pic/my-image' + filePath.match(/\.[^.]+?$/)[0];
        const cloudPath = 'group_imgs_QR/' + name;

        wx.cloud.uploadFile({
            cloudPath,
            filePath
        }).then(res => {
            console.log('[上传文件] 成功：', res)
            //  fileid  = res.fileID //图片在云存储中的id，位置
            const { params } = that.data;
            const { pic_url_qr } = params;
            pic_url_qr.push(res.fileID);
            params['pic_url_qr'] = pic_url_qr;
            that.setData({
                params
            });
        }).catch(error => {
            console.error('[上传文件] 失败：', error);
            wx.showToast({
                icon: 'none',
                title: '上传失败',
                duration: 1000
            })
        })

    },
    //删除图片
    deletePic(e) {
        console.log(e);
        const { index } = e.currentTarget.dataset;
        const { tempFilePaths } = this.data;
        tempFilePaths.splice(index, 1);
        this.setData({
            tempFilePaths
        })

    },
    deletePicqr(e) {
        console.log(e);
        const { index } = e.currentTarget.dataset;
        const { tempFilePaths1 } = this.data;
        tempFilePaths1.splice(index, 1);
        this.setData({
            tempFilePaths1
        })

    },

    //发布前检查
    beforCheck(params) {
        let temp = 1;
        const { goodsname, goodsdes, price, pnumber, phone } = params;
        //判断手机号
        let valid_rule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
        if (phone === '') {
            this.setData({
                phone_err: '请输入手机号'
            })
            temp = 0;
        } else if (!valid_rule.test(phone)) {
            this.setData({
                phone_err: '手机号格式错误'
            });
            temp = 0;
        }
        //判断描述是否为空
        if (!goodsdes) {
            this.setData({
                goodsdes_err: '请填写描述'
            });
            temp = 0;
        }
        //判断标题是否为空
        if (!goodsname) {
            this.setData({
                goodsname_err: '请填写标题'
            });
            temp = 0;
        }
        //判断价格是否为空
        if (!price) {
            this.setData({
                price_err: '请填写价格'
            });
            temp = 0;
        }
        //判断人数是否为空
        if (!pnumber && pnumber < 2) {
            this.setData({
                pnumber_err: '请填入人数并且大于2人'
            });
            temp = 0;
        }

        return temp;


    },


    toPublish() {
        const { params } = this.data;


        //发布前校验
        const temp = this.beforCheck(params);
        if (temp) {
            wx.showLoading({
                title: '发布中',
            });

            const { nickName, avatarUrl } = app.globalData.userInfo;
            const { score } = this.data;
            params.userDetail = {
                nickName,
                avatarUrl,
                score
            }
            params['pub_time'] = this.timeConvert(new Date());
            console.log(params);
            //弹出订阅提醒
            wx.requestSubscribeMessage({
                tmplIds: ['3WqwvI0Nek7TMAKQl2dgsDCRG6UnLFkUHhPA98JHWHU'],
                success(res) {
                    console.log('success', res);

                },
                fail(res) {
                    console.log('fail', res);
                }
            })
            wx.cloud.callFunction({
                name: 'publish_group',
                data: params,
                success: res => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 1000,
                        success: () => {
                            setTimeout(() => {
                                wx.navigateBack();
                            }, 1000)
                        }
                    })
                },
                fail: err => {
                    console.log(err);
                    wx.hideLoading();
                    wx.showToast({
                        title: '发布失败',
                        icon: 'none',
                        duration: 1000,
                        success: () => {
                            setTimeout(() => {
                                wx.navigateBack();
                            }, 1000)
                        }
                    })
                }

            })
        }
    }


})