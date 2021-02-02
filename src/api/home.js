/*
 * @Author: Hey
 * @Date: 2021-01-29 16:52:08
 * @LastEditTime: 2021-02-02 14:41:04
 * @LastEditors: Hey
 * @Description: 
 * @FilePath: \vue-h5-template\src\api\home.js
 */
// axios
import request from '@/utils/request'

// 根据类型获取视频列表
export function getVideoList(params) {
  return request({
    url: `/api/fr-video/type`,
    method: 'GET',
    params,
    hideloading: true
  })
}

// 给视频投票
export function videoVote(key) {
  return request({
    url: `/api/fr-video/videoVote/${key}`,
    method: 'POST',
    hideloading: true
  })
}

// 给视频评论
export function bulletChatList(params = {
  pageIndex: 1,
  pageSize: 10
}) {
  return request({
    url: `/api/fr-video-comment/bulletChat`,
    method: 'GET',
    params,
    hideloading: true
  })
}
