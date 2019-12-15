import fetch from '../axios'

/**接口 */

/**
 * 获得接口列表
 * @param {*} param 相关参数
 * keyword 可选	String	接口唯一标识或名称名的关键字
 * per_page 可选	Integer	每页显示多少条
 * page 可选	Integer	页码
 */
export const getRbacPermissionsList = param => fetch.get('/api/rbac/permissions/list', param)

/**
 * 切换白名单状态
 * @param {*} param 相关参数
 * id	Integer	接口id
 */
export const rbacPermissionsWhite = param => fetch.post('/api/rbac/permissions/white', param)

/**
 * 切换启用/禁用接口
 * @param {*} param 相关参数
 * id	Integer	接口id
 */
export const rbacPermissionsToggleEnable = param => fetch.post('/api/rbac/permissions/toggleEnable', param)

/**
 * 扫描接口接口列表
 * @param {*} param 相关参数
 */
export const rbacPermissionsScanapi = param => fetch.post('/api/rbac/permissions/scanapi', param)

/**菜单配置 */

/**
 * 获得vue路由列表
 * @param {*} param 相关参数
 * meta_title 可选	string	名称关键词
 * per_page 可选	Integer	每页显示多少条
 * page 可选	Integer	页码
 */
export const getRbacMenuList = param => fetch.get('/api/rbac/menu/list', param)

/**
 * 配置菜单权限 获取可配置权限列表,过滤已经配置过的菜单列表
 * @param {*} param 相关参数
 * menu_id	integer	菜单id
 */
export const getRbacMenuAllPermissions = param => fetch.get('/api/rbac/menu/all/permissions', param)

/**
 * 配置菜单权限 获取指定菜单的权限列表
 * @param {*} param 相关参数
 * menu_id	integer	菜单id
 */
export const getRbacMenuPermissions = param => fetch.get('/api/rbac/menu/permissions', param)

/**
 * 菜单 启用禁用接口
 * @param {*} param  相关参数
 * menu_id	Integer	菜单id
 */
export const rbacMenuToggleEnable = param => fetch.post('/api/rbac/menu/toggleEnable', param)

/**
 * 导入vue路由
 * @param {*} param  相关参数
 * data Array 路由数据
 */
export const rbacMenuImport = param => fetch.post('/api/rbac/menu/import', param)

/**
 * 配置菜单权限 更新菜单的权限id
 * @param {*} param  相关参数
 * menu_id	integer	菜单id
 * ids	array	权限id集合
 */
export const rbacMenuUpdatePermissions = param => fetch.post('/api/rbac/menu/update/permissions', param)

/**权限组 */

/**
 * 获取权限组列表
 * @param {*} param 相关参数
 * name 可选	string	权限组名称
 * per_page 可选	Integer	每页显示多少条
 * page 可选	Integer	页码
 */
export const getRbacGroupList = param => fetch.get('/api/rbac/group/list', param)

/**
 * 创建权限组
 * @param {*} param  相关参数
 * name	string	权限组名称
 * desc	string	权限组描述
 * symbol	integer	权限组标识
 */
export const rbacGroupCreate = param => fetch.post('/api/rbac/group/create', param)

/**
 * 删除权限组
 * @param {*} param  相关参数
 * id	integer	权限组id
 */
export const rbacGroupDelete = param => fetch.post('/api/rbac/group/delete', param)

/**
 * 更新权限组
 * @param {*} param  相关参数
 * id	integer	权限组id
 * name 可选	string	权限组名称
 * desc 可选	string	权限组描述
 */
export const rbacGroupUpdate = param => fetch.post('/api/rbac/group/update', param)

/**
 * 更新权限组配置权限，菜单对应的权限列表
 * @param {*} param  相关参数
 * id	integer	权限组id
 * data	array	菜单权限数据
 */
export const rbacGroupUpdatePermissions = param => fetch.post('/api/rbac/group/update/permissions', param)

/**
 * 获得权限组配置权限，三级联动数据结构
 * @param {*} param  相关参数
 * id	integer	权限组id
 */
export const getRbacGroupMenuPermissions = param => fetch.get('/api/rbac/group/menu/permissions', param)

///api/auth/user/menus/list
/**
 * 登录用户权限
 * @param {Object} param
 */
export const getAuthUserMenusList = param => fetch.get('/api/auth/user/menus/list', param)
