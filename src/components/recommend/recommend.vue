<template>
  <div class="recommend recommend-container" ref="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper" v-if="recommends.length">
        <slider>
          <div v-for="(item,index) in recommends" :key="index">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">
          热门歌曲推荐
        </h1>
        <ul>

        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider.vue';
  import {getRecommend,getDiscList} from "api/recommend.js";
  import {ERR_OK} from "api/config.js";

  export default {
    data() {
      return {
        recommends: [],
        discList:[]
      }
    },
    created() {
      // 获取轮播图数据
      this._getRecommend();
      // 获取歌单列表数据
      this._getDiscList();
    },
    components: {
      Slider
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList(){
        getDiscList().then((res)=>{
          if(res.code === ERR_OK){
            this.discList = res.data.list;
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend, .recommend-container
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
