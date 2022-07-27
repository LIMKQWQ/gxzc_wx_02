let globalData=require("../../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../../common/behavior/fixedMenus.js");
let authorize=require("../../../common/behavior/authorize.js");
Component({
    behaviors:[globalData,fixedMenus,authorize],
    attached(){
        this._initData();
        let pages=getCurrentPages();
        pages[pages.length-1].onReachBottom=function(){
            this.loadMore()
        }
    },
    data:{
        _deviceInfo:null,
        activeTab:1,
        newTotal:1,
        newCurrentPage:1,
        industryTotal:1,
        industryCurrentPage:1,
        newsBanner:"",
        industryBanner:"",
        _showLoading:false,
        newsList:[
            {
                id:"sneiog",
                title:"喜讯！安东石油荣登北京市专精特 新“小巨人”榜单！喜讯！安东石油荣登北京市专精特 新“小巨人”榜单！",
                time:"2022-02-24",
                views:4000
            }
        ],
        industryList:[
            {
                id:"sneiog",
                title:"测试",
                time:"2022-02-24",
                views:4000
            }
        ]
    },
    methods:{
        async _initData(){
            let {getNews,getIndustry}=getApp().$apis;
            let res=await Promise.all([getNews({page:1}),getIndustry({page:1})])
            this.setData({
                newsBanner:this.data.baseUrl+res[0].banner.image,
                industryBanner:this.data.baseUrl+res[1].banner.image,
                newTotal:res[0].list.last_page,
                newsList:res[0].list.data,
                industryTotal:res[1].list.last_page,
                industryList:res[1].list.data
            })
            console.log(this.data.newsList);
        },
        async loadMore(){
            let to=this.data.activeTab==1?"newsList":"industryList";
            let totalPage=this.data.activeTab==1?"newTotal":"industryTotal";
            let currentPage=this.data.activeTab==1?"newCurrentPage":"industryCurrentPage";
            if(this.data[currentPage]>=this.data[totalPage]||this.data._showLoading){
                 console.log("已经加载完了")
                  return;
              };
              console.log("开始加载新的")
              this.setData({
                _showLoading:true
              })

            let {getNews,getIndustry}=getApp().$apis;
            let getFn=this.data.activeTab==1?getNews:getIndustry;
            let {list}=await getFn({page:this.data[currentPage]+1});
            console.log(this.data[to])            
            this.setData({
                [to]:[...this.data[to],...list.data],
                _showLoading:false,
                [currentPage]:this.data[currentPage]+1
            })
           
        },
        switchTab(e){
         let tab=e.currentTarget.dataset.tab;
            
            this.setData({
                activeTab:tab
            })
        }
    }
})