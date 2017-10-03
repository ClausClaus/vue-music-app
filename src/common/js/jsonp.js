import originjsonp from 'jsonp';

/**
 *
 * @param url
 * @param data  传给服务端的数据
 * @param option
 */
export default function jsonp(url, data, option) {
  // 判断url是否有问号，indexOf('?')小于0证明没有问号
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originjsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 将传递的到后端的数据拼接到url后面
 * @param data
 * @returns {string}
 */
function param(data) {
  let url = '';
  for (let key in data) {
    let value = data[key] !== undefined ? data[key] : '';
    // 这里的&在调用函数时会被去掉
    url += `&${key} = ${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '';
}
