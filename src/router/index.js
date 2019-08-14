import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: null,
            meta: { title: '首页' },
            children: [],
            component: () =>
                import(/* webpackChunkName: "home" */ '../views/home') //加载方式为按需加载
        }
    ]
})

//路由守卫钩子，可根据项目需要进行拦截处理
router.beforeEach((to, from, next) => {
    next()
})

export default router
