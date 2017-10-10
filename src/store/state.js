import {playMode} from 'common/js/config.js';

const state = {
  singer: {}, // 歌手信息{ id:xxx,avatar:xxx,name:xxx }
  playing: false, // 播放器的播放与暂停
  fullScreen: false, // 是否全屏
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表，基于 播放列表 做了排序
  mode: playMode.sequence, // 播放模式,默认是顺序播放
  currentIndex: -1, // 当前播放的是哪首歌
}
export default state;
