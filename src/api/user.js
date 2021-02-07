/*
 * @Author: your name
 * @Date: 2021-01-29 16:52:08
 * @LastEditTime: 2021-02-02 14:30:35
 * @LastEditors: Hey
 * @Description: In User Settings Edit
 * @FilePath: \vue-h5-template\src\api\user.js
 */
// axios
import request from '@/utils/instance'

// 登录
export function login(params) {
  return request({
    url: '/api/login/app',
    method: 'post',
    params,
    hideloading: true
  })
}

// 填写用户信息
export function editUserInfo(params) {
  return request({
    url: '/api/fr-app-user/edit',
    method: 'post',
    params,
    hideloading: true
  })
}
