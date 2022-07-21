// pak1/shareKnowledge/shareKnowledge.js
const globalData=require("../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../common/behavior/fixedMenus.js");
Page({
  behaviors:[globalData,fixedMenus],
  onReachBottom(){

      this.loadMore()
  },
  onLoad(){
    this._initData();
  },
  data:{
    banner:null,
    last_page:1, //总页数
    currentPage:1,//当前页数
    knowledgeList:[],
    _showLoading:false,
    state:0,
    tabsList:[
      {
        name:"钻井技术类",
        id:"l11"
      },
      {
        name:"钻井技术类",
        id:"l21"
      },
      {
        name:"钻井技术类",
        id:"l31"
      },
      {
        name:"钻井技术类",
        id:"l41"
      }, {
        name:"钻井技术类",
        id:"l51"
      },
      {
        name:"钻井技术类",
        id:"l89"
      },
      {
        name:"钻井技术类",
        id:"l546"
      },
    ]
    
  },
  async loadMore(){
    if(this.data.currentPage>=this.data.last_page||this.data._showLoading){
      console.log("已经加载完了")
        return;
    };
    console.log("开始加载新的")
    this.setData({
      _showLoading:true
    })
      
      let {list}=await getApp().$apis.getShareKnowledgeList({page:this.data.currentPage+1});
      console.log("新的加载完毕",list)
      let newList=[...this.data.knowledgeList,...list.data];
      this.setData({
        knowledgeList:newList,
        currentPage:this.data.currentPage+1
      });
      this.setData({
        _showLoading:false
      })

  },
  async _initData(){
    let {list,banner} =await getApp().$apis.getShareKnowledgeList({page:1});
    let list2=[];
    if(list.last_page>1){
      console.log("有超过两页")
      let {list:list_} =await getApp().$apis.getShareKnowledgeList({page:2});
      list2=list_.data;
    }
      this.setData({
        knowledgeList:[...list.data,...list2],
        banner:this.data.baseUrl+banner.image,
        last_page:list.last_page,
        currentPage:list2.length?2:1
      })   
  },
  selectTab(e){
    // console.log(e);
    this.setData({
      state:e.target.dataset.key
    })
  }
})