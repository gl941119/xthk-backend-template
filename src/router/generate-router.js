
const whiteList = ['./index.js', './generate-router.js', './permission.js', './mock-router.js']
const allRouter = require.context('.', false, /\.js$/)
if (process.env.NODE_ENV === 'development') {
  whiteList.splice(2)
}
const routers = allRouter.keys().filter(key => !whiteList.includes(key)).map(key => {
  return allRouter(key).default[0]
})
routers.sort((a, b) => (~~a.sort - ~~b.sort))

export default routers
