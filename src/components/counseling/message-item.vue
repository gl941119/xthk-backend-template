<template>
  <div class='message-item' :class='itemStyle'>
    <template v-if='!messageItemType'>
      <div class='avatar'>
        <a-avatar v-if='!avatar' icon='user' :size='40'></a-avatar>
        <a-avatar v-else :size='40' :src='avatar'></a-avatar>
      </div>
      <div class='message-content-wrap'>
        <div class='message-name'>
          <span>{{ name }}</span>
        </div>
        <div class='message-content'>
          <slot>
            <div v-html='changeNewLine(content)'></div>
          </slot>
        </div>
      </div>
    </template>
    <div v-if='messageItemType===1' class='error'>
      <div class='error-info'>{{content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageItem',
  props: {
    /**是否发送消息 */
    isSend: {
      type: Boolean,
      default: false
    },
    content: {
      type: [String],
      default: ''
    },
    name: {
      type: [String],
      default: ''
    },
    avatar: {
      type: [String, null],
      default: ''
    },
    type: {
      type: Number,
      default: 1 //1文字。2图片
    },
    //消息类型:0=常规消息,1=错误提示
    messageItemType: {
      type: [Number, null, undefined],
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {
    itemStyle() {
      return {
        recevice: !this.isSend,
        send: this.isSend
      }
    }
  },
  methods: {
    changeNewLine(value) {
      return value.replace(/\r\n/gi, '<br>')
    }
  }
}
</script>

<style lang="scss">
.message-item {
  width: 100%;
  height: auto;
  padding: $base-space-size 4px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .error {
    width: 100%;
    height: 100%;
    height: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    display: flex;
    &-info {
      display: inline-block;
      flex: 0 auto;
      padding: 4px 8px;
      color: gray;
      border-radius: 10px;
      background-color: #f1f1f1;
    }
  }
  .avatar {
    width: 40px;
    height: 40px;
    display: inline-block;
    flex: 0 0 auto;
    text-align: center;
  }
  .message-content-wrap {
    display: block;
    //flex-direction: column;

    .message-name {
      //flex: 0 0 auto;
      padding: 0 0 4px 0;
    }

    .message-content {
      display: inline-block;
      padding: $base-space-size;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
      background-color: #f1f1f1;
      color: #000;
      border-radius: 4px;
      margin-right: 4px;
      margin-left: 4px;
      img {
        border: 0 none;
        width: 120px;
        height: auto;
      }
    }
  }
  &.recevice {
    .message-name {
      margin-left: 4px;
      font-size: 12px;
    }
    .message-content {
      border-top-left-radius: 0;
    }
  }

  &.send {
    flex-direction: row-reverse;
    justify-content: flex-start;
    .message-name {
      text-align: right;
      margin-right: 4px;
    }
    .message-content {
      background-color: $primary-color;
      color: #ffffff;
      border-top-right-radius: 0;
      float: right;
    }
  }
}
</style>
