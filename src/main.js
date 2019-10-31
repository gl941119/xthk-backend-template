import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import Viser from 'viser-vue'
import './libs/extends.js'
import './libs/ant-design-use'
import './mixins/global'
import './assets/less/index.less'
import './assets/scss/common.scss'

Vue.config.productionTip = false

Vue.use(Viser)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
