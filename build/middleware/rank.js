var express = require('express');
var axios = require('axios');
var apiRoutes = express.Router();

// 请求排行榜数据
apiRoutes.get('/getRankList',
  function (req, res) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    }).then((response) => {
      res.json(response.data);
    }).catch((err) => {
      console.log(err + ' 歌曲排行榜请求失败');
    })
  }
)
// 请求排行榜歌曲详情数据
apiRoutes.get('/getRankDetail',
  function (req, res) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    }).then((response) => {
      res.json(response.data);
    }).catch((err) => {
      console.log(err + ' 歌曲排行榜详情请求失败');
    })
  }
)
module.exports = apiRoutes;
