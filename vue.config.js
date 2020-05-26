const CompressionPlugin = require('compression-webpack-plugin')
const LessThemePlugin = require('webpack-less-theme-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const path = require('path')
const myConfig = require('./src/config/index')
const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
   */

  // 项目部署的基础路径(请使用publicPath)
  // baseUrl: "/",

  publicPath: '/',

  // 构建好的文件输出到哪里
  outputDir: 'dist',

  //指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
  indexPath: 'index.html',

  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: '',

  // 是否在保存时使用‘eslint-loader’进行检查 // 有效值: true | false | 'error' // 当设置为‘error’时，检查出的错误会触发编译失败
  lintOnSave: true,
  // 使用带有浏览器内编译器的完整构建版本
  runtimeCompiler: false,
  // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖
  transpileDependencies: [
    /* string or regex */
  ],
  // 是否为生产环境构建生成sourceMap?
  productionSourceMap: false,

  // CSS 相关选项
  css: {
    //是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
    extract: true,

    //是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。
    sourceMap: false,
    //默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。设置为 true 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
    modules: false,

    //向 CSS 相关的 loader 传递选项。例如：
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
      },
      postcss: {
        // 这里的选项会传递给 postcss-loader
      },
      less: {
        //aut design vue 样式定制
        modifyVars: {
          // 'primary-color': '#1DA57A',
          // 'link-color': '#1DA57A',
          // "border-radius-base": "2px",
          // "font-family": "Microsoft YaHei,Arial"
        },
        javascriptEnabled: true
      },
      sass: {
        data: `
                @import "@/assets/scss/var.scss";
                @import "@/assets/scss/transition.scss";
              `
      }
    }
  },
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用
  parallel: require('os').cpus().length > 1,
  //多页配置项参考
  //pages: {
  // console: {
  //     // 应用入口配置，相当于单页面应用的main.js，必需项
  //     entry: 'src/modules/console/console.js',
  //     // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
  //     template: 'public/console.html',
  //     // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
  //     filename: 'console.html',
  //     // 标题，可选项，一般情况不使用，通常是在路由切换时设置title
  //     // 需要注意的是使用title属性template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
  //     title: 'console page',
  //     // 包含的模块，可选项
  //     chunks: ['console']
  // },
  // // 只有entry属性时，直接用字符串表示模块入口
  // client: 'src/modules/client/client.js'
  // },
  // 所有 webpack-dev-server 的选项
  devServer: {
    open: process.platform === 'darwin',
    //contentBase: path.join(__dirname, 'src'),
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 7788,
    https: false,
    hotOnly: false
    //代理服务器
    // proxy: {
    //   // '/api': {
    //   //   target: "",
    //   //   ws: true,
    //   //   changeOrigin: true
    //   // }
    // } // string | Object

    // before: app => {}
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  },
  chainWebpack: config => {
    if (isProduction) {
      config.plugins.delete('prefetch')
      config.plugins.delete('preload')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 300000, // 依赖包超过300000bit将被单独打包
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              return `chunk.${packageName.replace('@', '')}`
            },
            priority: 10
          }
        }
      })
      config.optimization.runtimeChunk = {
        name: 'manifest'
      }
    } else {
      config.module
        .rule('eslint')
        .use('eslint-loader')
        .loader('eslint-loader')
        .tap(options => {
          options.fix = true
          return options
        })
    }
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_axios', resolve('src/libs/axios/modules'))
      .set('_scss', resolve('src/assets/scss'))
      .set('_layout', resolve('src/layouts'))

    config.plugin('define').tap(args => {
      args[0].VERSION = '"' + (myConfig.version || '1.0.0') + '"'
      return args
    })

    config.plugin('html').tap(args => {
      args[0].hash = true
      return args
    })
  },
  configureWebpack: config => {
    if (isProduction) {
      const version = myConfig.version || new Date().getTime()
      // 为生产环境修改配置...
      config.mode = 'production'
      return {
        output: {
          chunkFilename: `js/[name].[contenthash]-v${version}.js`
        },
        plugins: [
          new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.css$|\.ttf$|\.html$|\.svg$|\.json$|\.js$/, //匹配文件名
            threshold: 0, //对超过10k的数据进行压缩
            minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets: false //是否删除原文件
          }),
          new LessThemePlugin({
            theme: './src/assets/less/index.less'
          }) //自己lessURL
        ]
      }
    } else {
      return {
        devtool: 'source-map'
      }
    }
  }
}
