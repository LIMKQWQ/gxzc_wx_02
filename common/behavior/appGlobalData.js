module.exports = Behavior({
    attached:function(){
        const app = getApp();
        this.setData(app.globalData);
       }
})