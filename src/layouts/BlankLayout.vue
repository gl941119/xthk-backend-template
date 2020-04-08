<template>
  <div class="router-container">
    <keep-alive>
      <router-view v-if="this.$route.meta && this.$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!this.$route.meta || !this.$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'BlankLayout'
}
</script>
<style lang="scss">
.router-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
