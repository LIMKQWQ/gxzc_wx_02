Component({
  behaviors:[],
  attached(){
    const app = getApp();
    this.setData({
      _deviceInfo: app.globalData._deviceInfo
    })
  },
  properties:{
    isIndex:Boolean,
    isBack:Boolean
  },
  // options: {
  //   styleIsolation: 'apply-shared'
  // },
  data: {
    statusHeight:10,
    _deviceInfo:null
  },
  methods:{
    back(){
      
      this.triggerEvent("back");
      
        wx.navigateBack({
          fail(){
            wx.switchTab({
              url:"/pages/tabs/index/index"
            })
          }
        });
     
      
    }
  }
})