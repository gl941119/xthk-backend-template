import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import permission from './permission'

import { local, cookie } from '@/libs/storage.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    permission
  },
  state: {
    /** 显示用户头像 */
    showAvatar: false,
    /** 是否允许收缩菜单栏 */
    allowCollapsed: true
  },
  getters: {
    showAvatar: state => state.showAvatar,
    allowCollapsed: state => state.allowCollapsed
  },
  mutations: {
    /** 显示用户头像 */
    showAvatar(state, value) {
      state.showAvatar = value
    },
    /** 是否允许收缩菜单栏 */
    allowCollapsed(state, value) {
      state.allowCollapsed = value
    }
  },
  actions: {}
})
