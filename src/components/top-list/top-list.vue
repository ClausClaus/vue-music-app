<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import MusicList from 'components/music-list/music-list.vue';
  import {getRankDetail} from 'api/rank.js';
  import {ERR_OK} from 'api/config.js';
  import {createSong} from "common/js/song.js";

  export default {
    data() {
      return {
        songs: [],
        rank: true,
      }
    },
    created() {
      this._getRankDetail();
    },
    methods: {
      _getRankDetail() {
        if (!this.topList.id) {
          this.$router.push({
            path: '/rank'
          })
          return;
        }
        getRankDetail(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalLizeSong(res.songlist);
          }
        })
      },
      _normalLizeSong(list) {
        let ret = [];
        list.forEach((item) => {
          const musicData = item.data;
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        })
        return ret;
      }
    },
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.topList.topTitle;
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image;
        }
        return '';
      },
      ...mapGetters([
        'topList'
      ])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
