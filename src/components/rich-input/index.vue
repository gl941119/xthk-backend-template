<template>
  <div :placeholder="placeholder" :class="{"empty": !curLength, disabled: disabled}" class="rich-input-box">
    <div
      ref="input"
      :class="customClass"
      :contenteditable="!readOnly"
      class="rich-input"
      @dragenter.prevent.stop
      @drop.prevent.stop
      @input="handleInput"
      @keyup="handleInput"
      @paste.prevent.stop="handlePaste"
      @focus="deleteRange"
      @keydown.enter="enterDown"
      @blur="saveRange"
    ></div>
  </div>
</template>

<script>
import emoji2img from '@/libs/emoji/base-emoji'
export default {
  name: 'RichInput',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    },
    curLength: {
      // 当前字符串长度
      type: Number,
      default: 0
    },
    maxLength: {
      type: Number,
      default: 120
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: this.value,
      range: null,
      pasteText: ''
    }
  },
  watch: {
    value(val) {
      console.log('watch', val)
      if (!val) {
        this.$refs.input.innerHTML = ''
        this.inputValue = ''
      }
    }
  },
  created() {
    this.$on('emoji-pick', this.handleEmoji)
    this.$on('emoji-picker-trigger', this.clickPanel)
  },
  methods: {
    enterDown() {
      this.$emit('enter-down')
    },
    handleInput(event) {
      console.count('handleinput')
      console.log('handleInput', event)
      if (this.getCurLength() <= this.maxLength) {
        this.inputValue = this.$refs.input.innerHTML
      } else {
        this.saveRange()
        this.$refs.input.innerHTML = this.inputValue
        this.moveCursor()
      }
      this.updateData()
      if (event && (event.ctrlKey === true || event.altKey === true) && event.keyCode === 13) {
        this.$emit('ctrlEnter')
        return
      }
      if (event && event.altKey === true && event.keyCode === 83) {
        this.$emit('ctrlEnter')
        return
      }
    },
    handleEmoji(emoji) {
      if (this.getCurLength() < this.maxLength) {
        this.moveCursor()
        /* 若支持insertHTML则使用此方法，否则暂时使用appendChild方法插入节点 */
        const flag = document.execCommand(
          'insertHTML',
          false,
          `<img src="${emoji2img[emoji]}" data-emoji="${emoji}" alt="">`
        )
        if (!flag) {
          let img = document.createElement('img')
          img.src = emoji2img[emoji]
          img.dataset.emoji = emoji
          this.$refs.input.appendChild(img)
        }
        this.inputValue = this.$refs.input.innerHTML
        this.updateData()
      }
    },
    saveRange() {
      //if (!this.range) {
      // console.log('saveRange', this.getSelectionAndRange().range)
      this.range = this.getSelectionAndRange().range
      //}
    },
    deleteRange() {
      //this.range = null
    },
    handlePaste(e) {
      let text
      /* ie用插入节点的方式进行复制，inserText在ie中不起作用，原因未知 */
      if (e.clipboardData && e.clipboardData.getData) {
        if (e.clipboardData.files && e.clipboardData.files.length) {
          const file = e.clipboardData.files[0]
          this.$emit('pasteFile', file)
          // const f1 = new FileReader()
          // f1.readAsDataURL(file)
          // f1.onload = function(ev) {
          //   let base64 = ev.target.result
          //   console.log(base64)
          //   const img = new Image()

          //   document.execCommand(
          //     'insertHTML',
          //     false,
          //     `<img src="${base64}" style="width:100%;max-width:240px;height:auto;">`
          //   )
          // }
        } else {
          text = e.clipboardData.getData('text/plain')
          text = this.formatPaste(text)
          document.execCommand(
            'insertText',
            false,
            text.substring(0, Math.max(this.maxLength - this.getCurLength(), 0))
          )
        }
      } else if (window.clipboardData && window.clipboardData.getData) {
        text = window.clipboardData.getData('Text')
        text = this.formatPaste(text)
        let { range } = this.getSelectionAndRange()
        range.insertNode(document.createTextNode(text))
      }
      // 更新内容
      this.handleInput()
    },
    handleAppendContent(v) {
      const text = this.formatPaste(v)
      const startLeng = this.inputValue.length
      this.inputValue += text
      this.$refs.input.innerHTML += text
      this.updateData()
      this.$refs.input.focus()
      setTimeout(() => {
        this.keepLastIndex()
      }, 5)
    },
    keepLastIndex() {
      const obj = this.$refs.input
      if (window.getSelection) {
        //ie11 10 9 ff safari
        obj.focus() //解决ff不获取焦点无法定位问题
        let range = window.getSelection() //创建range
        range.selectAllChildren(obj) //range 选择obj下所有子内容
        range.collapseToEnd() //光标移至最后
      } else if (document.selection) {
        //ie10 9 8 7 6 5
        let range = document.selection.createRange() //创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(obj) //range定位到obj
        range.collapse(false) //光标移至最后
        range.select()
      }
    },
    updateData() {
      const v = this.replaceEmoji(this.removeHtmlTag(this.inputValue))

      this.$emit('update:curLength', Math.min(this.getCurLength(), this.maxLength))
      this.$emit('update:value', v)
      // this.$emit('input', v)
    },
    replaceEmoji(value) {
      return value.replace(/<img.*?data-emoji="(.*?)".*?\/?>/g, ($1, $2) => {
        return `${$2}`
      })
    },
    getCurLength() {
      return this.handleHTML(this.$refs.input.innerHTML).length
    },
    formatPaste(text) {
      // 复制内容去除格式
      return text.replace(/[\r\n]/g, '')
    },
    removeHtmlTag(html) {
      // 替换为了解决火狐兼容性问题
      html = html.replace(/<br>/g, '')
      html = html.replace(/&nbsp;/g, ' ')
      html = html.replace(/&amp;/g, '&')
      html = html.replace(/&lt;/g, '<')
      html = html.replace(/&gt;/g, '>')
      html = html.replace(/&quot;/g, '"')

      return html
    },
    handleHTML(html) {
      html = html.replace(/<(img.*?)>/g, '0')
      html = this.removeHtmlTag(html)
      return html
    },
    getSelectionAndRange() {
      let selection
      let range
      if (window.getSelection) {
        // ie11 10 9 ff safari
        selection = window.getSelection()
        range = selection.getRangeAt(0) // 创建range
      } else {
        selection = document.selection
        range = selection.createRange() // 创建创建range对象
      }
      return { selection, range }
    },
    clickPanel() {
      this.curLength ? this.moveCursor(false) : this.$refs.input.focus()
    },
    moveCursor(clearRange = true) {
      let { selection, range } = this.getSelectionAndRange()
      if (this.range) {
        selection.removeAllRanges()
        selection.addRange(this.range)
        clearRange && this.deleteRange()
      } else {
        range.selectNodeContents(this.$refs.input)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }
}
</script>

<style lang="scss">
// @import '@/sass/var.scss';

.rich-input-box {
  overflow: hidden;
  width: 100%;
  padding: 2px;
  &.empty:not(:focus):not(.disabled):before {
    content: attr(placeholder);
    position: absolute;
    left: 1em;
    top: 50%;
    transform: translateY(-50%);
    //color: $--color-text-secondary;
  }
  &.disabled {
    cursor: not-allowed;
    .rich-input {
      user-select: none;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      z-index: 1;
      background: #fff;
    }
    &:after {
      content: attr(placeholder);
      position: absolute;
      left: 1em;
      top: 50%;
      z-index: 2;
      transform: translateY(-50%);
      //color: $--color-text-secondary;
    }
  }
}
.rich-input {
  position: relative;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  outline: none;
  img {
    vertical-align: sub;
    margin: 0 1px;
    width: 18px;
    height: 18px;
    cursor: default;
    user-select: all;
  }
}
</style>
