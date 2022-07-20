const globalData=require("../../common/behavior/appGlobalData.js");

Component({
  behaviors:[globalData],
  async attached(){
    this.initData()
  },
  data: {
    commonUse:[],
    wordArr:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    currentScroll:"itemCommonUse"
    /**
     * a-b
     */
  },
  properties: {
    show:{
      type:Boolean,
      value:true
    }
  },
  methods: {
    async initData(){
      let {getCountry}=getApp().$apis
      let countrys=await getCountry();
      let arr="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      //字母数组
      arr.forEach(word=>{
          let arr=countrys.filter(country=>{
            let {key}=country;
            return key==word
          })
          let str=`words.${word}`
          this.setData({
            [str]:arr
          })
      })
      //commonUse
      let commonUseArr=countrys.filter(({commonUse})=>commonUse);
      this.setData({
        commonUse:commonUseArr
      })
      console.log(this.data)
     
      
    },
    selectedCountry(e){
      let {code,cn,en}=e.currentTarget.dataset;
      this.triggerEvent("selected",{code,cn,en});
    },
    close(){
      console.log("close")
      this.triggerEvent("close");
    },
    scrollTo(e){
      this.setData({
        currentScroll:`item${e.currentTarget.dataset.to}`
      })
    }
  }
})