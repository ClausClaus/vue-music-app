/*
 * @Author: Smile
 * @Date: 2017-10-02 22:57:41
 * @Last Modified by: Smile
 * @Last Modified time: 2017-10-08 15:00:16
 */
import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail';
import Disc from 'components/disc/disc.vue';
import TopList from 'components/top-list/top-list.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        path: '/recommend',
      }
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
