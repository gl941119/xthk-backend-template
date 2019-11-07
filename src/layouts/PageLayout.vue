<template>
  <div class='layout'>
    <bread-crumb v-if='showBreadCrumb'></bread-crumb>
    <a-card class='layout-card' :title='title' :bordered='false'>
      <div slot='extra'>
        <slot name='extra'></slot>
      </div>
      <slot></slot>
    </a-card>
  </div>
</template>

<script>
import BreadCrumb from '_c/breadcrumb'
export default {
  name: 'PageLayout',
  props: {
    showBreadCrumb: {
      type: Boolean,
      default: true
    }
  },
  components: {
    BreadCrumb
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  }
}
</script>

<style lang="scss">
.layout {
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
</style>
