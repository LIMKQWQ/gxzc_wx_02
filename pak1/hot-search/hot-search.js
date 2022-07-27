const globalData = require("../../common/behavior/appGlobalData.js");
let fixedMenus = require("../../common/behavior/fixedMenus.js");

Page({
  behaviors: [globalData, fixedMenus],
  onLoad() {
    this.initData()
  },
  data: {
    searchStr: '',
    hotSearch: []
  },
  async initData() {
    // let pages=getCurrentPages();
    // let id=pages[pages.length-1].options.id;
    // let {getKnowledgeDetail}=getApp().$apis;
    // let {list,banner}=await getKnowledgeDetail({id});
    this.getHotSearch()
  },
  async getHotSearch() {
    await getApp().$apis.getNeedsKey().then(res => {
      this.setData({
        hotSearch: res
      })
      console.log(this.data.hotSearch);
    })
  },
  hotTag(e) {
    // console.log(e.target.dataset.text);
    this.setData({
      searchStr:e.target.dataset.text
    })
    this.search()
  },
  search() {
    //  console.log(this.data.searchStr);
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      searchStr: this.data.searchStr
    })
    prevPage.search()
    wx.navigateBack({
      delta: 1 // 返回上一级页面。
    })
  }
})