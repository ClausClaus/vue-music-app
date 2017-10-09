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
export default {
  created() {
    // console.log(this.singer);
    this._getDetail();
  },
  methods: {
    _getDetail() {
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.list);
        }
      })
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