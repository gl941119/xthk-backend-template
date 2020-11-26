import { BlankLayout } from '@/layouts'

const mockRouter = [
  {
    name: 'permissionMock',
    path: '/permissionMock',
    redirect: { name: 'interfaceMock' },
    component: BlankLayout,
    meta: { title: '操作权限管理-MOCK', icon: 'user' },
    children: [
      {
        name: 'interfaceMock',
        path: 'interfaceMock',
        meta: {
          title: '接口列表-MOCK',
          icon: 'api'
        },
        component: () => import(/* webpackChunkName: "permissionMock" */ '../views/permission/interface')
      },
      {
        name: 'menuMock',
        path: 'menuMock',
        meta: {
          title: '菜单配置-MOCK',
          icon: 'menu-fold',
          preRoute: undefined,
          keepAlive: false
        },
        component: () => import(/* webpackChunkName: "permissionMock" */ '../views/permission/menu')
      },
      {
        name: 'groupMock',
        path: 'groupMock',
        meta: {
          title: '权限组设置-MOCK',
          icon: 'project',
          showMenu: true,
          preRoute: undefined,
          keepAlive: false
        },
        component: () => import(/* webpackChunkName: "permissionMock" */ '../views/permission/group')
      },
      {
        name: 'groupMock.test',
        path: 't',
        meta: {
          title: '组测试-MOCK',
          icon: 'project',
          showMenu: true,
          preRoute: undefined,
          keepAlive: false,
          allowSingleDisplay: false
        },
        redirect: { name: 'groupMock.test' },
        component: BlankLayout,
        children: [
          {
            name: 'groupMock.test.f',
            path: 'f',
            meta: {
              title: '测试MOCK-F',
              icon: 'project',
              showMenu: true,
              preRoute: undefined,
              keepAlive: false
            },
            component: () => import(/* webpackChunkName: "permissionMock" */ '../views/permission/group')
          }
        ]


      }
    ],
    sort: 9999
  }
]
export default mockRouter
