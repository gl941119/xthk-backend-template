<script>
import baseIndexMixins from '@/mixins/base-index-mixins'
import routers from '@/router/generate-router'
// import employee from '@/router/employee.js'
import {
  getRbacMenuList,
  getRbacMenuAllPermissions,
  getRbacMenuPermissions,
  rbacMenuToggleEnable,
  rbacMenuImport,
  rbacMenuUpdatePermissions
} from '_axios/permission'

export default {
  name: 'PermissionMenu',
  mixins: [baseIndexMixins],
  data() {
    return {
      modalTitle: '配置菜单权限',
      title: '菜单配置',
      addButtonIconType: 'scan',
      addButtonText: '扫描',
      searchPlaceholder: '请输入菜单展示名称',
      modalWidth: 800,
      columns: [
        { title: '序号', dataIndex: 'num' },
        { title: '菜单英文名 ', dataIndex: 'name' },
        { title: '菜单展示名称', dataIndex: 'meta_title' },
        { title: '菜单层级', dataIndex: 'level_name' },
        {
          title: '启用状态',
          dataIndex: 'status',
          width: 160,
          customRender: (text, record, dataIndex) => {
            return (
              <a-switch
                checkedChildren="启用"
                unCheckedChildren="禁用"
                checked={record.status === 1}
                onChange={checked => this.handleStateChange(text, record, dataIndex, checked)}
              />
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'operate',
          width: 160,
          customRender: (text, record, dataIndex) => {
            return (
              <a
                href="javascript:void(0);"
                disabled={record.level_name === '一级菜单'}
                onClick={() => this.handleConfigMenu(text, record, dataIndex)}
              >
                配置权限
              </a>
            )
          }
        }
      ],
      addButtonLoading: false,
      isConfigMenu: false,
      listStyle: {
        width: '300px',
        height: '400px'
      },
      allTreeDataSource: [],
      targetKeys: [],
      selectedKeys: []
    }
  },
  created() {
    this.__init_render_slots__()
    Object.assign(this.query, { meta_title: '' })

    /**设置获得列表信息调用接口*/
    this.api.getInfoList = getRbacMenuList
  },
  methods: {
    /**设置页面插槽 */
    __init_render_slots__() {
      this.$slots = {
        /**默认modal弹出窗内容 */
        modal: props => {
          return (
            <div>
              <div style="margin:0 auto;width:710px">
                <a-transfer
                  listStyle={this.listStyle}
                  dataSource={this.allTreeDataSource}
                  titles={['接口列表', '已添加接口列表']}
                  operations={['添加', '移出']}
                  showSearch={true}
                  targetKeys={this.targetKeys}
                  selectedKeys={this.selectedKeys}
                  render={item => item.title}
                  on-selectChange={this.selectChange}
                  on-change={this.handleChange}
                />
              </div>
            </div>
          )
        }
      }
    },
    /**添加按钮事件。*/
    handleAdd() {
      this.$confirm({
        title: '警告',
        content: (
          <span>
            <span class="error">扫描操作会重置当前现有的菜单状态</span>
            ，你确认要进行扫描操作吗?
          </span>
        ),
        onOk: async () => {
          this.addButtonLoading = true
          let param = { data: [...routers] }
          await rbacMenuImport(param)
            .then(({ status_code, message }) => {
              if (status_code === 200) {
                this.$message.success(message)
                this.getInfoList(1)
              } else {
                this.$message.error(message)
              }
            })
            .catch(({ message }) => {
              this.$message.error(message)
            })
          this.addButtonLoading = false
        }
      })
    },
    /**重写默认框查询事件 */
    handleSearch: debounce(function(value) {
      this.query.meta_title = value
      this.getInfoList(1)
    }),
    /**启用状态事件 */
    async handleStateChange(text, record, dataIndex, checked) {
      let oldstatus = record.status
      record.status = oldstatus ? 0 : 1

      await rbacMenuToggleEnable({ menu_id: record.id })
        .then(({ status_code, message, data: { status } }) => {
          if (status_code === 200) {
            this.$message.success(message)
            this.getInfoList()
          } else {
            this.$message.error(message)
            record.status = oldstatus
          }
        })
        .catch(({ message }) => {
          record.status = oldstatus
          this.$message.error(message)
        })
    },
    /**白名单事件 */
    async handleWhiteChange(text, record, dataIndex, checked) {
      await rbacPermissionsWhite({ id: record.id })
        .then(({ status_code, message, data: { status } }) => {
          if (status_code === 200) {
            this.$message.success(message)
          } else {
            this.$message.error(message)
          }
        })
        .catch(({ message }) => {
          this.$message.error(message)
        })
    },
    /**配置菜单 */
    async handleConfigMenu(text, record, dataIndex) {
      if (this.isConfigMenu) return
      this.isConfigMenu = true
      this.currentInfo = { ...record }
      let r = getRbacMenuAllPermissions({ menu_id: record.id })
      let r1 = getRbacMenuPermissions({ menu_id: record.id })
      await Promise.all([r, r1])
        .then(([{ status_code, message, data }, { status_code: status_code_1, message: message1, data: data1 }]) => {
          if (status_code === 200) {
            let arr = data.map(({ id: key, name: title }) => {
              return { key: '' + key, title }
            })
            this.allTreeDataSource = arr
          } else {
            this.$message.error(message)
          }
          if (status_code_1 === 200) {
            let arr1 = data1.map(({ id }) => {
              return '' + id
            })

            this.targetKeys = arr1
          } else {
            this.$message.error(message_1)
          }
        })
        .catch(({ message }) => {
          this.$message.error(message)
        })
      this.showModal = true
      this.isConfigMenu = false
    },
    async onModalOk(values) {
      let r = false
      if (!this.targetKeys || !this.targetKeys.length) {
        this.$message.warning('没有选中的接口信息')
        return r
      }
      await rbacMenuUpdatePermissions({
        menu_id: this.currentInfo.id,
        ids: this.targetKeys
      })
        .then(({ status_code, message }) => {
          if (status_code === 200) {
            this.$message.success(message)
            this.showModal = false
            r = true
          } else {
            this.$message.error(message)
          }
        })
        .catch(({ message }) => {
          this.$message.error(message)
        })
      return r
    },
    handleChange(targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    selectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    }
  }
}
</script>

<style lang="scss"></style>
