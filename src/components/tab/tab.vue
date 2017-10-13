<template>
  <div class="tab tab-container">
    <router-link tag="div" class="tab-item" :to="{path:'/recommend'}">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" :to="{path:'/singer'}">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" :to="{path:'/rank'}">
      <span class="tab-link">排行
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" :to="{path:'/search'}">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
   .tab.tab-container
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>
