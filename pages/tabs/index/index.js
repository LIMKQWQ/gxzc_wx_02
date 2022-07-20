let fixedMenus = require("../../../common/behavior/fixedMenus.js");
let globalData = require("../../../common/behavior/appGlobalData.js");
let {
    chunkArr
} = require("../../../utils/util.js")
Component({
    behaviors: [globalData, fixedMenus],

    async attached() {

        this._initData();
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        let fn = page.onPageScroll;
        page.onPageScroll = (...params) => {
            if (fn) {
                fn.call(this, ...params);
            }
            let {
                scrollTop
            } = params[0];

            if (scrollTop > this.data._deviceInfo.windowHeight) {
                if (this.data.isIndexStyle) {
                    wx.setNavigationBarColor({
                        frontColor: "#000000",
                        backgroundColor: "#FFFFFF"
                    })
                    this.setData({
                        isIndexStyle: false
                    })
                }
            } else {
                if (!this.data.isIndexStyle) {
                    wx.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: "#000000"

                    })
                    this.setData({
                        isIndexStyle: true
                    })
                }
            }
        }


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
    data: {
        swiperIndex: 0,
        swiperSum: 3,
        scrolled: false,
        isIndexStyle: true,
        userInfo: null,
        nums: [{
                num: 0,
                to: 300000
            },
            {
                num: 0,
                to: 2400
            },
            {
                num: 0,
                to: 4500
            },
            {
                num: 0,
                to: 5960
            }
        ],
        //顶部swiper图
        topSwiper: [],
        //顶部信息
        topData: {
            "banner_title": "",
            "banner_note": "大家共享 全球互联 融合共创 合作共赢"
        },
        knowledgeList: [], //知识共享列表
        hotList: [], //热门资源列表
        __shareImg: null,
        newsList: [{
                id: "sneiog",
                title: "喜讯！安东石油荣登北京市专精特 新“小巨人”榜单！喜讯！安东石油荣登北京市专精特 新“小巨人”榜单！",
                time: "2022-02-24",
                views: 4000,
                image: "/uploads/20220714/31fbe2540544f8cbc7d8ab90b6062f4f.jpg"
            },
            {
                id: "sneiog",
                title: "喜讯！安东石油荣登北京市专精特 新“小巨人”榜单！喜讯！安东石油荣登北京市专精特 新“小巨人”榜单！",
                time: "2022-02-24",
                views: 4000,
                image: "/uploads/20220714/31fbe2540544f8cbc7d8ab90b6062f4f.jpg"
            }
        ],
        sortList: [{
            name: "石油专用管材类",
            img: "./images/moreIcon.png"
        }, {
            name: "石油类",
            img: "./images/moreIcon.png"
        }, {
            name: "石油专用管材类",
            img: "./images/moreIcon.png"
        }, {
            name: "石油专用管材类",
            img: "./images/moreIcon.png"
        }, {
            name: "石油专用管材类",
            img: "./images/moreIcon.png"
        }, {
            name: "石油专用管材类",
            img: "./images/moreIcon.png"
        }, {
            name: "石油专用管材类",
            img: "./images/moreIcon.png"
        }, {
            name: "石油专用管材类",
            img: "./images/moreIcon.png"
        }]
    },
    methods: {
        to(e) {
            let {
                url,
                open
            } = e.currentTarget.dataset;
            getApp().$sendUserInfo()
            if (open == "switchTab") {
                wx.switchTab({
                    url
                })
            } else {
                wx.navigateTo({
                    url
                })
            }

        },
        async _initData() {
            let _location = getApp().globalData._location;
            if (!_location) {
                if (getApp().globalData._location_error == 2) {
                    wx.showModal({
                        title: "获取位置失败",
                        content: "可能是未打开系统定位"
                    })
                }
                //使用缓存位置
                _location = wx.setStorageSync("_location") || {
                    longitude: null,
                    latitude: null
                }
            }
            let {
                longitude,
                latitude
            } = _location;
            let {
                banner,
                home
            } = await getApp().$apis.getIndexData();
            let {
                list
            } = await getApp().$apis.getShareKnowledgeList({
                page: 1
            });
            let hotList = await getApp().$apis.getHotList({
                lng: longitude,
                lat: latitude
            });
            hotList = chunkArr(hotList, 4)
            let baseUrl = getApp().globalData.baseUrl;
            let topSwiper = banner.map(item => baseUrl + item.image);
            this.setData({
                topSwiper,
                topData: {
                    banner_title: home.banner_title,
                    banner_note: home.banner_note
                },
                knowledgeList: list.data,
                hotList,
                "nums[0].to": home.stock,
                "nums[1].to": home.again_rent,
                "nums[2].to": home.turnover,
                "nums[3].to": home.resources,
                __shareImg: topSwiper[0] || false

            })
        },
        showKf() {
            this.selectComponent("#fixedMenus").showQrcode()
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
        _setSwiperIndex(index) {
            this.setData({
                swiperIndex: Number(index)
            })
        },
        _startScroll() {
            if (this.data.scrolled) return;
            this.setData({
                scrolled: true
            })
            let set = new Set();
            let fn = () => {
                let done = false;
                this.data.nums.forEach((numItem, index) => {
                    let {
                        num,
                        to
                    } = numItem;
                    let str = `nums[${index}].num`;
                    if (num < to) {
                        let base = Math.ceil(to / 20)
                        this.setData({
                            [str]: num += base
                        });
                    } else {
                        this.setData({
                            [str]: to
                        });
                        set.add(index)
                    }
                    done = set.size == 4
                    // if(to-num<100){

                    //     done=true;
                    //     //有一个完成的同时结束
                    //     this.data.nums.forEach((numItem,index)=>{
                    //         let str=`nums[${index}].num`;
                    //         this.setData({
                    //                 [str]:numItem.to
                    //         })
                    //     })

                    // }
                })
                if (!done) setTimeout(fn, 50);
            }
            fn()

        },
        toNext() {
            let {
                swiperIndex: current,
                swiperSum
            } = this.data;
            let next = ++current % swiperSum;
            this._setSwiperIndex(next)
        },
        toPre() {
            let {
                swiperIndex: current,
                swiperSum
            } = this.data;
            let next = current - 1;
            if (next < 0) next = swiperSum - 1;
            this._setSwiperIndex(next)
        },
        swiperChange(e) {
            let {
                current
            } = e.detail;
            this._setSwiperIndex(current);
        },
    }

})