const permission = [
    {
        name: 'permission',
        path: '/permission',
        redirect: { name: 'interface' },
        component: () => import(/* webpackChunkName: "permission" */ '../components/router-container'),
        meta: { title: '操作权限管理', icon: 'user' },
        children: [
            {
                name: 'interface',
                path: 'interface',
                meta: {
                    title: '接口列表',
                    icon: 'api'
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission/interface')
            },
            {
                name: 'menu',
                path: 'menu',
                meta: {
                    title: '菜单配置',
                    icon: 'menu-fold'
                    // showMenu: false,
                    // //前置路由。当前路由与前置路由在配置上为同一层级，但由于需要体现在面包屑上为父子层级，因此可配置出前置路由
                    // preRoute: {
                    //     name: 'role-manager',
                    //     meta: {
                    //         title: '角色管理'
                    //     }
                    // }
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission/menu')
            },
            {
                name: 'group',
                path: 'group',
                meta: {
                    title: '权限组设置',
                    icon: 'project'
                    // showMenu: false,
                    // //前置路由。当前路由与前置路由在配置上为同一层级，但由于需要体现在面包屑上为父子层级，因此可配置出前置路由
                    // preRoute: {
                    //     name: 'role-manager',
                    //     meta: {
                    //         title: '角色管理'
                    //     }
                    // }
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission/group')
            }
        ]
    }
]
export default permission
