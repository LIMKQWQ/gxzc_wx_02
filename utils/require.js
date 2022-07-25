const {
  oBaseUrl,
  baseUrl
} = require('./evn.js').test
const {
  oBaseUrl: oBaseUrl_t,
  baseUrl: baseUrl_t
} = require('./evn.js').test
// 专用域名
const subDomain = 'api';
const oSubDomain = 'api';

module.exports = {
  // 封装wx.request 
  // {String }url:请求的接口地址 
  // {String} method:请求方式 GET,POST.... 
  // {Object} data:要传递的参数 
  // { boolean }isSubDomain:表示是否添加二级子域名 true代表添加,false代表不添加 
  //二次封装wx.request
  request: (url, method, data, isSubDomain = true, isTest = false) => {
    let baseUrl_ = baseUrl;
    let oBaseUrl_ = oBaseUrl;
    if (isTest) {
      baseUrl_ = baseUrl_t;
      oBaseUrl_ = oBaseUrl_t;
    }
    return new Promise((resolve, reject) => {
      let _url = `${baseUrl_}/${isSubDomain?subDomain:''}/${url}`;

      console.log(_url)
      wx.request({
        url: _url,
        data: data,
        method: method,
        header: {
          "content-type": "application/json;charset=UTF-8",
          ...getHeader()
        },
        success: res => {
          if (res.data.code == 0 || res.data.code == 401) {
            console.log("错误", res.data)
            if (res.data.code == 401) {
              wx.$bus.emit("logout")
            }
            setTimeout(() => {
              wx.showToast({
                title: res.data.msg,
                icon: "none",
                duration: 800,
                fail(e) {
                  console.log(e,'fail')
                }
              })
            }, 0)
            resolve(false)
            return;
          }

          resolve(res.data.data || res.data);
        },
        fail: res => {
          reject(res.data)
        }
      })
    })
  },


  // 封装wx.uploadFile 
  // {String }url:请求的接口地址 
  // {String} filePath:请求方式的本地文件路径（可以是微信的临时路径）
  // {String} name: 获取图片二进制文件的key
  // {Object} formData: HTTP 请求中其他额外的 form data（选） 
  // { boolean }isSubDomain:表示是否添加二级子域名 true代表添加,false代表不添加 
  //二次封装wx.uploadFile 
  uploadFile: (url, filePath, name, formData, isSubDomain = true) => {
    return new Promise((resolve, reject) => {
      let _url = `${oBaseUrl}/${isSubDomain?oSubDomain:''}${url}`;
      wx.uploadFile({
        url: _url,
        filePath: filePath,
        name: name,
        formData: formData,
        header: {
          // 微信wx.uploadFile默认
          'content-type': ' multipart/form-data',
          ...getHeader()
        },
        success: res => {
          if (res.data.code == 0 || res.data.code == 401) {
            console.log("错误")
            wx.showToast({
              title: res.data.msg,
              icon: "error",
              duration: 800
            })
            resolve(false)
            return;
          }
          resolve(JSON.parse(res.data))
        }
      })
    })
  }
}
const getHeader = () => {

  const token = wx.getStorageSync('token')
  if (token) {
    return {
      token
    }
  }
}