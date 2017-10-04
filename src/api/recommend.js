import jsonp from 'common/js/jsonp';
import { commonParams, options } from "./config";
import axios from 'axios';
/**
 * 请求推荐页面的轮播图数据
 */
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({}, commonParams, {
    // 这里是这个请求外加的参数，commonParams是公共参数
    platform: 'h5', // 请求来源于h5平台
    uin: 0, // qq号
    needNewCode: 1
  })
  return jsonp(url, data, options)  // 返回一个promise方法
}
/**
 * 请求推荐页面的歌单列表
 *  这个请求使用ajax请求定义好的代理接口，不使用jsonp。
 */
export function getDiscList() {
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg';
  const url = 'api/getDiscList';
  const data = Object.assign({}, commonParams, {
    rnd: Math.random(),
    hostUin: 0,
    loginUin:0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format:'json',// 定义返回的格式，不再是jsonp
    g_tk:108992016  
  })
  // return jsonp(url, data, options);
  return axios.get(url, {
    params: data
  }).then((res) => {
    // 最终返回的也是一个promise方法
    return Promise.resolve(res.data);
  })
}
