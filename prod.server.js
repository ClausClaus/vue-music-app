var express = require('express');
var config = require('./config/index.js');


/* 自定义代理请求 start */
var recommend = require('./build/middleware/recommend');
var singer = require('./build/middleware/singer');
var song = require('./build/middleware/song');
var songAlbum = require('./build/middleware/songalbum');
var rank = require('./build/middleware/rank');
var search = require('./build/middleware/search');
var app = express();
app.use('/api', singer);
app.use('/api', recommend);
app.use('/api', song);
app.use('/api', songAlbum);
app.use('/api', rank);
app.use('/api', search);
/* 自定义代理请求 end */


/*请求静态资源 start*/
app.use(express.static('./dist'));
/*请求静态资源 end*/

/* 定义端口 start */
var port = process.env.PORT || config.build.port;
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err + '本地服务器启动错误');
    return;
  }
  console.log('Listening at http://localhost:' + port + '\n')
});

/* 定义端口 end */
