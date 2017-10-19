import {commonParams} from './config';
import axios from 'axios';

/**
 * 根据歌曲id请求歌词信息
 * @param mid
 * @returns {Promise.<TResult>|*}
 */
export const getLyric = function (mid) {
  const url = '/api/getLyric';
  const data = Object.assign({}, commonParams, {
    pcachetime: +new Date(),
    songmid: mid,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data,
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}
