const globalData=require("../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../common/behavior/fixedMenus.js");
let {chunkArr}=require("../../utils/util")
Page({
    behaviors:[globalData,fixedMenus],
    async onLoad(){
        await this.initData()
    },
    data:{
        list:[]
    },
    async initData(){
        let {getProds}=getApp().$apis;
        let res=await getProds();
        if(res){
            let arr=chunkArr(res.list,2);
            console.log(arr)
            this.setData({
                list:arr
            })
        }
    }
})