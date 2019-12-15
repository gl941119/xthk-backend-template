<template>
  <div class='timeRanger-wrap'>
    <a-time-picker
      :allowClear='false'
      inputReadOnly
      :format='format'
      :disabled='disabled'
      :value='timeValue'
      @change='change'
      :getPopupContainer='getPopupContainer'
    />
    <span style='padding:0 8px;'>至</span>
    <a-time-picker
      inputReadOnly
      :allowClear='false'
      :format='format'
      :disabled='disabled'
      :value='timeValue1'
      @change='change1'
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { TimePicker } from 'ant-design-vue'
import moment from 'moment'
const timeFormat = 'HH:mm:ss'
Vue.component(TimePicker.name, TimePicker)
export default {
  name: 'TimeRanger',
  props: {
    value: {
      type: Array,
      default: () => {
        let nowTime = moment().format(timeFormat)
        return [nowTime, nowTime]
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    getPopupContainer: {
      type: Function,
      default: () => document.body
    },
    format: {
      type: String,
      default: timeFormat
    }
  },
  data() {
    return {
      moment,
      timeValue: null,
      timeValue1: null
    }
  },
  watch: {
    value(c, o) {
      if (c) {
        this.timeValue = c[0] ? moment(c[0], this.format) : null
        this.timeValue1 = c[1] ? moment(c[1], this.format) : null
      } else {
        this.timeValue = null
        this.timeValue1 = null
      }
    }
  },
  created() {
    this.timeValue = this.value[0] ? moment(this.value[0], this.format) : null
    this.timeValue1 = this.value[1] ? moment(this.value[1], this.format) : null
  },
  methods: {
    getValue() {
      return [
        this.timeValue ? this.timeValue.format(this.format) : '',
        this.timeValue1 ? this.timeValue1.format(this.format) : ''
      ]
    },
    /*起始时间的变化 */
    change(time, timerString) {
      if (!time || !this.timeValue1 || time.isBefore(this.timeValue1)) {
        this.timeValue = time
        this.$emit('input', this.getValue())
        this.triggerChange()
      }
    },
    /*结束时间的变化 */
    change1(time, timerString) {
      if (!time || !this.timeValue || time.isAfter(this.timeValue)) {
        this.timeValue1 = time
        this.$emit('input', this.getValue())
        this.triggerChange()
      }
    },
    triggerChange() {
      this.$emit('change', this.getValue())
    }
  }
}
</script>

<style lang="scss" scoped>
</style>