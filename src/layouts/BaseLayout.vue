<template>
  <a-layout :class="'base-layout'">
    <!--左侧菜单栏-->
    <sider-menu
      :menus="menus"
      :defaultOpenKeys="openKeys"
      :defaultSelectedKeys="selectedMenuKeys"
      :collapsible="collapsible"
      @menuSelect="handleMenuSelect"
    ></sider-menu>
    <a-layout-content :class="baseContentClass">
      <head-tabs
        v-if="allowShowGlobalHeadTabs"
        :items.sync="tabs"
        :defaultKey="defaultTabKey"
        @tabSelect="handleTabSelect"
        @tabRemove="handleTabRemove"
      ></head-tabs>
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
  data() {
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
    baseContentClass() {
      return {
        'base-content': true
      }
    }
  },
  async created() {
    //成生菜单数据
    const data = await this.generateMenus()
    this.menus = data
    this._initInfo()
    console.log(this.menus)
  },
  mounted() { },
  methods: {
    /**初始化相关数据 */
    _initInfo() {
      this._init_menu_default_select()
    },
    /**设置菜单默认选中值 */
    _init_menu_default_select() {
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
                const r = funFind(m.showChildren)
                return !!r
              }
              return false
            })
            return item
          }
          funFind(this.menus)
        }

        if (menu) {
          this.selectedMenuKeys = [menu.name]
          let p = menu.parentMenu
          while (p) {
            this.openKeys.push(p.name)
            p = p.parentMenu
          }
          // menu.parent && this.openKeys.push(menu.parent)
          if (this.$route.name !== menu.name && !preRoute) this.$router.push({ name: menu.name })
          this.addTab({ name: menu.name, title: menu.meta.title })
        } else {
          this.$router.replace({ name: 'noapp' })
        }
      }
    },
    /**添加tab项 */
    addTab({ name, title }) {
      this.tabs.push({ key: name, title, name })
      this.defaultTabKey = name
    },
    /**tab项被选中 */
    handleTabSelect(item) {
      this.selectedMenuKeys = [item.name]
      this.defaultTabKey = item.name
      this.$route.name !== item.name && this.$router.push({ name: item.name })
    },
    /**tab项被移出 */
    handleTabRemove(item) {
      console.log(item)
    },
    /**菜单项被选中 */
    handleMenuSelect(menu) {
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
</style>
