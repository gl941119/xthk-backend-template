<template>
  <div :class="baseClass" :currentLength="currentLength">
    <!-- 图片上传组件辅助-->
    <upload-oss ref="myUploadOss" :afterUpload="afterUpload" :getStsToken="getStsToken"></upload-oss>
    <quill-editor ref="myQuillEditor" v-model="content" class="editor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"></quill-editor>
    <!-- <div>{{limitText}}/{{pureText.length}}</div> -->
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import UploadOss from '_c/uploadoss'
import { quillEditor } from 'vue-quill-editor'
import OSS from 'ali-oss'
/*eslint-disable*/
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote', 'code-block'], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ['clean'], // 清除文本格式
  ['link', 'image'] // 链接、图片、视频, "video"
]
const div = document.createElement('div')
export default {
  name: 'RichEditor',
  props: {
    /*编辑器的内容*/
    value: {
      type: [String, undefined]
    },
    /*图片大小*/
    maxSize: {
      type: Number,
      default: 4000 //kb
    },
    height: {
      type: Number,
      default: 200
    },
    /**最大字符长度 ,默认不限制*/
    maxLength: {
      type: Number,
      default: 0
    },
    getStsToken: {
      type: [Function, null],
      default: null
    },
    placeholder: {
      type: [String, null],
      default: '请输入内容'
    },
    isUploadPic: {
      type: [Boolean],
      default: true
    },
    /** 自定义工具栏选项。（选项内容。可参考quill组件帮助） */
    defaultToolbarOptions: {
      type: [Array, null],
      default: null
    },
    /** 自定义图片选择事件处理 */
    customChoiceImageHandle: {
      type: [Function, null],
      default: null
    },
    /** 显示字数提示 */
    showCountTips: {
      type: Boolean,
      default: false
    }

  },
  components: {
    quillEditor,
    UploadOss
  },
  watch: {
    value (val) {
      this.content = val || ''
    }
  },
  created () {
    this.editorOption.placeholder = this.placeholder
  },
  mounted () {
    const { quill } = this.$refs.myQuillEditor
    quill.enable(false)
    this.content = this.value

    quill.container.style.height = this.editorHeight.height
    this.$nextTick(() => {
      quill.blur()
      setTimeout(() => {
        quill.enable(true)
      }, 400)

    })
  },
  computed: {
    editorHeight () {
      return {
        height: this.height + 'px'
      }
    },
    limitText () {
      return this.content.length < 8 ? 0 : this.content.length - 7
    },
    baseClass () {

      return {
        editor: true,
        'show-count-tips': this.maxLength && this.showCountTips
      }
    },
    currentLength () {
      return `${this.cLength}/${this.maxLength}`
    }
  },
  data () {
    const self = this
    let opts
    if (!this.defaultToolbarOptions) {
      opts = [...toolbarOptions]
      if (!this.isUploadPic) {
        opts[opts.length - 1] = ['link']
      }
    } else {
      opts = this.defaultToolbarOptions
    }

    return {
      content: '',
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        theme: 'snow', // or 'bubble'
        placeholder: '请输入内容',
        modules: {
          toolbar: {
            container: opts,
            handlers: {
              image: function (value) {
                if (value) {
                  self.selectionIndex = this.quill.getSelection()?.index ?? 0
                  if (self.customChoiceImageHandle) {
                    console.log('xxxx', self.selectionIndex)
                    self.customChoiceImageHandle(this.quill)
                  } else {
                    // 触发input框选择图片文件
                    self.$refs.myUploadOss.$el.querySelector('.ant-upload input').click()
                  }
                } else {

                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      },
      header: {
        // token: sessionStorage.token
      }, // 有的图片服务器要求请求头需要有token
      info: {},
      file: null,
      pureText: '',
      cLength: 0,
      selectionIndex: 0
    }
  },
  methods: {
    /** quill文本框，在当前位置插入图片 */
    quillInsetImage (imgUrl) {
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      // 获取光标所在位置
      let length = this.selectionIndex ?? quill.getSelection()?.index ?? 0
      // 插入图片  res.url为服务器返回的图片地址
      quill.insertEmbed(length, 'image', imgUrl)
      // 调整光标到最后
      quill.setSelection(length + 1)
    },
    afterUpload (resp) {
      let url = resp.relativeUrl
      // res为图片服务器返回的数据
      this.quillInsetImage(url)
      // loading动画消失
      this.quillUpdateImg = false
    },
    onEditorBlur () {
      //失去焦点事件
    },
    onEditorFocus () {
      //获得焦点事件
    },
    onEditorChange (val) {
      const ml = Math.abs(this.maxLength)
      const cLen = val.quill.getLength() - 1
      val.quill.deleteText(ml, 5)

      if (this.content === '') {
        this.cLength = 0
      } else {
        this.cLength = val.quill.getLength() - 1
      }


      if (ml && cLen > ml && !this.showCountTips) {
        if (this.onEditorChange.timer) {
          // console.count('防抖')
          clearTimeout(this.onEditorChange.timer)
          this.onEditorChange.timer = null
        }
        this.onEditorChange.timer = setTimeout(() => {
          this.$message.warning(`最多只能输入${ml}字符`)
        }, 200)
      }

      this.$emit('input', this.content) //实现value的v-model的绑定
      this.$emit('on-change', this.content)
      this.triggerChange(this.content)
    },
    triggerChange (changeValue) {
      this.$emit('change', changeValue)
    }
  }
}
</script>

<style lang="scss">
.editor {
  position: relative;
  line-height: normal !important;
  width: 100%;

  .limit {
    position: absolute;
    right: 6px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    line-height: 22px;
    color: rgba(153, 153, 153, 1);
  }
  &.show-count-tips {
    padding-bottom: 25px;
    border: 1px solid #dfe6ec;
    border-top: 0 none;
    &::after {
      position: absolute;
      bottom: 5px;
      right: 12px;
      content: attr(currentLength);
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c0c3c9;
      line-height: 22px;
    }
    .quill-editor {
      > div {
        border-left: 0 none;
        border-right: 0 none;
      }
      .ql-container {
        border-bottom: 0 none;
      }
    }
  }
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}
.ql-editor.ql-blank::before {
  font-style: normal;
}
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: '等宽字体';
}
</style>
