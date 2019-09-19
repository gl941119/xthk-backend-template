import axios from 'axios'
import store from '@/store'
import config from '@/config'
import { relogin } from '@/libs/util'

let logOutTimer = null
/* 解析配置中默认参数 */
const DEFAULT = {
    baseUrl: config.baseUrl,
    timeout: config.timeout,
    name: config.name,
    version: config.version
}
/**
 * @class API请求封装
 * */
class Fetch {
    /**构造 */
    constructor(options = {}) {
        this._def = Object.assign({}, DEFAULT, options)
    }

    /**
     * @description get请求封装
     * */
    get(url, params, options = {}) {
        return this._fetch({
            url,
            method: 'get',
            params,
            options
        })
    }
    /**
     * @description post请求封装
     * */
    post(url, data, options = {}) {
        return this._fetch({
            url,
            method: 'post',
            data,
            options
        })
    }
    /**
     * @description 请求体
     * @param {object} options 请求额外参数
     * */
    _fetch(options) {
        const opt = Object.assign({}, this._def, options.options)
        const headers = {
            Authorization: store.getters.getToken || ''
        }

        opt.name && (headers['APP-NAME'] = opt.name)
        opt.version && (headers['APP-VERSION'] = opt.version)
        opt.device && (headers['APP-DEVICE'] = opt.device)

        /* 创建axios实例 */
        const instance = axios.create({
            /* 默认请求根目录 */
            baseURL: opt.baseUrl,
            /* 请求超时时间 */
            timeout: opt.timeout,
            /* 设置header */
            headers
        })

        /* 请求拦截 */
        instance.interceptors.request.use(config => {
            return config
        })
        /* 响应成功拦截 */
        const responseSuccess = response => {
            let { data, headers: { authorization } = {} } = response
            /* 重新设置token */
            authorization && store.commit('setToken', authorization)
            /* 状态统一处理 */
            switch (data.status_code) {
                case 200:
                    return data
                case 401:
                    if (logOutTimer) {
                        clearTimeout(logOutTimer)
                        logOutTimer = null
                    }
                    logOutTimer = setTimeout(() => {
                        // store.dispatch('logout')
                        // router.replace({ name: 'login' })
                        logOutTimer = null
                        relogin()
                        //Vue.prototype.$message.error('请重新登录')
                    }, 150)

                    return new Promise(() => {})
                default:
                    return Promise.reject(data)
            }
        }
        /* 响应失败拦截 */
        const responseFail = error => {
            if (error && error.response) {
                return Promise.reject(error.response.data)
            } else {
                return Promise.reject({ message: '网络异常，请稍后再试' })
            }
        }
        // 添加响应拦截器
        instance.interceptors.response.use(responseSuccess, responseFail)
        return instance(options)
    }
}

export default new Fetch()

export { Fetch as FetchClass }
