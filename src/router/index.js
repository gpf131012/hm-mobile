import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login'
Vue.use(VueRouter)
// 配置路由表
const routes = [
  {
    path: '/login',
    component: login
  }
]

const router = new VueRouter({
  routes
})

export default router
