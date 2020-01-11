<template>
  <a-layout-sider
    v-model="myCollapsed"
    class="side"
    :class="collapsedClass"
    :width="width"
    :theme="theme"
    :collapsible="collapsible"
    :collapsedWidth="40"
    :trigger="null"
  >
    <div class="side-inner">
      <div class="avatar">
        <a-avatar v-if="!user.avatar" :size="!myCollapsed ? 64 : 32" icon="user" />
        <a-avatar v-else :size="!myCollapsed ? 64 : 32" :src="user.avatar"></a-avatar>
        <div class="name">{{ user.real_name }}</div>
      </div>
      <a-icon
        v-if="collapsible"
        :title="collapsibleTitle"
        class="trigger"
        :type="triggerType"
        @click="() => (myCollapsed = !myCollapsed)"
      />
      <div class="menu-wrap">
        <a-menu
          v-model="selectedKeys"
          :inlineCollapsed="myCollapsed"
          :theme="theme"
          mode="inline"
          :defaultOpenKeys="defaultOpenKeys"
          @click="handleMenuClick"
          @select="handleMenuSelect"
        >
          <template v-for="item in menus">
            <a-menu-item v-if="item.showChildren && !item.showChildren" :key="item.name">
              <a-icon v-if="item.meta.icon" :type="item.meta.icon"></a-icon>
              <span>{{ item.meta.title }}</span>
            </a-menu-item>
            <a-menu-item v-if="item.showChildren && item.showChildren.length === 1" :key="item.showChildren[0].name">
              <a-icon
                v-if="item.showChildren[0].meta.icon || item.meta.icon"
                :type="item.showChildren[0].meta.icon || item.meta.icon"
              ></a-icon>
              <span>
                {{ item.showChildren[0].meta.title }}
              </span>
            </a-menu-item>
            <a-sub-menu v-if="item.showChildren && item.showChildren.length > 1" :key="item.name">
              <template v-slot:title>
                <a-icon v-if="item.meta && item.meta.icon" :type="item.meta.icon"></a-icon>
                <span>{{ item.meta.title }}</span>
              </template>
              <a-menu-item v-for="child in item.showChildren" :key="child.name">
                <a-icon v-if="child.meta.icon" :type="child.meta.icon"></a-icon>
                <span>{{ child.meta.title }}</span>
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu>
      </div>
    </div>
  </a-layout-sider>
</template>

<script>
export default {
  name: 'SiderMenu',
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
    collapsible: {
      type: Boolean,
      required: false,
      default: false
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
    }
  },
  created() {
    this.selectedKeys = this.defaultSelectedKeys
    this.myCollapsed = this.collapsed
  },
  methods: {
    /*查找对应name的菜单项 */
    _findMenu(name) {
      let menu
      this.menus.find(m => {
        if (m.name === name) {
          menu = m
          return true
        }
        if (m.showChildren) {
          menu = m.showChildren.find(n => n.name === name)
          return !!menu
        }
        return false
      })

      return menu
    },
    /**
     * 菜单项点击事件
     */
    handleMenuClick({ item, key, keyPath }) {
      const menu = this._findMenu(key)
      if (this.menuClick) {
        this.menuClick(menu)
      } else {
        this.$emit('menuClick', menu)
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
      margin-top: 10px;
    }
    .name {
      display: none;
    }
    .ant-menu-inline-collapsed {
      width: 40px !important;

      .ant-menu-submenu-selected {
        background-color: #e6f7ff;
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
    right: $base-space-size;
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
    padding: 24px 0 0;
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
  .menu-wrap {
    flex: 1%;
    overflow: hidden;
    &:hover {
      overflow-y: auto;
    }
  }
}
</style>
