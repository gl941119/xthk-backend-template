import { createFetchInstance } from '@/libs/axios'
const fetch = createFetchInstance({ baseUrl: '/api/common/xthy-sso/' })
export default fetch