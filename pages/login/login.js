let globalData=require("../../common/behavior/appGlobalData.js");

Component({
    behaviors:[globalData],
    attached(){

    },
    data:{
        username:"",
        password:"",
        isLogining:false,
        isShowSelect:false,
        actived:1
    },
    methods:{
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
        async login(){
            let {username,password}=this.data;
            if(!username){
                wx.showToast({
                    title:"用户名不能为空",
                    icon:"error",
                    duration:500
                })
                return;
            }
            if(!password){
                wx.showToast({
                    title:"密码不能为空",
                    icon:"error",
                    duration:500
                })
                return;
            }
            let {login,getUserInfo}=getApp().$apis;
            this.setData({
                isLogining:true
            })
            wx.showLoading({
                title:"正在登录"
            })
            let res=await login({account:username,password});
         

            this.setData({
                isLogining:false
            })
            wx.hideLoading()
            if(res){
                wx.$bus.emit("login",res.userinfo)
                let info=await getUserInfo();
                if(info){
                    wx.$bus.emit("refreshUserInfo",info);
                }
                wx.switchTab({
                    url:"/pages/tabs/user/user"
                })
            }
        }
    }
})