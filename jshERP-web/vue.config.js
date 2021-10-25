const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir)
}
// 端口设置
const port = process.env.port || process.env.npm_config_port || 3000 // 开发端口
    // vue.config.js
module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    configureWebpack: config => {
        // 生产环境取消 console.log
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@views', resolve('src/views'))
            // 生产环境，开启js\css压缩
        if (process.env.NODE_ENV === 'production') {
            config.plugin('compressionPlugin').use(new CompressionPlugin({
                test: /\.(js|css|less)$/, // 匹配文件名
                threshold: 10240, // 对超过10k的数据压缩
                deleteOriginalAssets: false // 删除源文件
            }))
        }
    },
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    /* less 变量覆盖，用于自定义 ant design 主题 */
                    'primary-color': '#E11837',
                    'link-color': '#E11837',
                    'border-radius-base': '4px'
                },
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_APP_BASE_API,
                changeOrigin: true, // 配置跨域
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            },
            '/jshERP-boot': {
                target: 'https://cloud.huaxiaerp.vip', // 请求本地代理到
                // target: 'http://192.168.13.60:9999/',
                ws: false,
                changeOrigin: true
            }
        }
    },
    lintOnSave: process.env.NODE_ENV === 'development' || undefined
}