<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
export default {
  data() {
    return {

    }
  },
  props: {
    probeType: {
      type: Number,
      default: 3
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
    },
    /** 代理better-scroll实例的方法 */
    // 开启better-scroll
    enable() {
      this.scroll && this.scroll.enable();
    },
    // 禁用better-scroll
    disable() {
      this.scroll && this.scroll.disable();
    },
    // 重新初始化better-scroll
    refresh() {
      this.scroll && this.scroll.refresh();
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.scroll.refresh();
      }, 20)
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    })
  }
}
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  
</style>
