const { name } = require('../package.json')

module.exports = {
  transpileDependencies: ['common'],
  configureWebpack: {
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  },
  chainWebpack: config => {
    config.plugin('html')
      .tap((args) => {
        args[0].title = 'qiankun-example'
        return args
      })
  },
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/toutiao/': {
        target: "http://v.juhe.cn",
        changeOrigin: true
      }
    }
  }
}
