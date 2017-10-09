var express = require('express');
var axios = require('axios');
var apiRoutes = express.Router();
// 获取推荐页面轮播图数据
apiRoutes.get('/getCommendSlider', function (req, res) {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com',
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err + '请求轮播图数据失败');
  })
});
// 获取推荐页面热门歌曲推荐列表
apiRoutes.get('/getCommendList', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios.get(url, {
    // headers是修改此次请求的请求头数据
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com',
    },
    params: req.query
  }).then((response) => {
    res.json(response.data) // 将请求的数据返回给浏览器端，前端才可以获取到
  }).catch((err) => {
    console.log(err + '请求歌单列表失败');
  })
});


module.exports = apiRoutes;