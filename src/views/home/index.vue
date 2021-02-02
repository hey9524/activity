<!--
 * @Author: Hey
 * @Date: 2021-02-01 10:47:07
 * @LastEditTime: 2021-02-02 09:24:44
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\views\home\index.vue
-->
<template>
  <div class="index">
    <img src="@/assets/login/title.png" alt="" class="title">
    <van-notice-bar text="中奖人员XXX" />
    <van-notice-bar :scrollable="false">
      <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
        <van-swipe-item v-for='item in list' :key="item.id">{{item.info}}</van-swipe-item>
      </van-swipe>
    </van-notice-bar>

    <div class="content">
      <img v-for="item in contentList" :key="item.id" @click="jumpActive(item.id)" :src="item.img" alt=""
        :class="item.info">
    </div>

    <img src="@/assets/index/clickImg.png" alt="" class="view">

    <van-field autosize type="textarea" v-model="comment" class="textarea"></van-field>

    <img src="@/assets/index/comments.png" alt="" class="comments" @click="commentsHandle">

    <van-dialog v-model="show" @close='clear' :show-confirm-button="false">
      <div class="dialog">
        <div class="dialog-title">恭喜中奖</div>
        <div class="dialog-title">请填写身份信息</div>
      </div>

      <div class="dialog-content">
        <van-form validate-first @submit="onSubmit">
          <van-field type="text" v-model="form.name" label-width="40px" required placeholder="请填写姓名" label="姓名"
            name="name" :rules="[{ required: true, message: '请填写姓名' }]">
          </van-field>
          <van-field type="text" v-model="form.unit" label-width="40px" required placeholder="请填写单位" label="单位"
            name="unit" :rules="[{ required: true, message: '请填写单位' }]">
          </van-field>
          <van-field type="text" v-model="form.phone" label-width="40px" maxlength='11' required placeholder="请填写手机号"
            name="pattern" label="手机" :rules="[{ required: true, message: '请填写手机号' },{ pattern, message: '手机号格式不正确' }]">
          </van-field>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">完成填写</van-button>
          </div>
        </van-form>
      </div>
    </van-dialog>
  </div>
</template>
<script>
  import {
    baseApi
  } from '@/config'
  export default {
    data() {
      return {
        list: [{
          info: 13,
          id: 1
        }, {
          info: 12,
          id: 2
        }, {
          info: 11,
          id: 3
        }, {
          info: 10,
          id: 4
        }, {
          info: 9,
          id: 5
        }],
        contentList: [{
          img: require('@/assets/index/man.png'),
          id: 1,
          info: 'man'
        }, {
          img: require('@/assets/index/tang.png'),
          id: 2,
          info: 'tang'
        }, {
          img: require('@/assets/index/hong.png'),
          id: 3,
          info: 'hong'
        }],
        form: {
          name: '',
          unit: '',
          phone: ''
        },
        comment: '',
        show: false,
        pattern: /1[3-8]\d{8}/,
        ws: null
      }
    },
    mounted() {
      // TODO
      const userId = 10
      this.ws = new WebSocket(`${baseApi}/imserver/${userId}`)

      ws.addEventListener('open', this.handleWsOpen.bind(this), false)
      ws.addEventListener('close', this.handleWsClose.bind(this), false)
      ws.addEventListener('error', this.handleWsError.bind(this), false)
      ws.addEventListener('message', this.handleWsMessage.bind(this), false)

      this.handleWsOpen()
    },
    methods: {
      handleWsOpen(e) {
        console.log('FE: WebSocket open');
        console.log(this.ws);
      },
      handleWsClose(e) {
        console.log('FE: WebSocket close');
      },
      handleWsError(e) {
        console.log('FE: WebSocket error');
      },
      handleWsMessage(e) {
        console.log('FE: WebSocket message');
      },
      jumpActive(id) {
        if (!id) {
          return this.$notify({
            type: 'error',
            message: '访问出错'
          })
        }
        this.$router.push(`/activity/${id}`)
      },
      // TODO
      async commentsHandle() {

      },
      // TODO...提交身份信息
      onSubmit(val) {
        console.log(val)
        console.log(this.form)
        this.$notify({
          type: 'success',
          message: '提交成功'
        })
        this.show = false
      },
      clear() {
        this.form = {
          name: '',
          unit: '',
          phone: ''
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
    height: 1250px;
    background-image: url('~@/assets/index/bg.jpg');
    background-size: 100vw 1250px;
    background-repeat: no-repeat;

    .title {
      width: 318px;
      margin: 70px 0 20px;
    }

    .content {
      position: relative;
      width: 250px;
      height: 288px;
      margin: 40px 0 10px;

      .man {
        position: absolute;
        top: 0;
        width: 130px;
      }

      .tang {
        position: absolute;
        top: 50px;
        right: 0;
        width: 130px;
      }

      .hong {
        position: absolute;
        bottom: 0;
        left: 30px;
        width: 130px;
      }
    }

    .view {
      width: 254px;
      margin-bottom: 16px;
    }

    .comments {
      width: 78px;
    }

    .dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 18px;
      font-weight: 1000;
      margin-bottom: 20px;
    }

    .textarea {
      width: 297px;
      height: 83px;
      background: #FFFFFF;
      margin-bottom: 8px;
    }

  }

</style>
<style lang="scss">
  .van-notice-bar {
    width: 300px;
  }

  .van-notice-bar+.van-notice-bar {
    margin-top: 10px;
  }

  .notice-swipe {
    height: 40px;
    line-height: 40px;
  }

  .van-dialog__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

</style>
