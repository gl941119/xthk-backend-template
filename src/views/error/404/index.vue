<script>
export default {
  name: 'Error404',
  render() {
    return (
      <div class="error-404 ">
        <a-result
          status="404"
          title="404"
          subTitle="抱歉，你访问的页面并不存在!"
          {...{
            scopedSlots: {
              extra: () => {
                return (
                  <a-button type="primary" onClick={() => this.$router.replace({ path: '/' })}>
                    返回首页
                  </a-button>
                )
              }
            }
          }}
        />
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.error-404 {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
</style>
