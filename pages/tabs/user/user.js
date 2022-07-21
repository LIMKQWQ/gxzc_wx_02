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
    },


    data: {
        userInfo: null,
        actived: 1,
        isShowSelect: false,
        scrolled: false,
        disabledShare: true,
        popupShow: false,
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
        multiArray: [
            ['无脊柱动物', '脊柱动物'],
            ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'],
            ['猪肉绦虫', '吸血虫']
        ],
        objectMultiArray: [
            [{
                    id: 0,
                    name: '无脊柱动物'
                },
                {
                    id: 1,
                    name: '脊柱动物'
                }
            ],
            [{
                    id: 0,
                    name: '扁性动物'
                },
                {
                    id: 1,
                    name: '线形动物'
                },
                {
                    id: 2,
                    name: '环节动物'
                },
                {
                    id: 3,
                    name: '软体动物'
                },
                {
                    id: 3,
                    name: '节肢动物'
                }
            ],
            [{
                    id: 0,
                    name: '猪肉绦虫'
                },
                {
                    id: 1,
                    name: '吸血虫'
                }
            ]
        ],
        multiIndex: [0, 0, 0]
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
        bindMultiPickerChange: function (e) {
            console.log('picker发送选择改变，携带值为', e.detail.value)
            this.setData({
                multiIndex: e.detail.value
            })
        },
        bindMultiPickerColumnChange: function (e) {
            console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
            var data = {
                multiArray: this.data.multiArray,
                multiIndex: this.data.multiIndex
            };
            data.multiIndex[e.detail.column] = e.detail.value;
            switch (e.detail.column) {
                case 0:
                    switch (data.multiIndex[0]) {
                        case 0:
                            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
                            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                            break;
                        case 1:
                            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
                            data.multiArray[2] = ['鲫鱼', '带鱼'];
                            break;
                    }
                    data.multiIndex[1] = 0;
                    data.multiIndex[2] = 0;
                    break;
                case 1:
                    switch (data.multiIndex[0]) {
                        case 0:
                            switch (data.multiIndex[1]) {
                                case 0:
                                    data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                                    break;
                                case 1:
                                    data.multiArray[2] = ['蛔虫'];
                                    break;
                                case 2:
                                    data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                                    break;
                                case 3:
                                    data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                                    break;
                                case 4:
                                    data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                                    break;
                            }
                            break;
                        case 1:
                            switch (data.multiIndex[1]) {
                                case 0:
                                    data.multiArray[2] = ['鲫鱼', '带鱼'];
                                    break;
                                case 1:
                                    data.multiArray[2] = ['青蛙', '娃娃鱼'];
                                    break;
                                case 2:
                                    data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                                    break;
                            }
                            break;
                    }
                    data.multiIndex[2] = 0;
                    break;
            }
            console.log(data.multiIndex);
            this.setData(data);
        },
        submit(){
            wx.navigateTo({
              url: '/pak1/pub-prod/pub-prod',
            })
        }
    }

})