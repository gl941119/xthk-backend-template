<template>
  <a-breadcrumb :class="'breadcrumb'" :routes="breadcrumb">
    <template v-slot:itemRender="{ route, params, routes }">
      <span v-if="routes.indexOf(route) === 0 || routes.indexOf(route) === routes.length - 1">
        {{ route.breadcrumbName }}
      </span>
      <router-link v-else :to="{ name: route.name }">
        {{ route.breadcrumbName }}
      </router-link>
    </template>
  </a-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  data() {
    return {}
  },
  computed: {
    breadcrumb() {
      let info = this.$route.matched.filter(({ path, redirect: { name } = { name: '' } }, index) => {
        return index === 1 || (path && !name)
      })
      let temp = []
      info.forEach((n, i) => {
        if (n.meta && n.meta.preRoute) {
          let pr = n.meta.preRoute
          if (Object.isObject(pr)) {
            temp.push({ ...n.meta.preRoute })
          } else if (Array.isArray(pr) && pr.length) {
            temp = [...temp, ...pr]
          }
        }
        temp.push({ ...n })
      })

      info = temp.map(({ name, meta: { title: breadcrumbName } = { title: '' } }) => {
        return {
          breadcrumbName,
          name
        }
      })
      return info
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss">
.breadcrumb {
  line-height: 40px !important;
  padding: 0 16px !important;
}
</style>
