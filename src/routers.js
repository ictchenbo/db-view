import Vue from 'vue'
import Router from 'vue-router'

import Main from './dbview/index'
import Query from './dbview/query'
import PoolList from './dbview/pool-list'

Vue.use(Router)

const routes = [
  {
    path: '/ ',
    component: Main,
    children: [
      {
        path: '/query',
        component: Query
      },
      {
        path: '/setting/pool-list',
        component: PoolList
      }
    ]
  }
]

//路由相关配置
const router = new Router({
  mode: 'hash',
  base: '/ttms/',
  routes,
  strict: process.env.NODE_ENV !== 'production',// 参考：https://vuex.vuejs.org/zh/guide/strict.html 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {x: 0, y: to.meta.savedPosition || 0}
    }
  }
})


export default router;
