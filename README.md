# ICraft App

By NriotHrreion

## 简介

这是Minecraft的2D版本, 可以用来当画板用, 或者也可以拿来玩, 和别人一起联机

## 客户端使用

1. 下载源码到本地

```cmd
git clone https://github.com/NriotHrreion/Craftmine-App.git
```

2. 下载依赖

```cmd
npm install
```

3. 启动App

```cmd
npm run ic-launch
```

5. 最后用浏览器进入

```
http://localhost:3000
```

## 服务端使用

1. 下载源码到本地

```cmd
git clone https://github.com/NriotHrreion/Craftmine-App.git
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

## LICENSE

[MIT](./LICENSE)
