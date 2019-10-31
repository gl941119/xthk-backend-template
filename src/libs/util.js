import Vue from 'vue'
import config from '@/config'
import Store from '@/store'
import router from '@/router'

import { sendMessage } from 'xthk-utils/system-communication'

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
    const keyValueArr = url.split('?')[1].split('&')
    let paramObj = {}
    keyValueArr.forEach(item => {
        const keyValue = item.split('=')
        paramObj[keyValue[0]] = keyValue[1]
    })
    return paramObj
}

/**9
 * 回到元素顶部
 * @param {HtmlDomObject} el -页面元素
 * @param {Number} from - 起始位置
 * @param {Number} to - 结束位置
 * @param {Number} duration - 延时时长
 * @param {Function} endCallback - 结束回调方法
 */
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, 1000 / 60)
            }
    }
    const difference = Math.abs(from - to)
    const step = Math.ceil((difference / duration) * 50)

    const scroll = (start, end, step) => {
        if (start === end) {
            endCallback && endCallback()
            return
        }

        let d = start + step > end ? end : start + step
        if (start > end) {
            d = start - step < end ? end : start - step
        }

        if (el === window) {
            window.scrollTo(d, d)
        } else {
            el.scrollTop = d
        }
        window.requestAnimationFrame(() => scroll(d, end, step))
    }
    scroll(from, to, step)
}

/**
 * @description 获得当前地址是否是域名地址
 */
export const isDomainAddress = () => {
    let hostname = window.location.hostname
    return !/^\d{1,3}\.\d{1,3}.\d{1,3}.\d{1,3}$/.test(hostname) && hostname.toLowerCase() !== 'localhost'
}
/**
 * @description 获得当前主域名
 */
export const getMasterDomain = () => {
    let arr = window.location.hostname.split('.')
    if (arr.length > 2) {
        return arr
            .reverse()
            .slice(0, 2)
            .reverse()
            .join('.')
    }
    return `.${arr.join('.')}`
}

/**
 * @description 向指定窗口发送消息
 * @param {String}  message 需要发送的消息
 * @param {HtmlDomObject} win 指定的父级窗口对象。默认为window.parent
 */
export const postMessage = (message, win = window.parent) => {
    win.postMessage(message, '*')
}

// eslint-disable-next-line no-underscore-dangle
const catchMessateFunction = new Map()

/**
 * @description 接收post过来的消息
 * @param {Function|Boolean} fn  fu参数为function时为回调方法、为 Boolean时表示移出接收消息操作品
 * @param {string} key 对应的key值，可以为空
 */
export const receviceMessage = (fn, key) => {
    let { host, protocol } = window.location
    let k = key || `${protocol}//${host}`
    if (catchMessateFunction.has(k) && catchMessateFunction.get(k)) {
        window.removeEventListener('message', catchMessateFunction.get(k))
    }
    if (typeof fn !== 'boolean') {
        window.addEventListener('message', fn, false)
        catchMessateFunction.set(k, fn)
    }
}

/**
 * @description 改变指定父级节点下的所的所有button的禁用状态
 * @param {Boolean} isDisabled 是否禁用
 * @param {HtmlDomObject} parentNode 父级节点
 */
export const changeButtonDisabledStatu = (isDisabled, parentNode) => {
    let buttons = parentNode.querySelectorAll('button')
    buttons.forEach(n => {
        n.disabled = isDisabled
    })
    return buttons
}

/**
 * 格式化数字为 （xxx,xxx,xxx）呈现形式
 * @param {*} value 需要格式化的内容
 */
export const formatNumber = value => {
    value += ''
    const list = value.split('.')
    const prefix = list[0].charAt(0) === '-' ? '-' : ''
    let num = prefix ? list[0].slice(1) : list[0]
    let result = ''
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`
        num = num.slice(0, num.length - 3)
    }
    if (num) {
        result = num + result
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`
}

/**
 * 消抖执行方法
 * @param {Function} fn 待执行方法
 * @param {Number} delay 消抖延时执行时间。默认180
 */
export const debounce = (fn, delay = 180) => {
    let timer = null

    return function() {
        let args = arguments
        let context = this
        if (timer) {
            clearTimeout(timer)
            timer = setTimeout(function() {
                fn.apply(context, args)
                timer = null
            }, delay)
            console.log(timer)
        } else {
            timer = setTimeout(function() {
                fn.apply(context, args)
            }, delay)
        }
    }
}

/**
 * 节流执行方法
 * @param {Function} fn 待执行方法
 * @param {Number} delay 节流延时执行时间。默认180
 */
export const throttle = (fn, delay = 180) => {
    let timer = null,
        remaining = 0,
        previous = new Date()

    return function() {
        let now = new Date(),
            remaining = now - previous,
            args = arguments,
            context = this

        if (remaining >= delay) {
            if (timer) {
                clearTimeout(timer)
            }

            fn.apply(context, args)
            previous = now
        } else {
            if (!timer) {
                timer = setTimeout(function() {
                    fn.apply(context, args)
                    previous = new Date()
                }, delay - remaining)
            }
        }
    }
}

/**重登录 */
export const relogin = function(cb) {
    sendMessage.logout(() => {
        Store.dispatch('logout')
        router.replace({ name: 'login' })
        Vue.prototype.$message.error('请重新登录')
    })
    //logOutTimer = null
}
