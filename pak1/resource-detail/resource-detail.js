const globalData=require("../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../common/behavior/fixedMenus.js");
Page({
    behaviors:[globalData,fixedMenus],
    onLoad(){
        this.initData()
    },
    data:{
        swiper:{
            current:1,//第几个,即index+1
            sum:2
        },
        images:[],
        collected:false,
        info:null,
        id:null,
       shareTitle:null,
       __shareImg:null


    },
    swiperChange({detail}){
        let {current}=detail;
        this.setData({
            "swiper.current":current+1
        })
    },
    async initData(){
        let pages=getCurrentPages();
        let page=pages[pages.length-1];
        let {getResourceDetail}=getApp().$apis;
        let res=await getResourceDetail({id:page.options.id});
        if(res){
            let {images,list,shoucang}=res;
            list.images=list.images.split(",");
            list.content=list.content.replaceAll(/(?<=\<img.*?)height="150rpx".*?(?=\>)/g,"")
            list.content=list.content.replaceAll("<img",`<img style=" display:block;max-width:100%;object-fit:cover;object-position:center" `)
        list.content=list.content.replaceAll(/<img style=" display:block;max-width:100%;object-fit:cover;object-position:center"(.*?)style="(.*?)"(?=.*?[\/]?>)/g,`<img style=" max-width:100%;object-fit:cover;object-position:center;$2"$1`)
           
            list.content=list.content.replaceAll("<table",`<table style="max-width:100% !important;"`)
            list.content=`<div style="width:100%;margin:0 auto;word-break:break-all;">${list.content}</div>`
            
            let sum=res.images.length;
            let shareImg=images.find(item=>item.type=="img")?.url;
            this.setData({
                "swiper.sum":sum,
                images,
                info:list,
                collected:shoucang,
                id:page.options.id,
                shareTitle:list.titel,
                __shareImg:shareImg?this.data.baseUrl+shareImg:false

            })
        }
    },
    async toggleCollectResource(){
        let {toggleCollectResource}=getApp().$apis;
		wx.showLoading({
			title:"加载中"
		})
        let res=await toggleCollectResource({id:this.data.id});
		wx.hideLoading()
        if(res){
            wx.$bus.emit("refreshCollection")

            this.setData({collected:!this.data.collected});
            wx.showToast({
                title:res.msg,
                duration:800
            })
        }
    },
    showKf(){
        this.selectComponent("#fixedMenus").showQrcode()
    },
})