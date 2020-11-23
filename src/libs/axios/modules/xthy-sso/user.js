import { createFetchInstance } from '@/libs/axios/axios'
const fetch = createFetchInstance({ baseUrl: '/api/common/xthy-sso/' })


/**
 * @description 登录接口
 * */
export const login = data => fetch.post('/api/login', data, { device: 'web' })
/**
 * @description 登出接口
 * */
export const logout = data => fetch.post('/api/logout', data)

/*获取二维码标识：获取 原型-A */
export const getLoginCode = param => fetch.get('/api/get/login/code', param, { device: 'web' })

/**
 * 轮询判断扫码状态：获取状态后处理页面
 * @param {*} param 相关参数
 * @property {String} param.login_key 二维码登录标识key
 */
export const getCheckQrStatus = param => fetch.get('/api/check/qr/status', param)
///api/log/user/track/toapp
/**
 * 用户的一些埋点日志数据（进入应用）
 * @param {*} param 相关参数
 * @property {String} param.app_name 进入的应用名称
 */
export const logUserTrackToapp = param => fetch.post('/api/log/user/track/toapp', param)

/********用户及个人中心********************* */
/**
 * @description 切换城市
 * */
export const switchCity = data => fetch.post('/api/switch/city', data)

/**
 * 个人中心sts鉴权获取token
 * @param {*} param
 */
export const getApiOwnStsToken = param => fetch.get('/api/own/sts/token', param)

/**
 * 获得个人信息
 */
export const getOwnInfo = param => fetch.get('/api/own/info', param)

/**
 * 获得个人个性信息
 */
export const getOwnSpecialInfo = param => fetch.get('/api/own/special/info', param)

/**
 * 个性信息编辑
 * @param {*} param 相关参数
 * avatar	String	头像地址
 * desc	String	个人简介
 * signature	String	个性签名
 */
export const ownSpecialInfoEdit = param => fetch.post('/api/own/special/info/edit', param)

/**
 * 修改密码
 * @param {*} param 相关参数
 * origin_password	String	原始密码
 * new_password	String	新密码
 * confirm	String	再次输入的新密码
 */
export const ownEditPassword = param => fetch.post('/api/own/edit/password', param)

/**
 * 修改邮箱
 * @param {*} param 相关参数
 * email	String	修改邮箱
 */
export const ownEditEmail = param => fetch.post('/api/own/edit/email', param)

/**
 * 获得个人基本信息
 * @param {*} param 相关参数
 */
export const getOwnBasicInfo = param => fetch.get('/api/own/basic/info', param)

/**
 * 编辑个人基本信息
 * @param {*} param 相关参数
 * real_name	String	真实姓名
 * gender	Integer	性别
 * card_num 可选	String 身份证号
 *  birthday 可选	String	生日
 * birthplace 可选	String	出生地
 * address 可选	String	联系地址
 * emergency_name 可选	String	紧急联系人姓名
 * emergency_phone 可选	Integer	紧急联系人电话
 * */
export const ownBasicInfoEdit = param => fetch.post('/api/own/basic/info/edit', param)

/**
 * 获得组织列表信息
 * @param {*} param 相关参数
 */
export const getOwnOrganizationList = param => fetch.get('/api/own/organization/list', param)
