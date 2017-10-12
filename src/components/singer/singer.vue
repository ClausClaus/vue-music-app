<template>
  <div class="singer singer-container" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="listview"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from "api/singer.js";
  import {ERR_OK} from "api/config.js";
  import {playListMixin} from 'common/js/mixin.js';
  import {mapMutations} from 'vuex'; // vuex提供的对mutation的映射
  import Singer from "common/js/singer.js";
  import ListView from 'base/listview/listview.vue';

  const HOT_NAME = '热门';
  const HOT_SINGER_LENGTH = 10;
  export default {
    mixins: [playListMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList();

    },
    methods: {
      //
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
//        console.log(this.$refs.singer);
        this.$refs.listview.refresh();
      },
      // 点击歌手名称时触发编程式导航跳转，传递歌手id作为参数
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer);
      },
      /**
       * 请求歌手列表数据
       */
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normallizeSinger(res.data.list);
          }
        })
      },
      /**
       * 将请求回来的歌手数据格式化
       * 1.0 以二维数组的格式重新排列歌手数据，添加热门歌手类目，简单按照前十个歌手作为热门
       * 2.0 判断歌手列表数据中是否含有对应字母开头的属性，没有的话则添加此属性，并初始化为一个对象
       * 3.0 遍历歌手数据列表，为对应字母开头的属性添加对应字母名称开头的歌手信息。
       * tips: 有些数据格式是一致的，这里使用初始化一个类实例来添加数据
       */
      _normallizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LENGTH) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            }))
          }
          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }))
        });
        // 为了得到有序列表,需要对map做进一步处理
        let hot = [];
        let ret = [];
        for (let key in map) {
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          }
          else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        /*
        若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
        若 a 等于 b，则返回 0。
        若 a 大于 b，则返回一个大于 0 的值。
        */
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        })
        return hot.concat(ret);
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer, .singer-container
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
