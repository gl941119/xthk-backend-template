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
        <keep-alive :include="keepAliveInfos.value">
          <router-view></router-view>
        </keep-alive>
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
  },
  mounted() {},
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
        //如果是三级以上的菜单路由，取所属的第二级路由
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
          if (menu && menu.showChildren) {
            menu = menu.showChildren[0]
          }
        } else {
          this.menus.find(m => {
            if (m.name === name) {
              menu = m
              return true
            }
            menu = m.showChildren.find(n => n.name === name)
            return !!menu
          })
        }
        if (menu) {
          this.selectedMenuKeys = [menu.name]
          menu.parent && this.openKeys.push(menu.parent)
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
      this.$router.push({ name: item.name })
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
