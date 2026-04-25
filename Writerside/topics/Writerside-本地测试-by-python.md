# Writerside 本地测试 by python

我看到报错了：**`http-server` 不是可识别命令**，原因是 **Node.js 环境未生效 / 没安装 http-server**。

我给你两个**零失败的本地测试方案**，**不用折腾环境**，10秒启动你的 Writerside 文档！

你的文件目录完全正确（有`index.html`），直接按下面操作👇

---

# 方案1：【最快、推荐】Python 自带静态服务器（无需安装任何软件）

Windows 10/11 一般**自带 Python**，直接用这个命令，**3秒启动**：

1. 保持当前 PowerShell 窗口（路径正确）
2. 输入下面**任意一行**命令启动：

```powershell
# Python 3 命令（绝大多数人用这个）
python -m http.server 9999

# 如果上面报错，用这个（Python 2 兼容）
py -m http.server 9999
```

3. 浏览器打开：

```
http://localhost:9999
```

✅ 直接看到 Writerside 文档，样式/图片全正常！

---

# 方案2：修复 http-server（官方推荐）

如果你想用官方的`http-server`，按这3步修复：

## 1. 先检查 Node.js 是否安装

在 PowerShell 输入：

```powershell
node -v
```

- 如果输出版本号 → 已安装
- 如果报错 → 去安装 https://nodejs.org/zh-cn/（一路下一步）

## 2. **必须重启 PowerShell**（关键！新装软件要重开终端）

关闭当前窗口，重新打开 PowerShell，进入你的目录：

```powershell
cd D:\My_File\live\push_to_nginx\webHelpGUIDE2-all
```

## 3. 安装并启动

```powershell
# 安装 http-server
npm install -g http-server

# 启动服务
http-server -p 9999
```

---

# 测试成功后

浏览器打开 `http://localhost:9999`，确认文档没问题后，
把整个 `webHelpGUIDE2-all` 文件夹上传到服务器：

```
/home/ski/product/static_html/writerside
```

然后 Nginx 配置不变，直接访问：

```
https://youupro.xyz/guide
```

---

### 总结

1. 报错是因为`http-server`没安装/环境未生效
2. **直接用 Python 命令`python -m http.server 9999`最快**
3. 本地测试成功 → 上传服务器 → 部署完成