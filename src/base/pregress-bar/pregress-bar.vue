<template>
  <div class="progress-bar progress-bar-container" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom.js';

  const PROGRESS_BTN_WIDTH = 16;
  const transform = prefixStyle('transform');
  export default {
    data() {
      return {}
    },
    props: {
      // 进度条，当前进度
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      // 在touch事件的不同阶段要共享的数据
      this.touch = {};
    },
    methods: {
      progressClick(e){
        this._offset(e.offsetX);
        this._triggerPercent();
      },
      progressTouchStart(e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.startY = e.touches[0].pageY;
        // 当前行进中的进度条宽度
        this.touch.left = this.$refs.progress.clientWidth;
//        console.log(this.touch);
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return;
        }
        const deltaX = e.touches[0].pageX - this.touch.startX;
        // 手机滑动的距离 +
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX));
        this._offset(offsetWidth);
      },
      progressTouchEnd(e) {
        this.touch.initiated = false;
        this._triggerPercent();
      },
      _triggerPercent() {
        // 1.0 歌曲播放进度条的宽度
        const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH;
        // 2.0 获取运动中的进度
        const percent = this.$refs.progress.clientWidth / barWidth;
        // 3.0 将当前进度发送给父组件让歌曲响应到同等的进度
        this.$emit('percentChange', percent);
      },
      _offset(offsetWidth) {
        // 3.0 设置进度条 ->进度
        this.$refs.progress.style.width = `${offsetWidth}px`;
        // 4.0 设置按钮 ->进度
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          // 1.0 歌曲播放进度条的宽度
          const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH;
          // 2.0 当前的播放进度 * 进度条宽度 = 应该偏移的进度
          const offsetWidth = newPercent * barWidth;
//          // 3.0 设置进度条 ->进度
//          this.$refs.progress.style.width = `${offsetWidth}px`;
//          // 4.0 设置按钮 ->进度
//          this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
          this._offset(offsetWidth);
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar, .progress-bar-container
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
