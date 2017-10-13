<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list.vue';
  import {mapGetters} from 'vuex';
  import {getMusicAlbum} from 'api/songalbum.js';
  import {ERR_OK} from 'api/config.js';
  import {createSong} from "common/js/song";

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getMusicAlbum();
    },
    methods: {
      _getMusicAlbum() {
        if (!this.disc.dissid) {
          this.$router.push({path: '/recommend'});
          return;
        }
        let dissid = this.disc.dissid;
        getMusicAlbum(dissid)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.songs = this._normalLizeSong(res.cdlist[0].songlist);
              console.log(this.songs);
            }
          })
      },
      _normalLizeSong(list) {
        let ret = [];
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData));
          }
        })
        return ret;
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },

      ...mapGetters([
        'disc'
      ])
    },
    components: {
      MusicList,
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
