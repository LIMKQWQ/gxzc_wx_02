// pak1/filter/filter.js
const globalData = require("../../common/behavior/appGlobalData.js");
let fixedMenus = require("../../common/behavior/fixedMenus.js");

Page({
  behaviors: [globalData, fixedMenus],
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    scrollTops: 0, // 要滚动的高度
    tabCur: 0, // 当前项
    rightCur: 0, // 用于实现左边联动右边
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ids = parseInt(options.id)
    console.log(ids, "111");

    if (ids != NaN ) {
      this.setData({
        tabCur: ids
      })
    }
    this.filterList()
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

  },
  // 列表加载
  async filterList() {
    await getApp().$apis.getHomeFilter().then(res => {
      // console.log(res);
      this.setData({
        list: res
      })
      console.log(this.data.list);
    })

    // console.log( getApp().$apis.getNeedsKey());
  },

  // 切换左边菜单并联动右边
  tabNav(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index);
    this.setData({
      tabCur: index,
      rightCur: index,
      // 实现左边自动滑动到某个位置 4表示自动滑动到 第五项 （4为索引值）
      scrollTops: (index - 4) * 50
    })
  },
  /**
   * 滑动右边对应左边菜单切换
   * 1、拿到该元素的高度，设定它的top和bottom
   * 2、判断滑动的距离是否大于 设定的top并小于设定的bottom，然后对应左边菜单的滑动
   */
  scrollLink(e) {
    let list = this.data.list
    let itemHeight = 0;
    for (let i = 0; i < list.length; i++) {
      //拿到每个元素
      let els = wx.createSelectorQuery().select("#scroll-" + i);
      els.fields({
        size: true
      }, function (res) {
        list[i].top = itemHeight;
        itemHeight += res.height;
        list[i].bottom = itemHeight
      }).exec()
    }

    this.setData({
      list
    })

    // 拿到滚动的高度
    let scrollTop = e.detail.scrollTop;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        this.setData({
          tabCur: i,
          scrollTops: (i - 4) * 50
        })
        return false
      }
    }
  },
  slideToggle() {
    console.log(111);
  },
  skipProduct(e) {
    console.log(e.target.dataset.text);
    wx.switchTab({
      url: '/pages/tabs/find-resource/find-resource',
    })
  }
})