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
  state: {},
  getters: {},
  mutations: {},
  actions: {}
})
