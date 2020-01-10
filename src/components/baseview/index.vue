<template>
  <layout>
    <div slot="extra">
      <a-input-search
        ref="aInputSearch"
        :placeholder="searchPlaceholder"
        :defaultValue="searchInputDefaultValue"
        style="width:240px"
        @search="handleSearch"
      ></a-input-search>
    </div>
    <div class="base-view" :class="baseViewClass">
      <a-form>
        <slot name="query"></slot>
        <a-row :gutter="32" type="flex">
          <a-col v-if="showAddButton" :span="2">
            <a-button type="primary" :loading="addButtonLoading" @click="handleAdd">
              <a-icon v-if="showAddButtonIcon" :type="addButtonIconType" />
              <span>{{ addButtonText }}</span>
            </a-button>
          </a-col>
          <a-col :span="22">
            <slot name="extra-button"></slot>
          </a-col>
        </a-row>
      </a-form>
      <info-list
        v-if="showInfoList"
        :columns="columns"
        :source="dataSource"
        :pageSettings="pagesetting"
        :pagination="pagination"
        :rowKey="rowKey"
        :loading="infoListloading"
        :onSorter="onSorter"
        :onPageChange="onPageChange"
      ></info-list>
    </div>
    <a-modal
      class="my-modal"
      :visible="showModal"
      :afterClose="handlerModalClose"
      :maskClosable="false"
      :destroyOnClose="true"
      :confirmLoading="confirmLoading"
      :width="modalWidth"
      :footer="modalFooter"
      @cancel="handlerModalCancel"
      @ok="handlerModalOk"
    >
      <template slot="title">
        <span>{{ modalTitle }}</span>
        <span v-if="showModalSecondTitle" style="margin-left:1em;font-size:12px;color:gray">基础信息</span>
      </template>
      <slot name="modal"></slot>
    </a-modal>
    <slot></slot>
  </layout>
</template>

<script>
import Layout from '_c/layout'
import InfoList from '_c/info-list'
const handle = {
  type: Function,
  default: () => {}
}
export default {
  name: 'BaseView',
  components: {
    Layout,
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
    pageSettings: {
      type: [Object, Boolean, undefined],
      default: undefined
    },
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
    onSorter: handle
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
