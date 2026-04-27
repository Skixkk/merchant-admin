# dongli服务器配置问题

你说得对！这是一个**非常典型的 Vue SPA（单页应用）部署配置错误**，不是代码问题，是**服务器没有配置路由重定向**导致的。

---

# 问题根源

1. 你用的是 Vue Router 的 **History 模式**（`createWebHistory`）
2. 当你直接在浏览器访问 `https://donglizhiyuan.com/product-introduction` 时：
    - 请求直接发给了服务器（Nginx/Apache）
    - 服务器上**没有这个物理文件/文件夹**，所以返回 404
3. 正确的流程应该是：
    - 服务器把**所有路由请求**都重定向到 Vue 的入口 `index.html`
    - 然后让 Vue Router 自己在前端处理路由跳转

---

# 解决方案（根据你的服务器选择）

## 方案一：Nginx 配置（最常见）

在 Nginx 配置文件中添加 `try_files`：

```nginx
server {
    listen 80;
    server_name donglizhiyuan.com;
    root /path/to/your/vue/dist; # 指向你的 dist 目录
    index index.html;

    location / {
        # 核心配置：所有请求都指向 index.html
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 方案二：Apache 配置

在项目根目录创建 `.htaccess` 文件：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 方案三：Vite 本地预览（开发环境）

如果你是在本地用 `vite preview` 测试，在 `vite.config.ts` 中配置：

```typescript
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        historyApiFallback: true // 开启 History 模式支持
    },
    preview: {
        historyApiFallback: true // 预览模式也开启
    }
})
```

---

## 方案四：Netlify / Vercel 等托管平台

- **Netlify**：在根目录创建 `_redirects` 文件：
  ```
  /*    /index.html   200
  ```
- **Vercel**：在 `vercel.json` 中配置：
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

---

# 总结

你遇到的问题**100% 是服务器配置问题**，和 Vue 代码无关。
只要在服务器上配置好**把所有路由重定向到 index.html**，问题就解决了。
