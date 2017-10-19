/*
 * @Author: Smile
 * @Date: 2017-10-02 22:57:41
 * @Last Modified by: Smile
 * @Last Modified time: 2017-10-08 15:00:16
 */
import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import Rank from 'components/rank/rank'
// import Search from 'components/search/search'
// import SingerDetail from 'components/singer-detail/singer-detail';
// import Disc from 'components/disc/disc';
// import TopList from 'components/top-list/top-list';
// import UserCenter from 'components/user-center/user-center';

Vue.use(Router)

/* 异步加载路由组件 start */
const Recommend = ((resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
})
const Singer = ((resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module)
  })
})
const Rank = ((resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module)
  })
})
const Search = ((resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
})
const SingerDetail = ((resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
})
const Disc = ((resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
})
const TopList = ((resolve) => {
  import('components/top-list/top-list').then((module) => {
    resolve(module)
  })
})
const UserCenter = ((resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
})
/* 异步加载路由组件 end */


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
    },
    {
      path: '/user',
      name: 'user',
      component: UserCenter
    }
  ]
})
