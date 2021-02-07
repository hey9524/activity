<!--
 * @Author: Hey
 * @Date: 2021-02-01 10:47:07
 * @LastEditTime: 2021-02-04 16:40:48
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\views\home\index.vue
-->
<template>
  <div class="index">
    <!-- <img src="@/assets/login/title.png" alt="" class="title"> -->

    <!-- <vue-seamless-scroll class="notice-swipe winning" :data="list" :class-option="transverseOption"> -->
    <!-- </vue-seamless-scroll> -->

    <!-- <van-notice-bar class="notice-swipe winning" scrollable>
      <span class="item" v-for='(item, i) in list' :key="i">{{`恭喜${item.nickname}获得${item.floor || i}楼奖励`}}</span>
    </van-notice-bar> -->

    <div class="overlay">
      <van-swipe class="my-swipe" ref="swipe" @change="onChange" :show-indicators='false'>
        <van-swipe-item v-for="item in movieList" :key="item.id" lazy-render>

          <!-- <video ref='video' class="movie" playsinline webkit-playsinline x5-playsinline autobuffer='autobuffer'
            x5-video-player-type='true' controls="controls" :id="'video' + item.id">
            <source v-if="activeId == i" src='http://192.168.0.114:8080/redio/getVido' type="video/mp4" />
            <source v-if="activeId == i" :src='item.videoUrl' type="video/mp4" />
          </video> -->
          <div class="movie">
            <videoCom :src="item.videoUrl" :isPaused='isPaused' />
          </div>

          <div class="content">
            <div>当前节目: <span class="content-info">{{item.videoName}}</span></div>
            <div>当前票数: <span class="content-info">{{item.ticket}}</span></div>
          </div>
        </van-swipe-item>
      </van-swipe>

      <img @click.prevent="changeSwipe()" src="@/assets/prev.png" alt="" class="prev">
      <img @click="changeSwipe(true)" src="@/assets/next.png" alt="" class="next">

      <div class="vote" @click="vote">我要为节目助力投票</div>
    </div>

    <vue-seamless-scroll class="notice-swipe" :data="commentsList" :class-option="classOption">
      <div class="item" v-for='(item, i) in commentsList' :key="i">{{item.floor + '楼:  ' + item.comment}}</div>
    </vue-seamless-scroll>

    <!-- <div class="content">
      <img v-for="item in contentList" :key="item.id" @click="jumpActive(item.id)" :src="item.img" alt=""
        :class="item.info">
    </div> -->

    <!-- <img src="@/assets/index/itshi-1.png" alt="" class="view"> -->

    <!-- <div class="rule">
      <div>评论奖励规则：</div>
      <div>1.每逢35楼获得1次幸运奖，如135、1235等，奖品为牛年主题玩偶或蓝宝主题玩偶一个；</div>
      <div>2.第1135楼获得“满堂红“奖，奖励价值1000元无线耳机一个；</div>
      <div>3.评论上限为1万条。</div>
    </div> -->

    <van-field autosize type="textarea" v-model="comment" placeholder="评论区" class="textarea"></van-field>

    <!-- <img src="@/assets/index/comments.png" alt="" class="comments" @click="commentsHandle"> -->
    <div class="comments1" @click="commentsHandle">评论</div>

    <!-- <img src="@/assets/index/jiemu-2.png" alt="" class="jiemu"> -->

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
  import {
    getVideoList,
    videoVote
  } from '@/api'
  import videoCom from '@/components/videoCom'

  export default {
    name: 'Index',
    components: {
      vueSeamlessScroll,
      videoCom
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
        movieList: [],
        comment: '',
        show: false,
        pattern: /1[3-8]\d{8}/,
        userId: '',
        selfWinInfo: {},
        isPaused: true,
        socketTimer: null,
        activeId: 0,
      }
    },
    mounted() {
      this.init()
      this.movieInit()
      // this.getWinningList()
      this.websocket()
      this.socketTimer = setInterval(() => this.handleWsSend({
        data: "data",
        key: "PING"
      }), 30000)
      'onorientationchange' in window && window.addEventListener('onorientationchange', this.resize)
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
      async movieInit() {
        const {
          data
        } = await getVideoList({
          videoType: '满'
        })
        this.movieList = data
      },
      resize() {
        this.$refs.swipe.resize()
      },
      onChange(index) {
        this.activeId = index
        this.isPaused = !this.isPaused
      },
      changeSwipe(add) {
        // const video = document.getElementById(`video${this.movieList[this.activeId].id}`)
        // video.pause()
        this.$refs.swipe[add ? 'next' : 'prev']()
      },
      async vote() {
        const {
          movieList,
          activeId
        } = this
        const {
          msg,
          success
        } = await videoVote(movieList[activeId].id)

        this.$notify(success ? {
          type: 'success',
          message: '投票成功'
        } : {
          type: 'warning',
          message: msg
        })
        this.movieInit()
      },
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
      handleWsSend(data) {
        this.socket.send(JSON.stringify(data))
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
        // 弹幕
        if (info.key === 'COMMENT') {
          // if (info.data.nickname) this.list.push(info.data)
          this.commentsList.push(info.data)
          // 当前用户中奖
        }
        // else if (info.key === 'WIN_PRIZE') {
        //   // 未填写用户信息
        //   if (info.data.phone == '') {
        //     this.show = true
        //     this.selfWinInfo = info.data
        //     return
        //   }
        //   this.commentsList.push(info.data)
        //   this.list.push(info.data)
        //   // 重刷中奖列表
        // } else if (info.key === 'PULL_PRIZE') {
        //   this.getWinningList()
        // }
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
            this.socket.close()
          }
          // 实例化socket
          this.socket = new WebSocket(socketUrl)
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
    // beforeRouteEnter(to, from, next) {
    //   // ...
    //   const Token = getStroage('Token')
    //   if (!Token) next('/login')
    //   next()
    // },
    beforeDestroy() {
      this.socket.close()
      clearInterval(this.socketTimer)
      window.removeEventListener('orientationchange', this.resize)
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
    background-image: url('~@/assets/index/bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;

    .title {
      width: 318px;
      margin: 70px 0 20px;
    }

    .overlay {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: calc(100% - 20px);
      padding-bottom: 30px;
      background-color: rgba(255, 255, 255, .5);

      .my-swipe {
        width: 100%;
        height: 260px;
        padding: 10px 0 0;

        .movie {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 10px);
          width: calc(100% - 60px);
          height: 188px;
          background-color: #000;
          border-radius: 10px 10px 0 0;
          z-index: 10;
        }

        .content {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: calc(100% - 60px);
          font-size: 14px;
          font-weight: 1000;
          color: #a31420;

          &-info {
            font-size: 12px;
          }
        }
      }

      .prev,
      .next {
        position: absolute;
        top: 50%;
        transform: translateY(calc(-50% - 50px));
        width: 15px;
      }

      .prev {
        left: 10px;
      }

      .next {
        right: 10px;
      }

      .vote {
        padding: 0 10px;
        color: #f2b773;
        font-size: 20px;
        line-height: 30px;
        border-radius: 15px;
        background-color: #a40000;
      }
    }

    // .content {
    //   position: relative;
    //   width: 250px;
    //   height: 288px;
    //   margin: 40px 0 10px;

    //   .man {
    //     position: absolute;
    //     top: 0;
    //     width: 130px;
    //   }

    //   .tang {
    //     position: absolute;
    //     top: 50px;
    //     right: 0;
    //     width: 130px;
    //   }

    //   .hong {
    //     position: absolute;
    //     bottom: 0;
    //     left: 30px;
    //     width: 130px;
    //   }
    // }

    .view {
      width: 300px;
      margin-bottom: 16px;
    }

    .comments {
      width: 85px;
      margin-top: 20px;
    }

    .comments1 {
      padding: 5px 10px;
      color: #f2b773;
      font-size: 18px;
      border-radius: 5px;
      background-color: #a40000;
      margin-top: 20px;
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
      width: calc(100% - 80px);
      height: 83px;
      background: #FFFFFF;
      margin-top: 20px;
    }

    .notice-swipe {
      width: calc(100% - 60px);
      height: 120px;
      background-color: rgba(255, 255, 255, .3);
      line-height: 40px;
      margin-top: 20px;
      overflow: hidden;
      padding: 0 20px;
      border-radius: 10px;
      color: #fff;
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
