import { formItemLayout, debounce } from '@/libs/util.js'
import BaseView from '_layout/BaseViewLayout'
import { perPage } from '@/config/common.js'
const baseData = function() {
  let d = {}
  Object.entries(BaseView.props).forEach(([key, val]) => {
    if (key === 'modalTitle') return
    let t = val.type
    let def = val.default
    if (typeof t === 'function') {
      if (typeof t() !== 'function') {
        d[key] = typeof def === 'function' ? def() : def
      }
    } else {
      if (Array.isArray(t)) {
        if (t.includes(Function) && typeof def === 'function') {
          d[key] = def()
          return
        }
      }
      d[key] = def
    }
  })

  return d
}
export const baseViewMixin = {
  components: {
    BaseView
  },
  computed: {
    modalTitle() {
      return '基础信息'
    }
  },
  data() {
    return {
      debounce,
      /**允许创建组件加载列表数据 */
      enableCreateLoadInfo: true,
      /**表单项基本样式 */
      formItemLayout,
      ...baseData(), //继承自BaseView组件的Props属性字段（除类型为function）
      /** 名称字段统计*/
      nameCount: 0, //名称字段统计
      /**是否正在存储数据中 */
      isInStore: false, //是否存储数据中+
      /**数据加载状态 */
      loading: false, //加载动画
      /**当前选中业务信息 */
      currentInfo: {}, //当前选中业务信息
      /**查条基本条件 */
      query: {
        per_page: perPage,
        page: 1
      }
    }
  },
  created() {
    if (this.$form) {
      this.form = this.$form.createForm(this, {
        name: 'my_form',
        onFieldsChange: this.onFieldsChange
      })
    }
    if (this.enableCreateLoadInfo) {
      delay(() => {
        this.getInfoList && this.getInfoList()
      })
    }
  },
  methods: {
    /**获得列表信息.需要override */
    getInfoList() {},
    /**模式窗口关闭后事件。可按需求进行override */
    handlerModalClose() {
      this.currentInfo = {}
    },
    /**模式窗口事件。可按需求进行override */
    handlerModalCancel() {
      this.showModal = false
    },
    /**添加按钮事件。可按需求进行override */
    handleAdd() {
      this.showModal = true
    },
    /**文本搜索框事件.需要override */
    handleSearch: debounce(function() {}),
    /**列表分页事件 .需要override*/
    async onPageChange({ current, pageSize }) {
      console.log('onPageChange', current, pageSize)
      this.query.page = current
      this.query.per_page = pageSize
      this.getInfoList && (await this.getInfoList())
      this.loading = false
    },
    /**列排序事件 */
    onSorter({ order, columnKey, field }) {
      console.log(order, columnKey, field)
    },
    /**模式窗口确认按钮事件。特殊情况可按需求进行override，一般只需要实现onHandleModalOk方法即可 .*/
    handlerModalOk() {
      if (this.isInStore) return

      if (this.form) {
        this.form.validateFields(async (error, values) => {
          if (!error) {
            this.confirmLoading = this.isInStore = true
            await this.onHandleModalOk(values)
            this.confirmLoading = this.isInStore = false
            // if (res !== false) {
            //     this.currentInfo = {}
            // }
          }
        })
      } else {
        this.confirmLoading = this.isInStore = true
        this.onHandleModalOk()
        this.confirmLoading = this.isInStore = false
        this.currentInfo = {}
      }
    },

    /**
     * 模式窗口点击确认回调(.async)
     * 需要override
     * @param {*} values 相关值
     * */
    onHandleModalOk(values) {
      console.log(values)
    },
    /**字段值改变事件 */
    onFieldsChange(props, fields) {
      console.log('onFieldsChange', props, fields)
    },
    /**
     * 设置列表数据内容.可按需进行override
     * @param {Array<object>} dataSource 数据信息列表
     * @param {object} pagination 分页信息
     */
    setDataSource(dataSource, pagination) {
      this.dataSource = dataSource
      this.pagination = pagination
    },
    /** 输出扩展的元素。（即baseview对应的slot元素） */
    renderSlot() {
      return ''
    },
    /** 输出扩展的Modal元素。（即baseview对应的slot=modal元素） */
    renderSlotModal() {
      return ''
    },
    /** 输出扩展的按钮元素。（即baseview对应的slot=extra-button元素） */
    renderSlotExtraButton() {
      return ''
    },
    /**输出查询区域元素。（即baseview对应的slot=query元素） */
    renderSlotQuery() {
      return ''
    }
  },
  render() {
    let props = Object.assign(
      {
        modalTitle: this.modalTitle,
        handlerModalClose: this.handlerModalClose,
        handlerModalCancel: this.handlerModalCancel,
        handleAdd: this.handleAdd,
        handleSearch: this.handleSearch,
        onPageChange: this.onPageChange,
        handlerModalOk: this.handlerModalOk,
        onSorter: this.onSorter
      },
      this.$data
    )
    props.infoListloading = this.loading
    return (
      <base-view {...{ props }}>
        {this.renderSlotQuery()}
        {this.renderSlotExtraButton()}
        {this.renderSlotModal()}
        {this.renderSlot()}
      </base-view>
    )
  }
}

export default baseViewMixin
