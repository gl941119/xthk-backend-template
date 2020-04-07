import Vue from 'vue'
import {
  Layout,
  Menu,
  Pagination,
  Table,
  LocaleProvider,
  Button,
  Tabs,
  Divider,
  Tag,
  Icon,
  Modal,
  Form,
  Input,
  Switch,
  Popover,
  Popconfirm,
  message,
  Select,
  Row,
  Col,
  Breadcrumb,
  DatePicker,
  Upload,
  Dropdown,
  Alert,
  Checkbox,
  Card,
  Badge,
  Collapse,
  Tooltip,
  Rate,
  Spin,
  Avatar,
  Tree,
  Radio,
  Cascader,
  List,
  Affix,
  Transfer,
  ConfigProvider,
  Result
} from 'ant-design-vue'

Vue.use(Dropdown)
Vue.use(Upload)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Button)
Vue.use(LocaleProvider)
Vue.use(Menu)
Vue.use(Layout)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Table)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(Modal)
Vue.use(Form)
Vue.use(Input)
Vue.use(Popconfirm)
Vue.use(message)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)
Vue.use(Popover)
Vue.use(Breadcrumb)
Vue.use(DatePicker)
Vue.use(Alert)
Vue.use(Checkbox)
Vue.use(Collapse)
Vue.use(Card)
Vue.use(Badge)
Vue.use(Tooltip)
Vue.use(Spin)
Vue.use(Rate)
Vue.use(Avatar)
Vue.use(Tree)
Vue.use(Radio)
Vue.use(Cascader)
Vue.use(List)
Vue.use(Transfer)
Vue.use(ConfigProvider)
Vue.use(Result)
Vue.component(Affix.name, Affix)

Vue.prototype.$message = message
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$confirm = Modal.confirm
