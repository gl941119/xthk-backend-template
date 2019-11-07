<template>
  <div class='editor'>
    <!-- 图片上传组件辅助-->
    <upload-oss :afterUpload='afterUpload'></upload-oss>
    <quill-editor
      class='editor'
      v-model='content'
      ref='myQuillEditor'
      :options='editorOption'
      @blur='onEditorBlur($event)'
      @focus='onEditorFocus($event)'
      @change='onEditorChange($event)'
      :style='editorHeight'
    ></quill-editor>
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
    }
  },
  components: {
    quillEditor,
    UploadOss
  },
  watch: {
    value(val) {
      this.content = val || ''
    }
  },
  mounted() {},
  computed: {
    editorHeight() {
      return {
        height: this.height + 'px'
      }
    },
    limitText() {
      return this.content.length < 8 ? 0 : this.content.length - 7
    }
  },
  data() {
    return {
      content: '',
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        placeholder: '请输入内容',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.editor .avatar-uploader input').click()
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
      pureText: ''
    }
  },
  methods: {
    afterUpload(resp) {
      let a = resp.res.requestUrls[0].split('?')
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功

      // 获取光标所在位置
      let length = quill.getSelection().index
      // 插入图片  res.url为服务器返回的图片地址
      quill.insertEmbed(length, 'image', a[0])
      // 调整光标到最后
      quill.setSelection(length + 1)
      // loading动画消失
      this.quillUpdateImg = false
    },
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange(val) {
      let ml = Math.abs(this.maxLength)
      if (ml && val.text.length > ml) {
        val.quill.deleteText(ml, 5)

        if (this.onEditorChange.timer) {
          console.count('防抖')
          clearTimeout(this.onEditorChange.timer)
          this.onEditorChange.timer = null
        }
        this.onEditorChange.timer = setTimeout(() => {
          this.$message.error(`最多只能输入${ml}字符`)
        }, 200)
      }

      this.$emit('input', this.content) //实现value的v-model的绑定
      this.$emit('on-change', this.content)
      this.triggerChange(this.content)
    },
    triggerChange(changeValue) {
      this.$emit('change', changeValue)
    }
  }
}
</script> 

<style lang="scss">
.editor {
  line-height: normal !important;
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
.editor {
  position: relative;
  .limit {
    position: absolute;
    right: 6px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    line-height: 22px;
    color: rgba(153, 153, 153, 1);
  }
}
</style>