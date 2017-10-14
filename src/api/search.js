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

export function search(query, page, zhida) {
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
    perpage: 20,
    n: 20,
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

