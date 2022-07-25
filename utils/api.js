const {
  request
} = require('./require.js');
const {
  uploadFile: uploadFile_
} = require('./require.js');

// 基于业务封装的数据请求
module.exports = {
  getIndexData: () => request("index", "post"),
  getShareKnowledgeList: ({
    page,
    type
  }) => request("knowledge", "post", {
    page,
    type
  }),
  getHotList: ({
    lng,
    lat
  }) => request("product_home", "post", {
    lng,
    lat
  }),
  getNews: ({
    page
  }) => request("information", "post", {
    page
  }),
  getIndustry: ({
    page
  }) => request("industry", "post", {
    page
  }),
  getResources: ({
    page,
    category,
    size,
    grade,
    manufacturer,
    seachc,
    area,
    lat,
    lng
  }) => request("product", "post", {
    page,
    category,
    size,
    grade,
    manufacturer,
    seachc,
    area,
    lat,
    lng
  }),
  getAnnounces: ({
    page
  }) => request("announces", "post", {
    page
  }),

  getIntroduction: () => request("introduction", "post"),
  getCases: () => request("cases", "post"),
  getContact: () => request("contact", "post"),
  getCertificate: () => request("certificate", "post"),
  getKnowledgeDetail: ({
    id
  }) => request("knowledge_text", "post", {
    id
  }),
  getNewsDetail: ({
    id
  }) => request("information_text", "post", {
    id
  }),
  getIndustryDetail: ({
    id
  }) => request("industry_text", "post", {
    id
  }),
  getAnnounceDetail: ({
    id
  }) => request("announces_text", "post", {
    id
  }),
  login: ({
    account,
    password
  }) => request("login", "post", {
    account,
    password
  }),
  getUserInfo: () => request("user", "post"),
  getCode: ({
    area_code,
    phone,
    event
  }) => request("mobile_send", "post", {
    area_code,
    mobile: phone,
    event
  }),
  getCountry: () => request("assets/mobile/pack/country.json", "get", null, false),
  sendOpenId: ({
    code
  }) => request("getUserWechat", "post", {
    code
  }),
  changePwd: ({
    mobile,
    code,
    password,
  }) => request("changepwd", "post", {
    mobile,
    code,
    password,
  }),
  getPubClasses: () => request("release_select", "post"),
  getAddress: ({
    province,
    city
  }) => request("area", "post", {
    province,
    city
  }),
  uploadFile: (path) => uploadFile_("/upload", path, "file"),
  pubProd: (obj) => request("release", "post", obj),
  getDemands: ({
    page
  }) => request("notice", "post", {
    page
  }),
  getDemandDetail: ({
    id
  }) => request("notice_text", "post", {
    id
  }),
  getProds: () => request("user_product", "post"),
  getProd: ({
    id
  }) => request("modify_data", "post", {
    id
  }),
  modifyProd: (obj) => request('modify', "post", obj),
  getResourceDetail: ({
    id
  }) => request('product_detail', "post", {
    id
  }),
  toggleCollectResource: ({
    id
  }) => request("product_user", "post", {
    id
  }),
  colletedResourceList: ({
    lng,
    lat
  }) => request("product_like", "post", {
    lng,
    lat
  }),
  registerPersonal: ({
    like,
    type,
    username,
    nickname,
    password,
    mobile,
    code,
    sex,
    openid,
  }) => request("personal", "post", {
    like,
    type,
    username,
    nickname,
    password,
    mobile,
    code,
    sex,
    openid,
  }),
  registerEnterprise: ({
    like,
    type,
    username,
    nickname,
    password,
    mobile,
    code,
    sex,
    corporate,
    phone,
    name,
    wechat,
    image,
    openid
  }) => request("enterprise", "post", {
    like,
    type,
    username,
    nickname,
    password,
    mobile,
    code,
    sex,
    corporate,
    phone,
    name,
    wechat,
    image,
    openid
  }),
  getOpenId: ({
    code
  }) => request("getOpenid", "post", {
    code
  }),
  getAgreement: () => request('like', "post"),
  leaveMessage: ({
    mobile,
    name,
    content,
    email
  }) => request("message", "post", {
    mobile,
    name,
    content,
    email
  }),
  resetPwd: ({
    name,
    mobile,
    code,
    password
  }) => request("resetpwd", "post", {
    name,
    mobile,
    code,
    password
  }),
  sendUserInfo: ({
    openid,
    nickName,
    gender,
    language,
    city,
    province,
    country,
    avatarUrl
  }) => request("getUserWechat", "post", {
    openid,
    nickName,
    gender,
    language,
    city,
    province,
    country,
    avatarUrl
  }),
  sendUserPhone: ({
    openid,
    encryptedData,
    iv
  }) => request("getUserPhone", "post", {
    openid,
    encryptedData,
    iv
  }),
  getHomeNotice: () => request("homeNotice", "post", null, true, true),
  // 共享知识页面
  getKnowledgeTabs: () => request("knowledge/type", "post"),
  getKnowledgeList: ({
    page,
    type
  }) => request("knowledge", "post", {
    page,
    type
  }),
  // 导航资产份分类
  getHomeFilter: () => request("product/home_type", "post"),

  // 需求大厅 详情
  getNeedsDeatil: ({
    id
  }) => request('needs/detail', "post", {
    id
  }),

  // 需求大厅搜索列表
  getNeedsList: ({
    page,
    seachc,
    lat,
    lng
  }) => request('needs/list', "post", {
    page,
    seachc,
    lat,
    lng
  }),

  // 需求大厅关键词列表
  getNeedsKey: () => request("needs/key", "post"),
  // 发布需求

  // 需求推荐

  // 需求详情留言
  sendMsg: () => request("needs/message", "post"),
  // 我的收藏
  getProductLike: ({
    lat,
    lng
  }) => request('product_like', "post", {
    lat,
    lng
  }),
  // 发布模板通用
  pubProdMod: (obj) => request("product/release_mod", "post", obj),
    // 发布需求
  pubNeedsProd: (obj) => request("needs/release", "post", obj),
  // 新资源分类
  getProductType: ({
    pid
  }) => request("product/type", "post", {
    pid
  }),
  // 资源推荐
  resourceRecommend: ({
    nid,
    company,
    contacts,
    number,
    content
  }) => request("needs/elect", "post", {
    nid,
    company,
    contacts,
    number,
    content
  }),
  // 新资源分类
  getProductFiler: ({
    type,
    pid
  }) => request("product/product_search", "post", {
    type,
    pid
  }),
  // 新资源列表
  getClasses: ({
    category,
    size,
    grade,
    manufacturer,
    area
  } = {}) => request("product", "post", {
    category,
    size,
    grade,
    manufacturer,
    area
  }),
}