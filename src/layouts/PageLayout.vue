<template>
  <div class="layout">
    <div :class="headerClass">
      <bread-crumb v-if="showBreadCrumb"></bread-crumb>
    </div>
    <a-card class="layout-card" :title="title" :bordered="false">
      <template v-slot:extra>
        <div>
          <slot name="extra"></slot>
        </div>
      </template>
      <slot></slot>
    </a-card>
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
    }
  }
}
</script>

<style lang="scss">
.layout {
  &__header {
    display: flex;
    flex-direction: row;

    &:last-child {
      flex: 1;
    }
    &.show-silder {
      padding-left: 32px;
    }
  }
  .layout-card {
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
}
.query-form {
  .ant-form-item {
    margin-bottom: 12px;
  }
}
</style>
