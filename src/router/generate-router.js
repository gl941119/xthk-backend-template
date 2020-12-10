
// 不参于自动加载文件
const filterList = ['./index.js', './generate-router.js']
const allRouter = require.context('.', false, /\.js$/)

// 非开发环境，把mock的路由加入到自动加载的白名单里
if (process.env.NODE_ENV !== 'development') {
  filterList.push('./mock-router.js')
}
const routers = allRouter.keys().filter(key => !filterList.includes(key)).map(key => {
  return allRouter(key).default[0]
})
routers.sort((a, b) => (~~a.sort - ~~b.sort))

export default routers
