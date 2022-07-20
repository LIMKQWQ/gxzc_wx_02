const globalData=require("../../common/behavior/appGlobalData.js");

Page({
    behaviors:[globalData],
    data:{
        area:"中国",
        area_code:"+86",
        phone:null,
        code:null,
        password:null,
        repassword:null,
        showCountry:false,
        restTime:0
    },
    //选中区号
    selected(e){
        this.setData({
            area:e.detail.cn,
            area_code:e.detail.code
        })
        this.close();
    },
    
    show(){
        this.setData({
            showCountry:true
        })
    },
    //关闭区号选择
    close(){
        console.log("close")
        this.setData({
            showCountry:false
        })
    },
    async getCode(){
        if(this.data.restTime>0)return;
        let {getCode}=getApp().$apis;
        let {area_code,phone}=this.data;
        area_code=area_code.replace("+","");
        if(!phone){
            wx.showToast({
                title:"手机号不能为空",
                icon:"error",
                duration:500
            })
        }
        let res=await getCode({area_code,phone,event:"changepwd"});
        if(res){
            this.setData({
                restTime:60
            });
            let interval=setInterval(()=>{
                this.setData({
                    restTime:--this.data.restTime
                })
                if(this.data.restTime<=0){
                    clearInterval(interval);
                    this.setData({
                        restTime:0
                    })
                }
            },1000)
        }
        console.log(res)
    },
    async setPasswd(){
        let {changePwd}=getApp().$apis;
        let { phone,code,password,repassword}=this.data;
        if(!phone){
            wx.showToast({
                title:"手机号不能为空",
                icon:"error",
                duration:500
            })
            return;
        }
        if(!code){
            wx.showToast({
                title:"验证码不能为空",
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
        if(repassword!=password){
            wx.showToast({
                title:"密码不一致",
                icon:"error",
                duration:500
            })
            return;
        }
        let res=await changePwd({
            mobile:phone,
            code,
            password
        });
        if(res){
            wx.switchTab({
                url:"/pages/tabs/user/user",
                success(){
                   setTimeout(()=>{
                    wx.showToast({
                        title:"密码修改成功",
                        duration:800
                    })
                   },300)
                }
            })
        }
    },
    prevent(){
        return;
    }
})