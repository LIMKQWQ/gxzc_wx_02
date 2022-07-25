let globalData = require("../../../common/behavior/appGlobalData.js");
let fixedMenus = require("../../../common/behavior/fixedMenus.js");
let authorize = require("../../../common/behavior/authorize.js");
const computedBehavior = require('miniprogram-computed').behavior

Component({
    behaviors: [globalData, fixedMenus, computedBehavior, authorize],
    async attached() {
        let {
            _userInfo
        } = getApp().globalData;
        let {
            getUserInfo
        } = getApp().$apis;
        wx.$bus.on("login", (userInfo) => {
            this.setData({
                _userInfo: userInfo
            })
        })
        wx.$bus.on("logout", () => {
            this.setData({
                _userInfo: null,
                userInfo: null
            })
        })
        wx.$bus.on("refreshUserInfo", (userInfo) => {
            console.log("refreshUserInfo", userInfo)
            this.setData({
                userInfo: userInfo.user,
                scrolled: false,
                "nums[0].to": userInfo.collection,
                "nums[0].num": 0,
                "nums[1].to": userInfo.deal,
                "nums[1].num": 0,
                "nums[2].to": userInfo.follow,
                "nums[2].num": 0
            })
        })
        if (_userInfo) {
            //已登录
            let userInfo = await getUserInfo();

            if (userInfo) {
                wx.$bus.emit("refreshUserInfo", userInfo);
            }
        }
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        page.onShow = () => {
            this._startScroll();
        }
        this.getPicker()
    },


    data: {
        userInfo: null,
        actived: 1,
        isShowSelect: false,
        scrolled: false,
        disabledShare: true,
        popupShow: false,
        pickerId: 0,
        pickerId2: 0,
        pickerId3: 0,
        nums: [{
                num: 0,
                to: 2400
            },
            {
                num: 0,
                to: 4000
            },
            {
                num: 0,
                to: 8000
            }
        ],
        array: [],
        index1: null,
        arrayTwo: [],
        index2: null,
        arrayThree: [],
        index3: null,
        type: 0,
        showSelectThree: true
    },
    computed: {
        status(data) {
            let info = data.userInfo;
            if (!info) {
                return "unlogin"
            }

            return info.group_id == 2 ? "personc" : "personb"
        }
    },
    methods: {
        logout() {
            wx.$bus.emit("logout")
        },
        toLogin() {
            wx.navigateTo({
                url: "/pages/login/login"
            })
        },
        toRegister() {
            let actived = this.data.actived;
            let type = actived == 1 ? 0 : 1;
            wx.setStorageSync("registerType", type);
            wx.navigateTo({
                url: "/pages/register/register",
                complete: () => {
                    this.hideSelect()
                }
            })
        },
        selectItem(e) {
            let target = e.currentTarget;
            this.setData({
                actived: target.dataset.item
            })
        },
        showSelect() {
            this.setData({
                isShowSelect: true
            })
        },
        hideSelect() {
            this.setData({
                isShowSelect: false
            })
        },
        _startScroll() {
            if (this.data.scrolled) return;
            this.setData({
                scrolled: true
            })
            let fn = () => {
                let done = false;
                this.data.nums.forEach((numItem, index) => {
                    let {
                        num,
                        to
                    } = numItem;
                    let str = `nums[${index}].num`;
                    this.setData({
                        [str]: num += 275
                    });
                    if (to - num < 100) {

                        done = true;
                        //有一个完成的同时结束
                        this.data.nums.forEach((numItem, index) => {
                            let str = `nums[${index}].num`;
                            this.setData({
                                [str]: numItem.to
                            })
                        })

                    }
                })
                if (!done) setTimeout(fn, 50);
            }
            fn()

        },
        to(e) {
            let {
                url
            } = e.currentTarget.dataset;

            if (this.data.status != 'unlogin') {
                wx.navigateTo({
                    url
                })
            } else {
                wx.showToast({
                    title: "请先登录",
                    icon: "error",
                    duration: 500
                })
            }

        },
        closePopup() {
            this.setData({
                popupShow: false
            })
        },
        openPopup() {
            this.setData({
                popupShow: true
            })
        },
        bindPickerChange: function (e) {
            console.log('picker发送选择改变，携带值为', e.detail.value,e.target.dataset.item[e.detail.value])
            let item = e.target.dataset.item[e.detail.value];
            console.log(item);
            this.setData({
                index1: e.detail.value,
                pickerId2: item.id,
                type: item.type,
                arrayThree: []
            })
            console.log(e.target.dataset.item.id, "id");
            this.getPickerTwo()
        },
        bindPickerChangeTwo: function (e) {
            console.log('picker发送选择改变，携带值为', e.detail.value, e.target.dataset.item[e.detail.value])
            let item = e.target.dataset.item[e.detail.value];
            this.setData({
                index2: e.detail.value,
                pickerId3:item.id,
                type: item.type
            })
            this.getPickerThree()

        },
        bindPickerChangeThree: function (e) {
            console.log('picker发送选择改变，携带值为', e.detail.value, e.target.dataset.item[e.detail.value])
            let item = e.target.dataset.item[e.detail.value];
            this.setData({
                index3: e.detail.value,
                type:item.type
            })
        },
        async getPicker() {
            let {
                pickerId
            } = this.setData;
            await getApp().$apis.getProductType({
                pid: pickerId
            }).then(res => {
                console.log(res);
                this.setData({
                    array: res,
                })
            })
        },
        async getPickerTwo() {
            let {
                pickerId2
            } = this.data;
            console.log(pickerId2, "2222");
            await getApp().$apis.getProductType({
                pid: pickerId2
            }).then(res => {
                console.log(res);
                this.setData({
                    arrayTwo: res
                })
            })
        },
        async getPickerThree() {
            let {
                pickerId3
            } = this.data;
            console.log(pickerId3, "3333");
            await getApp().$apis.getProductType({
                pid: pickerId3
            }).then(res => {
                console.log(res);
                if (res == '') {
                    this.setData({
                        showSelectThree: false
                    })
                    return
                }
                this.setData({
                    arrayThree: res,
                    showSelectThree: true
                })
            })
        },
        submit() {
            let {
                type
            } = this.data;
            console.log(type);
            if (type == 1) {
                wx.navigateTo({
                    url: '/pak1/pub-prod/pub-prod',
                })
            } else if (type == 2) {
                wx.navigateTo({
                    url: '/pak1/pub-prod-temp/pub-prod-temp',
                })
            }

        }
    }

})