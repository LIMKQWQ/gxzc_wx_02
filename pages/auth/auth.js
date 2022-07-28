// pages/auth/auth.js
let globalData=require("../../common/behavior/appGlobalData.js");

Page({
  behaviors:[globalData],
  data: {
    show: false
  },
  async getPhoneNumber(e) {
    console.log(e,"eee");
    let {encryptedData,iv}=e.detail;
    let {getOpenId,sendUserPhone}=getApp().$apis;
    wx.showLoading({
      title:"加载中"
    })
    let {code}=await wx.login();
    let openid=await getOpenId({code});
    console.log(openid,encryptedData,iv);
    let res=await sendUserPhone({openid,encryptedData,iv})
    wx.hideLoading()
    if(res.code==1){
      wx.setStorageSync("sended",true);
    }
    console.log(res,"======================")
    if(!getApp().globalData._userInfo){
      wx.redirectTo({
        url:"/pages/login/login"
      })
    }else{
      wx.switchTab({
        url:"/pages/tabs/user/user"
      })
    }
   
  }
})