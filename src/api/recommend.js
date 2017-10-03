import jsonp from 'common/js/jsonp';
import {commonParams, options} from "./config";

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
  return jsonp(url,data,options)  // 返回一个promise方法
}
