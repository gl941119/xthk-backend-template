<script>
import baseIndexVueMixins from '@/mixins/base-index-mixins'
import { mapMutations } from 'vuex'
export default {
  mixins: [baseIndexVueMixins],
  created() {
    this.$slots = {
      extraButton: {
        render: () => <div>{this.addButtonText}</div>
      }
    }
    this.showAvatar(false)
  },
  methods: {
    ...mapMutations(['showAvatar']),
    renderSlots() {},
    renderExtraSlot() {
      return <div>fdsadfasdfasdfasdfasdf</div>
    },
    renderQuerySlot() {
      return <a-input placeholder="输入续报名称关键词或续报ID" />
    },
    renderNormalQueryItem() {
      return [
        <a-form-item label="续报名称/续报ID">
          <a-input placeholder="输入续报名称关键词或续报ID" />
        </a-form-item>
      ]
    },
    renderExpandQueryItem() {
      return [
        <a-form-item label="续报名称/续报ID">
          <a-input placeholder="输入续报名称关键词或续报ID" />
        </a-form-item>
      ]
    }
  }
}
</script>
