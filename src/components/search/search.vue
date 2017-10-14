<template>
  <div class="search search-container">
    <div class="search-box-wrapper">
      <search-box ref="searchbox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="(item,index) in hotKey" @click.stop.prevent="addQuery(item.k)"
                :class="{'current':index === 0}">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest @listScroll="blurInput" :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box.vue';
  import {getHotKey} from 'api/search.js';
  import {ERR_OK} from 'api/config.js';
  import Suggest from 'components/suggest/suggest.vue';

  export default {
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    created() {
      this._getHotKey();
    },
    methods: {
      blurInput(){
        this.$refs.searchbox.blur();
      },
      onQueryChange(query) {
        this.query = query;
      },
      addQuery(query) {
        this.$refs.searchbox.setQuery(query);
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10);
          }
        })
      }
    },
    components: {
      SearchBox,
      Suggest
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search.search-container
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
            &.current
              color: $color-theme
              border: 1px solid $color-theme
              box-sizing: border-box
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
