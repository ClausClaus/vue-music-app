<template>
  <div class="search-box search-box-container">
    <i class="icon-search"></i>
    <input ref="input" class="box" v-model="query" :placeholder="placeholder"/>
    <i @click.stop.prevent="clear" class="icon-dismiss" v-show="query"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util.js';

  export default {
    data() {
      return {
        query: ''
      }
    },
    created() {
      /**
       * 使用节流函数
       */
      this.$watch('query', debounce((newQuery) => {

        this.$emit('query', newQuery)
      }, 300));
    },
    methods: {
      clear() {
        this.query = '';
      },
      setQuery(query) {
        this.query = query;
      },
      blur() {
        this.$refs.input.blur();
      }
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box.search-box-container
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      caret-color: $color-text
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
