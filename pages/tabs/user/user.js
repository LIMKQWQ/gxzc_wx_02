let globalData=require("../../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../../common/behavior/fixedMenus.js");
let authorize=require("../../../common/behavior/authorize.js");
const computedBehavior = require('miniprogram-computed').behavior

Component({
    behaviors:[globalData,fixedMenus,computedBehavior,authorize],
    async attached(){
        let {_userInfo}=getApp().globalData;
        let {getUserInfo}=getApp().$apis;
        wx.$bus.on("login",(userInfo)=>{
            this.setData({
                _userInfo:userInfo
            })
        })
        wx.$bus.on("logout",()=>{
            this.setData({
                _userInfo:null,
                userInfo:null
            })
        })
        wx.$bus.on("refreshUserInfo",(userInfo)=>{
           console.log("refreshUserInfo",userInfo)
            this.setData({
                userInfo:userInfo.user,
                scrolled:false,
                "nums[0].to":userInfo.collection,
                "nums[0].num":0,
                "nums[1].to": userInfo.deal,
                "nums[1].num": 0,
                "nums[2].to": userInfo.follow,
                "nums[2].num": 0
            })
        })
        if(_userInfo){
            //已登录
            let userInfo=await getUserInfo();
           
            if(userInfo){
                wx.$bus.emit("refreshUserInfo",userInfo);
            }
        }
        let pages=getCurrentPages();
        let page=pages[pages.length-1];
        page.onShow=()=>{
            this._startScroll();
        }
    },
   

    data:{
        userInfo:null,
        actived:1,
        isShowSelect:false,
        scrolled:false,
        disabledShare:true,
        nums:[
            {
                num:0,
                to:2400
            },
            {
                num:0,
                to:4000
            },
            {
                num:0,
                to:8000
            }
        ]
    },
    computed:{
        status(data){
            let info=data.userInfo;
            if(!info){
                return "unlogin"
            }
           
            return info.group_id==2?"personc":"personb"
        }
    },
    methods:{
        logout(){
            wx.$bus.emit("logout")
        },
        toLogin(){
            wx.navigateTo({
                url:"/pages/login/login"
            })
        },
        toRegister(){
         let actived=this.data.actived;
         let type=actived==1?0:1;
         wx.setStorageSync("registerType",type);
        wx.navigateTo({
            url:"/pages/register/register",
            complete:()=>{
                this.hideSelect()
            }
        })
        },
        selectItem(e){
            let target=e.currentTarget;
            this.setData({
                actived:target.dataset.item
            })
        },
        showSelect(){
            this.setData({
                isShowSelect:true
            })
        },
        hideSelect(){
            this.setData({
                isShowSelect:false
            })
        },
        _startScroll(){
            if(this.data.scrolled)return;
            this.setData({
                scrolled:true  
            })
            let fn=()=>{
                let done=false;
                    this.data.nums.forEach((numItem,index)=>{
                        let {num,to}=numItem;
                        let str=`nums[${index}].num`;
                        this.setData({
                            [str]:num+=275
                        });
                        if(to-num<100){
                            
                            done=true;
                            //有一个完成的同时结束
                            this.data.nums.forEach((numItem,index)=>{
                                let str=`nums[${index}].num`;
                                this.setData({
                                        [str]:numItem.to
                                })
                            })
                           
                        }
                    })
                    if(!done) setTimeout(fn,50);
               }
              fn()
           
        },
        to(e){
            let {url}=e.currentTarget.dataset;
           
            if(this.data.status!='unlogin'){
                wx.navigateTo({
                    url
                })
            }else{
                wx.showToast({
                    title:"请先登录",
                    icon:"error",
                    duration:500
                })
            }
            
        }
    }

})