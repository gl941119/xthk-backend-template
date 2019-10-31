import { FetchClass } from './axios'
import config from '@/config'
export default new FetchClass({ baseUrl: config.extraUrl })
