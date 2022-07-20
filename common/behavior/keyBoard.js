module.exports = Behavior({
    data:{
        nav_scroll_height: 0,
    },
   methods:{
     //键盘弹起时，解决键盘遮挡问题
     keyboardOcclusion(e) {
        let windowHeight = wx.getSystemInfoSync().windowHeight;
        const query = wx.createSelectorQuery();
        query.select('#' + e.currentTarget.id).boundingClientRect();
        query.selectViewport().scrollOffset();
        console.log('keyBoardHeight', e.detail.height)
        var that = this;
        query.exec(function (res) {
            let inputBottom = windowHeight - res[0].bottom;
            //如果input没有被键盘遮挡，不做任何事
            if (!res[0] || e.detail.height <= inputBottom) {
                that.setData({ nav_scroll_height: 0 });
                return;
            }
            //获取input被键盘遮挡的高度
            that.setData({
                nav_scroll_height: e.detail.height - inputBottom
            });
            wx.pageScrollTo({   //滑动input被键盘遮挡的距离
                scrollTop: res[1].scrollTop + that.data.nav_scroll_height,   //页面滚动的距离
                duration: 300    //页面滚动速度 单位ms
            });
        })
    },
    //键盘关闭时，解决键盘遮挡问题
    offKeyboardOcclusion() {
        this.setData({ nav_scroll_height: 0 })
    }
   }
   
    
})







