let globalData = require("../../../common/behavior/appGlobalData.js");
let fixedMenus = require("../../../common/behavior/fixedMenus.js");
let authorize = require("../../../common/behavior/authorize.js");
const computedBehavior = require('miniprogram-computed').behavior

Component({
    behaviors: [globalData, fixedMenus, computedBehavior, authorize],
    async attached() {
        let pages = getCurrentPages()
        pages[pages.length - 1].onReachBottom = function () {
            this.loadMore()
        }
        await this._initData();
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
    // pageLifetimes: {
    //     // 组件显示触发
    //     show: function () {
    //         let that = this;
    //         wx.getStorage({
    //             key: 'filterId',
    //             success(res) {
    //                 console.log(res.data, "storage")
    //                 getApp().$apis.getProductFiler({
    //                     pid: res.data
    //                 }).then(res => {
    //                     console.log(res, "resfiltersss", that);
    //                     that.setData({
    //                         subFilterList: res,
    //                         showFilter: false,
    //                         showSubFilter: true
    //                     })
    //                 })
    //             }
    //         });
    //         wx.removeStorage({
    //             key: 'filterId',
    //             success: function (res) {
    //                 console.log(res, "resssssssssssssssss");
    //             }
    //         })
    //         // console.log(123);
    //     },
    //     hide: function () {
    //         this.setData({
    //             showFilter: false,
    //             showSubFilter: false
    //         })
    //     }

    // },

    options: {
        pureDataPattern: /^__/ // 指定所有 _ 开头的数据字段为纯数据字段
    },
    data: {
        page: 1,
        totalPage: 1,
        announceList: [],
        resourceList: [],
        filterList: [],
        subFilterList: [],
        showLoading: false,
        filterActive: 0,
        showFilter: false,
        filterType: 0,
        banner: "",
        isManufacturer: null,
        isType: null,
        searchCate: null,
        searchManu: null,
        showTop: true,
        userInfo: null,
        classes: {
            list: ["类别1", "类别2"],
            index: null
        },
        size: {
            list: ["类别1", "类别2类别1类别1"],
            index: null
        },
        //钢级
        gj: {
            list: ["类别1", "类别2"],
            index: null
        },
        //生产厂家
        proder: {
            list: ["类别1", "类别2"],
            index: null
        },
        address: {
            list: ["类别1", "类别2"],
            index: null
        },
        searchStr: null,
        showTip: false,
        //纯数据字段
        __lat: null,
        __lng: null,
    },

    computed: {
        announceList_(data) {
            let arr = data.announceList;
            let size = 2;
            var result = [];
            var l = arr.length;
            var s = Math.ceil(l / size)
            for (var i = 0; i < s; i++) {
                result[i] = arr.slice(size * i, size * (i + 1))
            }
            return result
        }
    },
    methods: {
        // 切换筛选
        async handover(e) {
            console.log(e);
            console.log(e.target.dataset.num);
            let tabSelect = e.target.dataset.num;
            await getApp().$apis.getProductFiler({
                type: tabSelect
            }).then(res => {
                console.log(res, "resfilter");
                this.setData({
                    filterList: res,
                    showFilter: true,
                    showSubFilter: false
                })
            })
            if (tabSelect == this.data.filterActive) {
                this.setData({
                    filterActive: 0,
                    showFilter: false
                })
                return false
            }
            this.setData({
                filterActive: tabSelect
            })
        },

        showKf() {
            this.selectComponent("#fixedMenus").showQrcode()
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
                getResources,
                getAnnounces,
                getClasses
            } = getApp().$apis;
            let {
                list,
                banner
            } = await getResources({
                page: 1,
                lat: res.latitude,
                lng: res.longitude
            });
            let {
                list: announceList
            } = await getAnnounces({
                page: 1
            });
            let classes = await getClasses();
            console.log(list.data, '111');
            this.setData({
                totalPage: list.last_page,
                page: list.current_page,
                resourceList: list.data,
                announceList: announceList.data,
                banner: this.data.baseUrl + banner.image
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
                getResources
            } = getApp().$apis;
            let filter = this._getFilter();
            filter.page = this.data.page + 1;

            let {
                list
            } = await getResources(filter);

            this.setData({
                resourceList: [...this.data.resourceList, ...list.data],
                page: this.data.page + 1,
                showLoading: false
            })
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
        async search() {
            let {
                getResources
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
            let {
                list
            } = await getResources(filter);
            wx.hideLoading()
            let {
                area,
                category,
                grade,
                manufacturer,
                seachc,
                size
            } = filter;
            console.log(category, manufacturer, "111");
            if ((!!area || !!category || !!grade || !!manufacturer || !!seachc || !!size) && list.data.length) {
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
                resourceList: list.data,
                showTop: false
            })

        },
        async refreshList(picker) {
            //就改变本次的,本次及以后的都刷新
            let {
                classes,
                size,
                gj,
                proder,
                address
            } = this.data;
            let obj = {
                classes,
                size,
                gj,
                proder,
                address
            };
            let currentSort;
            if (!obj[picker].sort) {
                let lists = Object.values(obj);
                let sorts = lists.filter(list => list.sort != undefined).map(list => list.sort)
                if (!sorts.length) {
                    obj[picker].sort = 1;
                    currentSort = 1;
                } else {
                    let maxSort = sorts.sort().pop();
                    obj[picker].sort = maxSort + 1;
                    currentSort = maxSort + 1;
                }

            } else {
                currentSort = obj[picker].sort
            }
            //本次刷新curentSort
            console.log("本次刷新sort", currentSort)
            let {
                getClasses
            } = getApp().$apis;
            let filterObj = {}; //用来刷新的obj
            let setArr = []; //要被刷新的prop
            for (let key in obj) {
                if (obj[key].sort && obj[key].sort <= currentSort && filterObj[key] !== null) {
                    let listObj = obj[key];
                    filterObj[key] = listObj.list[listObj.index].id;
                } else {
                    obj[key].sort = null;
                    setArr.push(key)
                }
            }
            filterObj = this.tranformObj(filterObj)
            let res = await getClasses(filterObj)
            console.log(filterObj, setArr)
            Object.keys(filterObj).forEach(item => {
                if (filterObj[item]) delete res.code[item]
            })
            setArr.forEach(prop => {
                let str = `${prop}.index`;
                this.setData({
                    [str]: 0
                })
            })
        },
        _getFilter() {
            let {
                size,
                gj,
                proder,
                address,
                __lat,
                __lng
            } = this.data;
            // console.log(this.data.searchCate,"11xx1");
            return {
                page: this.data.page,
                category: this.data.searchCate,
                size: size.list[size.index]?.id,
                grade: gj.list[gj.index]?.id,
                manufacturer: this.data.searchManu,
                seachc: this.data.searchStr,
                area: address.list[address.index]?.id,
                lat: __lat,
                lng: __lng
            }
        },
        tranformObj(obj) {
            let {
                classes: category,
                size,
                gj: grade,
                proder: manufacturer,
                address: area
            } = obj;
            return {
                category,
                size,
                grade,
                manufacturer,
                area
            }
        },
        _dealObj(obj) {
            let arr = [];
            for (let index in obj) {
                arr.push({
                    id: index,
                    name: obj[index]
                })
            }
            return arr;
        },
        async handleSubFilter(e) {
            console.log(e.currentTarget.dataset.item.id, 11111111111);
            // let {id}=e.currentTarget.dataset.item.id;
            await getApp().$apis.getProductFiler({
                pid: e.currentTarget.dataset.item.id
            }).then(res => {
                console.log(res, "resfiltersss");
                this.setData({
                    subFilterList: res,
                    showFilter: false,
                    showSubFilter: true
                })
            })
        },
        handleFilterType(e) {
            console.log(e.currentTarget.dataset);
            this.setData({
                searchCate: e.currentTarget.dataset.item.tname,
                isType: e.currentTarget.dataset.index
            })
            this.search()
        },
        // Manufacturer
        handleFilterManu(e) {
            console.log(e.currentTarget.dataset);
            this.setData({
                searchManu: e.currentTarget.dataset.item,
                isManufacturer: e.currentTarget.dataset.index
            })
            this.search()
        },
        closeSearch() {
            this.setData({
                searchManu: null,
                isManufacturer: null,
                searchCate: null,
                isType: null,
                showTip: false,
                showTop: true
            })
        }




    }
})