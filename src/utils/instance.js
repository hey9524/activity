import axios from 'axios'
import {
  Toast
} from 'vant';
import {
  baseApi
} from '@/config'
import {
  getStroage,
  setStroage
} from './stroage'
// axios 配置

// 创建一个axios实例
const instance = axios.create({
  baseURL: baseApi, // api 即上面 vue.config.js 中配置的地址
  timeout: 5000, // request timeout  设置请求超时时间
  withCredentials: true, // 是否允许带cookie这些
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // if (getStroage('Token')) {
  config.headers.Authorization = getStroage('Token') || ''
  // }
  Toast.loading({
    forbidClick: true
  })
  return config;
}, error => { //请求错误处理
  return Promise.reject(error)
});


// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];
let newToken = '';

// 响应拦截器
instance.interceptors.response.use(response => {
  Toast.clear()
  const res = response.data
  if (res.status && res.status !== 200) {
    // 登录超时,重新登录
    Toast({
      message: response.msg || '',
    })
    removeStroage('Token')
    router.replace('/login')
    return Promise.reject(res || 'error')
  } else {
    if (res.code !== 200) {
      Toast({
        message: res.msg || ''
      })
    }
    return Promise.resolve(res)
  }
}, error => {
  Toast.clear()
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // if (getStroage('Token')) {
        var config = error.response.config;
        console.log("token过期");
        //通过刷新token获取请求token
        if (!isRefreshing) {
          isRefreshing = true;
          return instance({
              url: "/api/login/app", // 后台接口
              method: "post", // 请求方式  
              params: {
                key: '满堂红',
              }
            })
            .then(response => {
              newToken = response.data.token
              //未进行刷新
              setStroage('Token', newToken)

              return instance(config);
            })
            .catch(error => {
              console.log("刷新token请求失败:", error);
            }).finally(() => {
              isRefreshing = false;
              requests.forEach(cb => cb(newToken));
              // 重试完了别忘了清空这个队列（掘金评论区同学指点）
              requests = [];
            })
        } else {
          // 正在刷新token，返回一个未执行resolve的promise
          return new Promise((resolve) => {
            // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
            requests.push((token) => {
              config.headers.Authorization = token
              resolve(instance(config))
            });
          });
        }
        // } else {
        //   Toast({
        //     message: '登录过期，请重新登录',
        //     duration: 1000,
        //     forbidClick: true
        //   });
        // }
        break;
      default:
        Toast({
          message: error.response.data.message,
          duration: 1500,
          forbidClick: true
        });
    }
  }
  return Promise.reject(error)
})

export default instance
