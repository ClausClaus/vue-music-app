var express = require('express');
var axios = require('axios');
var apiRoutes = express.Router();
// 请求歌曲数据
apiRoutes.get('/getLyric',
  function (req, res) {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    }).then((response) => {
      var ret = response.data;
      if (typeof ret === 'string') {
        var reg = /^\w+\(({[^()]+})\)$/;
        var matchs = ret.match(reg);
        if (matchs) {
          ret = JSON.parse(matchs[1]);
        }
      }
      res.json(ret);
    }).catch((err) => {
      console.log(err + '请求歌词列表失败');
    })
  });
module.exports = apiRoutes;
