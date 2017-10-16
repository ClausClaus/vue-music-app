import storage from 'good-storage';

const SEARCH_KEY = '__search__'; // 搜索列表key,代表搜索历史
const SEARCH_MAX_LENGTH = 15;// 最大的保存搜索storage,超过15条删除旧的storage

/**
 *  格式化搜索历史
 * @param arr [ 需要格式化的数组 ]
 * @param val [ 需要存取的值 ]
 * @param compare [ 比较函数 ]
 * @param maxlen [ 最大存储的长度 ]
 */
function insertArray(arr, val, compare, maxlen) {
  const index = arr.findIndex(compare);
  // 1.0 如果数组中已经有这条数据，直接返回，不做存储
  if (index === 0) {
    return;
  }
  // 2.0 如果这条数据不是在第一的位置，那么先删除掉这条数据
  if (index > 0) {
    arr.splice(index, 1);
  }
  // 3.0 然后再插入到最前面
  arr.unshift(val);
  // 4.0 如果存储的数据超过最大的存储量，那么从数组的后面删除这条数据，保持在15条
  if (maxlen && arr.length > maxlen) {
    arr.pop();
  }
}

/**
 *  查找要删除的项并做删除操作
 * @param arr
 * @param compare
 */
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

/**
 * 保存本地缓存数据
 * @param query
 * @returns {*}
 */
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(searches, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LENGTH);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

/**
 * 获取本地缓存数据
 * @returns {*}
 */
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

/**
 * 删除本地缓存数据（单个删除）
 * @param query
 * @returns {*}
 */
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query;
  })
  storage.set(SEARCH_KEY, searches);
  return searches
}

/**
 * 删除本地缓存数据 （全部删除）
 * @returns {Array}
 */
export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}
