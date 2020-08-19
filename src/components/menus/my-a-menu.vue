<script>
import { Menu } from 'ant-design-vue'
export default {
  name: 'MyAntMenu',
  extends: Menu,
  props: {
    menus: {
      type: [Array],
      default: () => []
    }
  },
  render() {

    const funMenus = items => {

      return items.map(m => {
        const len = (m.showChildren || []).length
        const allowSingleDisplay = len === 1 && m.showChildren.every(n => !n.showChildren || !n.showChildren.length) && m.meta.allowSingleDisplay !== false
        const item = allowSingleDisplay ? m.showChildren[0] : m
        const optName = len > 0 && !allowSingleDisplay ? 'subMenu' : 'menu'
        const opt = {
          menu: item => {
            return <a-menu-item key={item.name}>
              {
                item.meta.icon ? <a-icon type={item.meta.icon}></a-icon> : null
              }
              <span>{item.meta.title}</span>
            </a-menu-item>
          },
          subMenu: item => {
            return <a-sub-menu key={item.name}>
              <template slot="title">
                {
                  item.meta.icon ? <a-icon type={item.meta.icon}></a-icon> : null
                }
                <span>{item.meta.title}</span>
              </template>
              {...funMenus(item.showChildren)}
            </a-sub-menu >
          }
        }
        return opt[optName](item)
      })
    }

    this.$slots.default = funMenus(this.menus)
    let superRender = this.$options.extends.render.apply(this, arguments)
    return superRender
  }
}
</script>