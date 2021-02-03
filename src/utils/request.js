/*
 * @Author: Hey
 * @Date: 2021-01-29 16:52:08
 * @LastEditTime: 2021-02-03 16:21:17
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\utils\request.js
 */
import axios from 'axios'
import {
  Toast,
  Notify
} from 'vant'
// 根据环境不同引入不同api地址
import {
  baseApi
} from '@/config'
import {
  getStroage,
  removeStroage
} from './stroage'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    config.headers['Authorization'] = getStroage('Token') || ''
    return config
  },
  error => {
    // do something with request error
    Notify('访问错误,请稍后重试')
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      Notify(response.msg || '访问错误,请稍后重试')
      removeStroage('Token')
      router.replace('/login')
      return Promise.reject(res || 'error')
    } else {
      if (res.code !== 200) {
        Notify(res.msg || '访问错误,请稍后重试')
      }
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    removeStroage('Token')
    router.replace('/login')
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
