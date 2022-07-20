let globalData=require("../../common/behavior/appGlobalData.js");
let keyBoard=require("../../common/behavior/keyBoard.js");

let {checkEmpty}=require("../../utils/util");
Component({
    behaviors:[globalData,keyBoard],
    attached(){
        let type=wx.getStorageSync("registerType");
       
        if(type===""&&!getApp().globalData._next){
            wx.showModal({
                title:"错误",
                content:"未知的注册类型",
                showCancel:false,
                success(){
                    wx.navigateBack()
                }
            })
        }
        if(type) wx.removeStorageSync("registerType");
        this.setData({
            type
        })
        if(getApp().globalData._next){
            console.log("第二步")
            if(getApp().nextObj){
                let {
                    companyName,
                    phone_company,
                    name_company,
                    wechat,
                    image,
                    agreement,
                    fileList
                }=getApp().nextObj;
                this.setData({
                    companyName,
                    phone_company,
                    name_company,
                    wechat,
                    image,
                    agreement,
                    fileList:fileList||[]
                })
            }
           
            this.setData({
                isNext:true
            })
            getApp().globalData._next=false;
        }
        if(type==1){
           
            this.setData({
                activeTab:2
            })
        }
        
    },
    data:{
        activeTab:1,//1企业
        isShowOptions:false,
        //
        type:null,
        username:null,
        password:null,
        repassword:null,
        name:null,
        phone:null,
        code:null,
        companyName:null,
        name_company:null,
        phone_company:null,
        wechat:null,
        agreement:false,
        sexCode:1, //1男,2女
        user:1,//1企业2个人
        area:"中国",//手机号归属地
        area_code:"+86",//手机号归属地代码
        image:null,//企业营业执照
        //
        restTime:0,//验证码剩余时间
        showCountry:false,//归属地选择器显示状态
        fileList: [],
        isNext:false, //企业第二步
        __notEmpty:{
			username:"请输入用户名",
            nickname:"请输入姓名",
			password:"请输入密码",
			repassword:"请再次输入密码",
            sexCode:"请选择性别",
            mobile:"请输入手机号",
            code:"请输入验证码"
		},
        __notEmpty_c:{
                corporate:"请输入公司名称",
                phone:"请输入手机号",
                name:"请输入姓名",
                wechat:"请输入微信号",
                image:"请上传营业执照"
        },
    },
    methods:{
        back(){
            if(this.data.isNext){
                this.saveNextObj();
            }else{
                this.clearNextObj() 
            }
        },
        clearNextObj(){
            //第一步返回清理
            if(this.data.isNext)return;
            getApp().nextObj=null;
        },
        saveNextObj(){
            //第二步返回保存
            if(!this.data.isNext)return;
            let {
                companyName,
                phone_company,
                name_company,
                wechat,
                image,
                agreement,
                fileList
            }=this.data;
            getApp().nextObj={
                companyName,
                phone_company,
                name_company,
                wechat,
                image,
                agreement,
                fileList
            }
        },
        //个人用户注册
        async registerPersonal(){
            let {registerPersonal,getOpenId,getUserInfo}=getApp().$apis;
            let type=this.data.type;
            let {
                username,
                name:nickname,
                password,
                repassword,
                phone:mobile,
                code,
                sexCode
            }=this.data;
            
            let errs=checkEmpty({
                username,
                nickname,
                password,
                repassword,
                phone:mobile,
                code,
                sexCode
            },this.data.__notEmpty);
           if(errs.length){
               wx.showToast({
                   title:errs[0],
                   duration:800,
                   icon:"error"
               });
               return;
           }
           let sex=sexCode==1?"先生":"女士";
           wx.showLoading({
            title:"正在注册"
        })
           let {code:code_}=await wx.login()
           let openid=await getOpenId({code:code_});
          
            let res=await registerPersonal({
                like:1,
                type,
                username,
                nickname,
                password,
                mobile,
                code,
                sex,
                openid
            })
            wx.hideLoading()
            if(res){
                wx.$bus.emit("login",res.userinfo);
                let info=await getUserInfo();
                if(info){
                    wx.$bus.emit("refreshUserInfo",info);
                }
                wx.switchTab({
                    url:"/pages/tabs/user/user"
                })
            }
        },
        //企业用户注册
        async registerEnterprise(){
            let nextObj=this.data._nextObj
            let {
                companyName:corporate,
                phone_company:phone,
                name_company:name,
                wechat,
                image,
                agreement
            }=this.data
            
           let errs=checkEmpty({
                corporate,
                phone,
                name,
                wechat,
                image,
                
            },this.data.__notEmpty_c);
           if(errs.length){
               wx.showToast({
                   title:errs[0],
                   duration:800,
                   icon:"error"
               });
               return;
           }
           let like=agreement?1:0;
           if(!like){
               wx.showToast({
                   title:"请先同意用户协议",
                   duration:800,
                   icon:"error"
               });
               return;
           }

           wx.showLoading({
               title:"正在注册"
           })
           let {registerEnterprise,getUserInfo}=getApp().$apis;
           let res=await registerEnterprise({
               ...nextObj,
               ...{
                    corporate,
                    phone,
                    name,
                    wechat,
                    image,
                    like
                }

           });
           wx.hideLoading()
           if(res){
            wx.$bus.emit("login",res.userinfo);
            let info=await getUserInfo();
            if(info){
                wx.$bus.emit("refreshUserInfo",info);
            }
            wx.switchTab({
                url:"/pages/tabs/user/user"
            })
        }

        },
        //获取验证码
        async getCode(){
            if(this.data.restTime>0)return;
            let {getCode}=getApp().$apis;
            let phone=this.data.phone;
            if(!phone){
                wx.showToast({
                    title:"手机号不能为空",
                    duration:600,
                    icon:"error"
                });
                return;
            }
            let res=await getCode({
                area_code:this.data.area_code.replace("+",""),
                phone,
                event:"register"
            })
            console.log(res)
            if(res){
                this.setData({
                    restTime:60
                })
                let interval=setInterval(()=>{
                    let restTime=this.data.restTime;
                    this.setData({
                        restTime:--restTime
                    })
                    if(!restTime){
                        clearInterval(interval)
                        this.setData({
                            restTime:0
                        })
                    }
                },1000)
                wx.showToast({
                    title:"发送成功",
                    duration:600
                })
                
            }
        },
        //checkbox
        checkChange(e){
            let {value}=e.detail;
            if(value.length){
               this.setData({
                agreement:true
               })
            }else{
                this.setData({
                    agreement:false
                   })
            }
        },
        //选中归属地
        selectedCountry(e){
            this.close()
            console.log(e.detail)
            let {cn,code}=e.detail;
            this.setData({
                area:cn,
                area_code:code
            })
        },
        //显示归属地选择器
        showCountry(){
            this.setData({
                showCountry:true
            })
        },
        //关闭归属地选择器
        close(){
            this.setData({
                showCountry:false
            })
        },
        //switchTab
        switchTab(e){
            let tab=e.currentTarget.dataset.tab;
               this.setData({
                   activeTab:tab
               })
           },
           //性别显示隐藏
        toggleOptions(){
            this.setData({
                isShowOptions:!this.data.isShowOptions
            })
        },
        //隐藏性别选择
        hideOptions(){
            this.setData({
                isShowOptions:false
            }) 
        },
        //选择性别
        setSex(e){
            
            let {sex}=e.currentTarget.dataset;
            this.setData({
                "sexCode":sex
            })

        },
        //企业注册下一步
        async toNext(){
            let {
                username,
                name:nickname,
                password,
                repassword,
                phone:mobile,
                code,
                sexCode,
                type
            }=this.data;
            
            let errs=checkEmpty({
                username,
                nickname,
                password,
                repassword,
                mobile,
                code,
                sexCode
            },this.data.__notEmpty);
            
           if(errs.length){
               wx.showToast({
                   title:errs[0],
                   duration:800,
                   icon:"error"
               });
               return;
           }
           
           let sex=sexCode==1?"先生":"女士";
           wx.showLoading({
               title:"正在加载"
           })
           let {code:code_}=await wx.login()
           let {getOpenId}=getApp().$apis;
           let openid=await getOpenId({code:code_});
           wx.hideLoading()
           
            getApp().globalData._next=true;
            getApp().globalData._nextObj={
                type,
                username,
                nickname,
                password,
                mobile,
                code,
                sex,
                openid
            }
            wx.navigateTo({
                url:"/pages/register/register"
            })
        },
        //企业营业执照
        afterRead(e) {
            let {index,file:{url}} = e.detail;
            let fileList=this.data.fileList
            let obj={
                url,
                status:"uploading",
                message:"上传中"
            }
            fileList.push(obj);
            let {uploadFile}=getApp().$apis;
            uploadFile(url).then(({data:{url}})=>{
               
                this.setData({
                    image:url,
                    "fileList[0].status":"done"
                })
            })    
            this.setData({
                fileList
            })
        },
        removePic(e){
            
            let fileList=this.data.fileList;
            fileList.splice(e.detail.index,1)
            this.setData({
                fileList,
                image:null
         })
        },
        prevent(){
            return;
        }
    },
    observers:{
        activeTab(v){
            this.setData({
                "user":v
            })
        }
    }
})