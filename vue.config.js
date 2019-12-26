let proxyObj = {};

proxyObj['/'] = {
    wx: false,
    target: 'http://localhost:9080',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
};
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
};