const globalData=require("../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../common/behavior/fixedMenus.js");

let {chunkArr}=require("../../utils/util");
Page({
    behaviors:[globalData,fixedMenus],
    onLoad(e){
       this.initData()
    },
    data:{
        banner:null,
        info:null,
        announce:null,
        title1:"新闻详情",
        title2:"行业动态",
        tab:1,
        last:null,
        next:null
    },
    async initData(){
        let pages=getCurrentPages();
        let {id,tab}=pages[pages.length-1].options;
        console.log(tab);
        if(tab==2){
            
           this.setData({
               tab:2
           })
        }
        let {getNewsDetail,getIndustryDetail}=getApp().$apis;
        let fn=tab==1?getNewsDetail:getIndustryDetail;
        let {banner,list,announce,last,next}=await fn({id});
        console.log(list);
        // list.content=list.content.replaceAll(/(?<=\<img.*?)height="150rpx".*?(?=\>)/g,"")
        list.content=list.content.replaceAll("<img",`<img style=" display:block;max-width:100%;object-fit:cover;object-position:center" `)
        list.content=list.content.replaceAll(/<img style=" display:block;max-width:100%;object-fit:cover;object-position:center"(.*?)style="(.*?)"(?=.*?[\/]?>)/g,`<img style=" max-width:100%;object-fit:cover;object-position:center;$2"$1`)
        list.content=list.content.replaceAll("<table",`<table style="max-width:100% !important;"`)
        list.content=`<div style="width:92%;margin:0 auto;word-break:break-all;">${list.content}</div>`
        this.setData({
            banner:this.data.baseUrl+banner.image,
            info:list,
            announce:chunkArr(announce,2),
            last,
            next,
            shareTitle:list.title

        })
    }
})