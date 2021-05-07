
// 此环境变量，系统会根据部署环境自动设置，
// 用户可以此来判断当前处于哪个环境，并按需设置路由转发逻辑等
const currentEnv = process.env['stage'];   // string, 取值范围：local, dev, prod_test, prod

console.log(`当前环境：${currentEnv}`);

const faasHost = {
  'local': 'https://alpha.kujiale.com',
  'dev': 'https://sit.kujiale.com',
  'prod_test': 'https://beta.kujiale.com',
  'prod': 'https://kujiale.com',
};


module.exports = {
    // 用于定义项目启动时，去自定义目录读取网站静态文件
    distDir: './app/build',

    // 可以在此处定义设置接口的代理转发逻辑
    proxies: {
      // 比如：项目内发起所有 /api/*** 前缀的请求，都会被转发到 http://sit.kujiale.com/api/***
      // 支持正则路由设定等，
      '/faas/api/*': faasHost[currentEnv] || faasHost.local,
    }
};
