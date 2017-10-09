<template>
  <transition name="slide">
      <music-list :title="title" :songs="songs" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import {getSingerDetail} from 'api/singer.js';
  import {ERR_OK} from 'api/config.js';
  import {createSong} from 'common/js/song.js';
  import MusicList from 'components/music-list/music-list.vue';

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
          this.$router.push({path: '/singer'})
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalLizeList(res.data.list);
          }
        })
      },
      _normalLizeList(list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        });
        return ret;
      }
    },
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
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
</style>
