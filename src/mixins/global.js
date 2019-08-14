import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

if (process.env.NODE_ENV === 'production') {
    //此处为sentry的接入口
    if (!Vue.prototype.$sentry) {
        Vue.config.errorHandler = (err, vm, info) => {
            console.error(err)
        }
        try {
            Sentry.init({
                dsn: decodeURIComponent(process.env.VUE_APP_SENTRY_DNS),
                integrations: [new Integrations.Vue({ Vue })],
                attachProps: true
                //release: '版本号',
                // environment: '环境，比如生产或者测试',
                //debug: process.env.NODE_ENV !== 'production'
            })
            Vue.prototype.$sentry = Sentry
        } catch (e) {
            console.log('sentry init fail：', e)
        }
    }
}
Vue.mixin({
    computed: {
        /**允许编辑*/
        allowEdit() {
            return true
        },
        /**允许添加*/
        allowAdd() {
            return true
        },
        /**允许删除*/
        allowDelete() {
            return true
        }
    },
    data() {
        return {
            /**数据是否加载中 */
            isLoading: false,
            /**数据保存中 */
            isSaving: false,
            /**
             *form表单，单行标签与输入框的占位 ant-design-form使用
             */
            formItemLayout: {
                labelCol: { span: 5 },
                wrapperCol: { span: 19 }
            }
        }
    },
    methods: {}
})
