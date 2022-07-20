let globalData=require("../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../common/behavior/fixedMenus.js");

Component({
    behaviors:[globalData,fixedMenus],
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
        total:1,
        page:1,
        banner:"",
        _showLoading:false,
        announceList:[
            {
                id:"sneiog",
                title:"喜讯！安东石油荣登北京市专精特 新“小巨人”榜单！喜讯！安东石油荣登北京市专精特 新“小巨人”榜单！",
                time:"2022-02-24",
                views:4000
            }
        ],
      
    },
    methods:{
        async _initData(){
            let {getAnnounces}=getApp().$apis;
            let res=await getAnnounces({page:1})
            
            this.setData({
                banner:this.data.baseUrl+res.banner.image,
                total:res.list.last_page,
                announceList:res.list.data
            })
        },
        async loadMore(){
            let to="announceList";
            let totalPage="total";
            let currentPage="page";
            if(this.data[currentPage]>=this.data[totalPage]||this.data._showLoading){
                 console.log("已经加载完了")
                  return;
              };
              console.log("开始加载新的")
              this.setData({
                _showLoading:true
              })

            let {getAnnounces}=getApp().$apis;
            let getFn=getAnnounces;
            let {list}=await getFn({page:this.data[currentPage]+1});
            console.log(this.data[to])            
            this.setData({
                [to]:[...this.data[to],...list.data],
                _showLoading:false,
                [currentPage]:this.data[currentPage]+1
            })
           
        },
       
    }
})