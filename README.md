# Serverless Component · 前端建站服务模板

## 一、功能说明
本模板主要为用户提供以下功能：

1. 服务端渲染 (简单的返回静态资源)
2. 解决跨域问题（支持用户自定义转发逻辑）
2. 统一部署流程（用户无需做任何部署相关配置）
4. 通用用户模板 （更针对性的面向前端用户）

## 二、目录介绍

- __appconfig: 存放通用的 Dockerfile 

- app: 存放前端代码 以及 构建产物

- .gitlab-ci.yml: 存放通用的 ci 部署脚本

- server.js:  主进程，用于提供 静态资源访问 及 接口代理

- server-config.js： 用于配置 静态资源目录路径 及 转发代理的配置


## 三、本地调试

#### 1.构建前端资源
```
yarn --cwd=./app
yarn --cwd=./app build
```

#### 2. 本地启动服务
```
yarn && yarn dev
```

#### 3.访问服务
```
curl http://localhost:8080
```

## 四、自动部署
模板默认为您集成了 alpha / sit / beta / prod 四个环境的部署流程

`您只需要把代码提交到 master 分支，ci 就会自动部署您的服务到 alpha 环境`

如需部署到其他环境，请前往 ci CI/CD 栏 自行触发部署

访问格式为： http://${组件服务名}.faas-alpha.k8s-new.qunhequnhe.com/


## 五、自定义前端代码

其实整个模板并不关心您使用何种前端框架或技术栈，
但是`我们强烈推荐您把您的前端项目代码都放在 *app* 目录下`

然后在 server-config.js 的 distDir 参数里指定 前端构建产物的目录路径 即可

## 六、如何配置跨域

与跨域相关的配置，都在 *server-config.js* 文件里：

- 我们可以指定接口的转发规则：

```
  proxies: {
      // 比如：项目内发起所有 /api/*** 前缀的请求，都会被转发到 http://sit.kujiale.com/api/***
      // 还支持正则路由等方式
      '/faas/api/*': 'https://sit.kujiale.com',
    }
```

- 有时候，我们需要在不同的环境里请求不同域名下的 api，您可以通过 *获取环境变量* 来判断当前环境

```
// 此环境变量，系统会根据部署环境自动设置，
// 用户可以此来判断当前处于哪个环境，并按需设置路由转发逻辑等
const currentEnv = process.env['stage'];   // string, 取值范围：local, dev, prod_test, prod

console.log(`当前环境：${currentEnv}`);

// 假如需要根据环境来请求不同的域名
const faasHost = {
  'local': 'https://alpha.kujiale.com',
  'dev': 'https://sit.kujiale.com',
  'prod_test': 'https://beta.kujiale.com',
  'prod': 'https://kujiale.com',
};
```


## 七、Support

任何疑问，请联系 @冰蛙

