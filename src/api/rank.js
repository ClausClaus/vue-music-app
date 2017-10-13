import {commonParams} from "./config";
import axios from 'axios';

export const getRankList = function () {
  const url = 'api/getRankList/';
  const data = Object.assign({}, commonParams, {
    uin: 0,
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
