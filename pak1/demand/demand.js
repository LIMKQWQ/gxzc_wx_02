const globalData=require("../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../common/behavior/fixedMenus.js");
Component({
    behaviors:[globalData,fixedMenus],
    async attached(){
        let pages=getCurrentPages();
        let page=pages[pages.length-1];
        page.onReachBottom=()=>{
            this.loadMore()
        };
        wx.showLoading({
            title:"加载中"
        })
        wx.$bus.on("refreshDemand",()=>{
            this.initData()
        })
        await this.initData();
        wx.hideLoading()
    },
    data:{
        page:1,
        totalPage:1,
        list:null,
        _showLoading:false
    },
    methods:{
        async loadMore(){
            if(this.data.page>=this.data.totalPage||this.data._showLoading){
              console.log("已经加载完了")
                return;
            };
            console.log("开始加载新的")
            this.setData({
              _showLoading:true
            })
              
              let {list}=await getApp().$apis.getDemands({page:this.data.page+1});
              console.log("新的加载完毕",list)
              let newList=[...this.data.list,...list.data];
              this.setData({
                list:newList,
                page:this.data.page+1
              });
              this.setData({
                _showLoading:false
              })
        
          },
        async initData(){
            let {getDemands}=getApp().$apis;
            let {list}=await getDemands({page:1});
            let {last_page}=list;
            let lists=[];
            let page=1;
            if(last_page>=2){
                let data1,data2;
                let {list:{data}}=await getDemands({page:2});
                data1=data;
                page=2;
                if(last_page>=3){
                    let {list:{data}}=await getDemands({page:3});
                    data2=data;
                    page=3;
                }
                data1=data1||[];
                data2=data2||[];
                lists.push(...data1,...data2);
            }
            
            this.setData({
                page,
                totalPage:last_page,
                list:[...list.data,...lists]
            })
            
        }
    }
})