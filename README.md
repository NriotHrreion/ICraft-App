# Craftmine App

By NriotHrreion

## 简介

这个React应用是我之前写的[Craftmine](https://github.com/NriotHrreion/Craftmine)的存档管理器.

如果有什么不行的可以告诉我.

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
npm run start
```

4. 在另一个命令行窗口启动后端服务器

```cmd
npm run server
```

5. 最后用浏览器进入

```
http://your-domain.com:3000
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
    "serverMotd": "A Craftmine Server", // 服务器简介
    "worldName": "world", // 存档名称
    "port": 7000 // 服务器端口
}
```

3. 在`server`文件夹下启动服务器

```cmd
node index
```

4. 在Craftmine客户端中添加服务器并进入即可

## LICENSE

[MIT](./LICENSE)
