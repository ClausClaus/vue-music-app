# vue-music-app

> 音乐播放器

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8088
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

##开发目录结构
```bash
  │  App.vue  
  │  main.js  入口文件
  │
  ├─api  接口请求目录
  │      config.js  所有请求的公共参数
  │      rank.js  排行页面
  │      recommend.js  推荐页面
  │      search.js  搜索页面
  │      singer.js  歌手页面
  │      song.js  歌词信息请求
  │      songalbum.js  歌曲专辑信息请求
  │
  ├─base  基础组件目录
  │  ├─confirm  确认框
  │  │      confirm.vue
  │  │
  │  ├─listview  快速导航栏(A-z)
  │  │      listview.vue
  │  │
  │  ├─loading  loading状态
  │  │      loading.gif
  │  │      loading.vue
  │  │
  │  ├─no-result  无搜索结果
  │  │  │  no-result.vue
  │  │  └─img
  │  │
  │  ├─progress-bar  歌曲进度条 （横线）
  │  │      progress-bar.vue
  │  │
  │  ├─progress-circle  歌曲进度条（圆形）
  │  │      progress-circle.vue
  │  │
  │  ├─scroll  滚动组件
  │  │      scroll.vue
  │  │
  │  ├─search-box  搜索框
  │  │      search-box.vue
  │  │
  │  ├─search-list  搜索结果显示列表
  │  │      search-list.vue
  │  │
  │  ├─slider  轮播图
  │  │      slider.vue
  │  │
  │  ├─song-list  歌曲列表
  │  │      song-list.vue
  │  │
  │  ├─switches  tab栏切换
  │  │      switches.vue
  │  │
  │  └─top-tip  顶部提示信息
  │          top-tip.vue
  │
  ├─common   公共文件目录
  │  ├─fonts  字体图标
  │  │
  │  ├─image  图片
  │  │
  │  ├─js  通用js文件
  │  │      cache.js   本地缓存数据
  │  │      config.js  播放模式配置
  │  │      dom.js     dom操作相关js
  │  │      jsonp.js   jsonp请求公共函数
  │  │      mixin.js   组件间相同的方法或属性
  │  │      singer.js  歌手信息通用类{id:xxx,avatar:xxx,name:xxx}
  │  │      song.js   歌曲信息通用类{ id, mid, singer, name, album, duration, image, url，歌词解析函数 }
  │  │      util.js   通用的js文件（节流函数，数组顺序打乱）
  │  │
  │  └─stylus
  │          base.styl  基本样式
  │          icon.styl  图标字体样式
  │          index.styl 样式入口文件
  │          mixin.styl 样式混入函数
  │          reset.styl 样式初始化
  │          variable.styl  项目常用颜色
  │
  ├─components    业务组件目录
  │  ├─add-song   添加歌曲
  │  │      add-song.vue
  │  │
  │  ├─disc       推荐页面中（热门歌曲推荐列表）
  │  │      disc.vue
  │  │
  │  ├─m-header   主页头部信息
  │  │      m-header.vue
  │  │
  │  ├─music-list  歌曲列表
  │  │      music-list.vue
  │  │
  │  ├─player       播放器内核
  │  │      player.vue
  │  │
  │  ├─playlist     播放列表
  │  │      playlist.vue
  │  │
  │  ├─rank         排行榜页面
  │  │      rank.vue
  │  │
  │  ├─recommend    推荐页面
  │  │      recommend.vue
  │  │
  │  ├─search       搜索页面
  │  │      search.vue
  │  │
  │  ├─singer       歌手列表页面
  │  │      singer.vue
  │  │
  │  ├─singer-detail 歌手详情页
  │  │      singer-detail.vue
  │  │
  │  ├─suggest       搜索结果列表
  │  │      suggest.vue
  │  │
  │  ├─tab           tab栏切换
  │  │      tab.vue
  │  │
  │  ├─top-list      顶部提示信息
  │  │      top-list.vue
  │  │
  │  └─user-center    用户中心页面
  │          user-center.vue
  │
  ├─router     路由器配置
  │      index.js
  │
  └─store     Vuex配置文件
          actions.js
          getters.js
          index.js
          mutation-type.js
          mutations.js
          state.js

```
