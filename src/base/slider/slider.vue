<template>
  <div class="slider slider-container" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <!-- 小圆点 -->
      <span :key="index" class="dot" v-for="(item,index) in dots" :class="{'active':currentPageIndex === index}">
        {{item}}
      </span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import { addClass } from "common/js/dom.js";

export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0,
      children: []
    }
  },
  props: {
    // 开启轮播
    loop: { type: Boolean, default: true },
    // 自动轮播
    autoplay: { type: Boolean, default: true },
    // 轮播间隔时间
    interval: { type: Number, default: 4000 }
  },
  mounted() {
    setTimeout(() => {
      // 设置轮播图片的宽度
      this._setSliderWidth();
      // 初始化小圆点
      this._initDots();
      // 初始化轮播图
      this._initSlider();
      // 自动轮播
      if (this.autoplay) {
        this._play();
      }
    }, 20) // 浏览器的刷新是17毫秒一次，在这里初始化的时候是异步环境
    window.addEventListener('resize', () => {
      if (!this.slider) { return }
      this._setSliderWidth(true);
      this.slider.refresh();
    })
  },
  methods: {
    /**
     * @param isResize [boolean]
     * @description 初次计算图片宽度的时候需要增加两张图片的宽度，视口改变时重新计算就不用再添加宽度了
     */
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;
      let width = width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (var i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, 'slider-item');
        child.style.width = sliderWidth + 'px';
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px';
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        // click: true,
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
      })
      // 绑定滚动结束的事件
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX;// 获取当前轮播的图片下标
        if (this.loop) {
          pageIndex -= 1;
        }
        this.currentPageIndex = pageIndex;
        if (this.autoplay) {
          clearTimeout(this.timer);
          this._play();
        }
      })
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1;
      if (this.loop) {
        pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400);
      }, this.interval)
    }
  },
  destroyed() {
    clearTimeout(this.timer);
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider.slider-container
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
