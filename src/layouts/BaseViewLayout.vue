<template>
  <PageLayout>
    <div slot='extra'>
      <a-input-search
        ref='aInputSearch'
        :placeholder='searchPlaceholder'
        @search='handleSearch'
        :defaultValue='searchInputDefaultValue'
        style='width:240px'
        v-if='showSearchInput'
      ></a-input-search>
    </div>
    <div class='base-view' :class='baseViewClass'>
      <a-form>
        <slot name='query'></slot>
        <a-row :gutter='32' type='flex'>
          <a-col :span='2' v-if='showAddButton' style='width:auto;'>
            <a-button type='primary' @click='handleAdd' :loading='addButtonLoading'>
              <a-icon :type='addButtonIconType' v-if='showAddButtonIcon' />
              <span>{{ addButtonText }}</span>
            </a-button>
          </a-col>
          <a-col :span='22' style='flex:1 !important'>
            <slot name='extra-button'></slot>
          </a-col>
        </a-row>
      </a-form>
      <info-list
        :columns='columns'
        :source='dataSource'
        :pagination='pagination'
        :rowKey='rowKey'
        :loading='infoListloading'
        :onSorter='onSorter'
        :onPageChange='onPageChange'
        :rowSelection='rowSelection'
        v-if='showInfoList'
      ></info-list>
    </div>
    <a-modal
      class='my-modal'
      :class='modalClass'
      :visible='showModal'
      @cancel='handlerModalCancel'
      :afterClose='handlerModalClose'
      @ok='handlerModalOk'
      :maskClosable='false'
      :destroyOnClose='true'
      :confirmLoading='confirmLoading'
      :width='modalWidth'
      :footer='modalFooter'
    >
      <template slot='title'>
        <span>{{ modalTitle }}</span>
        <span style='margin-left:1em;font-size:12px;color:gray' v-if='showModalSecondTitle'>基础信息</span>
      </template>
      <slot name='modal'></slot>
    </a-modal>
    <slot></slot>
  </PageLayout>
</template>

<script>
import PageLayout from '_layout/PageLayout'
import InfoList from '_c/info-list'
const handle = {
  type: Function,
  default: () => {}
}
export default {
  name: 'BaseView',
  components: {
    PageLayout,
    InfoList
  },
  props: {
    baseViewClass: {
      type: String,
      default: ''
    },
    /**页面标题 */
    title: {
      type: String,
      default: '基础页面'
    },
    /**模式窗口标题  */
    modalTitle: {
      type: String,
      default: '基础信息'
    },
    /** 是否显示添加按钮ICON */
    showAddButtonIcon: {
      type: Boolean,
      default: true
    },
    /**添加按钮文件 */
    addButtonText: {
      type: String,
      default: '添加'
    },
    /**添加按钮Icon type */
    addButtonIconType: {
      type: String,
      default: 'plus'
    },
    /**添加按钮是否loading中 */
    addButtonLoading: {
      type: Boolean,
      default: false
    },
    /**是否显示模式窗口 */
    showModal: {
      type: Boolean,
      default: false
    },
    /**显示infolist列表` */
    showInfoList: {
      type: Boolean,
      default: true
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    searchPlaceholder: {
      //查询框提示内容
      type: String,
      default: '请输入查询内容'
    },
    /**查询输入框默认值 */
    searchInputDefaultValue: {
      type: String,
      default: ''
    },
    showSearchInput: {
      type: Boolean,
      default: false
    },
    /**查询文本框搜索事件 */
    handleSearch: handle,
    /** 添加按钮事件*/
    handleAdd: handle,
    /**显示添加按钮 */
    showAddButton: {
      type: Boolean,
      default: true
    },
    /**模式窗口点击确认 */
    handlerModalOk: handle,
    /**模式窗口点击取消 */
    handlerModalCancel: handle,
    handlerModalClose: handle,
    /** 列表分页信息 */
    pagination: {
      type: Object,
      default: () => {
        return {
          total: 0
        }
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    },
    rowKey: {
      type: [String, Function],
      default: () => {
        return record => record.id
      }
    },
    infoListloading: {
      type: Boolean,
      default: false
    },
    /**显示模式窗次级名称 */
    showModalSecondTitle: {
      type: Boolean,
      default: true
    },
    modalWidth: {
      type: [Number, String],
      default: 520
    },
    /**模式窗口底部内容 */
    modalFooter: {
      type: [String, Object, undefined],
      default: undefined
    },
    /** 翻页回调方法 */
    onPageChange: handle,
    /**排序回调方法 */
    onSorter: handle,
    /**表格行操作对象 */
    rowSelection: {
      type: [Object, null],
      default: null
    },
    /**模式窗口扩展样式 */
    modalClass: {
      type: [String],
      default: ''
    }
  },
  data() {
    return {
      modalVisible: this.showModal
    }
  },
  watch: {
    showModal(c, o) {
      this.modalVisible = c
    }
  },
  created() {
    // this.$refs.aInputSearch.value = this.searchInputDefaultValue
  },
  mounted() {},
  methods: {
    test() {}
  }
}
</script>

<style lang="scss">
@import '_scss/var.scss';
@import '_scss/my-modal.scss';

.base-view {
  height: $p100;
}
</style>
