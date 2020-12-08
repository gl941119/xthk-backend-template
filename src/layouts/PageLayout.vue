<template>
  <div class="layout">
    <div :class="headerClass">
      <div>
        <bread-crumb v-if="showBreadCrumb"></bread-crumb>
      </div>
      <slot name="headerExtra"></slot>
    </div>
    <div :class="layoutInnerClass">
      <template v-if="!useCustomLayout">
        <a-card class="layout-card" :title="title" :bordered="false">
          <template v-slot:extra>
            <div>
              <slot name="extra"></slot>
            </div>
          </template>
          <slot></slot>
        </a-card>
      </template>
      <!--自定义内容区域-->
      <template v-else>
        <slot name="extra"></slot>
        <div class="custom-layout__inner">
          <slot></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BreadCrumb from '_c/breadcrumb'
import { allowShowGlobalHeadTabs } from '@/config/common'
export default {
  name: 'PageLayout',
  components: {
    BreadCrumb
  },
  props: {
    showBreadCrumb: {
      type: Boolean,
      default: true
    },
    /** 使用自定义内容层 */
    useCustomLayout: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    },
    headerClass () {
      return {
        'layout__header': true,
        'show-silder': !allowShowGlobalHeadTabs
      }
    },
    layoutInnerClass () {
      return {
        'layout__inner': true,
        'custom-layout': this.useCustomLayout
      }
    }
  }
}
</script>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  min-width: 100%;
  .breadcrumb {
    background-color: #ffffff;
    flex: 1;
  }

  &__inner {
    flex: 1;
    overflow-y: auto;

    &.custom-layout {
      display: flex;
      flex-direction: column;
      padding: 0px !important;
      overflow: hidden;
      .custom-layout__inner {
        flex: 1;
        overflow-y: auto;
      }
    }
  }

  &__header {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #f0f2f5;
    background-color: #ffffff;
    > :first-child {
      flex: 1;
      display: flex;
      flex-direction: row;
    }
    .breadcrumb {
      flex: 1;
    }
    &.show-silder {
      padding-left: 32px;
    }
  }
  .layout-card {
    display: flex;
    flex-direction: column;
    flex: 0 auto;
    min-height: 100%;
    background-color: #ffffff;

    & > .ant-card-head {
      border-bottom: none;
      .ant-card-head-wrapper {
        align-items: flex-start;
        .ant-card-head-title {
          font-weight: bold;
        }
        .ant-card-extra {
          button {
            > {
              i {
                margin-left: 0;
              }
              span {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
    & > .ant-card-body {
      padding: 0 32px 24px;
    }
  }
  .ant-card-head {
    padding: 0 32px;
    flex: 0 0 auto;
  }
  .ant-card-body {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .ant-card-head-wrapper {
    &::after {
      content: '';
      height: 1px;
      position: absolute;
      left: 0;
      top: 56px;
      width: 100%;
      // background-color: #f0f2f5;
    }
  }
}
.query-form {
  .ant-form-item {
    margin-bottom: 12px;
  }
}
</style>
