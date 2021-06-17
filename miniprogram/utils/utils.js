const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  
  
  // 倒计时
  function countDown(that) { //倒计时函数
    let newTime = new Date().getTime();
    let endTime = that.data.endTime;
    let remainTime = endTime - newTime;
    let obj = null;
    let t = '';
    // 如果活动未结束，对时间进行处理
    if (remainTime > 0) {
      let time = remainTime / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: formatNumber(day),
        hou: formatNumber(hou),
        min: formatNumber(min),
        sec: formatNumber(sec)
      }
    }
    t = setTimeout(function() {
      that.setData({
        countDownTxt: obj
      });
      countDown(that)
    }, 1000)
    if (remainTime <= 0) {
      clearTimeout(t);
    }
  }
  
  module.exports = {
  　　countDown: countDown,
  }