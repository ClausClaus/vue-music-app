var express = require('express');
var axios = require('axios');
var apiRoutes = express.Router();

// 请求歌曲专辑数据
apiRoutes.get('/getMusicAlbum',
  function (req, res) {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    }).then((response) => {
      res.json(response.data);
    }).catch((err) => {
      console.log(err + '请求歌曲专辑数据失败');
    })
  }
)
module.exports = apiRoutes;
