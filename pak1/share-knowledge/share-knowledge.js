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
    type: 1,
    tabsList: [],
    active:0

  },
  async loadMore() {
    let {
      currentPage,
      last_page,
      _showLoading,
      type,
      knowledgeList
    } = this.data;
    console.log(currentPage, last_page);

    if (currentPage >= last_page || _showLoading) {
      // console.log(this.data.currentPage, this.data.last_page);
      console.log("已经加载完了")
      return;
    };
    console.log("开始加载新的")
    this.setData({
      _showLoading: true
    })
    let {
      list
    } = await getApp().$apis.getShareKnowledgeList({
      page: currentPage + 1,
      type: type
    });
    console.log(list);
    // console.log(this.data.currentPage + 1, this.data.type + 1);
    // console.log("新的加载完毕", list)
    let newList = [...knowledgeList, ...list.data];
    this.setData({
      knowledgeList: newList,
      currentPage: list.current_page,
      _showLoading: false
    });
    // this.setData({
    //   _showLoading: false
    // })

  },
  async _initData() {
    let {
      type,
      currentPage
    } = this.data;
    console.log(type, currentPage, '当前页数和type');
    let {
      list,
      banner
    } = await getApp().$apis.getShareKnowledgeList({
      page: currentPage,
      type: type
    });
    let list2 = [];
    console.log(list, "list");
    let cupage = 0;
    if (list.last_page > 1) {
      console.log("有超过两页")
      let {
        list: list_
      } = await getApp().$apis.getShareKnowledgeList({
        page: currentPage + 1,
        type: type
      });
      list2 = list_.data;
      cupage = list_.current_page;
      console.log(list_, "list_list_");
    }
    console.log(list.data, list2);
    this.setData({
      knowledgeList: [...list.data, ...list2],
      banner: this.data.baseUrl + banner.image,
      last_page: list.last_page,
      currentPage: cupage
    })
    console.log(this.data.knowledgeList);
  },
  selectTab(e) {
    console.log(e.currentTarget.dataset.key,e.currentTarget.dataset.item.id);
    this.setData({
      active: e.currentTarget.dataset.key,
      currentPage:1,
      type:e.currentTarget.dataset.item.id,
      knowledgeList:[]
    })
    this._initData()
    //  console.log(111);
  },
  async tabsData() {
    await getApp().$apis.getKnowledgeTabs().then(res => {
      this.setData({
        tabsList: res,
      })
      console.log(this.data.tabsList);
    })
  }
})