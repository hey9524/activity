<!--
 * @Author: Hey
 * @Date: 2021-02-01 12:35:39
 * @LastEditTime: 2021-02-01 16:30:16
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
      <van-swipe class="my-swipe" ref="swipe" @change="onChange" :touchable="false">
        <van-swipe-item v-for="item in movieList" :key="item.id">
          <video class="movie" src="@/assets/c483e086785aed9a794ad651beb3057f.mp4" controls="controls"></video>
          <div class="content">
            <div>当前节目: <span class="content-info">{{item.title}}</span></div>
            <div>当前票数: <span class="content-info">{{item.ticket}}</span></div>
          </div>
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">
            <img @click="changeSwipe()" src="@/assets/prev.png" alt="" class="prev">
            <img @click="changeSwipe(true)" src="@/assets/next.png" alt="" class="next">
          </div>
        </template>
      </van-swipe>
    </div>
    <div @click="vote" class="btn">我要为节目助力投票</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routeId: 1,
      movieList: [{
        inner: 1,
        title: '肖申克的救赎',
        ticket: 1,
        id: 1
      },
      {
        inner: 2,
        title: 1,
        ticket: 1,
        id: 2
      },
      {
        inner: 3,
        title: 1,
        ticket: 1,
        id: 3
      }
      ],
      activeId: 0
    }
  },
  mounted() {
    this.routeId = this.$route.params.id || 1
    this.init()
  },
  methods: {
    // TODO..
    async init() {},
    onChange(index) {
      this.activeId = index
    },
    changeSwipe(add) {
      this.$refs.swipe[add ? 'next' : 'prev']()
    },
    // TODO...
    vote() {
      console.log(this.activeId)
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
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      background-color: rgba(255, 255, 255, .5);

      .my-swipe {
        position: relative;
        width: 375px;
        height: 280px;
        padding: 20px 0 10px;

        .movie {
          width: 255px;
          height: 200px;
        }

        .content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 255px;
          font-size: 16px;
          font-weight: 1000;
          color: #a31420;
          margin-top: 20px;

          &-info {
            font-size: 14px;
          }
        }

        .custom-indicator {
          position: absolute;
          top: 50%;
          transform: translateY(calc(-50% - 20px));
          display: flex;
          justify-content: space-between;
          width: 375px;
          padding: 0 10px;

          .prev,
          .next {
            width: 30px;
          }
        }
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
<style lang="scss">
  .van-swipe-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 375px !important;
    height: 250px !important;
  }

</style>
