const globalData=require("../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../common/behavior/fixedMenus.js");

let {chunkArr}=require("../../utils/util");
Page({
    behaviors:[globalData,fixedMenus],
    onLoad(){
        this.initData()
        wx.$bus.on("refreshCollection",this.initData)
    },
    data:{
        list:null
    },
    showKf(){
        this.selectComponent("#fixedMenus").showQrcode()
    },
    async initData(){
        let {getProductLike}=getApp().$apis;
        let {latitude:lat,longitude:lng}=this.data._location;
        wx.showLoading({
            title:"正在加载"
        })
        let res=await getProductLike({lng,lat});
        wx.hideLoading();
        res.list=chunkArr(res.list,2);
        console.log(res.list);
        this.setData({
            list:res.list
        })
        
    }
})