<template>
  <transition name="slide">
    <div class="singer-detail">
      我是详情页
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import { getSingerDetail } from 'api/singer.js';
import { ERR_OK } from 'api/config.js';
import { createSong } from 'common/js/song.js';
export default {
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getDetail();
  },
  methods: {
    _getDetail() {
      // 数据是通过点击歌手实现路由跳转并传递过来的，如果在当前的详情页刷新页面是拿不到数据的
      // 如果在当前页刷新的话让路由跳转回到歌手列表。
      if (!this.singer.id) {
        this.$router.push({ path: '/singer' })
        return;
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data);
          this.songs = this._normalLizeList(res.data.list);
          console.dir(this.songs);
        }
      })
    },
    _normalLizeList(list) {
      let ret = [];
      list.forEach((item) => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      });
      return ret;
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .singer-detail
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 100
    background-color $color-background
</style>