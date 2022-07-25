// pak1/shareKnowledge/shareKnowledge.js
const globalData = require("../../common/behavior/appGlobalData.js");
let fixedMenus = require("../../common/behavior/fixedMenus.js");

Page({
  behaviors: [globalData, fixedMenus],
  onReachBottom() {

    this.loadMore()
  },
  onLoad() {
    this._initData();
    this.tabsData();
  },
  data: {
    banner: null,
    last_page: 1, //总页数
    currentPage: 1, //当前页数
    knowledgeList: [],
    _showLoading: false,
    type: 0,
    tabsList: []

  },
  async loadMore() {
    if (this.data.currentPage >= this.data.last_page || this.data._showLoading) {
      console.log("已经加载完了")
      return;
    };
    console.log("开始加载新的")
    this.setData({
      _showLoading: true
    })

    let {
      list
    } = await getApp().$apis.getKnowledgeList({
      page: this.data.currentPage + 1,
      type: this.data.type + 1
    });
    console.log(this.data.currentPage + 1, this.data.type + 1);
    console.log("新的加载完毕", list)
    let newList = [...this.data.knowledgeList, ...list];
    this.setData({
      knowledgeList: newList,
      currentPage: this.data.currentPage + 1
    });
    this.setData({
      _showLoading: false
    })

  },
  async _initData() {
    let {
      list,
      banner
    } = await getApp().$apis.getKnowledgeList({
      page: 1,
      type: this.data.type + 1
    });
    let list2 = [];
    if (list.last_page > 1) {
      console.log("有超过两页")
      let {
        list: list_
      } = await getApp().$apis.getKnowledgeList({
        page: 2,
        type: this.data.type + 1
      });
      list2 = list_.data;
    }
    this.setData({
      knowledgeList: [...list.data, ...list2],
      banner: this.data.baseUrl + banner.image,
      last_page: list.last_page,
      currentPage: list2.length ? 2 : 1
    })
  },
  selectTab(e) {
    this.setData({
      type: e.target.dataset.key,
      currentPage:1
    })
    this._initData()
    //  console.log(111);
  },
  async tabsData() {
    await getApp().$apis.getKnowledgeTabs().then(res => {
      this.setData({
        tabsList: res
      })
      console.log(this.data.tabsList);
    })
  }
})