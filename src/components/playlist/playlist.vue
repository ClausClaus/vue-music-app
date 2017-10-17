<template>
  <transition name="list-fade">
    <div class="playlist playlist-container" v-show="showFlag" @click.stop="hide">
      <div class="list-wrapper" @click.stop>
        <!-- 歌曲列表头部 start -->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click.stop.prevent="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click.stop.prevent="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <!-- 歌曲列表头部 end -->
        <!-- 歌曲列表内容 start -->
        <scroll
          ref="listContent"
          class="list-content"
          :data="sequenceList">
          <transition-group ref="list" name="list" tag="ul">
            <li :key="item.id" ref="listItem" @click.stop="selectSong(item,index)" class="item"
                v-for="(item,index) in sequenceList">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop.prevent="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <!-- 歌曲列表内容 end -->
        <!-- 添加新歌曲 start -->
        <div class="list-operate">
          <div class="add" @click.stop.prevent="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <!-- 添加新歌曲 end -->
        <div class="list-close" @click.stop="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex';
  import {playerMixin} from 'common/js/mixin.js';
  import {playMode} from 'common/js/config.js';
  import Scroll from 'base/scroll/scroll.vue';
  import Confirm from 'base/confirm/confirm.vue';
  import AddSong from 'components/add-song/add-song.vue';

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
      }
    },
    methods: {
      // 添加歌曲到队列
      addSong() {
        this.$refs.addSong.show();
      },
      // 点击清空按钮时
      confirmClear() {
        this.deleteSongList();
        this.hide();
      },
      //清空所有歌曲
      showConfirm() {
        this.$refs.confirm.show();
      },
      // 删除歌曲
      deleteOne(item) {
        this.deleteSong(item);
        if (!this.playList.length) {
          this.hide();
        }
      },
      // 让当前正在播放的歌曲自动滚动到顶部位置
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id;
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
      },
      // 点击切换歌曲
      selectSong(item, index) {
        if (this.mode === playMode.random) {
          index = this.playList.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index);
        this.setPlayingState(true);
      },
      // 当前的播放歌曲
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        } else {
          return ''
        }
      },
      show() {
        this.showFlag = true;
        setTimeout(() => {
          this.$refs.listContent.refresh();
          this.scrollToCurrent(this.currentSong);
        }, 20);
      },
      hide() {
        this.showFlag = false;
      },
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return;
        }
        this.scrollToCurrent(newSong);
      }
    },
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '順序播放' :
          this.mode === playMode.random ? '隨機播放' : '單曲循環'
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist.playlist-container
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          opacity: 1
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
            opacity: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
