import Vue from 'vue'
import Router from 'vue-router'
import { relogin } from '../libs/util'
import { BaseLayout } from '@/layouts'
import Store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
import generate from './generate-router'
import { getOwnInfo } from '_axios/user'

Vue.use(Router)

/**
 * 路由对象
 * route对应的基本结构为:
 * {
 *    path: '',
      name: '',
      redirect: '',
      meta: { 
          title: '',
          icon:'',//图标名称
          showMenu:true, //是否显示菜单
          preRoute:{ //上级路由信息
            name:"",
            meta:{
                title:""
            }
          }
      },
      children: [],
      component:            
 * }
 * 
 */

export const routes = [
  {
    path: '/',
    name: 'home',
    redirect: undefined,
    meta: { title: '首页' },
    children: generate,
    component: BaseLayout //加载方式为按需加载
  },
  {
    path: '/login',
    name: 'login',
    redirect: undefined,
    meta: { title: '首页' },
    children: [],
    component: () => import(/* webpackChunkName: "home" */ '../views/login') //加载方式为按需加载
  }
]

const router = new Router({
  routes
})

/**验证用户菜单权限 */
const validateMenuPermission = function(menus) {
  let arr = menus
    .filter(m => {
      return m.meta && !m.meta.preRoute
    })
    .map(({ name }) => name)
  let { menus: ownMenus = [] } = Store.getters.getOwnAuth || { menus: [] }
  return arr.every(m => ownMenus.includes(m))
}

/**获得用户相关的菜单或权限信息 */
const getUserPermissions = function() {
  let arr = []
  routes
    .find(m => m.path === '/')
    .children.forEach(m => {
      arr.push(m.name)
      if (m.children) {
        Array.prototype.push.apply(arr, m.children.map(n => n.name))
      }
    })

  Store.commit('setOwnAuth', { menus: arr })
}

let isLoadUserInfo = false
/**获得用户信息 */
const getUserInfo = function() {
  if (isLoadUserInfo) return
  const user = Store.getters.getUser
  console.log('user', user)
  if (!user) {
    isLoadUserInfo = true
    console.count('获得用户信息')
    getOwnInfo()
      .then(({ data }) => {
        Store.commit('setUser', data)
      })
      .finally(d => {
        isLoadUserInfo = false
      })
  }
}

//路由守卫钩子，可根据项目需要进行拦截处理
router.beforeEach((to, from, next) => {
  NProgress.start()
  let token = Store.getters.getToken
  let name = to.name
  if (token) {
    getUserPermissions()
    getUserInfo()
    //已登录，并存在token
    if (name === 'login') {
      //进入login页，重定向到home页
      next(false)
      router.replace({ name: 'home' })
      return true
    }
  } else {
    if (name !== 'login') {
      next(false)
      //router.replace({ name: 'login' })
      relogin()
      return
    }
  }
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})
export default router
