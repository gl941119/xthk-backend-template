<template>
  <a-layout-sider
    v-model="myCollapsed"
    class="side"
    :class="collapsedClass"
    :width="width"
    :theme="theme"
    :collapsedWidth="40"
    :trigger="null"
  >
    <div class="side-inner">
      <div v-if="showAvatar !== false" class="avatar">
        <a-avatar v-if="!user.avatar" :size="!myCollapsed ? 64 : 32" icon="user" />
        <a-avatar v-else :size="!myCollapsed ? 64 : 32" :src="user.avatar"></a-avatar>
        <div class="name">{{ user.real_name }}</div>
      </div>
      <a-icon
        v-if="allowCollapsed"
        :title="collapsibleTitle"
        class="trigger"
        :type="triggerType"
        @click="() => (myCollapsed = !myCollapsed)"
      />
      <div class="menu-wrap">
        <my-a-menu
          v-model="selectedKeys"
          :inlineCollapsed="myCollapsed"
          :theme="theme"
          :inlineIndent="12"
          :defaultOpenKeys="defaultOpenKeys"
          mode="inline"
          :menus="menus"
          @click="handleMenuClick"
          @select="handleMenuSelect"
        ></my-a-menu>
      </div>
    </div>
  </a-layout-sider>
</template>

<script>
import { mapGetters } from 'vuex'
import MyAMenu from './my-a-menu'
export default {
  name: 'SiderMenu',
  components: {
    MyAMenu
  },
  props: {
    width: {
      type: [Number, String],
      default: 220,
      required: false
    },
    theme: {
      type: String,
      default: 'light'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    },
    /**默认选中的key */
    defaultSelectedKeys: {
      type: Array,
      default: () => []
    },
    defaultOpenKeys: {
      type: Array,
      default: () => []
    },
    /**菜单项点击 */
    menuClick: {
      type: [Function, null],
      default: null
    },
    /**菜单项选中 */
    menuSelect: {
      type: [Function, null],
      default: null
    }
  },
  data() {
    return {
      selectedKeys: [],
      myCollapsed: false
    }
  },
  computed: {
    ...mapGetters(['showAvatar', 'allowCollapsed']),
    user() {
      return this.$store.getters.getUser || {}
    },
    triggerType() {
      return this.myCollapsed ? 'menu-unfold' : 'menu-fold'
    },
    collapsedClass() {
      return this.myCollapsed ? 'my-collapsed' : ''
    },
    collapsibleTitle() {
      return this.myCollapsed ? '展开菜单栏' : '收缩菜单栏'
    }
  },
  watch: {
    defaultSelectedKeys(c, o) {
      if (c !== o) {
        this.selectedKeys = c
      }
    },
    selectedKeys(c, o) {
      this.$emit('update:defaultSelectedKeys', c)
    },
    myCollapsed(c, o) {
      if (c !== o) {
        this.$emit('update:collapsed', c)
      }
    },
    collapsed(c, o) {
      if (c !== o) {
        this.myCollapsed = c
      }
    },
    menus: {
      handler(c) {
        console.log({ c })
      },
      immediate: true
    }
  },
  created() {
    this.selectedKeys = this.defaultSelectedKeys
    this.myCollapsed = this.collapsed
  },
  methods: {
    /*查找对应name的菜单项 */
    _findMenu(name) {
      const fun = (menus) => {
        let menu
        menus.find(m => {
          if (m.name === name) {
            menu = m
            return true
          }
          if (m.showChildren) {
            menu = fun(m.showChildren)
            return !!menu
          }
          return false
        })

        return menu
      }
      return fun(this.menus)
    },
    /**
     * 菜单项点击事件
     */
    handleMenuClick({ item, key, keyPath }) {
      const menu = this._findMenu(key)
      const { name } = this.$route || { name: '' }
      const current = this.selectedKeys[0]
      if (this.menuClick) {
        this.menuClick(menu)
      } else {
        this.$emit('menuClick', menu)
      }

      if (current === key && name !== key) {
        this.handleMenuSelect({ item, key, keyPath })
      }
    },
    /** 菜单项选中事件 */
    handleMenuSelect({ item, key, keyPath }) {
      const menu = this._findMenu(key)
      if (this.menuSelect) {
        this.menuSelect(menu)
      } else {
        this.$emit('menuSelect', menu)
      }
    }
  }
}
</script>

<style lang="scss">
.side {
  height: 100%;
  position: relative;
  background-color: #fff;
  //box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);

  &.my-collapsed {
    .avatar {
      height: 80px;
      margin-top: 0;
    }
    .name {
      display: none;
    }
    .ant-menu-inline-collapsed {
      width: 40px !important;

      .ant-menu-submenu-selected {
        background-color: #e6f7ff;
      }

      > .ant-menu-item {
        padding: initial !important;
        text-align: center;
      }
      .ant-menu-submenu-title {
        padding: 0 !important;
        text-align: center;
      }
    }
  }

  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0 none;
  }

  &-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .trigger {
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;
    position: absolute;
    top: $base-space-size;
    right: -24px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background-color: #e8e8e8;
  }

  .avatar {
    flex: 0 auto;
    width: 100%;
    height: 140px;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;

    .name {
      margin: $base-space-size 0;
      width: 100%;
      line-height: 24px;
      text-align: center;
      white-space: nowrap;
      padding: 0 $base-space-size;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .no-avatar {
    height: 20px;
  }
  .menu-wrap {
    flex: 1%;
    overflow: hidden;
    &:hover {
      overflow-y: auto;
    }
  }
}
</style>
