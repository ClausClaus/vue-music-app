<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from "components/m-header/m-header.vue";
import Tab from "components/tab/tab.vue";
export default {
  data() {
    return {}
  },
  components: {
    MHeader,
    Tab
  }
}
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "./common/stylus/variable.styl";
  #app
    color: $color-theme

</style>
