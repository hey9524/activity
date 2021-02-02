<!--
 * @Author: Hey
 * @Date: 2021-01-29 16:52:08
 * @LastEditTime: 2021-02-01 17:44:18
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\views\home\login.vue
-->
<!-- home -->
<template>
  <div class="index">
    <img src="@/assets/login/title.png" alt="" class="title">
    <img src="@/assets/login/inputlabel.png" alt="" class="label">
    <input type="text" v-model="key" class="pass-inp">
    <img src="@/assets/login/loginBTN.png" alt="" class="btn" @click="login">
  </div>
</template>
<script>
  import {
    login
  } from '@/api'
  export default {
    data() {
      return {
        key: '满堂红',
        list: [
          'Vue-cli4',
          '配置多环境变量',
          'VantUI 组件按需加载',
          'Sass 全局样式',
          'Webpack 4',
          'Vuex 状态管理',
          'Axios 封装及接口管理',
          'Vue-router',
          'Webpack 4 vue.config.js 基础配置',
          '配置 proxy 跨域',
          '配置 alias 别名',
          '配置 打包分析',
          '配置 externals 引入 cdn 资源',
          '去掉 console.log',
          'splitChunks 单独打包第三方模块',
          '添加 IE 兼容',
          'Eslint+Pettier 统一开发规范'
        ]
      }
    },
    mounted() {},
    methods: {
      // TODO...
      async login() {
        const {
          key
        } = this
        if (!key) return this.$notify({
          type: 'warning',
          message: '请填写密码后访问'
        })
        const {
          data
        } = await login({
          key
        })
        console.log(data)
        // this.$router.push('/')
      }
    }
  }

</script>
<style lang="scss" scoped>
  .index {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 375px;
    height: 100vh;
    background-image: url('~@/assets/login/backgroundIMG.jpg');
    background-size: 375px 100vh;
    background-repeat: no-repeat;

    .title {
      margin-top: 70px;
      width: 318px;
    }

    .label {
      margin-top: 10vh;
      width: 40vw;
    }

    .pass-inp {
      width: 80vw;
      height: 40px;
      border-radius: 10px;
      background-color: #fff;
      border: 0;
      outline: 0;
      padding: 5px 10px;
    }

    .btn {
      width: 20vw;
      margin-top: 5vh;
    }
  }

</style>
