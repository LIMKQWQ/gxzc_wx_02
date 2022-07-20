module.exports = Behavior({
    attached:function(){
        let pages=getCurrentPages();
        let page=pages[pages.length-1];
        if(!this.data.disabledShare){
            //分享
            wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
            })
            page.onShareAppMessage=function(){
                return {
                    title:this.data.shareTitle?this.data.shareTitle:"大家共享资产仓"
                }
            }
            page.onShareTimeline=function(){
                return {
                    title:this.data.shareTitle?this.data.shareTitle:"大家共享资产仓",
                    imageUrl:this.data.__shareImg||"https://gxzc.eccode.net/assets/mobile/img/shareIcon.jpg"
                }
                }
        }
        
        
       
      
      //
      
       let fn=page.onPageScroll;
       page.onPageScroll=function(...params){
           if(fn){
               fn.call(this,...params);
           }
           let fixedMenus= this.selectComponent('#fixedMenus');
           fixedMenus.scroll()
       }
     
    }
})