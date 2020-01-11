<script>
import baseIndexVueMixins from '@/mixins/base-index-mixins'
export default {
  mixins: [baseIndexVueMixins],
  created() {
    this.$slots = {
      extraButton: {
        render: () => <div>{this.addButtonText}</div>
      }
    }
  },
  methods: {
    renderSlots() {},
    renderExtraSlot() {
      return <div>fdsadfasdfasdfasdfasdf</div>
    }
  }
}
</script>
