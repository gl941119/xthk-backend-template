<template>
  <div :class="myClass">
    <a-tabs v-model="activeKey" :class="headTabClass" :hideAdd="hideAdd" :tabBarGutter="tabBarGutter" type="editable-card" @change="handleChange" @edit="handelEdit" @tabClick="handleTabClick">
      <a-tab-pane v-for="item in menus" :key="item.key" :closable="closable && menus.length > 1">
        <template v-slot:tab>
          <div class="tab-inner">
            <div class="dot"></div>
            <span>{{ item.title }}</span>
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HeadTabs',
  props: {
    items: {
      type: Array,
      required: true
    },
    /**是否隐藏增加按钮的 */
    hideAdd: {
      type: Boolean,
      default: true
    },
    /**
     * tabBar之间的间距
     */
    tabBarGutter: {
      type: Number,
      default: 8
    },
    /**是否允许tabPane关闭 */
    closable: {
      type: Boolean,
      default: true
    },
    /**默认选中的key */
    defaultKey: {
      type: [Number, String],
      default: 0
    },
    /**移出tab项完成后 */
    tabRemove: {
      type: [Function, null],
      default: null
    },
    /**tab项点击 */
    tabClick: {
      type: [Function, null],
      default: null
    },
    /**tab项选中 */
    tabSelect: {
      type: [Function, null],
      default: null
    }
  },
  data () {
    return {
      menus: [],
      activeKey: 0,
      tempKeep: {}
    }
  },
  computed: {
    ...mapGetters(['showAvatar', 'allowCollapsed']),
    headTabClass () {
      return { 'head-tabs': true }
    },
    //是否允许关闭当前tabPane
    allowClosableTab () {
      return this.closable && this.menus.length > 1
    },
    myClass () {
      return {
        collapsed: this.allowCollapsed
      }
    }
  },
  watch: {
    defaultKey (c, o) {
      if (c !== o) {
        this.activeKey = c
      }
    },
    items (c, o) {
      if (c !== o) {
        this.menus = c || []
      }
    },
    $route: {
      handler (c, o) {
        // 移出tab时，需要从keepAlive 里，移出对应的页面缓存
        if (o && o.meta && o.meta.keepAlive) {
          const len = o.matched.length
          let m = o.matched[len - 1]
          if (m && (m = m.instances) && (m = m.default)) {
            if (!m.$vnode.parent && m.$parent.$options.name === 'BlankLayout') {
              m = m.$parent
            }
            let $v = m.$vnode
            // 当前vnode存在父级对象，且父级对象拥有cache
            if ($v.parent && $v.parent.componentInstance && $v.parent.componentInstance.cache) {
              const cOptions = $v.componentOptions
              const cache = $v.parent.componentInstance.cache || {}
              const keys = $v.parent.componentInstance.keys || []
              let key =
                $v.componentOptions.Ctor.cid + ($v.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
              $v.key && (key = $v.key)
              keys.find((m, index) => {
                if (m === key) {
                  keys.splice(index, 1)
                  return true
                }
              })
              if (this._is_remove_tab_) {
                cache[key] && Reflect.deleteProperty(cache, key)
                this.tempKeep[o.name] && Reflect.deleteProperty(this.tempKeep, o.name)
              } else {
                this.tempKeep[o.name] = { cache, key, keys }
              }
            }
          }
        }
        this._is_remove_tab_ = false

      },
      immediate: true
    }
  },
  created () {
    this.menus = this.items || []
    this.activeKey = this.defaultKey
    this._is_remove_tab_ = false

    this.$once('hook:beforeDestroy', () => {
      if (this.tempKeep) {
        Object.keys(this.tempKeep).forEach(m => {
          Reflect.deleteProperty(this.tempKeep, m)
        })
      }
    })
  },

  methods: {
    handleChange (activeKey) {
      if (this.tabSelect) {
        this.tabClick(this.menus.find(m => m.key === activeKey))
      } else {
        this.$emit('tabSelect', this.menus.find(m => m.key === activeKey))
      }
    },
    handleTabClick (activeKey) {
      if (this.tabClick) {
        this.tabClick(this.menus.find(m => m.key === activeKey))
      } else {
        this.$emit('tabClick', this.menus.find(m => m.key === activeKey))
      }
    },
    handelEdit (targetKey, action) {
      this[action](targetKey)
      if (!this.tempKeep[targetKey]) return
      const { key, cache, keys } = this.tempKeep[targetKey]
      cache[key] && Reflect.deleteProperty(cache, key)
      keys.find((m, idx) => {
        if (m === key) {
          keys.splice(idx, 1)
          return true
        }

      })

    },
    /**移出tab项 */
    remove (targetKey) {
      //当tab项只有一个不能进行移出操作
      if (this.menus.length === 1) return
      const length = this.menus.length
      const lastKey = this.menus[length - 1].key
      let tempActiveKey = this.activeKey
      //移出的tab项是当前选中的tab时
      if (tempActiveKey === targetKey) {
        if (lastKey === targetKey) {
          //当前选中的tab是最后一个tab项时。设定移出后的选中的key为当前项的前一个tab
          tempActiveKey = this.menus[length - 2].key
        } else {
          //当前选中的tab是不是最后一个tab项时。设定移出后的选中的key为当前项的后一个tab
          const nextIndex = this.menus.findIndex(m => m.key === targetKey) + 1
          tempActiveKey = this.menus[nextIndex].key
        }
        this._is_remove_tab_ = true
      }
      //移出tab
      const removeItem = this.menus.find(m => m.key === targetKey)
      this.menus = this.menus.filter(m => m.key !== targetKey)
      this.activeKey = tempActiveKey
      this.handleChange(this.activeKey)

      this.$emit('update:items', this.menus)
      if (this.tabRemove) {
        this.tabRemove(removeItem)
      } else {
        this.$emit('tabRemove', removeItem)
      }
    }
  }
}
</script>

<style lang="scss">
.collapsed {
  padding-left: 32px;
  background-color: #fff;
  margin-bottom: 0;

  box-shadow: 0 1px 6px rgba($color: #000000, $alpha: 0.1);
  border-bottom: 1px solid #e8e8e8;
}
.head-tabs {
  flex: 0 0 auto;
  margin-bottom: 0;

  .ant-tabs-nav-wrap {
    line-height: 40px;
  }
  .ant-tabs-nav {
    padding-left: 8px !important;
  }

  .ant-tabs-nav-container-scrolling {
    .ant-tabs-nav {
      padding-left: 0 !important;
    }
  }

  .ant-tabs-tab {
    padding: 2px 8px 2px 4px !important;
    border: 1px solid #e8e8e8 !important;
    line-height: 1.5 !important;
    border-radius: 0 !important;
    height: auto !important;
  }
  .ant-tabs-bar {
    margin-bottom: 0;
    border-bottom: 0 none;
  }

  .ant-tabs-close-x {
    transform: translateY(-1px);
  }
  .ant-tabs-card-bar .ant-tabs-tab-active {
    height: auto !important;
    border-color: #1890ff !important;
    background: #1890ff !important;
    color: #fff !important;
    .ant-tabs-close-x {
      color: #fff !important;
    }
  }

  .ant-tabs-ink-bar {
    display: none !important;
  }

  .tab-inner {
    display: inline-block;

    .dot {
      display: inline-block;
      margin-right: $base-space-size / 2;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ffffff;
      transform: translateX(2px);
      //transform: translateY(1px);
    }
  }
}
</style>
