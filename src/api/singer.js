import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';
export function getSingerList() {
  const url = 'api/getSingerList';
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    format:'json',// 定义返回的格式，不再是jsonp
    g_tk: 1664029744
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}