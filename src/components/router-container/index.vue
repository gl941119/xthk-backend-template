<template>
    <div class="router-container">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'RouterContainer'
}
</script>
<style lang="scss">
.router-container {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
