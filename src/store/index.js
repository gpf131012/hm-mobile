import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录用户，一个对象包含token信息
    user: getItem('user')
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      setItem('user', state.user)
      // 为防止刷新丢失state中的user状态，需要把它放入本地存储
    }
  },
  actions: {
  },
  modules: {
  }
})
