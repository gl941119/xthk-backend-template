import permission from './permission'
import mockRouter from './mock-router'

let routers = [...permission]
if (process.env.NODE_ENV === 'development') {
  routers = [...routers, ...mockRouter]
}
export default routers
