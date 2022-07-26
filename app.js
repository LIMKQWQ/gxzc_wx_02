let apis=require("./utils/api.js");
import EventBus from './utils/eventBus';
let sended=false;

wx.$bus = new EventBus()
App({
  async onLaunch() {
	//  wx.clearStorageSync()
	  // app.js

      //初始化tabbar高度等信息
      this.$initDeviceInfo()
     
    //   //初始化位置
    //   this.$initAddress()
    //  //初始化登录
    //   this.$initLogin()
     //是否发送过请求
     sended=wx.getStorageSync("sended")||false;
    
    wx.showLoading({
      title:"加载中"
  })
  await Promise.all([this.$initAddress(),this.$initLogin()])
  wx.hideLoading()
  },
  globalData: {
    _userInfo: null,
    baseUrl:"https://gxzc.eccode.net",
    // oBaseUrl:"https://www.dajia-oil.com",
    location:null
  },
  $apis:apis,
  $initDeviceInfo(){
     //手机信息
     let systemInfo = wx.getSystemInfoSync();
     // px转换到rpx的比例
       let pxToRpxScale = 750 / systemInfo.windowWidth;
 
       // 状态栏的高度
       let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
     
       // window的宽度
       let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
       let windowHeight = systemInfo.windowHeight;
       // window的高度
       let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
       // 屏幕的高度
       let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
       // 底部tabBar的高度
       let tabBarHeight = ktxScreentHeight - ktxStatusHeight - ktxWindowHeight
       //tabbar到顶部的高度
       this.globalData._deviceInfo={
           ktxStatusHeight,
           ktxWindowWidth,
           windowHeight,
           ktxScreentHeight,
           tabBarHeight
       }
  },
  $sendUserInfo(){
      if(sended)return;
      sended=true;
      wx.getUserProfile({
        desc:"用于更好的提供服务",
        success:async (res)=>{
         console.log(res,'***********************************************')
          let {getOpenId,sendUserInfo}=getApp().$apis;
          let {code}=await wx.login();
          // console.log(code)
          let openid=await getOpenId({code});
          let {userInfo:{nickName,gender,language,city,province,country,avatarUrl}}=res;
          // console.log({openid,encryptedData,iv})
          wx.showLoading({
            title:"加载中"
          })
          let res_=await sendUserInfo({openid,nickName,gender,language,city,province,country,avatarUrl});
        
          wx.hideLoading();
          console.log(res_)
          
          wx.navigateTo({
            url:"/pages/auth/auth"
          })
          
         
        },
        fail(e){
          console.log(e)
        }
      });
  },
  $initLogin(){
     // 登录
   let userInfo=wx.getStorageSync("userInfo");
   console.log("初始化",userInfo)
  let timestamp=Date.now();
  if(userInfo&&(Number(userInfo.expiretime)*1000-timestamp>1000*60*10)){
      console.log("已登录,初始化userInfo")
      console.log(userInfo)
      wx.setStorageSync("token",userInfo.token);
      this.globalData._userInfo=userInfo; 
   }else{
     console.log("超时",timestamp,userInfo.expiretime*1000)
   }
    wx.$bus.on("login",(userInfo)=>{
      this.globalData._userInfo=userInfo;
      console.log("设置token")
      wx.setStorageSync("token",userInfo.token);
      wx.setStorageSync("userInfo",userInfo)
    })
    wx.$bus.on("logout",()=>{
      this.globalData._userInfo=null;
      wx.removeStorageSync("token");
      wx.removeStorageSync("userInfo");
    })
  },
  async $initAddress(){
    let res=await wx.getSetting();
    if(!res.authSetting["scope.userLocation"]){
        console.log("没获取位置权限,开始获取权限")
        try{
            await wx.authorize({
                scope:"scope.userLocation"
            })
        }catch(e){
            wx.showToast({
                title:"获取位置失败",
                icon:"error",
                duration:800
            })
        }
    }
    console.log("开始获取位置")
    try{
       this.globalData._location=await wx.getLocation();
       wx.setStorageSync("_location",this.globalData._location)
    }catch(e){
      console.log(e)
      this.globalData._location_error=e.errCode;
      this.globalData._location=false;
    }
   
  }
})
