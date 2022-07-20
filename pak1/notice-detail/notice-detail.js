const globalData=require("../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../common/behavior/fixedMenus.js");
Page({
    behaviors:[globalData,fixedMenus],
    onLoad(){
        this.initData();
    },
    data:{
        banner:null,
        info:null
    },
    async initData(){
        let {getAnnounceDetail}=getApp().$apis;
        let pages=getCurrentPages();
        let id=pages[pages.length-1].options.id;
        console.log(id)
        let {list,banner}=await getAnnounceDetail({id});
        // list.content=list.content.replaceAll(/(?<=\<img.*?)height="150rpx".*?(?=\>)/g,"")
        list.content=list.content.replaceAll("<img",`<img style=" display:block;max-width:100%;object-fit:cover;object-position:center" `)
        list.content=list.content.replaceAll(/<img style=" display:block;max-width:100%;object-fit:cover;object-position:center"(.*?)style="(.*?)"(?=.*?[\/]?>)/g,`<img style=" max-width:100%;object-fit:cover;object-position:center;$2"$1`)
       
        list.content=list.content.replaceAll("<table",`<table style="max-width:100% !important;"`)
        list.content=`<div style="width:92%;margin:0 auto;word-break:break-all;">${list.content}</div>`
        this.setData({
            banner:banner.image,
            info:list
        })
    }
})