import Vue from 'vue'
import Router from 'vue-router'
import { relogin } from '../libs/util'
import { BaseLayout } from '@/layouts'
import Store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
import generate from './generate-router'
import { getOwnInfo } from '_axios/xthy-sso/user'
import { getAuthUserMenusList } from '_axios/permission'

Vue.use(Router)

/**路由白名单 */
const whiteList = ['noapp', 'login', 'demo']
const isDev = process.env.NODE_ENV === 'development'
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
          allowSingleDisplay:true, //允许单一子菜单合并显示(当前子菜只存在一个时，父级菜单直接显示为子菜单)
          preRoute:{ //上级路由信息
            name:"",
            meta:{
                title:""
            }
          },
          keepAlive:undefined // 是否保存当前页面状态.默认未定义
      },
      children: [],
      component:            
 * }
 *  preRoute:可以为数组用来模拟 多级路由的层级
 *  preRoute:[
 *    { //上级路由信息
            name:"1级",
            meta:{
                title:""
            }
      },
      { //上级路由信息
            name:"2级",
            meta:{
                title:""
            }
      },
      { //上级路由信息
            name:"3级",
            meta:{
                title:""
            }
      },
 *  ]
 */

export const routes = [
  {
    path: '/',
    name: 'home',
    redirect: undefined,
    meta: {
      title: '首页'
    },
    children: generate,
    component: BaseLayout //加载方式为按需加载
  },
  {
    path: '/login',
    name: 'login',
    redirect: undefined,
    meta: {
      title: '首页'
    },
    children: [],
    component: () => import(/* webpackChunkName: "home" */ '../views/login') //加载方式为按需加载
  },
  {
    path: '/noapp',
    name: 'noapp',
    meta: {
      title: '心田花园--无可用应用'
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/error/noapp')
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "login" */ '../views/error/404')
  },
  {
    path: '/demo',
    name: 'demo',
    meta: {
      title: '心田花园--DEMO'
    },
    component: resolve => require(['@/views/demo'], resolve)
  }
]

const router = new Router({
  routes
})

/**获得用户相关的菜单或权限信息 */
const getUserPermissions = async function () {
  let arr = []

  if (isDev) {
    const menus = (routes.find(m => m.path === '/') || { children: [] }).children
    const fn = (items) => {
      items.forEach(m => {
        arr.push(m.name)
        if (m.children) {
          // Array.prototype.push.apply(arr, m.children.map(n => n.name))
          fn(m.children)
        }
      })

    }
    fn(menus)
  }
  let r
  try {
    r = await getAuthUserMenusList()
      .then(({ data: { menus, permissions } = { menus: [], permissions: [] } }) => {
        isDev && (menus = arr)
        return {
          menus,
          permissions
        }
      })
  } catch ({ message }) {
    Vue.prototype.$message.error(message)
    if (isDev) {
      r = {
        menus: arr,
        permissions: []
      }
    } else {
      router.replace({
        name: 'noapp'
      })
    }
  }
  r && Store.commit('setOwnAuth', r)
  return r
}

/**获得用户信息 */
const getUserInfo = async function () {
  let user = Store.getters.getUser
  if (!user) {
    try {
      user = await getOwnInfo()
        .then(({ data }) => {
          Store.commit('setUser', data)
          return data
        })
    } catch (err) {
      // 处理相关错误
      console.warn(err)
    }
  }
  return user
}

//路由守卫钩子，可根据项目需要进行拦截处理
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  let token = Store.getters.getToken
  let ownAuth = Store.getters.getOwnAuth
  let name = to.name

  //在白名单中的路由名称，直接进入页面
  if (whiteList.includes(name)) {
    next()
    return
  }

  if (token) {
    getUserInfo()
    if (!ownAuth) {
      ownAuth = await getUserPermissions()
    }
    if (!ownAuth) {
      next(false)
      router.replace({
        name: 'noapp'
      })
      return
    }
    //已登录，并存在token
    if (name === 'login') {
      //进入login页，重定向到home页
      next(false)
      router.replace({
        name: 'home'
      })
      return
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
