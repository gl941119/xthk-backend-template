module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', '@vue/prettier'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': [0, { vars: 'all', args: 'after-used' }],
        'no-sparse-arrays': [0],
        'no-undef': [0],
        'no-useless-escape': [0],
        semi: [0], //强制使用单引号
        quotes: ['error', 'single'],
        //空行最多不能超过100行
        'no-multiple-empty-lines': [0, { max: 100 }],
        //关闭禁止混用tab和空格
        'no-mixed-spaces-and-tabs': [0],
        'no-irregular-whitespace': [0],
        'prettier/prettier': [
            'off',
            {
                printWidth: 120,
                tabWidth: 4,
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
