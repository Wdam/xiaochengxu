import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()
Page({

    /**
    * 页面的初始数据
    */
    data: {

    },

    toPublish(e){
        const { logged } = app.globalData;
        if(logged){
                const {type} = e.currentTarget.dataset;
                if(type == 2){
                    wx.navigateTo({
                        url: '../publish_lost/publish_lost'
                    })
                }else if(type == 0 || type == 1){
                    wx.navigateTo({
                        url: `../publish_old/publish_old?pub_type=${type}`
                    })
                
                }else if(type == 3){
                    wx.navigateTo({
                        url: '../publish_group/publish_group'
                    })
                }
        }else{
            Dialog.alert({
                title: '未登录',
                message: '您暂未登录，请登录后再进行发布'
            });
        }
    }
})