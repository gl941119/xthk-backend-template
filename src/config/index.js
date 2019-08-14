export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: '后端管理系统基本框架',
    /**
     * @description 配置API接口中识别的项目类型
     */
    name: 'base-back-end',
    /**
     * @description 版本号
     * */
    version: '0.1.0',
    /**
     * @description 设备名称
     * */
    device: 'web',
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description api请求基础路径
     */
    baseUrl: process.env.VUE_APP_BASE_URL,
    /**
     * @description api额外路径
     */
    extraUrl: process.env.VUE_APP_EXTRA_URL,
    /**
     * @description api请求超时时间
     * */
    timeout: 30000,
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
    /**
     * @description 需要加载的插件
     */
    plugin: {
        'error-store': {
            showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
            developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    }
}
