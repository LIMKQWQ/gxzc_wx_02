const globalData = require("../../common/behavior/appGlobalData.js");
let fixedMenus = require("../../common/behavior/fixedMenus.js");
Page({
    behaviors: [globalData, fixedMenus],
    onLoad() {
        this.initData()
    },
    data: {
        images: '',
        collected: false,
        content: null,
        // info: null,
        id: null,
        shareTitle: null,
        // __shareImg: null,
        intr: null,
        area: null,
        quantity: null,
        recommend: null,
        status: null,
        msgName: '',
        msgPhone: '',
        msgContent: '',
        baseUrl:"https://gxzc.eccode.net"
    },
    swiperChange({
        detail
    }) {
        let {
            current
        } = detail;
        this.setData({
            "swiper.current": current + 1
        })
    },
    async initData() {
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        let {
            getNeedsDeatil
        } = getApp().$apis;
        let res = await getNeedsDeatil({
            id: page.options.id
        });
        // console.log(res.quantity);
        if (res) {
            let {
                images,
                content,
                title,
                area_name,
                note,
                quantity,
                recommend,
                status
            } = res;
            content = content.replaceAll(/(?<=\<img.*?)height="150rpx".*?(?=\>)/g, "")
            content = content.replaceAll("<img", `<img style=" display:block;max-width:100%;object-fit:cover;object-position:center" `)
            content = content.replaceAll(/<img style=" display:block;max-width:100%;object-fit:cover;object-position:center"(.*?)style="(.*?)"(?=.*?[\/]?>)/g, `<img style=" max-width:100%;object-fit:cover;object-position:center;$2"$1`)
            content = content.replaceAll("<table", `<table style="max-width:100% !important;"`)
            content = `<div style="width:100%;margin:0 auto;word-break:break-all;">${content}</div>`
            this.setData({
                images: images,
                id: page.options.id,
                shareTitle: title,
                intr: note,
                area: area_name,
                quantity: quantity,
                recommend: recommend,
                status: status,
                content: content
                // __shareImg: shareImg ? this.data.baseUrl + shareImg : false
            })
            // console.log(this.data.quantity,"------------");
            console.log(this.data);
        }
    },
    async toggleCollectResource() {
        let {
            toggleCollectResource
        } = getApp().$apis;
        wx.showLoading({
            title: "加载中"
        })
        let res = await toggleCollectResource({
            id: this.data.id
        });
        wx.hideLoading()
        if (res) {
            wx.$bus.emit("refreshCollection")

            this.setData({
                collected: !this.data.collected
            });
            wx.showToast({
                title: res.msg,
                duration: 800
            })
        }
    },
    showKf() {
        this.selectComponent("#fixedMenus").showRecommend()
    },
    async submitMsg() {
       let {
            msgPhone,
            msgName,
            msgContent
        } = this.data
        console.log(msgPhone,
            msgName,
            msgContent, "111", this.data);
        if (msgName != '' && msgPhone != '' && msgContent != '') {
            console.log("xxxxx");
            await getApp().$apis.sendMsg().then(res => {
                wx.showToast({
                    title: res.msg
                })
            })
            this.setData({
                msgPhone:'',
                msgName:"",
                msgContent:""
            })
        } else {
            wx.showToast({
                title: '请输入留言',
                icon: "error"
            })
        }


    }
})