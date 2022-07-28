    const globalData = require("../../common/behavior/appGlobalData.js");
    let fixedMenus = require("../../common/behavior/fixedMenus.js");
    const computedBehavior = require('miniprogram-computed').behavior;
    let keyBoard = require("../../common/behavior/keyBoard.js");
    let {
        checkEmpty,
        deleteNull
    } = require("../../utils/util.js");
    const QQMapWX = require('./js/qqmap-wx-jssdk.min.js');
    let qqmap;
    let pros = [];
    let editroRes = null;
    let editorPro = new Promise(res => editroRes = res);
    let editor = null;
    Component({
        behaviors: [globalData, fixedMenus, computedBehavior, keyBoard],
        attached() {
            qqmap = new QQMapWX({
                key: this.data.map.key
            });
        },
        ready() {
            console.log("editroRes", editroRes)
            wx.createSelectorQuery().in(this).select('#richEditor').context((res) => {
                editor = res.context
                this.setData({
                    richEditor: res.context
                })
                let pages = getCurrentPages();
                let page = pages[pages.length - 1];
                this.initData()
            }).exec()

        },
        options: {
            pureDataPattern: /^__/ // 指定所有 _ 开头的数据字段为纯数据字段
        },
        data: {
            isModify: false,
            map: {
                key: "3HIBZ-HFV3G-7IPQV-ILMJD-5JUVH-3NFEU",
                lng: 117.06533,
                lat: 36.68013
            },
            isShowMap: false,
            fileList: [],
            richEditor: null,
            list: [1, 2, 3, 4, 5, 6],
            lists: {
                "grade": {
                    list: [],
                    index: null
                },
                //材质,多选
                "pipe_level": {
                    list: [],
                    keys: []
                },
                "category": {
                    list: [],
                    index: null
                },
                "sizedata": {
                    list: [],
                    index: null
                },
                "address": {
                    list: [
                        [],
                        [{
                            id: null,
                            name: "请先选择省"
                        }],
                        [{
                            id: null,
                            name: "请先选择市"
                        }]
                    ],
                    index: [0, 0, 0]
                }
            },
            statusList: ['求租', '求购'],
            statusIndex: null,
            selectedAddress: [], //记录获取的地址下标
            title: null,
            quantity: null,
            years: null,
            shuiyan: null,
            diameter: null,
            turnover: null,
            stock: null,
            brandName: null,
            manufactor: null,
            province: null,
            city: null,
            area: null,
            location: null,
            address: null, //详细地址
            images: null,
            content: null,
            nore: null,
            units_name: null,
            mobile: null,
            contacts: null,
            status: null,
            //
            isShowActionSheet: false,
            __imgUrls: [],
            __mediaUrls: [],
            __notEmpty: {
                units_name: "请输入单位名称",
                mobile: "请输入联系电话",
                contacts: "请输入联系人",
                title: "请输入标题",
                manufactor: "请输入生产厂家",
                images: "请上传缩略图",
                content: "请输入详情信息",
                note: "请输入要求"
            }

        },
        computed: {
            currentPID(data) {
                let index = data.lists.address.index[0]
                let obj = ((data.lists.address.list[0])[index]);
                return obj ? obj.id : null;
            },
            currentCID(data) {
                let index = data.lists.address.index[1]
                let obj = ((data.lists.address.list[1])[index]);
                return obj ? obj.id : null;
            },
            currentAID(data) {
                let index = data.lists.address.index[2]
                let obj = ((data.lists.address.list[2])[index]);
                return obj ? obj.id : null;
            }
        },
        methods: {
            statusChange(e) {
                console.log(e.detail.value);
                this.setData({
                    statusIndex: e.detail.value
                })
                if (e.detail.value == 0) {
                    this.setData({
                        status: "zu"
                    })
                } else {
                    this.setData({
                        status: "gou"
                    })
                }
                console.log(this.data.status);
            },
            afterRead(e) {
                let {
                    uploadFile
                } = getApp().$apis;

                let {
                    file
                } = e.detail
                pros.push(uploadFile(file.url).then(({
                    data
                }) => {
                    let {
                        url
                    } = data;
                    let list = this.data.__mediaUrls;
                    list.push(url)
                    this.setData({
                        __mediaUrls: list
                    })
                }))
                console.log(file)
                let {
                    type,
                    thumb,
                    url
                } = file;
                let list = this.data.fileList;
                if (type == "video") {
                    list.push({
                        url: thumb,
                        name: "缩略图"
                    })

                } else {
                    list.push({
                        url,
                        name: "缩略图"
                    })
                }
                this.setData({
                    fileList: list
                })

            },
            removePic(e) {
                let {
                    index
                } = e.detail;
                let list = this.data.fileList;
                let mediaList = this.data.__mediaUrls
                list.splice(index, 1);
                mediaList.splice(index, 1);
                this.setData({
                    fileList: list,
                    __mediaUrls: mediaList
                })
            },
            insertImg() {
                let {
                    uploadFile
                } = getApp().$apis;
                wx.chooseMedia({
                    mediaType: ['image'],
                    success: ({
                        tempFiles
                    }) => {
                        let files = tempFiles.filter(({
                            size
                        }) => size < 5000000);
                        let urls = files.map(({
                            tempFilePath
                        }) => tempFilePath);

                        this.data.__imgUrls.push(...urls);
                        this.setData({
                            __imgUrls: this.data.__imgUrls
                        })
                        urls.forEach(url => {
                            this.data.richEditor.insertImage({
                                src: url,
                                height: "300rpx"
                            })
                        })
                    }

                })
            },
            async submit() {
                console.log(111, this.data.list);
                //grade,pipe_level,category, sizedata,province,city,area,
                let grade = this._getKey("grade")
                let pipe_level = this.data.lists.pipe_level.keys.join(",");
                // let status = this._getKey("category")
                let sizedata = this._getKey("sizedata")
                let province = null;
                let city = null;
                let area = null;
                //获取县市区
                let list = this.data.lists.address.list;
                let indexs = this.data.selectedAddress;
                if (indexs.length) {
                    province = Number(list[0][indexs[0]]?.id) || null;
                    city = Number(list[1][indexs[1]]?.id) || null;
                    area = Number(list[2][indexs[2]]?.id) || null;
                }
                console.log(province, city, area)
                //获取图片
                wx.showLoading({
                    title: "正在提交"
                })
                await Promise.all(pros);
                let images = this.data.__mediaUrls.join(",");
                let content = await this._getRichContent();
                let {
                    title,
                    note,
                    units_name,
                    mobile,
                    contacts,
                    quantity,
                    location,
                    address,
                    status
                } = this.data
                let data = {
                    title,
                    quantity,
                    province,
                    city,
                    area,
                    location,
                    address,
                    images,
                    content,
                    units_name,
                    mobile,
                    contacts,
                    note,
                    status,
                }

                let errs = checkEmpty(data, this.data.__notEmpty);
                if (errs.length) {
                    console.log(errs)
                    wx.hideLoading()

                    wx.showToast({
                        title: errs[0],
                        duration: 600,
                        icon: "error"
                    });

                    return;
                }
                //单独处理
                if (data.content == "<p><br></p>") {
                    wx.hideLoading()

                    wx.showToast({
                        title: "请输入详细信息",
                        duration: 600,
                        icon: "error"
                    });
                    return;
                }
                if (!province && !city && !area) {
                    wx.hideLoading()

                    wx.showToast({
                        title: "请选择所在地点",
                        duration: 600,
                        icon: "error"
                    });
                    return;
                }
                if (province != 9999 && !address) {
                    wx.hideLoading()

                    wx.showToast({
                        title: "请选择详细地址",
                        duration: 600,
                        icon: "error"
                    });
                    return;
                }
                //国外详细地址不是必选,使用
                if (province == 9999 && !address) {
                    let {
                        lng,
                        lat
                    } = list[1][indexs[1]]
                    data.location = `${lng},${lat}`
                }
                let {
                    pubNeedsProd
                } = getApp().$apis;
                let fn = pubNeedsProd;
                if (this.data.isModify) {
                    data.id = this.data.id
                }
                let res = await fn(deleteNull(data))
                console.log(res)
                wx.hideLoading()
                if (res) {
                    wx.navigateBack({
                        success() {
                            setTimeout(() => {
                                wx.showToast({
                                    title: "已提交 待审核",
                                    duration: 800
                                })
                            }, 100)
                        }
                    })
                }
            },
            pickChange(e) {
                let {
                    picker
                } = e.currentTarget.dataset;
                let {
                    value
                } = e.detail;
                let str = `lists.${picker}.index`
                this.setData({
                    [str]: value
                })
            },
            checkboxChange(e) {
                let {
                    value
                } = e.detail;
                console.log(e)
                this.setData({
                    "lists.pipe_level.keys": value
                })
            },
            showActionSheet() {
                this.setData({
                    isShowActionSheet: true
                })
            },
            closeActionSheet() {
                this.setData({
                    isShowActionSheet: false
                })
            },
            async selectedAddress_map(e) {
                let {
                    latitude,
                    longitude
                } = e.detail;
                wx.showLoading({
                    title: "加载中"
                })
                let res = await (new Promise(res_ => {
                    qqmap.reverseGeocoder({
                        location: {
                            latitude,
                            longitude
                        },
                        success(res) {
                            res_(res)
                        }
                    })
                }));
                wx.hideLoading()
                let {
                    result: {
                        address
                    }
                } = res;
                this.setData({
                    isShowMap: false,
                    location: `${longitude},${latitude}`,
                    address
                })


            },
            showMap() {
                let list = this.data.lists.address.list;
                let indexs = this.data.selectedAddress;
                if (!indexs.length) {
                    wx.showToast({
                        title: "请先选择所在地址",
                        duration: 600,
                        icon: "error"
                    });
                    return;
                }
                let province = list[0][indexs[0]] || null;
                let city = list[1][indexs[1]] || null;
                let area = list[2][indexs[2]] || null;
                let {
                    lng,
                    lat
                } = area || city || province
                this.setData({
                    "map.lng": lng,
                    "map.lat": lat,
                    isShowMap: true
                })
            },
            //一列改变
            async regionChange(e) {
                //加载下一列
                let {
                    getAddress
                } = getApp().$apis;
                let {
                    column,
                    value
                } = e.detail;

                if (column == 0) {
                    //省变,市区都加载
                    wx.showLoading({
                        title: "加载中"
                    })
                    //修改index以获取id
                    this.setData({
                        "lists.address.index[0]": value,
                        "lists.address.index[1]": 0,
                        "lists.address.index[2]": 0
                    })
                    let cityArr = await this._loadCity(this.data.currentPID); //
                    let areaArr;
                    if (!cityArr.length) {
                        areaArr = [];
                    } else {
                        areaArr = await this._loadArea(this.data.currentPID, cityArr[0].id);
                    }

                    wx.hideLoading()
                    this.setData({
                        "lists.address.list[1]": cityArr,
                        "lists.address.list[2]": areaArr,

                    })

                } else if (column == 1) {
                    //市变,区加载
                    wx.showLoading({
                        title: "加载中"
                    })
                    //修改index以获取id
                    this.setData({
                        "lists.address.index[1]": value,
                        "lists.address.index[2]": 0,
                    })
                    let areaArr = await this._loadArea(this.data.currentPID, this.data.currentCID);
                    wx.hideLoading()
                    this.setData({
                        "lists.address.list[2]": areaArr,

                    })
                }

                console.log(e)
            },
            //地址改变
            addressChange(e) {
                this.setData({
                    selectedAddress: e.detail.value,
                    location: null,
                    address: null
                })
            },
            async initData() {
                let {
                    getPubClasses,
                    getAddress
                } = getApp().$apis;

                //  await getAddress({}).then(res=>{
                //      console.log(res,"省份");
                //  })
                let res = await getAddress({});
                // console.log(res, "res");
                let {
                    code: address
                } = res;
                // let address = code;
                console.log(address, "address");
                // console.log(address,"address");
                // //加载市
                let cityAddress = await this._loadCity(address[0].value);
                //加载区
                let areaAddress = await this._loadArea(address[0].value, cityAddress[0].id)
                this.setData({
                    "lists.address.list[0]": address,
                    "lists.address.list[1]": cityAddress,
                    "lists.address.list[2]": areaAddress,
                })
            },
            //获取市区列表,默认当前第一个省的id
            async _loadCity(id) {
                console.log("省区id", id)
                let {
                    getAddress
                } = getApp().$apis;
                let provinceId = id || this.data.lists.address.list[0][this.data.lists.address.index[0]].id;
                let cityRes = await getAddress({
                    province: provinceId
                });
                if (cityRes) {
                    let {
                        code
                    } = cityRes;
                    let cityAddress = code ? code.map(({
                        value,
                        name,
                        lat,
                        lng
                    }) => ({
                        id: value,
                        name,
                        lat,
                        lng
                    })) : [];
                    return cityAddress
                }
            },
            //获取地区,默认第一个省的id,第一个市区的id
            async _loadArea(id1, id2) {
                console.log("省区id", id1)
                console.log("市区id", id2)
                let {
                    getAddress
                } = getApp().$apis;

                if (!id1 || !id2) {
                    id1 = (this.data.lists.address.list[0][this.data.lists.address.index[0]]).id
                    id2 = (this.data.lists.address.list[1][this.data.lists.address.index[1]]).id
                }
                let areaRes = await getAddress({
                    province: id1,
                    city: id2
                });
                if (areaRes) {
                    let {
                        code
                    } = areaRes;
                    let areaAddress = code ? code.map(({
                        value,
                        name,
                        lat,
                        lng
                    }) => ({
                        id: value,
                        name,
                        lat,
                        lng
                    })) : [];
                    return areaAddress
                }
            },
            async _getRichContent() {
                let {
                    uploadFile
                } = getApp().$apis;
                let res = await this.data.richEditor.getContents();
                let str = res.html;
                console.log(str)
                let pros_ = [];

                let __imgUrls = str.match(/(?<=src\=")(http:\/\/tmp\/.+?|wxfile:\/\/.+?)(?=")/g) || []

                __imgUrls.forEach(tempUrl => {
                    let pro = (async () => {
                        let {
                            data: {
                                fullurl
                            }
                        } = await uploadFile(tempUrl);
                        str = str.replace(tempUrl, fullurl)
                    })()
                    pros_.push(pro)
                })
                await Promise.all(pros_);
                return str;
            },
            _getKey(prop) {
                let {
                    list,
                    index
                } = this.data.lists[prop];
                if (index === null) return null;
                return list[index].key
            },
            _dealObj(obj) {
                let arr = [];
                for (let index in obj) {
                    arr.push({
                        key: index,
                        name: obj[index]
                    })
                }
                return arr;
            },
            _getIndex(arr, value, prop = "key") {
                //从arr里找到prop为value的对象
                if (value === null) return null;
                if (prop == "id") {
                    console.log(arr, value)
                }
                let index = null;
                arr.forEach((item, index_) => {
                    if (item[prop] == value) index = index_;
                })
                return index;
            },
            prevent() {
                return;
            }
        }

    })