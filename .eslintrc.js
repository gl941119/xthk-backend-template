module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': [0, { vars: 'all', args: 'after-used' }],
    'no-sparse-arrays': [0],
    'no-undef': [0],
    'no-useless-escape': [0],
    'sort-vars': [0],
    semi: [0], //强制使用单引号
    quotes: ['error', 'single'],
    //空行最多不能超过100行
    'no-multiple-empty-lines': [0, { max: 100 }],
    //关闭禁止混用tab和空格
    'no-mixed-spaces-and-tabs': [0],
    'no-irregular-whitespace': [0],
    /**元素/组件特性的顺序
     * v-for、v-if、v-else-if、v-else、v-show、id、ref 、key、slot、v-model、其他特性（所有普通的绑定或未绑定的特性）、 v-on
     */
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ]
      }
    ],
    /**
     * 组件/实例的选项的顺序
     *  name、
        components、
        mixins、
        props、
        data、
        computed、
        watch、
        生命周期钩子 (按照它们被调用的顺序)
        　　　　beforeCreate、
        　　　　created、
        　　　　beforeMount、
        　　　　mounted、 
        　　　　beforeUpdate、
        　　　　updated、
        　　　　activated、
        　　　　deactivated、
        　　　　beforeDestroy、
        　　　　destroyed
        methods
     * 
     */
    'vue/order-in-components': [
      'error',
      {
        order: [
          'el',
          'name',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives', 'filters'],
          'extends',
          'mixins',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'data',
          'computed',
          'watch',
          'LIFECYCLE_HOOKS',
          'methods',
          ['template', 'render'],
          'renderError'
        ]
      }
    ],
    /**
     * 给v-for设置键值，与key结合使用
     */
    'vue/require-v-for-key': 'error',
    /**
     *  v-if 和 v-for 用在同一个元素上——因为v-for 比 v-if 具有更高的优先级。
     */
    'vue/no-use-v-if-with-v-for': [
      'error',
      {
        allowUsingIterationVar: false
      }
    ],
    'prettier/prettier': [
      'off',
      {
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        semi: false,
        trailingComma: 'none',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: 'avoid'
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
