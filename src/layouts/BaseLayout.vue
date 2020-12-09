<template>
  <a-layout :class="'base-layout'">
    <!--左侧菜单栏-->
    <sider-menu :menus="menus" :defaultOpenKeys="openKeys" :defaultSelectedKeys="selectedMenuKeys" :collapsible="collapsible" @menuSelect="handleMenuSelect"></sider-menu>
    <a-layout-content :class="baseContentClass">
      <div v-if="allowShowGlobalHeadTabs" class="tab-wrap">
        <head-tabs :items.sync="tabs" :defaultKey="defaultTabKey" @tabSelect="handleTabSelect" @tabRemove="handleTabRemove"></head-tabs>      
      </div>
      <div class="info-content">
        <keep-alive>
          <router-view v-if="this.$route.meta && this.$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!this.$route.meta || !this.$route.meta.keepAlive"></router-view>
      </div>  
    </a-layout-content>
  </a-layout>
</template>

<script>
import SiderMenu from '_c/menus/sidermenu'
import HeadTabs from '_c/head/head-tabs'
import { mapActions } from 'vuex'
import { keepAliveInfos, allowShowGlobalHeadTabs } from '@/config/common'

export default {
  name: 'BaseLayout',
  components: {
    SiderMenu,
    HeadTabs
  },
  data () {
    return {
      collapsible: true,
      keepAliveInfos,
      allowShowGlobalHeadTabs,
      selectedMenuKeys: [],
      openKeys: [],
      defaultTabKey: '1',
      ...mapActions(['generateMenus']),
      tabs: [],
      menus: []   
    }
  },
  computed: {
    baseContentClass () {
      return {
        'base-content': true
      }
    }
  },
  async created () {
    //成生菜单数据
    const data = await this.generateMenus()
    this.menus = data
    this._initInfo()
    console.log(this.menus)
  },
  mounted () { },
  methods: {
    /**初始化相关数据 */
    _initInfo () {
      this._init_menu_default_select()
    },
    /** 
     * 查找相应的路由
     * @param {string} name - 要查找的路由名称
     * @param {array} rotuers - 所有的路由信息
     */
    _findRoute (name, routers = this.menus) {
      let result
      const flat = (menus) => {
        for (let i = 0, len = menus.length; i < len; i++) {
          const n = menus[i]
          if (n.name === name) {
            result = n
            break
          }
          if (n.children && n.children.length) {
            flat(n.children)
          }
          if (result) break
        }
      }
      flat(routers)
      return result

    },
    /**设置菜单默认选中值 */
    _init_menu_default_select () {

      //设置菜单项的默认选中值
      if (this.menus && this.menus.length) {
        let {
          name,
          path,
          meta: { preRoute }
        } = this.$route
        let menu
        //如果是自定义三级以上的菜单路由，取所属的第二级路由
        if (preRoute) {
          if (Object.isObject(preRoute)) {
            name = preRoute.name
          } else {
            if (Array.isArray(preRoute) && preRoute.length) {
              name = preRoute[0].name
            }
          }
        }

        if (path === '/') {
          menu = this.menus.find(m => !m.hidden)
          const funFirst = items => {
            const item = items[0]
            return item.showChildren ? funFirst(item.showChildren) : item
          }

          if (menu && menu.showChildren) {
            menu = funFirst(menu.showChildren)
          }
        } else {
          const funFind = items => {

            const item = items.find(m => {
              if (m.name === name) {
                menu = m
                return true
              } else if (m.showChildren) {
                let r = funFind(m.showChildren) //先从可见的子级菜单中查找
                if (!r) { // 未找到从不可见菜单中查找
                  r = funFind(m.children)
                }
                return !!r
              }
              return false
            })
            return item
          }
          funFind(this.menus)
        }

        if (menu) {
          let currentMenu = menu
          if (menu.hidden) { // 如果当前为隐藏菜单,preRoute
            if (menu?.meta?.preRoute) {
              const { name, parentMenu } = menu?.meta?.preRoute
              menu = this._findRoute(name) || parentMenu
            } else {
              this.$router.replace({ name: 'noapp' })
              return
            }

          }

          let p = menu.parentMenu
          while (p) {
            this.openKeys.push(p.name)
            p = p.parentMenu
          }
          this.selectedMenuKeys = [menu.name]
          !this.openKeys.length && (this.openKeys.push(menu.name))
          // menu.parent && this.openKeys.push(menu.parent)
          if (this.$route.name !== currentMenu.name && !preRoute) this.$router.push({ name: currentMenu.name })
          this.addTab({ name: menu.name, title: menu.meta.title })
        } else {
          this.$router.replace({ name: 'noapp' })
        }
      }
    },
    /**添加tab项 */
    addTab ({ name, title }) {
      this.tabs.push({ key: name, title, name })
      this.defaultTabKey = name
    },
    /**tab项被选中 */
    handleTabSelect (item) {
      this.selectedMenuKeys = [item.name]
      this.defaultTabKey = item.name
      this.$route.name !== item.name && this.$router.push({ name: item.name })
    },
    /**tab项被移出 */
    handleTabRemove (item) {
      console.log(item)
    },
    /**菜单项被选中 */
    handleMenuSelect (menu) {
      const {
        name,
        meta: { title = '' }
      } = menu

      if (!this.tabs.find(m => m.key === name)) {
        this.addTab({ name, title })
      } else {
        this.defaultTabKey = name
      }
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="scss">
.base-layout {
  height: $p100;
  .side {
    min-height: $p100;
  }
  .base-content {
    display: flex;
    flex-direction: column;
    .tab-wrap {
      display: flex;
      flex-direction: row;
      flex: 0 0 auto;
      height: 40px;
      border-bottom: 1px solid #e8e8e8;
      background-color: #ffffff;
      .collapsed {
        border: 0 none;
        box-shadow: none;
      }
      > :first-child {
        flex: 1;
      }    
    }
    .info-content {
      flex: 1 auto;
      overflow: auto;
      background-color: #ffffff;
      display: flex;

      > .router-container {
        height: auto !important;
      }
    }
  }
}

.change-role-modal {
  .ant-modal {
    height: 188px;
  }

  .ant-modal-body {
    .inner-wrap {
      text-align: center;
      > :first-child {
        display: inline-block;
        flex: 0 auto;
      }
      > :not(:first-child) {
        flex: 1;
      }
    }
  }
}
</style>
