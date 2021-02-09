/*
 * @Author: Hey
 * @Date: 2021-01-29 16:52:08
 * @LastEditTime: 2021-02-03 21:36:02
 * @LastEditors: Hey
 * @Description: 
 * @FilePath: \vue-h5-template\src\config\env.development.js
 */
// 本地环境配置
module.exports = {
  title: '中建一局新年活动',
  baseUrl: 'http://120.53.235.197:8082', // 项目地址
  // baseApi: 'http://120.53.235.197:8082', // 本地api请求地址,注意：如果你使用了代理，请设置成'/'
  baseApi: '', // 本地api请求地址,注意：如果你使用了代理，请设置成'/'
  APPID: 'xxx',
  APPSECRET: 'xxx',
  $cdn: 'https://www.sunniejs.cn/static',
  ws: '',
  targetUri: 'http://120.53.235.197:8082', // proxy拦截地址
}
