<template>
    <a-breadcrumb
        :routes="breadcrumb"
        class="breadcrumb"
    >
        <template
            slot="itemRender"
            slot-scope="{ route, params, routes }"
        >
            <span v-if="routes.indexOf(route) === routes.length - 1">
                {{
                route.breadcrumbName
                }}
            </span>
            <router-link
                :to="{ name: route.name }"
                v-else
            >
                {{
                route.breadcrumbName
                }}
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
            //生成面包宵数据。根据实际情况和重写
            let info = this.$route.matched.filter(
                ({ path, redirect: { name } = { name: '' } }) => {
                    return path && !name
                }
            )
            let temp = []
            info.forEach((n, i) => {
                if (n.meta && n.meta.preRoute) {
                    temp.push({ ...n.meta.preRoute })
                }
                temp.push({ ...n })
            })

            info = temp.map(
                ({ name, meta: { title: breadcrumbName } = { title: '' } }) => {
                    return {
                        breadcrumbName,
                        name
                    }
                }
            )
            return info
        }
    },
    mounted() {},
    methods: {}
}
</script>
<style lang="scss">
.breadcrumb {
    line-height: 40px;
}
</style>
