<!--
 * @Author: Hey
 * @Date: 2021-01-29 16:52:08
 * @LastEditTime: 2021-02-03 21:14:20
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\views\home\login.vue
-->
<!-- home -->
<template>
  <div class="index">
    <img src="@/assets/login/title.png" alt="" class="title">

    <div class="movie">
      <videoCom :src="src" />
    </div>

    <img src="@/assets/login/inputlabel.png" alt="" class="label">
    <input type="text" v-model="key" class="pass-inp">
    <img src="@/assets/login/loginBTN.png" alt="" class="btn" @click="login">
  </div>
</template>
<script>
  import videoCom from '@/components/videoCom'
  import {
    login
  } from '@/api'
  import {
    setStroage
  } from '@/utils/stroage'
  export default {
    components: {
      videoCom
    },
    data() {
      return {
        // key: '满堂红',
        key: '',
        src: window.videoUrl || ''
      }
    },
    mounted() {},
    methods: {
      // TODO...
      async login() {
        const {
          key
        } = this
        if (!key) {
          return this.$notify({
            type: 'warning',
            message: '请填写密码后访问'
          })
        }
        const {
          data,
          code
        } = await login({
          key
        })
        if (code === 200 && data) {
          setStroage('Token', data.token)
          this.$router.push({
            name: 'Index'
          })
        }
      }
    }
  }

</script>
<style lang="scss" scoped>
  .index {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    min-height: 100vh;
    padding: 20px 0;
    background-image: url('~@/assets/login/backgroundIMG.jpg');
    background-size: cover;
    background-repeat: no-repeat;

    .title {
      margin-top: 70px;
      width: 318px;
    }

    .movie {
      width: calc(100vw - 60px);
      height: 188px;
      background-color: #999;
      border-radius: 10px 10px 0 0;
      margin: 20px 0;
    }

    .label {
      width: 40vw;
    }

    .pass-inp {
      width: 300px;
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
