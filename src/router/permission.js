import { BlankLayout } from '@/layouts'

const permission = [
  {
    name: 'permission',
    path: '/permission',
    redirect: { name: 'interface' },
    component: BlankLayout,
    meta: { title: '操作权限管理', icon: 'user' },
    children: [
      {
        name: 'interface',
        path: 'interface',
        meta: {
          title: '接口列表',
          icon: 'api',
          keepAlive: true
        },
        component: () => import(/* webpackChunkName: "permission" */ '../views/permission/interface')
      },
      {
        name: 'menu',
        path: 'menu',
        meta: {
          title: '菜单配置',
          icon: 'menu-fold',
          preRoute: undefined,
          keepAlive: true
        },
        component: () => import(/* webpackChunkName: "permission" */ '../views/permission/menu')
      },
      {
        name: 'group',
        path: 'group',
        meta: {
          title: '权限组设置',
          icon: 'project',
          showMenu: true,
          preRoute: undefined,
          keepAlive: true
        },
        component: () => import(/* webpackChunkName: "permission" */ '../views/permission/group')
      }
    ]
  }
]

export default permission
