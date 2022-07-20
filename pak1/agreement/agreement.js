let globalData=require("../../common/behavior/appGlobalData.js");

Component({
    behaviors:[globalData],
    attached(){
        this.initData()
    },
    data:{
        htmlStr:null
    },
    methods:{
        async initData(){
            let {getAgreement}=getApp().$apis;
            let htmlStr=await getAgreement();
            this.setData({
                htmlStr
            })
            
        }
    }
})