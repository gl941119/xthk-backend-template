/**平台系统间通信类型 */
const communicationType = {
    /**用户信息更新 */
    userUpdate: 'USER_UPDATE@',
    /**城市切换 */
    changeCity: 'CHANGE_CITY@',
    /**子系统访问路径改变 */
    systemChange: 'SYSTEM_URL_CHANGE@'
}

const listener = Symbol('listener')
const listener_callback = Symbol('listener_callback')
const eventMap = new Map()
/**
 * 系统通迅类
 */
class SystemCommunication {
    /**
     * @constructor 构造器
     * @param {string} type 通信类型
     */
    constructor(type) {
        if (typeof type !== 'string') throw new Error('类型必须为字符串')
        if (!type.endsWith('@')) {
            type += '@'
        }
        this.type = type
    }

    [listener_callback] = null;

    [listener]({ data, origin, source }) {
        if (data && typeof data === 'string' && data.indexOf(communicationType.userUpdate) > -1) {
            let info = data.substring(communicationType.userUpdate.length)
            try {
                info = JSON.parse(info)
            } catch (e) {
                console.log('message json parse fail')
            }
            if (this[listener_callback]) {
                if (Array.isArray(this[listener_callback])) {
                    this[listener_callback].forEach(n => {
                        if (typeof n === 'function') {
                            n(info)
                        }
                    })
                } else if (typeof this[listener_callback] === 'function') {
                    this[listener_callback](info)
                }
            }
        }
    }

    /**
     * 指定窗体发送信息
     * @param {Object} info 信息内容主体
     * @param {BrowerWindowObject} receviceWindow 接收窗体
     * @param {String} targetOrigin 通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。
     * 在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。
     * 这个机制用来控制消息可以发送到哪些窗口；例如，当用postMessage传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的origin属性完全一致，来防止密码被恶意的第三方截获。如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的targetOrigin，而不是*。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。
     */
    send(info, receviceWindow, targetOrigin = '*') {
        if (!receviceWindow) {
            receviceWindow = window.parent === self ? (window.opener ? window.opener : window) : window.parent
        }
        ;(info === null || info === undefined) && (info = '')
        info = `${this.type}${JSON.stringify(info)}`

        receviceWindow.postMessage(info, targetOrigin)
    }

    /**
     * 当前窗体监听用户更新消息
     * @param {Function} callback 监听用户更新回调方法
     *
     * */
    listener(callback) {
        window.removeEventListener('message', eventMap.get(this.type))

        eventMap.set(
            this.type,
            (function(t) {
                return function(event) {
                    t[listener](event)
                }
            })(this)
        )

        window.addEventListener('message', eventMap.get(this.type), false)
        if (!this[listener_callback]) {
            this[listener_callback] = callback
        } else if (Array.isArray(this[listener_callback])) {
            this[listener_callback].push(callback)
        } else {
            this[listener_callback] = [this[listener_callback], callback]
        }
    }
    /**关闭当前窗体监听 */
    off() {
        window.removeEventListener('message', eventMap.get(this.type))
        this[listener_callback] = null
        eventMap.delete(this.type)
    }
    /**
     * 移出当前窗体监听回调方法
     * @param {Function} 监听回调的方法
     */
    removeCallback(callback) {
        if (this[listener_callback]) {
            if (Array.isArray(this[listener_callback])) {
                let idx = this[listener_callback].indexOf(callback)
                if (idx !== -1) {
                    this[listener_callback].splice(idx, 1)
                }
                !this[listener_callback].length && (this[listener_callback] = null)
            } else if (typeof this[listener_callback] === 'function' && this[listener_callback] === callback) {
                this[listener_callback] = null
            }
        }
    }
}

let sc = {
    install(Vue, options) {
        Vue.prototype.$sc = {
            userUpdate: new SystemCommunication(communicationType.userUpdate),
            changeCity: new SystemCommunication(communicationType.changeCity),
            systemChange: new SystemCommunication(communicationType.systemChange)
        }
    }
}
export default sc
export { communicationType }
