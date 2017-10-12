import {mapGetters} from 'vuex';

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
