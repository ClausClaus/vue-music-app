<template>
  <div ref="suggest" class="suggest suggest-container">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result">
        <div class="icon">
          <i :class="getItemClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search.js';
  import {ERR_OK} from 'api/config.js';
  import {filterSinger} from 'common/js/song';

  const TYPE_SINEGR = 'singer';
  export default {
    data() {
      return {
        page: 1,
        result: []
      }
    },
    props: {
      query: {type: String, default: ''},
      showSinger: {type: Boolean, default: true}
    },
    methods: {
      search() {
        search(this.query, this.page, this.showSinger)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.result = this._genResult(res.data);
//              console.log(this.result);
            }
          })
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
          return `${item.songname}-${filterSinger(item.singer)}`
        }
      },
      _genResult(data) {
        let ret = [];
        // 条件成立的话证明搜索的是歌手。
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINEGR}}) // 使用扩展运算符将多个对象合并后添加到数组当中
        }
        if (data.song) {
          ret = ret.concat(data.song.list);
        }
        return ret;
      }
    },
    watch: {
      query() {
        this.search()
      }
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
