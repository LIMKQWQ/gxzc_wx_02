const globalData = require("../../common/behavior/appGlobalData.js");
let fixedMenus = require("../../common/behavior/fixedMenus.js");

Page({
  behaviors: [globalData, fixedMenus],
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    totalPage: 1,
    // announceList: [],
    resourceList: [],
    seachc:"超级钻头"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.name);
    this.setData({
      seachc:options.name
    })
    this._initData()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore()
  },
  showKf() {
    this.selectComponent("#fixedMenus").showQrcode()
  },
  async _initData() {
    let {
      getResources
    } = getApp().$apis;
    let {
      list
    } = await getResources({
      page: 1,
      seachc:this.data.seachc
    });
    console.log(list, "111");
    this.setData({
      totalPage: list.last_page,
      page: list.current_page,
      resourceList: list.data,
    })

  },
  async loadMore() {
    let {
      getResources
    } = getApp().$apis;
    
    let {
      page
    } = this.data;
    console.log(page);
    let {
      list
    } = await getResources({
      page: page+1,
      seachc:this.data.seachc
    });
    console.log(list, "111");
    if(list.data==0){
      wx.showToast({
        title: '加载到底了',
        icon:"none"
      })
      return false
    }
    this.setData({
      totalPage: list.last_page,
      page: list.current_page,
      resourceList: [...this.data.resourceList,...list.data],
    })
  }

})