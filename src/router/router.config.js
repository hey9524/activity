/*
 * @Author: Hey
 * @Date: 2021-01-29 16:52:08
 * @LastEditTime: 2021-02-01 12:44:37
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\router\router.config.js
 */
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
    path: '/',
    name: 'Index',
    component: () => import('@/views/home/index'),
    meta: {
      title: '首页',
      keepAlive: false
    }
  }, {
    path: '/reload',
    name: 'Reload',
    component: () => import('@/views/home/reload'),
    meta: {
      title: '首页',
      keepAlive: false
    }
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/views/home/login'),
  //   meta: {
  //     title: '登录',
  //     keepAlive: false
  //   }
  // }, {
  //   path: '/activity/:id',
  //   name: 'Activity',
  //   component: () => import('@/views/home/activity'),
  //   meta: {
  //     title: '活动',
  //     keepAlive: false
  //   }
  // }
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('@/views/home/about'),
  //   meta: {
  //     title: '关于我',
  //     keepAlive: false
  //   }
  // }
]
