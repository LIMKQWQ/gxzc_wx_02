let globalData=require("../../../common/behavior/appGlobalData.js");
let fixedMenus=require("../../../common/behavior/fixedMenus.js");
let authorize=require("../../../common/behavior/authorize.js");
const computedBehavior = require('miniprogram-computed').behavior

Component({
    behaviors:[globalData,fixedMenus,computedBehavior,authorize],
    async attached(){
        let pages=getCurrentPages()
        pages[pages.length-1].onReachBottom=function(){
            this.loadMore()
        }
        await this._initData();
       
        
    },
    options: {
        pureDataPattern: /^__/ // 指定所有 _ 开头的数据字段为纯数据字段
      },
    data:{
        page:1,
        totalPage:1,
        announceList:[],
        resourceList:[],
        showLoading:false,
        banner:"",
        classes:{
            list:["类别1","类别2"],
            index:null
        },
        size:{
            list:["类别1","类别2类别1类别1"],
            index:null
        },
        //钢级
        gj:{
            list:["类别1","类别2"],
            index:null
        },
        //生产厂家
        proder:{
            list:["类别1","类别2"],
            index:null
        },
        address:{
            list:["类别1","类别2"],
            index:null
        },
        searchStr:null,
        showTip:false,
        //纯数据字段
        __lat:null,
        __lng:null,
    },
  
    computed:{
        announceList_(data) {
            let arr=data.announceList;
            let size=2;
            var result = [];
            var l = arr.length; 
            var s = Math.ceil(l/size)
            for(var i =0;i<s;i++){
                result[i] = arr.slice(size*i,size*(i+1))
            }
            return result
         }
    },
    methods:{
        showKf(){
            this.selectComponent("#fixedMenus").showQrcode()
        },
        async _initData(){
            let res=await getApp().globalData._location;
            if(res){
                this.setData({
                    __lat:res.latitude,
                    __lng:res.longitude
                })
            }else{
                res={
                    latitude:null,
                    longitude:null
                }
            }
            let {getResources,getAnnounces,getClasses}=getApp().$apis;
            let {list,banner}=await getResources({page:1,lat:res.latitude,lng:res.longitude});
            let {list:announceList}=await getAnnounces({page:1});
            let classes=await getClasses();
            this._setList(classes.code);
            this.setData({
                totalPage:list.last_page,
                page:list.current_page,
                resourceList:list.data,
                announceList:announceList.data,
                banner:this.data.baseUrl+banner.image
            })

        },
        //用于初始化设置类别
        _setList(lists){
            //传入api返回的code
            let {category:classes,size,grade:gj,manufacturer:proder,area:address}=lists;
            let obj={};
            if(classes) obj[ "classes.list"]=[{id:null,name:"全部"},...this._dealObj(classes)];
            if(size) obj["size.list"]=[{id:null,name:"全部"},...this._dealObj(size)];
            if(gj) obj[ "gj.list"]= [{id:null,name:"全部"},...this._dealObj(gj)];
            if(proder) obj[ "proder.list"]=[{id:null,name:"全部"},...this._dealObj(proder)];
            if(address) obj[ "address.list"]=[{id:null,name:"全部"},...this._dealObj(address)];
            this.setData(obj)
        },
        async pickChange(e){
            let {picker}=e.currentTarget.dataset;
            let {value}=e.detail
            let str=`${picker}.index`;
           
            this.setData({
                [str]:value
            })
             //刷新类别筛选器
            wx.showLoading({
                title:"加载中"
            })
             await this.refreshList(picker)
             wx.hideLoading()
        },
        async loadMore(){
            if(this.data.page>=this.data.totalPage||this.data.showLoading){
               
                return;
            }
            this.setData({
                showLoading:true
            })
            let {getResources}=getApp().$apis;
            let filter=this._getFilter();
            filter.page=this.data.page+1;
           
            let {list}=await getResources(filter);
            
            this.setData({
                resourceList:[...this.data.resourceList,...list.data],
                page:this.data.page+1,
                showLoading:false
            })
           
        },
        async search(){
            let {getResources}=getApp().$apis;
            //每次搜索重置页数以及总页数
            this.setData({
                page:1,
                totalPage:1
            })
            let filter=this._getFilter();
            filter.page=1;
            wx.showLoading({
                title:"正在加载"
            })
            let {list}=await getResources(filter);
            wx.hideLoading()
            let {area,category,grade,manufacturer,seachc,size}=filter;
            if((!!area||!!category||!!grade||!!manufacturer||!!seachc||!!size)&&list.data.length){
                this.setData({
                    showTip:true
                })
            }else{
                this.setData({
                    showTip:false
                })
            }
           
            this.setData({
                totalPage:list.last_page,
                resourceList:list.data
            })

        },
        async refreshList(picker){
            //就改变本次的,本次及以后的都刷新
            let {classes,size,gj,proder,address}=this.data;
            let obj={classes,size,gj,proder,address};
            let currentSort;
            if(!obj[picker].sort){
                let lists=Object.values(obj);
                let sorts=lists.filter(list=>list.sort!=undefined).map(list=>list.sort)
                if(!sorts.length) {
                    obj[picker].sort=1;
                    currentSort=1;
                }else{
                    let maxSort=sorts.sort().pop();
                    obj[picker].sort=maxSort+1;
                    currentSort=maxSort+1;
                }
               
            }else{
               currentSort=obj[picker].sort
            }
            //本次刷新curentSort
            console.log("本次刷新sort",currentSort)
            let {getClasses}=getApp().$apis;
            let filterObj={};//用来刷新的obj
            let setArr=[];//要被刷新的prop
            for(let key in obj){
                if(obj[key].sort&&obj[key].sort<=currentSort&&filterObj[key]!==null){
                    let listObj=obj[key];
                    filterObj[key]=listObj.list[listObj.index].id;
                }else{
                    obj[key].sort=null;
                    setArr.push(key)
                }
            }
           filterObj=this.tranformObj(filterObj)
            let res=await getClasses(filterObj)
            console.log(filterObj,setArr)
            Object.keys(filterObj).forEach(item=>{
                if(filterObj[item])  delete res.code[item]
            })
            this. _setList(res.code)
            setArr.forEach(prop=>{
                let str=`${prop}.index`;
                this.setData({
                    [str]:0
                })
            })
        },
        _getFilter(){
            let {classes,size,gj,proder,address,__lat,__lng}=this.data;
            let proderName=proder.list[proder.index]?.name;
            
            return {
                page:this.data.page,
                category:classes.list[classes.index]?.id,
                size:size.list[size.index]?.id,
                grade:gj.list[gj.index]?.id,
                manufacturer:proderName!="全部"?proderName:null,
                seachc:this.data.searchStr,
                area:address.list[address.index]?.id,
                lat:__lat,
                lng:__lng
            }
        },
        tranformObj(obj){
            let {
                classes:category,
                size,
                gj:grade,
                proder:manufacturer,
                address:area
            }=obj;
           return {
            category,
            size,
            grade,
            manufacturer,
            area
         }
        },
        _dealObj(obj){
            let arr=[];
            for(let index in obj){
                arr.push({
                    id:index,
                    name:obj[index]
                })
            }
            return arr;
        },
       


    }
})