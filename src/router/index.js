import Vue from 'vue'
import Router from 'vue-router'
import { relogin } from '@/libs/util'

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
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: null,
            meta: { title: '首页' },
            children: [],
            component: () => import(/* webpackChunkName: "home" */ '../views/home') //加载方式为按需加载
        },
        {
            path: '/login',
            name: 'login',
            redirect: null,
            meta: { title: '登录页' },
            children: [],
            component: () => import(/* webpackChunkName: "home" */ '../views/login') //加载方式为按需加载
        }
    ]
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

//路由守卫钩子，可根据项目需要进行拦截处理
router.beforeEach((to, from, next) => {
    let token = Store.getters.getToken
    let name = to.name
    if (token) {
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

export default router
