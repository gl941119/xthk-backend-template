if (!Object.isObject) {
  /**
   * 判定对象是否为纯粹的object对象
   * @memberof Object
   * @param {any} obj 需要判定的对象
   * @returns {boolean}
   */
  Object.isObject = obj => {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
}

if (!Object.isAsyncFunction) {
  /**
   * 判定对象是否为async函数
   */
  Object.isAsyncFunction = obj => {
    return Object.prototype.toString.call(obj) === '[object AsyncFunction]'
  }
}

if (!Array.prototype.remove) {
  /**
   * 移出满足条件规则的数组元素
   * @param {function} fn  遍历时判定规则回调函数 .参数n表示当前元素，i表示当前元素所在索引项
   * @example
   *  let r = [1,2,4].remove(function(n,i){ return n===1; });
   * @returns {array|null} 返回被删除的组织对象
   */
  Array.prototype.remove = function(fn) {
    const me = this
    const len = me.length
    for (let i = 0; i < len; i++) {
      if (fn(this[i], i, this)) {
        return me.splice(i, 1)
      }
    }
    return null
  }
}

/**
 * @desc 是否UUID字符串
 * @name idUUID
 * @memberof String#
 * @example
 * var r =  "xxx".isUUID(
 * @returns {boolean}
 */
String.prototype.isUUID = function() {
  return /^[a-zA-Z0-9]{8}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{12}$/.test(this)
}

/**
 * 是否空白UUID字符串
 * @name isEmptyUUID
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isEmptyUUID = function() {
  return this === '00000000-0000-0000-0000-000000000000'
}

/**
 * 是否整型字符串
 * @name isInteger
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isInteger = function() {
  return new RegExp(/^\d+$/).test(this)
}

/**
 * 是否数字型字型串
 * @name isNumber
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isNumber = function() {
  return new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this)
}

/**
 * 移出头尾空格
 * @name trim
 * @memberof String#
 * @returns {string}
 */
String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 移出所有空格字符（含中文空白字符）
 * @name trimAll
 * @memberof String#
 * @returns {string}
 */
String.prototype.trimAll = function() {
  return this.replace(/ |　/g, '')
}
/**
 * 是否空字符串
 * @name isNullOrEmpty
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isNullOrEmpty = function() {
  return !this || this.length === 0 || this.trim().length === 0
}

/**
 * 是否IP地址
 * @name isIP
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isIP = function() {
  return /^((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))$/.test(this)
}

/**
 * 是否Mac地址
 * @name isMac
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isMac = function() {
  return /^[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}$/.test(this)
}

/**
 * 是否email格式
 * @name isEmail
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isEmail = function() {
  return new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim())
}

/**
 * 是否电话格式(含移动电话)
 * @name isPhone
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isPhone = function() {
  return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this)
}

/**
 * 是否电话格式
 * @name isTel
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isTel = function() {
  return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,8}$/.test(this)
}

/**
 * 是否有效移动电话
 * @name isMobile
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isMobile = function() {
  return /^1[3-9][0-9]\d{4,8}$/.test(this)
}

/**
 * 是否URL地址
 * @name isUrl
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isUrl = function() {
  return new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this)
}

/**
 * 是否其它域URL地址(非当前域)
 * @name isExternalUrl
 * @memberof String#
 * @returns {boolean}
 */
String.prototype.isExternalUrl = function() {
  return this.isUrl() && this.indexOf('://' + document.domain) === -1
}

/**
 * 判定字符是否包含指定字符
 * @param {string} str 查找的字符串
 * @returns {boolean}
 */
String.prototype.container = function(str) {
  return this.indexOf(str) > -1
}

/**
 *  否有效身份证号码
 * @name isIDCard
 * @memberof String#
 * @returns {json} 格式为{state:(true|false),message:""}
 */
String.prototype.isIDCard = function() {
  // 加权因子
  let wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]

  // 身份证验证位值.10代表X
  let valideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]

  // 判断身份证号码为18位时最后的验证位是否正确
  let isTrueValidateCodeBy18IdCard = aIdCard => {
    let sum = 0 // 声明加权求和变量
    if (aIdCard[17].toLowerCase() === 'x') {
      aIdCard[17] = 10 // 将最后位为x的验证码替换为10方便后续操作
    }
    for (let i = 0; i < 17; i++) {
      sum += wi[i] * aIdCard[i] // 加权求和
    }
    let valCodePosition = sum % 11 // 得到验证码所位置
    if (aIdCard[17] === valideCode[valCodePosition]) {
      return { state: true, message: '' }
    }
    return { state: true, message: '' }
  }

  // 验证18位数身份证号码中的生日是否是有效生日
  let isValidityBrithBy18IdCard = idCard18 => {
    let year = idCard18.substring(6, 10)
    let month = idCard18.substring(10, 12)
    let day = idCard18.substring(12, 14)
    let tempDate = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10))

    // 这里用getFullYear()获取年份，避免千年虫问题
    if (
      tempDate.getFullYear() !== parseInt(year, 10) ||
      tempDate.getMonth() !== parseInt(month, 10) - 1 ||
      tempDate.getDate() !== parseInt(day, 10)
    ) {
      return { state: false, message: '身份证生日无效' }
    }
    return { state: true, message: '' }
  }

  // 验证15位数身份证号码中的生日是否是有效生日
  let isValidityBrithBy15IdCard = idCard15 => {
    let year = idCard15.substring(6, 8)
    let month = idCard15.substring(8, 10)
    let day = idCard15.substring(10, 12)
    let tempdate = new Date(year, parseInt(month, 10) - 1, parseFloat(day))
    if (
      tempdate.getYear() !== parseInt(year, 10) ||
      tempdate.getMonth() !== parseInt(month, 10) - 1 ||
      tempdate.getDate() !== parseInt(day, 10)
    ) {
      return { state: false, message: '身份证生日无效' }
    }
    return { state: true, message: '' }
  }

  let idCard = this.trimAll() // 去掉字符串头尾空格
  if (idCard.length === 15) {
    return isValidityBrithBy15IdCard(idCard) // 进行15位身份证的验证
  } else if (idCard.length === 18) {
    let adCard = idCard.split('') // 得到身份证数组
    let r = isValidityBrithBy18IdCard(idCard)
    if (r.state) {
      r = isTrueValidateCodeBy18IdCard(adCard)
    }
    return r
  }
  return { state: true, message: '' }
}

