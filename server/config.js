const fs = require('fs');
const path = require('path');

function getPort() {
  return process.env.PORT ? process.env.PORT : 6001;
}

function getServer() {
  return 'http://127.0.0.1:6003';
}

const serverConfig = {
  historyApiFallback: {
    rewrites: [
      // { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      { from: /^\/$/, to: '/index.html' },
    ],
  },
  host: '127.0.0.1',
  port: getPort(),
  staticPath: path.resolve(__dirname, '../dist'),
  proxy: {
    '/api/sage': {
      target: getServer(),
      changeOrigin: true,
      logLevel: 'debug',
      // pathRewrite: path => path.replace('\/j-api\/paas', ''),
    }
  },
};

module.exports = Object.assign({
  port: process.env.PORT ? process.env.PORT : 6001,
  healthCheck: true,
  logger: {
    debug: process.env.DEBUG ? process.env.DEBUG : '*',
    useColors: true,
    toFile: process.env.LOG_DIR ? path.resolve(process.env.LOG_DIR, 'spa-server') : null,
    maxSize: 1024 * 1024 * 1024 * 8,
    maxCount: 60,
  }
}, serverConfig);
