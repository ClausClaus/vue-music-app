import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VuelazyLoad from 'vue-lazyload';
fastclick.attach(document.body); // 解决移动端点击延迟300毫秒
import 'common/stylus/index.styl'; // 引入公共的样式文件
Vue.config.productionTip = false
Vue.use(VuelazyLoad, {
  loading: require('common/image/default.png')
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
