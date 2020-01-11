# base-index-mixins 使用帮助

## 介绍

base-index-mixins.js 是为了应对在后台管理系统中对于模块功能首页的基础的列表查询页，进行公用封装的基于 vue.js 的 mixins 文件。目的是为减少部份重复性操作

## 页面组成

### 0.默认搜索框区域

    可重写 slot=extra

### 1.搜索查询区域

​ 包含 slot=query

### 2.操作按扭区域

​ 包含 slot=extraButton

### 3.列表区域

​ 可重写 slot=infoList

### 4.模式窗口

​ 包含 slot=modal

### 5.默认区域

​ 包含 slot

## 说明

### 1.引用方式

在.vue 页里

import baseIndexVueMixins from '@/mixins/base-index-mixins'

mixins: [baseIndexVueMixins]

### 2.内置的页面 data 值

​ 可根据需要在当前 vue 页，重写获赋值对应的 data 值

```
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
showInfoList: false,
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
/**
* 显示模式窗口名称
*/
showModalSecondTitle: true,
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
    getInfoList:null,
    /**保存数据 */
    saveInfo: null
},
/**当前查询条件 */
query: {
    /**每页呈现记录数 */
    per_page: perPage,
    /**当前页码 */
    page: 1
}
```

### 2.内置方法

​ 所有方法均可按需 override

```
/**获得列表信息 */
    getInfoList(page = 0) {},
    /**调用信息列表之前调用方法 */
    onBeforeGetInfoList() {},
    /**在绑定数据之前调用方法。可返回新的数据对象 */
    onBeforeBindInfoList(source) {},
    /**
     * 保存数据之前调用方法
     * @param {Object} values 相关表单值
     * */
    onBeforeSaveInfo(values) {},
    /**模式窗口确认操作成功后调用方法 */
    onModalOk() {},
    /**查询区域表单字段值改变事件 */
    handlFormFieldsChange(props, fields) {},
    /**查询文本框搜索事件 */
    handleSearch() {},
    /** 添加按钮事件*/
    handleAdd() {},
    /**模式窗口点击确认 */
    handlerModalOk() {},
    /**模式窗口点击取消 */
    handlerModalCancel() {},
    handlerModalClose() {},
    /** 翻页回调方法 */
    async handlePageChange({ current, pageSize }) {},
    /**排序回调方法 */
    handleSorter({ order, columnKey, field }) {},
    /**
     * 渲染扩展按钮
     */
    renderExtraButtonSlot() {},
    /**渲染扩展查询 */
    renderQuerySlot() {},
    /**渲染模式窗口内容 */
    renderModalSlot() {},
    /**渲染页面默认扩展内容 */
    renderDefaultSlot() {}
```

## 用法:

​ 在 vue 页面，设置 api.getInfoList 值为接口方法，并设置 columns 后，可查询数据并填数据列表.

​ 设置 api.saveInfo 值为保存接口方法。可在点击模式窗口确认按钮后调用方保存方法保存数据

​ 其它参见 method 与 data 说 明
