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
    format: 'json',// 定义返回的格式，不再是jsonp
    g_tk: 1664029744
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}
// 请求歌手详情页数据
export function getSingerDetail(singermId) {
  const url = 'api/getSingerDetail';
  const data = Object.assign({}, commonParams, {
    g_tk: 108992016,
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singermId,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1,
    format: 'json'// 定义返回的格式，不再是jsonp
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}
