//设置公共访问url，即环境地址 
//commonJS写法--node采用就是该规范 引入require
module.exports = {
  //开发环境
  dev: {},
  //测试环境
  test: {
    baseUrl:"https://gxzc.eccode.net",
    oBaseUrl: "https://gxzc.eccode.net"
  },
  //线上url
  prod: {
    baseUrl: "https://www.dajia-oil.com",
    oBaseUrl: "https://www.dajia-oil.com"
  }
}