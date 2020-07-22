<template>
  <div>
    <a-upload
      ref="sUploadz"
      :accept="accept"
      :beforeUpload="onBeforeUpload"
      :headers="header"
      :showUploadList="showUploadList"
      class="avatar-uploader"
      name="img"
    >
      <slot></slot>
    </a-upload>
  </div>
</template>

<script>
import { getApiOwnStsToken } from '_axios/user.js'
import OSS from 'ali-oss'

export default {
  name: 'UploadOss',
  props: {
    showUploadList: {
      type: Boolean,
      default: false
    },
    header: {
      type: Object,
      default: () => {
        return {}
      }
    },
    beforeUpload: {
      type: Function,
      default: function (file, fileList) {
        const isLt2M = file.size / 1024 / 1024 < this.maxSize
        if (!isLt2M) {
          this.$message.error(`上传文件不能大于${this.maxSize}M`)
          return false
        }
      }
    },
    change: {
      type: Function,
      default: function (val) { }
    },
    getStsToken: {
      type: [Function, null],
      default: getApiOwnStsToken
    },
    /**上传成功结束后 */
    afterUpload: {
      type: Function,
      default: () => { }
    },
    //**上传文件最大大小。默认10M */
    maxSize: {
      type: Number,
      default: 10
    },
    /**接收的文件类型，默认jpge,png,jpg,svg,gif */
    accept: {
      type: String,
      default: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
    }
  },
  data() {
    return {
      stsToken: null,
      file: null
    }
  },
  created() { },
  methods: {
    // ali上传
    async aliUpload() {
      if (!this.getStsToken) return
      await this.getStsToken().then(({ data }) => {
        this.stsToken = data
      })
      if (this.stsToken) {
        let {
          Credentials: { AccessKeySecret, AccessKeyId, Expiration, SecurityToken },
          bucket,
          endpoint,
          StorePath,
          EffectiveTime,
          cname
        } = this.stsToken
        const client = new OSS({
          accessKeyId: AccessKeyId,
          accessKeySecret: AccessKeySecret,
          stsToken: SecurityToken,
          bucket: bucket,
          endpoint: endpoint,
          cname
        })
        this.linearUpload(client, StorePath)
      }
    },
    // 图片上传
    linearUpload(client, path, index = 0) {
      const file = this.file,
        tempArr = file.name.split('.').reverse()
      const relativeUrl = `${path}${new Date().getTime()}${tempArr.length > 1 ? '.' + tempArr[0] : ''}`
      client
        .put(relativeUrl, file)
        .then(resp => {
          this.afterUpload(resp)
        })
        .catch(err => {
          this.$message.error('文件上传失败')
          console.log('文件上传失败:', err)
        })
    },
    onBeforeUpload(file, fileList) {
      if (this.beforeUpload && this.beforeUpload(file, fileList) === false) {
        return false
      }
      this.file = file
      this.aliUpload()
      return false
    }
  }
}
</script>
