const app = getApp()
const ss = require('../../utils/utils.js')

Page({

    /**
    * 页面的初始数据
    */
    data: {
        msgList: [],
        imgUrls: [],
        choose: 1,
        goods_list: [],
        lost_list: [],
        startNum: 0,
        lastData: false,
        lostStart: 0,
        lastLost: false,
        active: 0,

        searchKey: '',
        nowTime: new Date().getTime(), //获取当前日期
        endTime: 0,//结束日期时间戳
        remainTime: null,
        countDownTxt: null,

    },

    saveSearchKey(e) {
        this.setData({
            searchKey: e.detail.value
        });
    },

    changeChoice(event) {
        const tag = parseInt(event.currentTarget.dataset.tag, 10);
        console.log(event.currentTarget.dataset.tag,'1111111111111111111')
        this.setData({
            choose: tag
        });
    },

    initList(startNum) {
        const that = this;
        wx.showLoading({
            title: '加载中'
        })
        wx.cloud.callFunction({
            name: 'getGoods_list',
            data: {
                startNum
            },
            success: res => {
                console.log(res);
                wx.stopPullDownRefresh(); // 停止下拉刷新
                wx.hideLoading();
                const { isLast } = res.result;
                let reverseList = res.result.list.data.reverse();
                //console.log(reverseList);
                if (startNum) {
                    //startNum不为0时，拼接到goods_list的后面
                    reverseList = that.data.goods_list.concat(reverseList);
                }
                console.log(reverseList,);
                that.setData({
                    goods_list: reverseList,
                    lastData: isLast
                });

            },
            fail: err => {
                wx.hideLoading();
                console.log(err);
            }
        })
    },

    initLostList(startNum) {
        const that = this;
        wx.showLoading({
            title: '加载中'
        })
        wx.cloud.callFunction({
            name: 'getLost_list',
            data: {
                startNum
            },
            success: res => {
                console.log(res);
                wx.stopPullDownRefresh(); // 停止下拉刷新
                wx.hideLoading();
                const { isLast } = res.result;
                let reverseList = res.result.list.data.reverse();
                if (startNum) {
                    //startNum不为0时，拼接到goods_list的后面
                    reverseList = that.data.lost_list.concat(reverseList);
                }
                that.setData({
                    lost_list: reverseList,
                    lastLost: isLast
                });
            },
            fail: err => {
                wx.hideLoading();
                console.log(err);
            }
        })

    },

    /**
    * 生命周期函数--监听页面显示
    */
    onShow() {
        this.initList(0);
        this.initLostList(0);



    },

    onLoad() {
        // console.log(this.data);
        this.getNotes()

    },
    onShareAppMessage() {
        return {
            title: '欢迎使用leyi',
            path: '/pages/home/home'
        }
    },



    /**
    *上拉加载
    */
    onReachBottom() {
        const that = this;
        console.log('上拉加载')
        that.initList
        const { startNum, lastData, lostStart, lastLost, choose } = this.data;

        if (choose == 1 && !lastData) {
            this.initList(startNum + 1);
        } else if (choose == 0 && !lastLost) {
            this.initLostList(lostStart + 1)
        }

    },

    //获取公告内容和照片
    getNotes() {
        const { msgList } = this.data
        const { imgUrls } = this.data
        wx.cloud.callFunction({
            name: 'getNotes',
            success: res => {
                console.log(res, 'getNotes');
                this.setData({
                    msgList: res.result.data[0].notes,
                    imgUrls: res.result.data[0].imgs
                })
            },
            fail: res => {
                console.log(res, 'getNotes');
            }
        })
    },



    //获取d_time
    getDtime() {
        const { remainTime } = this.data;
        console.log(remainTime, '111111111111');
    },


    /**
    *下拉刷新
    */
    onPullDownRefresh() {
        const { choose } = this.data;
        if (choose == 1) {
            this.initList(0);
            this.getNotes()
        } else {
            this.initLostList(0);
        }


    },


    tapToDetail(e) {
        const index = e.currentTarget.dataset.index;
        const { goods_list } = this.data;
        //console.log(e,'11111111111111')
        const pnumber = goods_list[index].pnumber;
        const alradyNum = goods_list[index].alradyNum;
        //    console.log(goods_list);
        console.log(this.data.remainTime);//有值
        if (alradyNum >= pnumber) {
            wx.showToast({
                title: '人数已满，无法参加',
                icon: 'none'
            })

        } else {
            const { id } = e.currentTarget.dataset;
            wx.navigateTo({
                url: `../goodsDetail/goodsDetail?id=${id}&status=1`
            });
        }

    },

    tapToLostDetail(e) {
        // const {lost_list} = this.data;
        // console.log(lost_list);
        // const phone = lost_list[0].phone;
        // console.log(phone);

        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../lostDetail/lostDetail?id=${id}`
        });
    },

    toClassifyList(e) {
        const { classify } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../classifyList/classifyList?from=classify&txt=${classify}`
        })
    },

    toSearchList() {
        let { searchKey } = this.data;
        this.setData({
            searchKey: ''
        })
        searchKey = searchKey.replace(/\s*/g, '');
        if (searchKey) {
            wx.navigateTo({
                url: `../classifyList/classifyList?from=search&txt=${searchKey}`
            })
        }
    },

    tapToUserInfo(e) {
        const { userid } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../userCenter/userCenter?userId=${userid}`
        })
    },
    toDetail(e) {
        const { title } = e.currentTarget.dataset;
        wx.navigateTo({
            url: '../notespage/notespage?title=' + title
        })
    }
})