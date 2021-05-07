const express = require('express');
const proxy = require('express-http-proxy');
const ip = require('ip');
const path = require('path');

const appRouter = express.Router();
const app = express();

const appConfig = require('./server_config');
const serverPort = 8080;

app.use(express.static(path.join(__dirname, appConfig.distDir)));

const prefixes = Object.keys(appConfig.proxies);

if (prefixes.length <= 0) {
  console.log('config.js 没有设置转发配置，跳过...');
} else {
  console.log('创建转发逻辑:', JSON.stringify(appConfig.proxies));
  prefixes.forEach((p)=> {
    const url = appConfig.proxies[p].trim();
    appRouter.all(p, proxy(url, {
      https: url.startsWith('https://'),
      proxyReqPathResolver: req => {
        console.log(`${new Date()}: ${req.originalUrl} 自动转发到 ${url}${req.originalUrl}`);
        return req.originalUrl;
      }
    }));
    app.use(appRouter);
  });
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, appConfig.distDir, 'index.html'))
});

app.listen(serverPort);

console.log(`服务已启动，访问地址: http://${ip.address()}:${serverPort}`);

