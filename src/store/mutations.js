import * as types from './mutation-type';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STAET](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAYLIST](state, list) {
    state.playList = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode;
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc;
  },
  [types.TOP_LIST](state, toplist) {
    state.topList = toplist;
  },
  [types.SET_SEARCH_HISSTORY](state, hisstory) {
    state.searchHisStory = hisstory;
  }
}
export default mutations;
