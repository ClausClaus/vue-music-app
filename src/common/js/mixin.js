import {mapGetters, mapMutations} from 'vuex';
import {playMode} from 'common/js/config.js';
import {shuffle} from 'common/js/util.js';

/**
 *  歌曲列表混入对象，自动计算列表高度，实现scroll的重绘
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
      'mode'
    ])
  },
  methods: {
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
    })
  }
}
