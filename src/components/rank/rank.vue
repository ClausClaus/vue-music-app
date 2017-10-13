<template>
  <div class="rank rank-container" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="(item,index) in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{ index + 1 }}</span>
              <span>{{ song.songname }}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex';
  import Scroll from 'base/scroll/scroll.vue';
  import Loading from 'base/loading/loading.vue';
  import {getRankList} from 'api/rank.js';
  import {ERR_OK} from 'api/config.js';
  import {playListMixin} from 'common/js/mixin.js';
  export default {
    mixins: [playListMixin],
    data() {
      return {
        topList: []
      }
    },
    created() {
      this._getRankList()
    },
    methods: {
      selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item);
      },
      handlePlayList(playList) {
        const bottom = playList.length ? '60px' : '';
        this.$refs.rank.style.bottom = bottom;
        this.$refs.toplist.refresh();
      },
      _getRankList() {
        getRankList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList;
          }
        })
      },
      ...mapMutations({
        setTopList: 'TOP_LIST'
      })
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

  .rank.rank-container
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
