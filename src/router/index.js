import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login'
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
import Article from '@/views/article'

Vue.use(VueRouter)
// 配置路由表
const routes = [
  {
    path: '/login',
    component: login
  },
  {
    path: '/',
    component: Tabbar,
    children: [
      {
        path: '',
        component: Home
      }

    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/search/:q',
    component: SearchResult
  },
  {
    name: 'article',
    path: '/article/:articleId',
    component: Article,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
