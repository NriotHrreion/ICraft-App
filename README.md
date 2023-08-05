<div align="center">

<img src="./src/static/logo.png" width="70">

# ICraft App

## `This Repo Has Been Archived`

By NriotHrreion; Using [React.js](http://reactjs.org)

</div>

## 简介

这是Minecraft的2D版本, 可以用来当画板用, 或者也可以拿来玩, 和别人一起联机

[ICraft 开发日志](https://nriothrreion.github.io/tags/ICraft/)

## 客户端使用

1. 下载源码到本地

```cmd
git clone https://github.com/NriotHrreion/ICraft-App.git
```

2. 进入源码根目录下载依赖

```cmd
npm install
```

3. 启动App

```cmd
npm run ic-launch
```

4. 最后用浏览器进入

```
http://localhost:3000
```

## 服务端使用

1. 下载源码到本地

```cmd
git clone https://github.com/NriotHrreion/ICraft-App.git
```

2. 在`server/config.json`文件中配置服务器

```json
{
    "serverName": "Server", // 服务器名称
    "serverMotd": "An ICraft Server", // 服务器简介
    "worldName": "world", // 存档名称
    "port": 7000 // 服务器端口
}
```

3. 在`server`文件夹下启动服务器

```cmd
node index
```

4. 在ICraft客户端中添加服务器并进入即可

## 贡献

**启动代码**: `npm start ic-launch`

**修改/测试代码**: 修改代码后重新加载页面即可

**Pull Request**: 发送代码时请在说明中注明修改的部分

## LICENSE

[MIT](./LICENSE)
