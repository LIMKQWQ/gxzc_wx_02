let globalData=require("../../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../../common/behavior/fixedMenus.js");
let authorize=require("../../../common/behavior/authorize.js");
let keyBoard=require("../../../common/behavior/keyBoard.js");
let {chunkArr}=require("../../../utils/util")
let tabNames=["introduce","case","honor","contact"];
Component({
    behaviors:[globalData,fixedMenus,authorize,keyBoard],
    attached(){
        this._initData()
        

        //成功案例动画
        let page=getCurrentPages()[0];
        let fn=page.onPageScroll;
        page.onPageScroll=(...params)=>{
            fn.call(this,...params);
            this._checkAnimated();
        }
        //服务介绍高度
        // const query = wx.createSelectorQuery().in(this);
        // query.selectAll(".selectSource .selectItem .all").fields({
        //     size:true
        // },(arr)=>{
        //     let heights=arr.map(res=>res.height);
        //     this.setData({
        //         heights
        //     })
        // }).exec()
    },
    ready(){
        //服务介绍滚动条
       
       
    },
    data:{
        tabActive:1,
        tabName:"introduce",
        heights:[],//服务介绍swiper高度
        animated:{
          
        },
        //公司简介的三个轮播
        swiper:{
            s1:{
                current:1,
                sum:3
            },
            s2:{
                current:0,
                sum:3
            },
            s3:{
                current:1,
                sum:3
            }
        },
        introduces:{
            about:"test",
            introduce:{
                about:"test"
            }
        },
        msg_name:null,
        msg_phone:null,
        msg_email:null,
        msg_content:null,
        cases:null,
        contact:null,
        certificate:null
    },
    methods:{
        async subMessage(){
            let {msg_name,msg_phone,msg_email,msg_content}=this.data;
            let {leaveMessage}=getApp().$apis;
            wx.showLoading({
              title:"提交中"
            })
            let res=await leaveMessage({
              mobile:msg_phone,
              name:msg_name,
              content:msg_content,
              email:msg_email
            });
            wx.hideLoading()
            if(res){
              wx.showToast({
                title:"留言成功",
                duration:800
              })
              this.setData({
                msg_name:null,
                msg_phone:null,
                msg_email:null,
                msg_content:null
              })
            }
        },
        switchTab(e){
            let tabCode=e.currentTarget.dataset.tab;
            let tabName=tabNames[tabCode-1];
           
            this.setData({
                tabActive:tabCode,
                tabName
            })
        },
        _checkAnimated(){
            let {windowHeight}=this.data._deviceInfo;
            let nodes=wx.createSelectorQuery().selectAll('.caseItem');
            nodes.fields({
                dataset:true,
                rect:true
            },(arr)=>{
                arr.forEach(obj=>{
                    let {top,dataset:{index}}=obj;
                    if(top<windowHeight-10){
                        if(this.data.animated['a'+index])return;
                        let str=`animated.a${index}`;
                        this.setData({
                            [str]:true
                        })
                    }
                })
               
            }).exec()
        },
        //成功案例动画
        animate(index){
            index=index-1;
           let str=`animated.a${index}`;
            this.setData({
                [str]:true
            });
        },
        _setSwiperIndex(key,index){
            let str=`swiper.${key}.current`;
            this.setData({
                [str]:index
            })
        },
        swiperChange(e){
            let key=e.currentTarget.dataset.swiper;
            let {current}=e.detail;

            this. _setSwiperIndex(key,current);
            
        },
        toNext(e){
            let key=e.currentTarget.dataset.swiper;
            let {current,sum}=this.data.swiper[key];
            let next=++current%sum;
            this._setSwiperIndex(key,Number(next))
        },
         toPre(e){
            let key=e.currentTarget.dataset.swiper;
            let {current,sum}=this.data.swiper[key];
            let next=current-1;
            if(next<0) next=sum-1;
            this._setSwiperIndex(key,next) 
         },
         async _initData(){
             let {getIntroduction,getCases,getContact,getCertificate}=getApp().$apis;
             let res=await Promise.all([getIntroduction(),getCases(),getContact(),getCertificate()]);
             res[0].introduce.images=res[0].introduce.images.split(",").map(item=>this.data.baseUrl+item)
             res[0].development=chunkArr(res[0].development,2)
             this.setData({
                introduces:res[0],
                cases:res[1],
                contact:res[2],
                certificate:res[3],
                "swiper.s1.sum":res[0].introduce.images.length,
                "swiper.s2.sum":res[0].service.length,
                "swiper.s3.sum":res[0].development.length
             })
        }
             
    },
    observers:{
        tabName(v){
           if(v=="case"){
               //初始化
              wx.nextTick(()=>{
                  this._checkAnimated()
              })
           }
        }
    }
})