function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options._componentTag;
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}

export default {
  methods: {
    emojiPickerTrigger () {
      broadcast.call(this, 'rich-input', 'emoji-picker-trigger')
    },
    emojiPick (emoji) {
      broadcast.call(this, 'rich-input', 'emoji-pick', emoji)
    }
  }
}
