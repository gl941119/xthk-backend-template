import { local, cookie, session } from '@/libs/storage.js'
// import { isDomainAddress, getMasterDomain } from '@/libs/util.js'

export default {
  state: {
    token: window.parent !== window.self ? cookie.get('token') : local.get('token') /* 用户token */,
    user: null /* 用户信息 */,
    apps: null /* 用户可用APP */,
    cities: null /**相关城市信息 */,
    /**当前用户拥有的菜单权限 */
    ownAuth: null,
    basic: {} /* 基础设置 */
  },
  getters: {
    getToken: state => state.token,
    getUser: state => state.user,
    getApps: state => state.apps,
    getCities: state => state.cities,
    /**获得当前用户拥有的菜单与操作权限.{menus:[],permissions:[]} */
    getOwnAuth: state => state.ownAuth,
    /**获得当用用户拥有的菜单 */
    getMenus: state => {
      let { menus = [] } = state.ownAuth || {}
      return menus
    },
    /**获得当用用户拥有的接口操作权限 */
    getPermissions: state => {
      let { permissions = [] } = state.ownAuth || {}
      return permissions
    }
    //menus, permissions
  },
  mutations: {
    setToken(state, value) {
      state.token = value || ''
      if (!value) {
        local.remove('token')
        //cookie.remove('token', isDomainAddress() ? { domain: getMasterDomain() } : undefined)
      } else {
        local.set('token', value)
        //cookie.set('token', value, isDomainAddress() ? { domain: getMasterDomain() } : undefined)
      }
    },
    setUser(state, value) {
      state.user = value
    },
    setApps(state, value) {
      state.apps = value
    },
    setCities(state, value) {
      state.cities = value
    },
    /**设置当前用户拥有的菜单权限 */
    setOwnAuth(state, value) {
      state.ownAuth = value
    }
  },
  actions: {
    login(state, { apps, user, token, cities }) {
      state.commit('setApps', apps)
      state.commit('setUser', user)
      state.commit('setToken', token)
      state.commit('setCities', cities)
    },
    logout(state) {
      state.commit('setApps')
      state.commit('setUser')
      state.commit('setToken')
      state.commit('setCities')
      state.commit('setOwnAuth')
    }
  }
}