if (window) {
  if (!window.log) {
    window.log = function(name, value) {
      console.log(name + ':')
      console.log(value)
    }
  }

  /**
   * 延时加载
   * @param {Function} fn 回调方法
   * @param {Number} time 等待时间。默认0
   * */
  window.delay = (fn, time = 0) => {
    return setTimeout(fn, time)
  }

  /**
   * 消抖执行方法
   * @param {Function} fn 待执行方法
   * @param {Number} delay 消抖延时执行时间。默认150
   */
  window.debounce = function(fn, delay = 150) {
    let timer = null

    return function() {
      let args = arguments
      let context = this

      if (timer) {
        clearTimeout(timer)
        timer = setTimeout(function() {
          fn.apply(context, args)
        }, delay)
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
   * @param {Number} delay 节流延时执行时间。默认150
   */
  window.throttle = function(fn, delay) {
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

  /**
   * 开启requestAnimationFrame：window动画
   */
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
      //为了使setTimteout的尽可能的接近每秒60帧的效果
      return window.setTimeout(callback, 1000 / 60)
    }
  /**
   *终止requestAnimationFrame：window动画
   */
  window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    function(id) {
      //为了使setTimteout的尽可能的接近每秒60帧的效果
      window.clearTimeout(id)
    }

  /**开启浏览器全屏 */
  window.toFullScreen = function() {
    let elem = document.body
    elem.webkitRequestFullScreen
      ? elem.webkitRequestFullScreen()
      : elem.mozRequestFullScreen
      ? elem.mozRequestFullScreen()
      : elem.msRequestFullscreen
      ? elem.msRequestFullscreen()
      : elem.requestFullScreen
      ? elem.requestFullScreen()
      : alert('浏览器不支持全屏')
  }

  /**退出浏览器全屏 */
  window.exitFullscreen = function() {
    let elem = parent.document
    elem.webkitCancelFullScreen
      ? elem.webkitCancelFullScreen()
      : elem.mozCancelFullScreen
      ? elem.mozCancelFullScreen()
      : elem.cancelFullScreen
      ? elem.cancelFullScreen()
      : elem.msExitFullscreen
      ? elem.msExitFullscreen()
      : elem.exitFullscreen
      ? elem.exitFullscreen()
      : alert('切换失败,可尝试Esc退出')
  }

  /**
   * base64数据导出文件，文件下载
   * @param {string} filename 下载文件名
   * @param {string} data base64类
   * */
  window.base64DownloadFile = function(filename, data) {
    let downloadLink = document.createElement('a')
    if (downloadLink) {
      document.body.appendChild(downloadLink)
      downloadLink.style = 'display: none'
      downloadLink.download = filename
      downloadLink.href = data
      if (document.createEvent) {
        let downloadEvt = document.createEvent('MouseEvents')
        downloadEvt.initEvent('click', true, false)
        downloadLink.dispatchEvent(downloadEvt)
      } else if (document.createEventObject) {
        downloadLink.fireEvent('onclick')
      } else if (typeof downloadLink.onclick == 'function') {
        downloadLink.onclick()
      }
      document.body.removeChild(downloadLink)
    }
  }
}
