<script>
import baseIndexVueMixins from '@/mixins/base-index-mixins'
import { mapMutations } from 'vuex'
import UploadOss from '@/components/uploadoss'
import { createFetchInstance } from '@/libs/axios'
export default {
  extends: baseIndexVueMixins,
  data () {
    let validatePass = (rule, value, callback) => {

      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        callback()
      }
    }
    return {
      getStsToken: null,
      getVodToken: null,
      uploadInfos: [],
      message: '',
      ruleForm: {
        name: ''
      },
      rules: {
        name: [{ validator: validatePass, trigger: 'change' }]
      },
      validateMessages: 'sdfasdfasdf',
      useCustomLayout: true
    }
  },
  created () {
    this.$slots = {
      extraButton: {
        render: () => <div>{ this.addButtonText }</div>
      },
      headerExtra: {
        render: <div>asdfasdfasdfasdfasd</div>
      }
    }
    this.showAvatar(false)

    this.getStsToken = (function () {
      const f = createFetchInstance()
      return function () {
        return f.get('https://xthy-sso-api-pub_1.dev.xthktech.cn/api/own/sts/token')
      }
    })()
    this.getVodToken = (function () {
      const f = createFetchInstance()
      return function (data) {
        // return f.get('https://online-activity-center-pub_1.dev.xthktech.cn/api/common/upload?type=video')
        return f.post('https://online-admin-api-pub_1.dev.xthktech.cn/api/common/aliyun/upload/', data)
      }
    })()

  },
  mounted () {

  },
  methods: {
    ...mapMutations(['showAvatar']),
    renderSlots () {

    },
    renderExtraSlot () {

      const aa = (infos) => {
        this.$message.info('上传成功')
        console.log({ infos })
      }
      const uploadProgress = (p, file) => {
        this.message = `${file.name}上传进度${Math.floor(p * 100)}%`
      }
      const change = (infos) => {
        this.uploadInfos = infos
      }
      const isVod = false
      return <div><UploadOss ref="myUpload" multiple={ true } getStsToken={ this.getStsToken } uploadSuccess={ aa } isAutoUpload={ false }
        uploadProgress={ uploadProgress } isVod={ isVod } getVodToken={ this.getVodToken } maxSize={ isVod ? 1000 : 10 } change={ change }>
        <a-button type="primary">上传</a-button>&nbsp;
      </UploadOss >
        <br />
        <a-button type="primary" on-click={ () => { this.$refs.myUpload.upload() } }>开始</a-button>
        <p>{ this.message }</p>
        <div>{
          this.uploadInfos.map(m => {
            return <div><img></img><a>{ m.name }</a></div>
          })
        }
        </div>
      </div>
    },
    renderDefaultSlot () {
      const props = {
        model: this.ruleForm,
        rules: this.rules,
        validateMessages: 'oaoaoaoaoaoaoa'
      }
      return <a-form-model { ...{ props } } ref="ruleForm" >
        <a-form-model-item label="Password" prop="name" >
          <a-input v-model={ this.ruleForm.name } autocomplete="off" />
        </a-form-model-item>
      </a-form-model>
    },
    renderQuerySlot () {
      return <a-input placeholder="输入续报名称关键词或续报ID" />
    },
    renderNormalQueryItem () {
      return [
        <a-form-item label="续报名称/续报ID">
          <a-input placeholder="输入续报名称关键词或续报ID" />
        </a-form-item>
      ]
    },
    renderExpandQueryItem () {
      return [
        <a-form-item label="续报名称/续报ID">
          <a-input placeholder="输入续报名称关键词或续报ID" />
        </a-form-item>
      ]
    },
    startRenderSlot (arr) {
      const v = <div style='display:flex;width:100%;height:100%'>
        <div style='width:400px;flex:0 0 auto;background-color:#ccc'>这是左边</div>
        <div style='padding:10px;'>
          { arr }
        </div>
      </div>

      return v
    }
  },
  render () {
    const baseNode = this.$options.extends.render.apply(this, [...arguments])
    return baseNode
  }
}
</script>
