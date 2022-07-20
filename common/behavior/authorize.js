module.exports = Behavior({
    attached:function(){
        let pages=getCurrentPages();
        let page=pages[pages.length-1];
        let fn=page.onTabItemTap;
        page.onTabItemTap=function (...params){
            if(fn)fn.call(this,...params);
           getApp().$sendUserInfo()
        }
    }
})
