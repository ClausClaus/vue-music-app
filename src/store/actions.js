import * as types from './mutation-type';
import {playMode} from 'common/js/config';
import {shuffle} from "common/js/util";

/**
 *  比较歌曲列表中索引与当前正在播放歌曲的索引，得到随机播放列表中的索引
 * @param list
 * @param song
 */
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

/**
 * 点击歌曲播放列表操作
 * @param commit
 * @param list
 * @param index
 */
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index])
  }else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STAET, true);
}
/**
 * 随机歌曲播放列表操作
 * @param commit
 * @param list
 */
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STAET, true);
}
