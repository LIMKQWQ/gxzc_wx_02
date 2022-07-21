
Component({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    isShowComment:false,
    isShowShare:false,
    isShowWxShareYd:false,
    isShowQrcode:false,
    isShowRecommend:false,
    hide:false,
    _timeout:null,
    msg_name:null,
    msg_phone:null,
    msg_email:null,
    msg_content:null,
    phone:null,
    rmd_unit:null,
    rmd_name:null,
    rmd_content:null,

    
  },
  attached(){
    this.initData()
  },
  pageLifetimes:{
    PageScroll(){
      console.log("scroll")
    }
  },
  properties: {
    top:String,
    id:String,
    disabledShare:Boolean
  },
  methods: {
    async initData(){
      let {getContact}=getApp().$apis;
      let {list:{mobile}}=await getContact();
      this.setData({
        phone:mobile
      })
    },
    call(){
      wx.makePhoneCall({
        phoneNumber: this.data.phone 
      })
    },
    async subComment(){
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
        this.hideComment()
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
    async subRecommend(){
      let {rmd_unit,rmd_name,rmd_content}=this.data;
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
        this.hideComment()
        wx.showToast({
          title:"推荐成功",
          duration:800
        })
        this.setData({
          rmd_unit:null,rmd_name:null,rmd_content:bull
        })
      }
    },
    showComment(){
      this.setData({
        isShowComment:true
      })
    },
    hideComment(){
      this.setData({
        isShowComment:false
      })
    },
    showShare(){
      this.setData({
        isShowShare:true
      })
    },
    hideShare(){
      this.setData({
        isShowShare:false
      })
    },
    hideWxShareYd(){
      this.setData({
        isShowWxShareYd:false
      })
    },
    showWxShareYd(){

      this.setData({
        isShowShare:false,
        isShowWxShareYd:true
      })
    },
    showQrcode(){
      this.setData({
        isShowQrcode:true
      })
    },
    hideQrcode(){
      this.setData({
        isShowQrcode:false
      })
    },
    showRecommend(){
      this.setData({
        isShowRecommend:true
      })
    },
    hideRecommend(){
      this.setData({
        isShowRecommend:false
      })
    },
    scroll(){
      clearTimeout(this.data._timeout);
      this.setData({
        hide:true
      })
      let timeout=setTimeout(()=>{
        this.setData({
          hide:false
        })
      },500)
      this.setData({
        _timeout:timeout
      })
    }

  }
})