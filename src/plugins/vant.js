/*
 * @Author: Hey
 * @Date: 2021-01-29 16:52:08
 * @LastEditTime: 2021-02-01 15:34:30
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\plugins\vant.js
 */
// 按需全局引入 vant组件
import Vue from 'vue'
import {
  Cell,
  Field,
  NoticeBar,
  Swipe,
  SwipeItem,
  Dialog,
  Form,
  Button,
  Notify,
  Icon
} from 'vant'
Vue.use(NoticeBar)
Vue.use(Cell)
Vue.use(Form)
Vue.use(Field)
Vue.use(Dialog)
Vue.use(Notify)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Swipe).use(SwipeItem)
