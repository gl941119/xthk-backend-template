import '../assets/scss/base-index-view.scss'
import Layout from '_layout/PageLayout'
import InfoList from '_c/info-list'
import { formatPagination } from '@/libs/tools'
import { perPage } from '@/config/common.js'
export default {
  name: 'baseIndexView',
  data () {
    return {
      __isExpand__: false,
      /**显示面包宵 */
      showBreadCrumb: true,
      /**添加按钮默认文本 */
      addButtonText: '添加',
      /**添加按钮是否显示加载状态 */
      addButtonLoading: false,
      /**页面基础样式 */
      baseViewClass: '',
      /**当前列表选中项 */
      currentInfo: {},
      /**添加按钮是否显示图标 */
      showAddButtonIcon: false,
      /**显示默认模式窗 */
      showModal: false,
      /**显示列表项 */
      showInfoList: true,
      /**模式窗口确认加载状态 */
      confirmLoading: false,
      /**查询输入框提示内容 */
      searchPlaceholder: '',
      /**查询输入框默认值 */
      searchInputDefaultValue: '',
      /**是否显搜索默认框 */
      showSearchInput: true,
      /**显示添加按钮 */
      showAddButton: true,
      /**表格行选中项（参见ant-design-vue table:rowSelection设置） */
      rowSelection: null,
      /**表格滚动条，（参见ant-design-vue table:scroll )*/
      tableScroll: { x: false },
      /**是否显示表格头 (参见ant-design-vue table:showHeader ) */
      showTableHeader: true,
      /**当前列表分页设置 （参见ant-design-vue table:pageSettings设置 */
      paginationSettings: undefined,
      /**当前列表分页信息 */
      pagination: { total: 0 },
      /**当前列表列头 */
      columns: [],
      /**列表数据 */
      dataSource: [],
      /**列表行对应的key */
      rowKey: 'id',
      /**当前页面title */
      title: '基础页面',
      /**是否加载列表数据 */
      loading: false,
      /** 显示模式窗口二级名称*/
      showModalSecondTitle: false,
      /**默认模式窗口title*/
      modalTitle: '基础信息',
      /**默认的模式窗口宽 */
      modalWidth: 520,
      /**默认的模式窗口底部内容 */
      modalFooter: undefined,
      /*是否允许默认创建加载数据 */
      enableCreatedLoadInfo: true,
      /**相关调用接口 */
      api: {
        /**获得列表数据 */
        getInfoList: function () {
          return Promise.resolve({ message: '', status_code: 200, data: [] })
        },
        /**保存数据 */
        saveInfo: null
      },
      /**当前查询条件 */
      query: {
        /**每页呈现记录数 */
        per_page: perPage,
        /**当前页码 */
        page: 1
      },
      /**默认的模式窗口属性 */
      defaultModalProps: {},
      /**查询表单区域Col栅格占位格数*/
      queryFormColSpan: 6,
      /** 显示表格边框 */
      showTableBorder: true,
      /** 使用自定义布局 */
      useCustomLayout: false
    }
  },
  created () {
    if (this.$form) {
      this.form = this.$form.createForm(this, {
        name: 'my_form',
        onFieldsChange: this.handlFormFieldsChange
      })
    }
  },
  mounted () {
    /**默认进入加载数据 */
    this.enableCreatedLoadInfo && this.getInfoList && this.getInfoList()
  },
  methods: {
    /**获得列表信息 */
    getInfoList (page = 0) {
      let fun = this.api.getInfoList

      if (!fun) {
        this.loading = false
        return
      }
      if (page) {
        this.query.page = page
      }
      const before = this.onBeforeGetInfoList
      if (before && before() === false) return
      let q = { ...this.query }
      fun(q)
        .then(({ message, status_code, data }) => {
          this.loading = false
          if (status_code !== 200) {
            this.$message.error(message)
          } else {
            const { data: source = [], meta: { pagination } = { pagination: {} } } = data || {
              data: [],
              meta: { pagination: {} }
            }
            //在绑定数据前，调用事件可自定义设置相关绑定数据
            this.dataSource =
              (typeof this.onBeforeBindInfoList === 'function' && this.onBeforeBindInfoList(source)) || source
            //数值翻页数据
            formatPagination(pagination)
            this.pagination = pagination
            //绑定数据后触发调用数据
            this.$nextTick(() => {
              const after = this.onAfterBindInfoList
              after && after.call(this, data)
            })
          }
        })
        .catch(({ message }) => {
          this.loading = false
          this.$message.error(message)
        })
    },
    /**调用信息列表之前调用方法 */
    onBeforeGetInfoList () { },
    /**在绑定数据之前调用方法。可返回新的数据对象 */
    onBeforeBindInfoList (source) { },
    /**
     * 保存数据之前调用方法
     * @param {Object} values 相关表单值
     * */
    onBeforeSaveInfo (values) { },
    /**模式窗口确认操作成功后调用方法 */
    onModalOk () { },
    /**查询区域表单字段值改变事件 */
    handlFormFieldsChange (props, fields) {
      console.log('onFieldsChange', props, fields)
    },
    /**查询文本框搜索事件 */
    handleSearch () { },
    /** 添加按钮事件*/
    handleAdd () {
      this.showModal = true
    },
    /**模式窗口点击确认 */
    handlerModalOk () {
      if (this.confirmLoading) return
      if (this.form) {
        this.form.validateFields(async (error, values) => {
          if (!error) {
            let result = true
            this.confirmLoading = true
            //如果指定了保存数据接口，进行自动调用保存接口
            if (this.api.saveInfo) {
              //调用保存接口前回调方法，如果存在先进行回调，可以对提交数处理
              //该方法存在返回值，则更新当前values
              let r = this.onBeforeSaveInfo && this.onBeforeSaveInfo(values)
              r && (values = r)
              result = await this.api
                .saveInfo({ ...values })
                .then(() => {
                  return true
                })
                .catch(({ message }) => this.$message.error(message))
            }

            if (result && this.onModalOk) {
              if (Object.isAsyncFunction(this.onModalOk)) {
                await this.onModalOk(values)
              } else {
                this.onModalOk(values)
              }
            }
            this.confirmLoading = false
          }
        })
      } else {
        this.confirmLoading = true
        this.onModalOk && this.onModalOk()
        this.confirmLoading = false
        this.currentInfo = {}
      }
    },
    /**模式窗口点击取消 */
    handlerModalCancel () {
      this.showModal = false
    },
    handlerModalClose () {
      this.currentInfo = {}
    },
    /** 翻页回调方法 */
    async handlePageChange ({ current, pageSize }) {
      console.log('onPageChange', current, pageSize)
      this.query.page = current
      this.query.per_page = pageSize
      this.loading = true
      if (this.getInfoList) {
        if (Object.isAsyncFunction(this.getInfoList)) {
          await this.getInfoList()
        } else {
          this.getInfoList()
        }
      }
      //this.loading = false
    },
    /**排序回调方法 */
    handleSorter ({ order, columnKey, field }) {
      console.log(order, columnKey, field)
    },
    __handeleExpand () {
      this.__isExpand__ = !this.__isExpand__
      this.$forceUpdate()
    },
    /** 重置查询表单 （可按需 override） */
    handleFormReset () {
      // 重置所有表单
      this.form.resetFields()
      /** 触发表单重置事件 fromreset */
      this.$emit('formReset')
    },
    /** 查询按钮事件 (可按需override) */
    handleQuery () {
      console.log(this.form.getFieldsValue())
      /** 触发查询事件 query */
      this.$emit('query', this.form.getFieldsValue())
    },
    /** 默认搜索框的slot渲染.对应slot=extra */
    renderExtraSlot () { },
    /** 渲染扩展按钮。对应slot=extraButton*/
    renderExtraButtonSlot () { },
    /**输出查询前置区域元素。（即对应的slot=beforQuery元素 */
    renderBeforeQuerySlot () { },
    /**渲染扩展查询 */
    renderQuerySlot () { },
    /** 
     * 输出标准准的查询项。可返回组件数组.(该方法比renderQuerySlot方法或者slot=query的权重更高)
     * 数组项格式如下: 
     * <a-form-item label="续报名称/续报ID">
          <a-input
            placeholder="输入续报名称关键词或续报ID"           
          ></a-input>
        </a-form-item>
     * */
    renderNormalQueryItem () { },
    /** 
     * 输出可展开收缩的查询项。可返回组件数组.(该方法比renderQuerySlot方法或者slot=query的权重更高)
     * 数组项格式如下: 
     * <a-form-item label="续报名称/续报ID">
          <a-input
            placeholder="输入续报名称关键词或续报ID"  
          ></a-input>
        </a-form-item>
     * */
    renderExpandQueryItem () { },
    /**渲染模式窗口内容 */
    renderModalSlot () { },
    /**渲染页面默认扩展内容。对应slot=default*/
    renderDefaultSlot () { },
    /** 开始渲染所有的slot */
    startRenderSlot (vNodes) {
      return () => {
        return [...vNodes]
      }
    },
    /** 获得当前列表的Props属性 */
    getCurrentInfoListProps () {
      return {
        columns: this.columns,
        source: [...this.dataSource],
        pageSettings: this.paginationSettings,
        pagination: this.pagination,
        rowSelection: this.rowSelection,
        scroll: this.tableScroll,
        rowKey: this.rowKey,
        loading: this.loading,
        showTotals: false,
        showHeader: this.showTableHeader,
        onSorter: this.handleSorter,
        onPageChange: this.handlePageChange

      }
    }
  },
  /** 生成查询条件页 */
  __buildQuerySlot__ (h) {
    // 判定生成查询条件空
    let queryItems = null
    let normal = this.renderNormalQueryItem()
    let expand = this.renderExpandQueryItem()
    // debugger
    if (normal || expand) {
      normal = normal || []
      expand = expand || []
      normal && !Array.isArray(normal) && (normal = [normal])
      expand && !Array.isArray(expand) && (expand = [expand])
      const colSpan = this.queryFormColSpan
      let arr = normal.map(m => {
        return <a-col span={ colSpan }>{ m }</a-col>
      })

      expand.map(m => {
        arr.push(<a-col span={ !this.__isExpand__ ? 0 : colSpan }>{ m }</a-col>)
      })

      if (arr.length) {
        queryItems = (
          <a-row gutter={ 16 } type="flex">
            {...arr }
            <a-col span={ colSpan }>
              <a-form-item label="　" colon={ false } class="form-button-wrap">
                <div style="white-space:nowrap">
                  <a-button type="primary" on-click={ this.handleQuery }>
                    查询
                  </a-button>
                  &ensp;
                  <a-button on-click={ this.handleFormReset }>重置</a-button>
                  &ensp;
                  { expand.length ? (
                    <a-button on-click={ this.__handeleExpand }>{ this.__isExpand__ ? '收起筛选' : '展开筛选' }</a-button>
                  ) : null }
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        )
      }
    }
    if (!queryItems) {
      return this.$slots.query
        ? (typeof this.$slots.query === 'function' && this.$slots.query()) ||
        (Object.isObject(this.$slots.query) && this.$slots.query.hasOwnProperty('render') && h(this.$slots.query))
        : this.renderQuerySlot()
    } else {
      return queryItems
    }
  },
  /** 获得插槽节点 */
  getSlotNode (slot, h) {

    if (typeof slot === 'function') {
      return slot()
    } else if (Object.isObject(slot)) {
      if (Reflect.has(slot, 'render')) {
        const r = slot['render']
        return typeof r === 'function' ? slot.render() : r.constructor.name === 'VNode' ? r : h(r)
      }
    }

    return slot
  },
  render (h, c) {
    const renderNodes = []
    const gsNode = this.$options.getSlotNode.bind(this)
    const headerExtraNode = gsNode(this.$slots.headerExtra, h)
    let scopedSlots = {}
    this.$slots.headerExtra && (scopedSlots.headerExtra = () => headerExtraNode)


    if (!this.useCustomLayout) {
      const defaultExtraNode = (<div>
        <a-input-search
          ref="aInputSearch"
          style="width:240px"
          placeholder={ this.searchPlaceholder }
          defaultValue={ this.searchInputDefaultValue }
          on-search={ this.handleSearch }
        />
      </div>)

      /**如果不显示默认搜索框 */
      if (!this.showSearchInput) {
        scopedSlots.extra = null
      } else {
        //默认搜索框的slot被自定义
        if (!this.$slots.extra) {
          const $node = this.renderExtraSlot() || defaultExtraNode
          $node && (scopedSlots.extra = () => $node)
        }
      }
      const $query = Reflect.apply(this.$options.__buildQuerySlot__, this, [h, c])

      //设置列表属性
      const infoListProps = this.getCurrentInfoListProps()


      /**默认模式窗口属性 */
      const modalProps = Object.assign(
        {},
        {
          class: 'my-modal',
          visible: this.showModal,
          afterClose: this.handlerModalClose,
          maskClosable: false,
          destroyOnClose: true,
          confirmLoading: this.confirmLoading,
          width: this.modalWidth,
          footer: this.modalFooter
        },
        this.defaultModalProps || {}
      )

      /**模式窗口title的slot */
      const modalScopedSlots = {
        title: props => {
          let arr = [<span>{ this.modalTitle }</span>]
          this.showModalSecondTitle && arr.push(<span style="margin-left:1em;font-size:12px;color:gray">基础信息</span>)
          return arr
        }
      }

      // 查询区域扩展按钮
      const extraButton = (this.$slots.extraButton && gsNode(this.$slots.extraButton, h)) || this.renderExtraButtonSlot()

      const baseView = (
        <div class={ 'base-view ' + this.baseViewClass }>
          {(this.$slots.beforeQuery && gsNode(this.$slots.beforeQuery, h)) || this.renderBeforeQuerySlot() }
          {
            this.showAddButton || $query || extraButton ?
              <a-form class="query-form" form={ this.form }>
                { $query }
                <a-row gutter={ 32 } type="flex">
                  { this.showAddButton && (
                    <a-col span={ 2 }>
                      <a-button type="primary" loading={ this.addButtonLoading } on-click={ this.handleAdd }>
                        { this.showAddButtonIcon && <a-icon type={ this.addButtonIconType } /> }
                        <span>{ this.addButtonText }</span>
                      </a-button>
                    </a-col>
                  ) }
                  <a-col span={ 22 }>
                    { extraButton }
                  </a-col>
                </a-row>
              </a-form> : null
          }
          {// 列表slot=infoList
            this.showInfoList &&
            ((this.$slots.infoList && gsNode(this.$slots.infoList, h)) || (<InfoList { ...{ props: infoListProps } } />)) }
        </div>
      )
      const modalVnode = (
        <a-modal
          ref="myBaseModal"
          { ...{ props: modalProps, scopedSlots: modalScopedSlots } }
          on-cancel={ this.handlerModalCancel }
          on-ok={ this.handlerModalOk }
          on-input={ v => (this.showModal = v) }
        >
          {//模式窗口内容slot=modal
            (this.$slots.modal && gsNode(this.$slots.modal, h)) || this.renderModalSlot() }
        </a-modal>
      )
      Array.prototype.push.apply(renderNodes, [baseView, modalVnode])

    } else {
      const $node = (this.$slots.extra && gsNode(this.$slots.extra, h)) || this.renderExtraSlot()
      $node && (scopedSlots.extra = () => ($node))
    }

    const defaultVnode = (this.$slots.default && gsNode(this.$slots.default, h)) || this.renderDefaultSlot()

    renderNodes.push(defaultVnode)

    const re = this.startRenderSlot(renderNodes)

    scopedSlots.default = typeof re !== 'function' ? () => [re] : re

    return <Layout { ...{ scopedSlots, props: { showBreadCrumb: this.showBreadCrumb, useCustomLayout: this.useCustomLayout } } } />
  }
}
