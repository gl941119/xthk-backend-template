import config from '@/config'
const setCookie = Symbol('setCookie')
const removeCookie = Symbol('removeCookie')
const getCookie = Symbol('getCookie')
const interceptorKey = Symbol('interceptorKey')
const oneSecond = 1000
const sixty = 60

const cookieOption = {
    path: '/',
    domain: '',
    secure: false,
    expires: config.cookieExpires * 24 * sixty * sixty * oneSecond
}
const storage = {
    local: window.localStorage,
    session: window.sessionStorage
}
/**
 * 本地存储类。可操作三种类型：cookie、localStorage、sessionStorage
 * @class
 */
class Storage {
    /**
     * Storage 的构造函数
     * @param {string} type 存储类型。cookie、local、session。默认cookie
     */
    constructor(type = 'cookie') {
        this.type = type
    }

    /**
     * 拦截对象
     * @memberof Storage#
     * @property {object} interceptors.key key字段拦截属性
     * @property {null|function} interceptors.key.once 执行一次的拦截。类型为function时执行，默认传入参数key. 执行后重置为null.返回拦截后的key值
     * @property {function} interceptors.key.default 默认的拦截。once为空时将会执行该拦截。返回拦截后的key值。
     */
    interceptors = {
        key: {
            once: null,
            default: key => {
                return key
            }
        }
    };

    /**
     * key拦截器执行
     * @param {string} key
     * @return {string}
     */
    [interceptorKey](key) {
        let k
        if (this.interceptors && (k = this.interceptors.key)) {
            if (k.once && typeof k.once === 'function') {
                k = k.once(key) || key
            } else if (k.default && typeof k.default === 'function') {
                k = k.default(key) || key
            }
        }

        return k
    }

    /**
     * 设置存储项
     * @param {string} key 存储键值（名称）
     * @param {string|object} value 存储的内容,字符串、数组 、Object.
     * @param {object|int} options 相关设置,type=cookie时有效.为数字时表时cookie的过期时间为分钟。
     * @property {int} options.expires 过期时间分钟.
     * @property {string} otpions.path cookie可见地址
     * @property {string} options.domain cookie可见域
     * @property {boolean}  options.secure 是否支持https传输
     */
    set(key, value, options) {
        if (!key && typeof key !== 'string') return
        let k = key
        let v = JSON.stringify(value)

        if (!v) {
            throw new Error('cookie存储内容格式不正确!')
        }
        k = encodeURIComponent(this[interceptorKey](k))
        v = encodeURIComponent(v)
        switch (this.type) {
            case 'cookie':
                this[setCookie](k, v, options)
                break
            case 'local':
            case 'session':
                storage[this.type].setItem(k, v)
                break
            default:
                break
        }
    }

    /**
     * 获得存储值
     * @param {string} key 存储值的Key名称
     * @returns {string|object}
     */
    get(key) {
        if (!key && typeof key !== 'string') return
        let k = encodeURIComponent(this[interceptorKey](key))
        let v = null
        switch (this.type) {
            case 'cookie':
                v = this[getCookie](k)
                break
            case 'local':
            case 'session':
                v = storage[this.type].getItem(k)
                break
            default:
                break
        }
        if (v) {
            v = decodeURIComponent(v)
            try {
                v = JSON.parse(v)
            } catch (e) {
                console.log(e)
            }
        }
        return v
    }

    /**
     * 称出某一特定的存储值
     * @param {string} key 存储值的Key名称
     * @property {string} otpions.path cookie可见地址
     * @property {string} options.domain cookie可见域
     * @property {boolean}  options.secure 是否支持https传输
     */
    remove(key, options) {
        if (!key && typeof key !== 'string') return
        let k = encodeURIComponent(this[interceptorKey](key))
        switch (this.type) {
            case 'cookie':
                this[removeCookie](k, options)
                break
            case 'local':
            case 'session':
                storage[this.type].removeItem(k)
                break
            default:
                break
        }
    }

    /**
     * 设置cookie
     * @private
     * @param {string} key cookie的名称
     * @param {string} value 存储的内容
     * @param {json|int} options 相关设置,type=cookie时有效.为数字时表时cookie的过期时间为分钟。
     * @property {string} otpions.path cookie可见地址
     * @property {string} options.domain cookie可见域
     * @property {boolean}  options.secure 是否支持https传输
     */
    [setCookie](key, value, options) {
        let opt = {
            ...cookieOption
        }
        //options为整型，且大于0时指定过期时间
        if (Number.isInteger(options)) {
            opt.expires = options > 0 ? options * sixty * oneSecond : -1
        } else if (Object.isObject(options)) {
            opt = {
                ...opt,
                ...options
            }
            opt.expires =
                opt.expires > 0 ? opt.expires * sixty * oneSecond : opt.expires
        }
        let expireDate = new Date()
        expireDate.setTime(expireDate.getTime() + opt.expires)
        let path = opt.path ? `;path=${opt.path}` : ''
        let expire = `;expires=${expireDate.toGMTString()}`
        let domain = opt.domain ? `;domain=${opt.domain}` : ''
        let secure = opt.secure ? ';secure' : ''
        document.cookie = `${key}=${value}${expire}${path}${domain}${secure}`
    }

    /**
     * 移出cookie
     * @param {string} key cookie的名称
     */
    [removeCookie](key, options = { ...cookieOption }) {
        let opt = { ...cookieOption, ...options }
        opt.expires = -1
        if (document.cookie.length > 0) {
            this[setCookie](key, '', opt)
        }
    }

    /**
     * 获得cookie 内容
     * @param {string} key cookie名称
     */
    [getCookie](key) {
        let arr = document.cookie.match(new RegExp(`(^| )${key}=([^;]*)(;|$)`))
        return arr !== null && arr[2]
    }
}
const cookie = new Storage('cookie')
const local = new Storage('local')
const session = new Storage('session')
export { cookie, local, session }
export default Storage
