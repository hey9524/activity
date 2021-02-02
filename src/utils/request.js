/*
 * @Author: Hey
 * @Date: 2021-01-29 16:52:08
 * @LastEditTime: 2021-02-01 17:35:44
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
  getStroage
} from './stroage'
// create an axios instance
const Authorization = getStroage()
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
    config.headers['Authorization'] = Authorization || ''
    return config
  },
  error => {
    // do something with request error
    Notify({
      type: 'error',
      message: res || '访问错误,请稍后重试'
    })
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
      Notify({
        type: 'error',
        message: res || '访问错误,请稍后重试'
      })
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
