import {commonParams} from './config';
import axios from 'axios';

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

