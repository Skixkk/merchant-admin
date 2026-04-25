# Writerside 本地测试 by http-server

完全按照 **Writerside 官方推荐的方式** 本地测试，**3步搞定**，超级简单！
我给你**Windows系统专属**的傻瓜式教程（你本地是Windows，路径都是反斜杠）：

---

# 本地测试 Writerside 静态文档（官方标准方法）

## 1. 先解压你的压缩包

把 `webHelpGUIDE2-all.zip` **解压到一个文件夹**，比如：

```
D:\docs\webHelpGUIDE2
```

解压后里面能看到 `index.html`、`images`、`css` 等文件 ✅

---

## 2. 安装 http-server（官方工具）

这个工具是**轻量静态服务器**，专门用来测试HTML文档。

### ① 先安装 Node.js（必须）

http-server 依赖 Node.js，下载安装：
https://nodejs.org/ （选 LTS 版本，一路下一步）

### ② 打开 **命令提示符(CMD)** 或 **PowerShell**，执行安装命令：

```bash
npm install -g http-server
```

等待安装完成即可。

---

## 3. 启动本地服务（核心）

### ① CMD 进入**解压后的文件夹**

比如你解压到了 `D:\docs\webHelpGUIDE2`

```bash
# 切换到D盘
D:
# 进入解压后的文件夹
cd D:\docs\webHelpGUIDE2
```

### ② 启动服务

```bash
http-server
```

---

## 4. 访问测试

启动成功后，控制台会显示：

```
Available on:
  http://127.0.0.1:8080
  http://localhost:8080
```

直接在浏览器打开：

```
http://localhost:8080
```

✅ Writerside 文档**样式、图片、功能全部正常**！

---

# 小技巧（端口被占用时）

如果 8080 端口被占用，用这个命令指定端口：

```bash
http-server -p 9999
```

然后访问：`http://localhost:9999`

---

# 总结

1. 解压 `webHelpGUIDE2-all.zip`
2. 安装 `http-server`
3. 进入解压目录 → 执行 `http-server`
4. 打开 `localhost:8080` 测试

本地测试没问题后，再上传到服务器 Nginx 就万无一失啦！
