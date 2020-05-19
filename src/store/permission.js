import { routes } from '@/router'

/** 过滤掉不呈现到菜单栏的信息*/
const filterNotShowMenu = function(infos, myMenus) {
  if (!infos) return null
  //let { menus: currentMenus = [] } = this.ownAuth || { menus: [] }
  let currentMenus = myMenus
  infos.forEach(n => {
    n.meta && n.meta.preRoute === null && (n.meta.preRoute = undefined)
    let {
      name: menuName,
      meta: { showMenu = true, preRoute: { name = '' } = { name: '' }, keepAlive = false } = {
        showMenu: true,
        preRoute: { name: '' },
        keepAlive: false
      }
    } = n
    if (showMenu && name === '' && currentMenus.includes(menuName)) {
      n.hidden = false
    } else {
      n.hidden = true
    }
    if (n.children) {
      filterNotShowMenu(n.children, myMenus)
      n.showChildren = n.children.filter(m => {
        m.parent = n.name
        return m.hidden !== true
      })
    }
  })

  //return data
}

export default {
  state: {
    ownMenus: []
  },
  getters: {
    getOwnMenus: state => state.menus
  },
  mutations: {
    setMenus(state, value) {
      state.ownMenus = Array.isArray(value) ? value : []
    }
  },
  actions: {
    /**生成菜单项 */
    generateMenus(state, data) {
      const myMenus = data || state.getters.getMenus
      return new Promise(resolve => {
        const info = routes.find(m => m.path === '/')
        const children = JSON.parse(JSON.stringify((info && info.children) || [])).filter(m => myMenus.includes(m.name))
        filterNotShowMenu(children, myMenus || [])
        state.commit('setMenus', children || [])
        resolve(children)
      })
    }
  }
}
