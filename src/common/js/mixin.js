import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode} from 'common/js/config.js';
import {shuffle} from 'common/js/util.js';
import Song from "./song";

/**
 *  歌曲列表混入对象，自动计算列表高度，实现scroll的重绘 (使用在有列表组件的页面当中)
 * @type {{computed: {}, mounted: (function()), activated: (function()), watch: {playList: (function(*=))}, methods: {handlePlayList: (function())}}}
 */
export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
// 当Vue实例的domReady的时候会触发的钩子
  mounted() {
    this.handlePlayList(this.playList);
  },
// 被keep-alive包含的组件切换的时候出发的钩子
  activated() {
    this.handlePlayList(this.playList);
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal);
    }
  },
  methods: {
    handlePlayList() {
      throw new Error(' handlePlayList方法是必须定义的 ');
    }
  }
}
/**
 *  player.vue 与 playlist.vue页面之间的方法与vuex共享mixin
 * @type {{computed: {iconMode: (function())}, methods: {changeMode: (function()), resetCurrentIndex: (function(*))}}}
 */
export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' :
        this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    // 切换我的喜欢按钮
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavotiteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    // 当前歌曲是否是我喜欢的歌曲，动态添加类名
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    // 判断当前歌曲是否已经存在于我的喜欢歌曲列表中
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id;
      })
      return index > -1;
    },
    // 修改播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
        this.setPlayList(list);
        this.resetCurrentIndex(list);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    // 重置当前播放歌曲的下标
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      })
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavotiteList'
    ])
  }
}
export const searchMixin = {
  data() {
    return {query: '', refreshDelay: 100}
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    blurInput() {
      this.$refs.searchbox.blur();
    },
    onQueryChange(query) {
      this.query = query;
    },
    addQuery(query) {
      this.$refs.searchbox.setQuery(query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
