<template>
  <base-view
    ref='bView'
    title='接口列表'
    addButtonIconType='scan'
    addButtonText='扫描'
    searchPlaceholder='请输入接口名称或地址'
    :addButtonLoading='addButtonLoading'
    :handleAdd='handleAdd'
    :handleSearch='handleSearch'
    :dataSource='dataSource'
    :pagination='pagination'
    :columns='columns'
    :infoListloading='loading'
    :onPageChange='onPageChange'
  ></base-view>
</template>

<script>
import BaseView from '_layout/BaseViewLayout'
import { baseViewMixin } from '@/mixins/baseView.js'
import {
  getRbacPermissionsList,
  rbacPermissionsWhite,
  rbacPermissionsToggleEnable,
  rbacPermissionsScanapi
} from '_axios/permission'
export default {
  name: 'Interface',
  components: {
    BaseView
  },
  mixins: [baseViewMixin],
  data() {
    return {
      columns: [
        { title: '序号', dataIndex: 'num' },
        { title: '接口名称', dataIndex: 'name' },
        { title: '接口地址', dataIndex: 'permission' },
        {
          title: '启用状态',
          dataIndex: 'status',
          width: 200,
          customRender: (text, record, dataIndex) => {
            return (
              <a-switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={record.status === 1}
                onChange={checked => this.handleStateChange(text, record, dataIndex, checked)}
              />
            )
          }
        },
        {
          title: '加入白名单',
          dataIndex: 'is_white',
          width: 200,
          customRender: (text, record, dataIndex) => {
            return (
              <a-switch
                checkedChildren="启用"
                unCheckedChildren="禁用"
                checked={record.is_white === 1}
                onChange={checked => this.handleWhiteChange(text, record, dataIndex, checked)}
              />
            )
          }
        }
      ],
      addButtonLoading: false
    }
  },
  created() {
    Object.assign(this.query, { keyword: '' })
    this.getInfoList()
  },
  methods: {
    /**获得列表信息.*/
    getInfoList(page) {
      if (page === 1) {
        this.query.page = 1
      }
      return getRbacPermissionsList(this.query)
        .then(
          ({
            status_code,
            message,
            data: { meta: { pagination }, data } = {
              meta: { pagination: {} },
              data: []
            }
          }) => {
            this.setDataSource(data, pagination)
          }
        )
        .catch(({ message }) => {
          this.$message.error(message)
        })
    },
    /**添加按钮事件。*/
    async handleAdd() {
      this.$confirm({
        title: '警告',
        content: (
          <span>
            <span class="error">扫描操作会重置当前现有的接口状态</span>
            ，你确认要进行扫描操作吗?
          </span>
        ),
        onOk: async () => {
          this.addButtonLoading = true
          await rbacPermissionsScanapi()
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
    handleSearch: debounce(function(value) {
      this.query.keyword = value
      this.getInfoList(1)
    }),
    /**启用状态事件 */
    async handleStateChange(text, record, dataIndex, checked) {
      let origin = record.status
      record.status = origin ? 0 : 1
      await rbacPermissionsToggleEnable({ id: record.id })
        .then(({ status_code, message, data: { status } }) => {
          if (status_code === 200) {
            this.$message.success(message)
          } else {
            this.$message.error(message)
            record.status = origin
          }
        })
        .catch(({ message }) => {
          this.$message.error(message)
          record.status = origin
        })
    },
    /**白名单事件 */
    async handleWhiteChange(text, record, dataIndex, checked) {
      let origin = record.is_white
      record.is_white = origin ? 0 : 1
      await rbacPermissionsWhite({ id: record.id })
        .then(({ status_code, message, data: { status } }) => {
          if (status_code === 200) {
            this.$message.success(message)
          } else {
            this.$message.error(message)
            record.is_white = origin
          }
        })
        .catch(({ message }) => {
          this.$message.error(message)
          record.is_white = origin
        })
    }
  }
}
</script>

<style lang="scss"></style>
