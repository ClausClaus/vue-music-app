import * as types from './mutation-type';
import {playMode} from 'common/js/config';
import {shuffle} from "common/js/util";
import {saveSearch, deleteSearch, clearSearch} from 'common/js/cache';

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
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
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
  commit(types.SET_PLAYING_STATE, true);
}
/**
 *  搜索页面搜索歌曲时的点击触发action
 *
 * @param commit
 * @param state
 * @param song
 */
export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  /*-------------给playList歌曲列表插入歌曲并做 添加/删除 操作-------------*/
  // 1.0 记录当前歌曲
  let currentSong = playList[currentIndex];
  // 2.0 查找插入的歌曲在不在当前的歌曲列表中，返回其索引
  let findPlayIndex = findIndex(playList, song);
  // 3.0 因为是插入歌曲。所以索引要加1
  currentIndex++;
  playList.splice(currentIndex, 0, song);
  /* --------先插入，后面再判断做删除操作-------- */
  // 4.0 大于-1证明已经有这首歌曲了，否则就没有这首歌曲
  if (findPlayIndex > -1) {
    // 5.0 如果当前的序号大于列表中的序号
    if (currentIndex > findPlayIndex) {
      playList.splice(findPlayIndex, 1);
      currentIndex--;
    } else {
      // 因为是在currentIndex的后面增加了一位，所以这里做删除的话也是在找到序号的后一位删除
      playList.splice(findPlayIndex + 1, 1);
    }
  }
  /*-------------给sequence歌曲列表插入歌曲并做 添加/删除 操作-------------*/
  // 1.0 记录当前歌曲
  let currentSequenceIndex = findIndex(sequenceList, currentSong) + 1;
  // 2.0 查找要插入的歌曲在不在当前的歌曲列表中，返回其索引
  let findSequenceIndex = findIndex(sequenceList, song);
  // 3.0 添加这首歌曲
  sequenceList.splice(currentSequenceIndex, 0, song);
  // 4.0 存在这首歌曲的话
  if (findSequenceIndex > -1) {
    // 4.1 判断在当前歌曲的前面还是后面，并做删除操作
    if (currentSequenceIndex > findSequenceIndex) {
      sequenceList.splice(findSequenceIndex, 1);
      // 4.2 在找到的插入歌曲的索引位置加1的地方删除这首歌曲
    } else {
      sequenceList.splice(findSequenceIndex + 1, 1);
    }
  }
  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}
/**
 *  保存搜索历史
 * @param commit
 * @param query
 */
export const saveSearchHistory = function ({commit}, query) {
  // 将搜索列表重新格式化之后再commit到mutations中
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
}
/**
 *  删除单个搜索历史
 * @param commit
 * @param query
 */
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}
/**
 *  删除所有搜索历史
 * @param commit
 */
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
}
