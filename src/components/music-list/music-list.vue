<template>
  <div class="music-list music-list-container">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length > 0" ref="playWrapper">
        <div class="play" @click.stop.prevent="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter">
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs"
            ref="list"
            class="list"
            :listenScroll="listenScroll"
            :probeType="probeType"
            @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex';
  import {playListMixin} from 'common/js/mixin.js';
  import SongList from 'base/song-list/song-list.vue';
  import Scroll from 'base/scroll/scroll.vue';
  import Loading from 'base/loading/loading.vue';
  import {prefixStyle} from 'common/js/dom.js';

  const RESERVED_HEIGHT = 40;
  const transform = prefixStyle('transform');
  const backdrop = prefixStyle('backdrop-filter');
  export default {
    mixins: [playListMixin],
    data() {
      return {
        scrollY: 0
      }
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true
    },
    methods: {
      //
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.list.$el.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      // 随机播放按钮事件
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      back() {
        this.$router.back();
      },
      scroll(position) {
        this.scrollY = position.y;
      },
      // 子组件传递过来的事件
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        });
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight;
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
      this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.minTranslateY, newY);
        let zIndex = 0;
        let scale = 1;
        let blur = 0;
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
        // newY除以图片的高度只要有值，就是多出来的图片高度了，scale + 1,1代表的是图片本身的高度，加上percent之后就是多出来的高度。
        const percent = Math.abs(newY / this.imageHeight);
        if (newY > 0) {
//          console.log(percent);
          scale = 1 + percent;
          zIndex = 10;
        } else {
          blur = Math.min(20 * percent, 20);
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
        if (newY < this.minTranslateY) {
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
          this.$refs.playWrapper.style.display = 'none';
        } else {
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
          this.$refs.playWrapper.style.display = '';
        }
        this.$refs.bgImage.style.zIndex = zIndex;
        this.$refs.bgImage.style[transform] = `scale(${scale})`;
      }
    },
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list.music-list-container
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
    /* background-color: rgba(7, 17, 27, 0.4)*/
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      /*overflow: hidden*/
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
