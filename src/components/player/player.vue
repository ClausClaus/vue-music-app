<template>
  <div class="player player-container" v-show="playList.length > 0">
    <transition name="normal"
                @enter="normalEnter"
                @after-enter="normalAfterEnter"
                @leave="normalLeave"
                @after-leave="normalAfterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!-- 一张大的模糊背景图 start -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!-- 一张大的模糊背景图 end -->
        <!-- 顶部的返回按钮与标题 start -->
        <div class="top">
          <div class="back" @click.stop.prevent="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 顶部的返回按钮与标题 end -->
        <!-- 中间旋转的图片 start -->
        <div class="middle"
             @touchstart.stop.prevent="middleTouchStart"
             @touchmove.stop.prevent="middleTouchMove"
             @touchend.stop.prevent="middleTouchEnd"
        >
          <!-- 歌曲大图片 start -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌曲大图片 end -->
          <!-- 歌词列表 start -->
          <scroll :data="currentLyric && currentLyric.lines" class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" ref="lyricLine" v-for="(line,index) in currentLyric.lines"
                   :class="{'current':currentLineNum === index}">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
          <!-- 歌词列表 end -->
        </div>
        <!-- 中间旋转的图片 end -->
        <!-- 大播放器底部的按钮 start -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent="percent"
                @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click.stop.prevent="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i @click.stop.prevent="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i @click.stop.prevent="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i @click.stop.prevent="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
        <!-- 大播放器底部的按钮 end -->
      </div>
    </transition>
    <transition name="mini">
      <!-- 播放器收起来后固定在底部的小播放器 start -->
      <div class="mini-player" v-show="!fullScreen" @click.stop.prevent="open">
        <div class="icon">
          <img :class="cdClass" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius"
                           :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop.prevent="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
      <!-- 播放器收起来后固定在底部的小播放器 end -->
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex';
  import Lyric from 'lyric-parser'; // 歌词解析包
  import animations from 'create-keyframe-animation';
  import {prefixStyle} from 'common/js/dom.js';
  import {playMode} from 'common/js/config.js';
  import {shuffle} from 'common/js/util.js';
  import ProgressBar from 'base/progress-bar/progress-bar.vue';
  import ProgressCircle from 'base/progress-circle/progress-circle.vue';
  import Scroll from 'base/scroll/scroll.vue';


  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');
  export default {
    data() {
      return {
        songReady: false, // 标志位，标识歌曲的 切换/请求 是否已经完成。（节流阀）
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    created() {
      this.touch = {};
    },
    methods: {
      middleTouchStart(e) {
        this.touch.initiated = true;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return;
        }
        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return;
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
        this.$refs.middleL.style[transitionDuration] = 0;
      },
      middleTouchEnd(e) {
        let offsetWidth;
        let opacity = 0;
        // 从 右向左 滑动，超过百分之10就滑动
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'lyric';
          } else {
            offsetWidth = 0;
            opacity = 1;
          }
        }
        // 从 左向右 滑动，超过百分之10就滑动
        else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0;
            opacity = 1;
            this.currentShow = 'cd';
          } else {
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        const time = 300;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
        this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      },
      // 歌词数据解析
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLineNum = 0;
        })
      },
      // 设置歌词当前行高亮效果
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum;
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      // 修改播放模式
      changeMode() {
        const mode = (this.mode + 1) % 3;
        this.setPlayMode(mode);
        let list = null;
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList);
          this.setPlayList(list);
          this.resetCurrentIndex(list);
        } else {
          list = this.sequenceList;
        }
        this.resetCurrentIndex(list);
        this.setPlayList(list);
      },
      //
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id;
        })
        this.setCurrentIndex(index);
      },
      // 进度条滑动事件，子组件监听并发射，父组件响应事件处理
      onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent;
        this.$refs.audio.currentTime = this.currentSong.duration * percent;
        if (!this.playing) {
          this.togglePlaying();
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000);
        }
      },
      // 歌曲的当前播放时间
      updateTime(e) {
        this.currentTime = e.target.currentTime;
      },
      // 歌曲播放完毕自动跳到下一首
      end() {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },
      // 单曲循环模式
      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if (this.currentLyric) {
          this.currentLyric.seek(0);
        }
      },
      // 歌曲已经切换完毕
      ready() {
        this.songReady = true;
      },
      // 切换歌曲时发生错误，不做处理的话其他功能会不能使用
      error() {
        this.songReady = true;
      },
      // 上一曲
      prev() {
        if (!this.songReady) {
          return;
        }
        if (this.playList.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex - 1;
          if (index === -1) {
            index = this.playList.length - 1;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlaying();
          }
        }
        this.songReady = false;
      },
      // 下一曲
      next() {
        if (!this.songReady) {
          return;
        }
        if (this.playList.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex + 1;
          if (index === this.playList.length) {
            index = 0;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlaying();
          }
        }
        this.songReady = false;
      },
      // 切换播放与暂停
      togglePlaying() {
        if (!this.songReady) {
          return;
        }
        this.setPlayIng(!this.playing);
        if (this.currentLyric) {
          this.currentLyric.togglePlay();
        }
      },
      // 关闭大播放器
      back() {
        this.setFullScreen(false);
      },
      // 打开大播放器
      open() {
        this.setFullScreen(true);
      },
      /* vue动画钩子函数 start */
      normalEnter(el, done) {
        const {x, y, scale} = this._getPosAndScale();
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0}) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      normalAfterEnter() {
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },
      normalLeave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s';
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },
      normalAfterLeave() {
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style.transform = '';
      },
      format(interval) {
        interval = interval | 0;
//        console.log(interval);
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);
        return `${minute}:${second}`;
      },
      _pad(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      // 动画函数辅助函数
      _getPosAndScale() {
        // 小图片
        const targetWidth = 40; // 小图片宽度
        const paddingBottom = 30; // 小图片中心点距离底部的距离Y轴
        const paddingLeft = 40; // 小图片中心点距离左侧的距离X轴
        // 大图片
        const paddingTop = 80; // 大图片的顶部距离视口顶部的距离
        const width = window.innerWidth * 0.8;// 大图片的宽度
        const scale = targetWidth / width; // 得到大图片宽度是小图片宽度的多少倍
        const x = -(window.innerWidth / 2 - paddingLeft); // 小图片中心点距离大图片中心点的距离。要移动的距离X轴
        const y = window.innerHeight - (width / 2 + paddingTop + paddingBottom); // 小图片中心点距离大图片中心点的距离，要移动的距离Y轴
        return {
          x, y, scale
        }
      },
      /* vue动画钩子函数 end */
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayIng: 'SET_PLAYING_STAET',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      })
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return;
        }
        if (this.currentLyric) {
          this.currentLyric.stop();
        }
        setTimeout(() => {
          this.$refs.audio.play();
          this.getLyric();
        }, 1000)
      },
      playing(newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio;
          newPlaying ? audio.play() : audio.pause();
        })
      }
    },
    computed: {
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' :
          this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      cdClass() {
        return this.playing ? 'play' : 'play pause';
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      disableClass() {
        return this.songReady ? '' : 'disable';
      },

      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player.player-container
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              transition: color .2s linear
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
