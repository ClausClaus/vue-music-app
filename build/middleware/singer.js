var express = require('express');
var axios = require('axios');
var apiRoutes = express.Router();
// 获取歌手页面歌手列表
apiRoutes.get('/getSingerList', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com',
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err + '请求歌手列表失败');
  })
});
// 获取歌手页面歌手详情数据
apiRoutes.get('/getSingerDetail', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com',
      host: 'c.y.qq.com',
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err + '请求歌手详情失败');
  })
})
module.exports = apiRoutes;