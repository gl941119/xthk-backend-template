const prodPlugins = [['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true }]]

if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  plugins: prodPlugins,
  presets: ['@vue/app']
}
