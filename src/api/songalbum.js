import {commonParams} from "./config";
import axios from 'axios';

/**
 * 获取歌曲专辑封面图片等信息请求
 * @param dissid
 * @returns {Promise.<TResult>|*}
 */
export const getMusicAlbum = function (dissid) {
  const url = '/api/getMusicAlbum';
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: dissid,
    format: 'json',
    loginUin: 0,
    hostUin: 0,
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
