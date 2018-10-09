const path = require('path')

// vue.config.js
module.exports = {
    // baseUrl: process.env.NODE_ENV === 'production'
    //     ? 'https://production.ru/'
    //     : '/',
    // devServer: {
    //     proxy: {
    //         '/api': {
    //             target: 'https://api.ru',
    //             secure: false,
    //             changeOrigin: true
    //         }
    //     }
    // },
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
    }
}

function addStyleResource (rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/assets/styles/variables.styl'),
                path.resolve(__dirname, './src/assets/styles/responsive.styl')
            ],
        })
}
