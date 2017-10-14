import {commonParams, options} from './config';
import axios from 'axios';
import jsonp from 'common/js/jsonp';

export function getHotKey() {
  const url = '/api/getHotKey/';
  const data = Object.assign({}, commonParams, {
    format: 'json',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })
  return axios.get(url, {
    params: data,
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}

/**
 *  搜索框搜索请求
 * @param query 搜索的字段
 * @param page 返回的第几页
 * @param zhida 请求的是歌手还是歌曲
 * @param perpage 每一页返回的个数
 * @returns {Promise.<TResult>}
 */
export function search(query, page, zhida, perpage) {
  const url = '/api/getSearch/';
  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    _: +new Date()
  })
  return axios.get(url, {
    params: data,
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}

