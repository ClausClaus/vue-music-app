<template>
  <scroll
    :pullup="pullup"
    :data="result"
    ref="suggest"
    class="suggest suggest-container"
    @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result">
        <div class="icon">
          <i :class="getItemClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll.vue';
  import Loading from 'base/loading/loading.vue';
  import {search} from 'api/search.js';
  import {ERR_OK} from 'api/config.js';
  import {createSong} from 'common/js/song';

  const TYPE_SINEGR = 'singer';
  const PER_PAGE = 20;
  export default {
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true,
      }
    },
    props: {
      query: {type: String, default: ''},
      showSinger: {type: Boolean, default: true}
    },
    methods: {
      search() {
        this.page = 1;
        this.hasMore = true;
        this.$refs.suggest.scrollTo(0, 0);
        search(this.query, this.page, this.showSinger, PER_PAGE)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.result = this._genResult(res.data);
              this.checkMore(res.data);
            }
          })
      },
      /**
       * 加载更多
       */
      searchMore() {
        if (!this.hasMore) {
          return;
        }
        this.page++;
        search(this.query, this.page, this.showSinger, PER_PAGE)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.result = this.result.concat(this._genResult(res.data));
              this.checkMore(res.data);
            }
          })
      },
      /* 判断滚动加载时数据是否已经加载完毕。
       * song.curnum 表示每次请求来的数量
       * song.curpage 表示当前请求到第几页
       * song.totalnum 表示总的歌曲数量
       * */
      checkMore(data) {
        const song = data.song;
        if (!song.list.length || (song.curnum + song.curpage * PER_PAGE) >= song.totalnum) {
          this.hasMore = false
        }
      },
      /**
       *  根据类型来判断是歌手还是歌曲。
       * @param item
       * @returns {*}
       */
      getItemClass(item) {
        if (item.type === TYPE_SINEGR) {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
      },
      /**
       * 根据类型来判断歌曲信息的显示格式
       * @param item
       * @returns {*}
       */
      getDisplayName(item) {
        if (item.type === TYPE_SINEGR) {
          return item.singername
        } else {
          return `${item.name} - ${item.singer}`
        }
      },
      _genResult(data) {
        let ret = [];
        // 条件成立的话证明搜索的是歌手。
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINEGR}}) // 使用扩展运算符将多个对象合并后添加到数组当中
        }
        if (data.song) {
          ret = ret.concat(this._normalLizeList(data.song.list));
        }
        return ret;
      },
      _normalLizeList(list) {
        let ret = [];
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData));
          }
        })
        return ret;
      }
    },
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest.suggest-container
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
