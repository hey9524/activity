<!--
 * @Author: Hey
 * @Date: 2021-02-01 12:35:39
 * @LastEditTime: 2021-02-03 17:19:50
 * @LastEditors: Hey
 * @Description:
 * @FilePath: \vue-h5-template\src\views\home\activity.vue
-->
<!-- home -->
<template>
  <div class="activity">
    <img src="@/assets/activitytitle.png" alt="" class="title">

    <div class="call">请选择为哪个节目打call</div>

    <div class="overlay">
      <van-swipe class="my-swipe" ref="swipe" @change="onChange" :touchable="false" :show-indicators='false'>
        <van-swipe-item v-for="(item, i) in movieList" :key="item.id" lazy-render>

          <!-- <video ref='video' class="movie" playsinline webkit-playsinline x5-playsinline autobuffer='autobuffer'
            x5-video-player-type='true' controls="controls" :id="'video' + item.id">
            <source v-if="activeId == i" src='http://192.168.0.114:8080/redio/getVido' type="video/mp4" />
            <source v-if="activeId == i" :src='item.videoUrl' type="video/mp4" />
          </video> -->
          <div class="movie">
            <videoCom :src="item.videoUrl" />
          </div>

          <div class="content">
            <div>当前节目: <span class="content-info">{{item.videoName}}</span></div>
            <div>当前票数: <span class="content-info">{{item.ticket}}</span></div>
          </div>
        </van-swipe-item>
      </van-swipe>

      <img @click.prevent="changeSwipe()" src="@/assets/prev.png" alt="" class="prev">
      <img @click="changeSwipe(true)" src="@/assets/next.png" alt="" class="next">
    </div>

    <div @click="vote" class="btn">我要为节目助力投票</div>
  </div>
</template>

<script>
  import {
    getVideoList,
    videoVote
  } from '@/api'
  import videoCom from '@/components/videoCom'
  export default {
    components: {
      videoCom
    },
    data() {
      return {
        routeId: 1,
        movieList: [],
        activeId: 0,
        queryArray: ['满', '堂', '红'],
        options: {
          preload: true,
          useH5Prism: true,
          playsinline: true,
          controlBarVisibility: 'click',
          definition: 'FD,LD,SD',
          defaultDefinition: 'FD'
        }
      }
    },
    mounted() {
      var evt = "onorientationchange" in window ? "orientationchange" : "resize";

      window.addEventListener(evt, this.resize);

      this.routeId = this.$route.params.id || 1
      this.init()
    },
    methods: {
      resize() {
        this.$refs.swipe.resize()
      },
      // TODO..
      async init() {
        const {
          data
        } = await getVideoList({
          videoType: this.queryArray[this.routeId]
        })
        this.movieList = data
      },
      onChange(index) {
        this.activeId = index
      },
      changeSwipe(add) {
        // const video = document.getElementById(`video${this.movieList[this.activeId].id}`)
        // video.pause()
        this.$refs.swipe[add ? 'next' : 'prev']()
      },
      // TODO...
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
      }
    }
  }

</script>
<style lang="scss" scoped>
  .activity {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-image: url('~@/assets/login/backgroundIMG.jpg');
    background-size: 100vw 100vh;
    background-repeat: no-repeat;

    .title {
      width: 318px;
    }

    .call {
      font-size: 19px;
      font-weight: 1000;
      color: #efc49e;
      margin: 10px 0 20px;
    }

    .overlay {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100vw;
      background-color: rgba(255, 255, 255, .5);

      .my-swipe {
        width: 100vw;
        height: 260px;
        padding: 10px 0;

        .movie {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 10px);
          width: calc(100vw - 60px);
          height: 188px;
          background-color: #999;
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
          width: 255px;
          font-size: 14px;
          font-weight: 1000;
          color: #a31420;
          margin-top: 20px;

          &-info {
            font-size: 12px;
          }
        }
      }

      .prev,
      .next {
        position: absolute;
        top: 50%;
        transform: translateY(calc(-50% - 20px));
        width: 15px;
      }

      .prev {
        left: 10px;
      }

      .next {
        right: 10px;
      }
    }

    .btn {
      font-size: 20px;
      font-weight: bold;
      color: #fbdcb2;
      margin-top: 20px;
    }
  }

</style>
