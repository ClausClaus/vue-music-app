<template>
  <div class="search-list search-list-container" v-show="searches.length">
    <ul>
      <li @click.stop.prevent="selectStory(item)" class="search-item" v-for="(item,index) in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop.prevent="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectStory(item) {
        this.$emit('selectStory', item);
      },
      deleteOne(item) {
        this.$emit('deleteOne', item);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list.search-list-container
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
