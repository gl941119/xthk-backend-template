<template>
  <a-locale-provider :locale='locale'>
    <div id='app'>
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn') // 设置日期本地化
export default {
  data() {
    return {
      locale: zhCN
    }
  },
  mounted() {}
}
</script>

<style lang="scss">
#app {
  width: 100%;
  min-width: 1280px;
  height: 100%;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
/* 当被transition包裹的元素在显示的过程中，enter-active是一直存在。而当被包裹元素消失的过程中，leave-active是一直存在的*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}
</style>
