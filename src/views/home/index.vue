<!--
 * @Author: Hey
 * @Date: 2021-02-01 10:47:07
 * @LastEditTime: 2021-02-03 21:09:47
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\views\home\index.vue
-->
<template>
  <div class="index">
    <img src="@/assets/login/title.png" alt="" class="title">

    <!-- <vue-seamless-scroll class="notice-swipe winning" :data="list" :class-option="transverseOption"> -->
    <!-- </vue-seamless-scroll> -->
    <van-notice-bar class="notice-swipe winning" scrollable>
      <span class="item" v-for='(item, i) in list' :key="i">{{`恭喜${item.nickname}获得${item.floor || i}楼奖励`}}</span>
    </van-notice-bar>

    <vue-seamless-scroll class="notice-swipe" :data="commentsList" :class-option="classOption">
      <div class="item" v-for='(item, i) in commentsList' :key="i">{{item.floor + '楼:  ' + item.comment}}</div>
    </vue-seamless-scroll>

    <div class="content">
      <img v-for="item in contentList" :key="item.id" @click="jumpActive(item.id)" :src="item.img" alt=""
        :class="item.info">
    </div>

    <img src="@/assets/index/itshi-1.png" alt="" class="view">

    <div class="rule">
      <div>评论奖励规则：</div>
      <div>
        1.每逢88楼获得1次幸运奖，如188、1288等，奖品为牛年玩偶一个；</div>
      <div>
        2.第2021楼获得“满堂红“奖，奖励价值1000元无线耳机一个；</div>
      <div>
        3.评论上限为1万条。</div>
    </div>

    <van-field autosize type="textarea" v-model="comment" placeholder="评论区" class="textarea"></van-field>

    <img src="@/assets/index/comments.png" alt="" class="comments" @click="commentsHandle">

    <img src="@/assets/index/jiemu-2.jpg" alt="" class="jiemu">

    <van-dialog v-model="show" @close='clear' :show-confirm-button="false">
      <div class="dialog">
        <div class="dialog-title">恭喜中奖</div>
        <div class="dialog-title">请填写身份信息</div>
      </div>

      <div class="dialog-content">
        <van-form validate-first @submit="onSubmit">
          <van-field type="text" v-model="form.nickname" label-width="40px" required placeholder="请填写姓名" label="姓名"
            name="nickname" :rules="[{ required: true, message: '请填写姓名' }]">
          </van-field>
          <!-- <van-field type="text" v-model="form.unit" label-width="40px" required placeholder="请填写单位" label="单位"
            name="unit" :rules="[{ required: true, message: '请填写单位' }]">
          </van-field> -->
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
    ws
  } from '@/config'
  import {
    getStroage
  } from '@/utils/stroage'
  import {
    videoComment,
    editUserInfo,
    bulletChatList,
    getWinningList
  } from '@/api'
  import vueSeamlessScroll from 'vue-seamless-scroll'

  export default {
    name: 'Index',
    components: {
      vueSeamlessScroll
    },
    data() {
      return {
        list: [],
        contentList: [{
          img: require('@/assets/index/man.png'),
          id: 0,
          info: 'man'
        }, {
          img: require('@/assets/index/tang.png'),
          id: 1,
          info: 'tang'
        }, {
          img: require('@/assets/index/hong.png'),
          id: 2,
          info: 'hong'
        }],
        commentsList: [],
        form: {
          nickname: '',
          phone: ''
        },
        comment: '',
        show: false,
        pattern: /1[3-8]\d{8}/,
        userId: '',
        selfWinInfo: {}
      }
    },
    mounted() {
      this.init()
      this.getWinningList()
      this.websocket()
    },
    computed: {
      classOption() {
        return {
          step: 0.5, // 数值越大速度滚动越快
          limitMoveNum: this.commentsList.length, // 开始无缝滚动的数据量 this.dataList.length
          hoverStop: true, // 是否开启鼠标悬停stop
          direction: 1, // 0向下 1向上 2向左 3向右
          openWatch: true // 开启数据实时监控刷新dom
        }
      },
      transverseOption() {
        return {
          step: 0.3, // 数值越大速度滚动越快
          limitMoveNum: this.list.length, // 开始无缝滚动的数据量 this.dataList.length
          hoverStop: true, // 是否开启鼠标悬停stop
          openWatch: true, // 开启数据实时监控刷新dom
          direction: 2 // 0向下 1向上 2向左 3向右
        }
      },
      noticeInfo() {
        let str = '       '
        this.list.forEach((e, i) => {
          str += ` 恭喜${e.nickname}获得${e.floor || i}楼奖励 `
        })
        return str
      }
    },
    methods: {
      async getWinningList() {
        const {
          data
        } = await getWinningList()
        this.list = data.records
      },
      async init() {
        const {
          data
        } = await bulletChatList()
        this.commentsList = data.records
      },
      handleWsOpen(e) {
        console.log('BE: WebSocket open')
      },
      handleWsClose(e) {
        console.log('BE: WebSocket close')
      },
      handleWsError(e) {
        console.log('BE: WebSocket error')
      },
      handleWsMessage(e) {
        // console.log('BE: WebSocket message', e)
        const info = this.formatCheck(e.data) && JSON.parse(e.data)
        if (!info) return
        console.log(info);
        if (info.key === 'COMMENT') {
          if (info.data.nickname) this.list.push(info.data)
          this.commentsList.push(info.data)
        } else if (info.key === 'WIN_PRIZE') {
          if (info.data.phone == '') {
            this.show = true
            this.selfWinInfo = info.data
            return
          }
          this.list.push(info.data)
        }
      },
      formatCheck(str) {
        if (typeof str === 'string') {
          try {
            JSON.parse(str)
            return true
          } catch (e) {
            return false
          }
        }
      },
      jumpActive(id) {
        this.$router.push(`/activity/${id}`)
      },
      // TODO
      async commentsHandle() {
        const {
          comment
        } = this
        if (!comment) {
          return this.$notify({
            type: 'warning',
            message: '请输入内容后提交'
          })
        }
        const {
          msg,
          success
        } = await videoComment({
          comment
        })

        this.$notify(success ? {
          type: 'success',
          message: '评论成功'
        } : {
          type: 'warning',
          message: msg
        })

        this.comment = ''
      },
      // TODO...提交身份信息
      async onSubmit(val) {
        const {
          form,
          selfWinInfo
        } = this
        const {
          msg,
          success
        } = await editUserInfo(form)

        this.$notify(success ? {
          type: 'success',
          message: '处理成功'
        } : {
          type: 'warning',
          message: msg
        })
        this.list.push({
          ...selfWinInfo,
          ...form
        })
        console.log('winList', this.list);

        this.show = false
      },
      clear() {
        this.form = {
          nickname: '',
          phone: ''
        }
      },
      websocket() {
        const userId = getStroage('Token') || ''
        const host = ws || 'ws:' + location.host
        let socketUrl = host + '/api/imserver/' + userId
        socketUrl = socketUrl.replace('https', 'ws').replace('http', 'ws')

        if (typeof (WebSocket) === 'undefined') {
          alert('您的浏览器不支持socket')
        } else {
          if (this.socket) {
            console.log('hassocket')
            this.socket.close()
            this.socket = null
          }
          // 实例化socket
          this.socket = new WebSocket(socketUrl)
          console.log(this.socket, 'socket')
          // 监听socket连接
          this.socket.onopen = this.handleWsOpen
          // 监听socket错误信息
          this.socket.onerror = this.handleWsError
          // 监听socket消息
          this.socket.onmessage = this.handleWsMessage
          this.socket.onclose = this.handleWsClose
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      // ...
      const Token = getStroage('Token')
      if (!Token) next('/login')
      next()
    },
    beforeDestroy() {
      this.socket.onclose()
    }
  }

</script>
<style lang="scss" scoped>
  .index {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    padding-bottom: 60px;
    background-image: url('~@/assets/index/bg.jpg');
    background-size: cover;
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
      width: 300px;
      margin-bottom: 16px;
    }

    .comments {
      width: 85px;
      margin-top: 10px;
    }

    .dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 18px;
      font-weight: 1000;
      margin-bottom: 20px;
    }

    .rule {
      width: 300px;
      color: #fff;
      margin-bottom: 10px;
      font-size: 12px;
    }

    .textarea {
      width: 297px;
      height: 83px;
      background: #FFFFFF;
      margin-bottom: 8px;
    }

    .notice-swipe {
      width: 300px;
      height: 120px;
      background-color: #fffbe8;
      line-height: 40px;
      margin-top: 10px;
      overflow: hidden;
      padding: 0 20px;
    }

    .jiemu {
      width: 100vw;
    }

    .winning {
      height: 40px;

      .item {
        padding-right: 20px;
      }
    }

  }

</style>
