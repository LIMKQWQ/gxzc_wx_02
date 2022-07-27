let globalData = require("../../../common/behavior/appGlobalData.js");
let fixedMenus = require("../../../common/behavior/fixedMenus.js");
let authorize = require("../../../common/behavior/authorize.js");
const computedBehavior = require('miniprogram-computed').behavior

Component({
    behaviors: [globalData, fixedMenus, computedBehavior, authorize],
    async attached() {
        let pages = getCurrentPages()
        let that = this;
        pages[pages.length - 1].onReachBottom = function () {
            console.log(111);
            that.loadMore()
        }
        await this._initData();
        let {
            _userInfo
        } = getApp().globalData;
        let {
            getUserInfo,
            getHomeNotice
        } = getApp().$apis;
        let notices = await getHomeNotice();
        this.setData({
            notices
        })
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
                userInfo: userInfo.user
            })
        })
        if (_userInfo) {
            //已登录
            let userInfo = await getUserInfo();
            console.log("已登录,获取用户信息", userInfo)
            if (userInfo) {
                wx.$bus.emit("refreshUserInfo", userInfo);
            }
        }
    },
    options: {
        pureDataPattern: /^__/ // 指定所有 _ 开头的数据字段为纯数据字段
    },
    data: {
        page: 1,
        totalPage: 1,
        announceList: [],
        resourceList: [],
        userInfo: null,
        showLoading: false,
        searchStr: null,
        showTip: false,
        //纯数据字段
        __lat: null,
        __lng: null,
    },
    methods: {
        // 引人入右侧菜单
        showKf(e) {
            this.selectComponent("#fixedMenus").showRecommend(e.target.dataset.id)
        },
        async _initData() {
            let res = await getApp().globalData._location;
            if (res) {
                this.setData({
                    __lat: res.latitude,
                    __lng: res.longitude
                })
            } else {
                res = {
                    latitude: null,
                    longitude: null
                }
            }
            let {
                getNeedsList
            } = getApp().$apis;
            let list = await getNeedsList({
                page: 1,
                lat: res.latitude,
                lng: res.longitude
            });
            // console.log(list.last_page);
            this.setData({
                totalPage: list.last_page,
                page: list.current_page,
                resourceList: list.data,
            })

        },
        async loadMore() {
            // console.log(this.data.page,this.data.totalPage,this.data.showLoading);
            if (this.data.page >= this.data.totalPage || this.data.showLoading) {
                return;
            }
            this.setData({
                showLoading: true
            })
            let {
                getNeedsList
            } = await getApp().$apis;
            let filter = this._getFilter();
            filter.page = this.data.page + 1;
            let list = await getNeedsList(filter);
            this.setData({
                resourceList: [...this.data.resourceList, ...list.data],
                page: this.data.page + 1,
                showLoading: false
            })
        },

        async search() {
            let {
                getNeedsList
            } = getApp().$apis;
            //每次搜索重置页数以及总页数
            this.setData({
                page: 1,
                totalPage: 1
            })
            let filter = this._getFilter();
            filter.page = 1;
            wx.showLoading({
                title: "正在加载"
            })
            let list = await getNeedsList(filter);
            wx.hideLoading()
            let {
                seachc
            } = filter;
            if ((!!seachc) && list.data.length) {
                this.setData({
                    showTip: true
                })
            } else {
                this.setData({
                    showTip: false
                })
            }
            this.setData({
                totalPage: list.last_page,
                resourceList: list.data
            })

        },
        _getFilter() {
            let {
                __lat,
                __lng
            } = this.data;
            return {
                page: this.data.page,
                seachc: this.data.searchStr,
                lat: __lat,
                lng: __lng
            }
        },
        toBeSuber() {
            if (!this.data.userInfo) {
                //未登录
                wx.setStorageSync("registerType", 0);
                wx.navigateTo({
                    url: "/pages/register/register"
                })
                return;
            }
            let {
                userInfo: {
                    group_id
                }
            } = this.data;
            if (group_id == 1) {
                //资源方
                wx.switchTab({
                    url: "/pages/tabs/user/user"
                })
                return;
            }
            if (group_id == 2) {
                //需求方,提示
                wx.showModal({
                    title: "请联系客服",
                    content: "请联系平台客服进行资源入驻"
                })
            }
        },
        //   发布需求
        release() {
            wx.navigateTo({
                url: '/pak1/pub-prod-need/pub-prod-need'
            })
        },
        inputFocus() {
            // console.log("111");
            wx.navigateTo({
                url: '/pak1/hot-search/hot-search',
            })
        },


    }
})