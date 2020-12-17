<template>
  <div>
    <a-upload ref="sUploadz" :multiple="multiple" :accept="currentAccept" :beforeUpload="onBeforeUpload" :headers="header" :showUploadList="showUploadList" class="avatar-uploader" name="img">
      <slot></slot>
    </a-upload>
  </div>
</template>

<script>
import { getApiOwnStsToken } from '_axios/xthy-sso/user'
import OSS from 'ali-oss'
import AliyunUpload from 'indoing-aliyun-vod-upload-js'

const GET_ALI_UPLOAD_OSS = '$_aliUpload_oss'
const OSS_LINEAR_UPLOAD = '$_oss_linear_upload'
const NORMAL_UPLOAD = '$_normal_upload'
const VOD_UPLOAD = '$_vod_upload'

export default {
  name: 'UploadOss',
  props: {
    /** 是否多选 */
    multiple: {
      type: Boolean,
      default: false
    },
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
    /** 是否自动上传 */
    isAutoUpload: {
      type: Boolean,
      default: true
    },
    /** 是否vod上传模式(视频上传) */
    isVod: {
      type: Boolean,
      default: false
    },
    /** 获得StsToken的接口 */
    getStsToken: {
      type: [Function, null],
      default: getApiOwnStsToken
    },
    /** 指定获得用于vod上传token的接口  */
    getVodToken: {
      type: [Function, null],
      default: null
    },
    /**上传单个文件最大大小。默认10M */
    maxSize: {
      type: Number,
      default: 10
    },
    /**
     * 1.收的文件类型，默认jpge,png,jpg,svg,gif
     * 2.vod模式下该类型无效
     */
    accept: {
      type: String,
      default: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
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
    /**上传成功结束后 */
    afterUpload: {
      type: Function,
      default: () => { }
    },
    /** 文件上传成功回调事件 */
    uploadSuccess: {
      type: [Function, null],
      default: null
    },
    /** 全部文件上传结束 */
    uploadEnd: {
      type: [Function, null],
      default: null
    },
    /** 上传失败 */
    uploadFail: {
      type: [Function, null],
      default: null
    },
    uploadProgress: {
      type: [Function, null],
      default: null
    }
  },
  data () {
    return {
      stsToken: null,
      uploadList: [],
      fileList: [],
      uploading: false,
      currentAccept: '',
      /** 当前ali上传对象 */
      uploader: null
    }
  },
  watch: {
    accept: {
      handler (c) {
        this.currentAccept = this.isVod ? '.mp4,.m4v' : this.accept
      },
      immediate: true
    }
  },
  created () {

  },
  methods: {
    /** 重置状态 */
    reset () {
      if (this.uploading) return false
      this.uploadList.length = 0
      this.fileList.length = 0
      this.uploading = false
      this.stsToken = null
      this.uploader = null
    },
    /** 开始上传(标准上传接口) */
    upload () {
      return this.aliUpload()
    },
    /** 开始上传 */
    async aliUpload () {
      if (this.uploading) return
      if (!this.uploadList || !this.uploadList.length) {
        this.$message.error('上传失败，未存在可上传的文件')
        return
      }

      if (!this.getStsToken || (this.isVod && !this.getVodToken)) {
        this.$message.error('上传失败，不能获得上传alioss鉴权')
        return
      }
      this.uploading = true
      if (this.isVod) {
        await this[VOD_UPLOAD]()
      } else {
        await this[NORMAL_UPLOAD]()
      }

    },
    /** 
     * 停止上传
     */
    stopUpload () {
      if (!this.uploader) return
      this.isVod && this.uploader.stopUpload()

      this.uploader = null
    },
    /** 
     * 标准方式上传(非vod方式)
     */
    async [NORMAL_UPLOAD] () {
      this.stsToken = await this.getStsToken().then(({ data }) => data)

      const { client, path } = this[GET_ALI_UPLOAD_OSS](this.stsToken)
      try {
        for (let file of this.uploadList) {
          try {
            const newFile = await this[OSS_LINEAR_UPLOAD](client, path, file)
            this.uploadSuccess && this.uploadSuccess(newFile, file)
          } catch (error) {
            this.uploadFail && this.uploadFail(error, file)
          }
        }
        this.uploadEnd && this.uploadEnd(this.uploadList, this.fileList)
        this.uploadList.length = 0
      } catch (error) {
        this.$message.error('上传失败')
        this.uploadFail && this.uploadFail(error)
        // console.log({ error })
      } finally {
        this.uploading = false
        this.uploader = null
      }
    },
    /** 
     * 获得AliyOss上传的鉴权信息
     */
    [GET_ALI_UPLOAD_OSS] ({ Credentials: { AccessKeySecret, AccessKeyId, Expiration, SecurityToken }, bucket, endpoint }) {
      const client = new OSS({
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        stsToken: SecurityToken,
        bucket: bucket,
        endpoint: endpoint
      })
      this.uploader = client
      return {
        client,
        path: `https://${bucket}.${endpoint}/`
      }
    },
    // 标准类型的串行上传
    async [OSS_LINEAR_UPLOAD] (client, path, file) {
      const { name, lastModified, size, lastModifiedDate, type, uid } = file
      const fileName = uid || `${new Date().getTime()}`
      const relativeUrl = `${uid}_${name || 'file.png'}`
      await client.multipartUpload(relativeUrl, file, {
        /** 
         * 上传进度回调
         * @param {number} - p  当前进度
         * @param {number} - checkpoint 断点续传检查点
         */
        progress: (p, checkpoint) => {
          this.uploadProgress && this.uploadProgress(p, file)
        }
      })
      const newFile = { uid, name, lastModified, size, lastModifiedDate, type, relativeUrl: `${path}${relativeUrl}` }
      this.afterUpload && this.afterUpload(newFile)
      return newFile
    },
    /** 
     * vod方式上传文件
     */
    async [VOD_UPLOAD] () {
      this.uploader = new AliyunUpload.Vod({
        userId: '232133545131616410',
        //分片大小默认1M，不能小于100K
        partSize: 1048576,
        //并行上传分片个数，默认5
        parallel: 5,
        //网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        //网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        //是否上报上传日志到点播，默认为true
        enableUploadProgress: true,
        // 开始上传
        'onUploadstarted': async (uploadInfo) => {
          const { file: { name } } = uploadInfo
          //获取STS Token,设置到SDK
          // this.uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret, secretToken)

          this.stsToken = await this.getVodToken({ title: name.replace(/\.[^.]+$/, ''), type: name }).then(({ data }) => data)

          const { RequestId: requestId, UploadAuth: uploadAuth, UploadAddress: uploadAddress, VideoId: videoId } = this.stsToken
          this.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
          // console.log({ s: this.stsToken })

        },
        // 文件上传成功
        'onUploadSucceed': (uploadInfo) => {
          const { file, videoId } = uploadInfo
          const newFile = { ...file, videoId }
          this.fileList.push(newFile)
          this.uploadSuccess && this.uploadSuccess(newFile)
        },
        // 文件上传失败
        'onUploadFailed': (uploadInfo, code, message) => {
          const { file } = uploadInfo
          this.uploadFail && this.uploadFail(new Error(message), file, code)
        },
        // 文件上传进度，单位：字节
        'onUploadProgress': (uploadInfo, totalSize, loadedPercent) => {
          const { file } = uploadInfo
          console.log({ uploadInfo, totalSize, loadedPercent })
          this.uploadProgress(loadedPercent, file, totalSize)
        },
        // 上传凭证超时
        'onUploadTokenExpired': (uploadInfo) => {
          // console.log('onUploadTokenExpired')
          //重新获取STS token，恢复上传
          // this.uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken)
        },
        //全部文件上传结束
        'onUploadEnd': (uploadInfo) => {
          this.uploadEnd && this.uploadEnd(this.fileList)
          this.uploading = false
        }
      })

      this.uploadList.forEach(m => this.uploader.addFile(m, null, null, null, JSON.stringify({ Vod: {} })))

      this.uploader.startUpload()

    },
    onBeforeUpload (file, fileList) {
      if (this.beforeUpload && this.beforeUpload(file, fileList) === false) {
        return false
      }
      const len = fileList.length
      if (!len) return
      this.uploadList.push(file)
      if (fileList.findIndex(f => f.uid === file.uid) === len - 1) { // 当前为选中的最后一个文件时
        this.change && this.change(this.uploadList)

        // 自动上传为true时，开时自动上传文件
        this.isAutoUpload && this.aliUpload()
      }
      return false
    }
  }
}
</script>
