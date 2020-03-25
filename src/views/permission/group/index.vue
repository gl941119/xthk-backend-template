<script>
import baseIndexMixins from '@/mixins/base-index-mixins'
import {
  getRbacGroupList,
  rbacGroupCreate,
  rbacGroupDelete,
  rbacGroupUpdate,
  rbacGroupUpdatePermissions,
  getRbacGroupMenuPermissions
} from '_axios/permission'
export default {
  mixins: [baseIndexMixins],
  data() {
    return {
      modalTitle: '配置权限',
      searchPlaceholder: '请输入权限组名称',
      columns: [
        { title: '序号', dataIndex: 'num' },
        { title: '权限组名称', dataIndex: 'name' },
        { title: '唯一标识', dataIndex: 'symbol' },
        { title: '描述', dataIndex: 'desc' },
        {
          title: '操作',
          dataIndex: 'operate',
          width: 200,
          customRender: (text, record, dataIndex) => {
            return (
              <span>
                <a
                  href="javascript:;"
                  onClick={() => this.handleOperate(text, record, dataIndex, 'config')}
                  disabled={record.symbol === 'admin'}
                >
                  配置权限
                </a>
                <a-divider type="vertical" />
                <a
                  href="javascript:;"
                  onClick={() => this.handleOperate(text, record, dataIndex, 'edit')}
                  disabled={record.symbol === 'admin'}
                >
                  编辑
                </a>
                <a-divider type="vertical" />
                <a
                  href="javascript:;"
                  class={record.symbol === 'admin' ? '' : 'error'}
                  onClick={() => this.handleOperate(text, record, dataIndex, 'delete')}
                  disabled={record.symbol === 'admin'}
                >
                  删除
                </a>
              </span>
            )
          }
        }
      ],
	  nameCount:0, // 名称字数
      symbolCount: 0, // 标识字数
      descCount: 0, //描述字数
      treeData: [], //当前树控件数据,
      checkedKeys: [], //树控件选中的数据
      isConfig: false // 当前是否配置
    }
  },
  computed: {},
  watch: {
    currentInfo(c, o) {
      if (c) {
        this.nameCount = c.name ? c.name.length : 0
        this.symbolCount = c.symbol ? c.symbol.length : 0
        this.descCount = c.desc ? c.desc.length : 0
      }
    },
    isConfig(c) {
      this.modalTitle = c ? '配置权限' : `${this.currentInfo.id ? '编辑' : '新增'}权限组`
    }
  },
  created() {
    Object.assign(this.query, { name: '' })

    /**设置获得列表信息调用接口*/
    this.api.getInfoList = getRbacGroupList

    this._cacheMap = new Map()
  },
  methods: {
    /**获得权限组配置权限，三级联动数据结构*/
    getGroupMenuPpermissionsInfo() {
      getRbacGroupMenuPermissions({ id: this.currentInfo.id })
        .then(({ status_code, message, data }) => {
          if (status_code !== 200) {
            this.$message.error(message)
          } else {
            let set = new Set()
            let _map = this._cacheMap
            let mapArr = function(arr, parents) {
              if (!arr || !arr.length) {
                return undefined
              }
              let p = parents || []
              return arr.map(({ id: key, name: title, children = null, is_active = null, parent_id }, idx) => {
                let k = '' + key
                let isKen = k.startsWith('m_')
                let p1 = [...p]
                if (isKen) {
                  p1.push(k)
                }

                let newChildren = children && children.length ? mapArr(children, p1) : null
                let o = {
                  key,
                  title,
                  children: newChildren,
                  parents: !isKen ? p1 : null
                }
                if (is_active === 1) {
                  set.add(key)
                }
                if (Number.isInteger(key)) {
                  _map.set(key, o)
                }

                return o
              })
            }
            let source = mapArr(data)
            this.treeData = source
            this.checkedKeys = [...set]
          }
        })
        .catch(({ message }) => {
          this.$message.error(message)
        })
    },
    //**搜索框事件 */
    handleSearch: debounce(function(value) {
      this.query.name = value
      this.getInfoList(1)
    }),
    /**操作列事件处理 */
    handleOperate(text, record, dataIndex, type) {
      let op = {
        //配置操作
        config: () => {
          this.isConfig = true
          this.showModal = true
          this.getGroupMenuPpermissionsInfo()
        },
        edit: () => {
          this.showModal = true
          this.isConfig = false
        },
        delete: () => {
          this.$confirm({
            title: '警告',
            content: (
              <span>
                <span class="error">正在删除数据</span>
                ，请确认是否执行此操作
              </span>
            ),
            onOk: async () => {
              await rbacGroupDelete({ id: this.currentInfo.id })
                .then(({ status_code, message }) => {
                  this.$message.success(message)
                  this.getInfoList()
                  this.currentInfo = {}
                })
                .catch(({ message }) => {
                  this.$message.error(message)
                })
            },
            onCancel: () => {
              this.currentInfo = {}
            }
          })
        }
      }

      if (type in op) {
        this.currentInfo = { ...record }
        op[type]()
      }
    },
    /**输入出插槽内容 */
    renderModalSlot() {
      let vnode = (
        <div style="overflow:auto;">
          <a-tree
            checkable
            style="height:400px"
            treeData={this.treeData}
            checkedKeys={this.checkedKeys}
            onCheck={this.handleCheck}
          />
        </div>
      )
      if (!this.isConfig) {
        let nameInput = <a-input maxlength="12" placeholder="权限组名称" />
        nameInput.data.directives = [
          {
            name: 'decorator',
            value: [
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入权限组名称'
                  }
                ],
                initialValue: this.currentInfo.name
              }
            ]
          }
        ]
        let symbolInput = <a-input maxlength="20" placeholder="唯一标识" />
        symbolInput.data.directives = [
          {
            name: 'decorator',
            value: [
              'symbol',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入唯一标识'
                  }
                ],
                initialValue: this.currentInfo.symbol
              }
            ]
          }
        ]
        let descInput = <a-input maxlength="120" type="textarea" placeholder="请输入描述" />
        descInput.data.directives = [
          {
            name: 'decorator',
            value: [
              'desc',
              {
                initialValue: this.currentInfo.desc
              }
            ]
          }
        ]

        vnode = (
          <a-form form={this.form}>
            <a-form-item
              label="权限组名称"
              label-col={this.formItemLayout.labelCol}
              wrapper-col={this.formItemLayout.wrapperCol}
            >
              {nameInput}
              <span class="counts-tips">{this.nameCount}/12</span>
            </a-form-item>
            <a-form-item
              label="唯一标识"
              label-col={this.formItemLayout.labelCol}
              wrapper-col={this.formItemLayout.wrapperCol}
              required
            >
              {symbolInput}
              <span class="counts-tips">{this.symbolCount}/20</span>
            </a-form-item>
            <a-form-item
              label="描述"
              label-col={this.formItemLayout.labelCol}
              wrapper-col={this.formItemLayout.wrapperCol}
            >
              {descInput}
              <span class="counts-tips">{this.descCount}/120</span>
            </a-form-item>
          </a-form>
        )
      }

      return vnode
    },
    async onModalOk(values) {
      let r = false
      if (this.isConfig) {
        //当前为配置操作
        let temp = new Map()
        let arr = this.checkedKeys.filter(n => {
          let r = !('' + n).startsWith('m_')
          if (r) {
            let o = this._cacheMap.get(n)
            if (o.parents) {
              let k = o.parents[0]
              if (!temp.has(k)) {
                temp.set(k, {})
              }
              let c = temp.get(k)
              let lastIndex = o.parents.length - 1
              o.parents.reduce((t, c, idx) => {
                if (idx === lastIndex) {
                  if (!(c in t)) {
                    t[c] = [n]
                  } else {
                    t[c].push(n)
                  }
                } else {
                  if (!(c in t)) {
                    t[c] = {}
                  }
                }

                return t[c]
              }, c)
            }
          }
          return r
        })

        await rbacGroupUpdatePermissions({
          id: this.currentInfo.id,
          data: [...temp.values()]
        })
          .then(({ status_code, message }) => {
            r = true
            this.$message.success(message)
            this.showModal = false
            this.isConfig = false
            this.currentInfo = {}
          })
          .catch(({ message }) => {
            this.$message.error(message)
          })
      } else {
        await (!this.currentInfo.id
          ? rbacGroupCreate({ ...values })
          : rbacGroupUpdate({ ...this.currentInfo, ...values })
        )
          .then(({ status_code, message }) => {
            r = true
            this.$message.success(message)
            this.showModal = false
          })
          .catch(({ message }) => {
            this.$message.error(message)
          })

        if (r) {
          this.getInfoList()
        }
      }

      return r
    },
    handleCheck(checkedKeys, e) {
      this.checkedKeys = checkedKeys
    },
    handlFormFieldsChange(props, fields) {
      if (fields.name && fields.name.value) {
        this.nameCount = fields.name.value.length
      }
      if (fields.symbol && fields.symbol.value) {
        this.symbolCount = fields.symbol.value.length
      }
      if (fields.desc && fields.desc.value) {
        this.descCount = fields.desc.value.length
      }
    },
    handlerModalClose() {
      this.currentInfo = {}
      this.isConfig = false
    }
  }
}
</script>
