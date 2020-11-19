import axios from 'axios'
import store from '@/store'
import config from '@/config'
import { relogin, isObject } from '@/libs/util'



let logOutTimer = null
/* 解析配置中默认参数 */
const DEFAULT = {
  baseUrl: config.baseUrl,
  timeout: config.timeout,
  name: config.name,
  version: config.version,
  device: config.device,
  remoteTarget: ''
}

/**
 * 转换pagination的属性字符串为number
 * @param {Object} pagination
 */
const convertPagination = function (pagination) {
  if (!Object.isObject(pagination)) return
  for (let o in pagination) {
    if (pagination.hasOwnProperty(o)) {
      if (o !== 'per_page') {
        pagination[o] = ~~pagination[o]
      }
    }
  }
}


/**
 * URL前缀装饰器
 */
const decorateUrl = function () {
  return function (target, name, decorater) {
    const fn = decorater.value
    decorater.value = function (...args) {
      const { 0: url, 1: params, 2: options } = args
      return fn.apply(this, [`${this._def.remoteTarget.replace(/\/$/, '')}/${url.replace(/^\//, '')}`, params, options])
    }

  }
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
  @decorateUrl()
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
  @decorateUrl()
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
    opt.version && (headers['XTHK-ONLINE-VERSION'] = headers['APP-VERSION'] = opt.version)
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
          //拉截处理pagination属性值为字符串类型的问题
          if (data && Object.isObject(data.data) && data.data.hasOwnProperty('meta') && data.data['meta']) {
            convertPagination(data.data['meta'].pagination)
          }
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

          return new Promise(() => { })
        default:
          return Promise.reject(data)
      }
    }
    /* 响应失败拦截 */
    const responseFail = error => {
      if (error && error.response) {
        const div = document.createElement('div')
        div.innerHTML = error.response.data
        let msg = div.innerText
        return Promise.reject({ message: msg })
      } else {
        return Promise.reject({ message: '网络异常，请稍后再试' })
      }
    }
    // 添加响应拦截器
    instance.interceptors.response.use(responseSuccess, responseFail)
    return instance(options)
  }
}

export default new Fetch({ remoteTarget: config.remoteTarget })

export { Fetch as FetchClass }

/** 
 * 生成fetch实例 
 * @param {string} remoteTarget - 对应的api网关代理标识
 * @param {object} options - 相应的请求设置项
 */
export const createFetchInstance = function (remoteTarget = '', options = {}) {
  if (!isObject(options)) throw new Error('options参数只能是对象')
  return new Fetch(Object.assign({}, { remoteTarget }, options))
}