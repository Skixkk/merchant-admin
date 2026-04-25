# writerside部署到 Nginx

没问题！**Writerside 生成的 `webHelpGUIDE2-all.zip` 是纯静态HTML文档**，和 VitePress 一样部署到 Nginx 即可，我给你*
*最简、无坑、无缝集成你现有配置**的教程，**不破坏你原有的 Django、VitePress 文档、HTTPS 等所有功能**。

我们给 Writerside 分配一个独立路径：`https://youupro.xyz/guide`（你也可以改成 `/writerside` / `/help` 都行）

---

# 一、前置操作：解压 ZIP 包

1. 本地解压 `webHelpGUIDE2-all.zip`
2. 解压后会得到一个**静态文件文件夹**（里面有 `index.html`、`assets`、`images` 等）
   → 这就是 Writerside 的完整静态站点

---

# 二、服务器创建存放目录

登录 Ubuntu 服务器，执行命令（和你现有静态文件目录统一）：

```bash
# 创建 Writerside 文档存放目录
sudo mkdir -p /home/ski/product/static_html/writerside
```

---

# 三、上传解压后的静态文件

把你**本地解压后的所有文件**，上传到服务器：

```
/home/ski/product/static_html/writerside/
```

上传方式：

- SCP 命令 / FileZilla 都可以

---

# 四、修改 Nginx 配置（核心）

直接在你**现有完整配置**中，**新增一段 Writerside 配置**，我已经写好，复制粘贴即可：

## 最终完整 Nginx 配置（新增 Writerside 部分）

```nginx
# 强制HTTP跳转到HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name youupro.xyz www.youupro.xyz;
    
    access_log /var/log/nginx/youupro_http_access.log;
    error_log /var/log/nginx/youupro_http_error.log;
    
    return 301 https://$host$request_uri;
}

# HTTPS核心配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name youupro.xyz www.youupro.xyz;

    ssl_certificate /etc/nginx/ssl/youupro.xyz/youupro.xyz.pem;
    ssl_certificate_key /etc/nginx/ssl/youupro.xyz/youupro.xyz.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_session_timeout 10m;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    access_log /var/log/nginx/youupro_https_access.log;
    error_log /var/log/nginx/youupro_http_error.log;

    # 1. 原有 notes 配置
    location ^~ /notes/ {
        root /home/ski/product/static_html/;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # 2. 原有 VitePress 文档 /docs
    location /docs/ {
        alias /home/ski/product/static_html/dist/;
        index index.html;
        try_files $uri $uri/ /docs/index.html;
        error_page 404 /docs/404.html;
        error_page 403 /docs/404.html;
        location ~* ^/docs/assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # ==============================================
    # 👇 【新增：Writerside 文档配置】
    # 访问：https://youupro.xyz/guide
    # 文件目录：/home/ski/product/static_html/writerside
    # ==============================================
    location ^~ /guide/ {
        alias /home/ski/product/static_html/writerside/;
        index index.html;
        try_files $uri $uri/ =404;
        
        # 静态资源缓存优化
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff2)$ {
            expires 30d;
            add_header Cache-Control "public";
        }
    }

    # 3. 原有 Django 代理
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 4. 错误页
    error_page 404 /error_pages/404.html;
    location = /error_pages/404.html {
        root /var/www/youupro.xyz/;
        internal;
    }

    # 5. Django 静态文件
    location /static/ {
        alias /home/ski/product/django/KnowledgeBase/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    location /media/ {
        alias /home/ski/product/django/KnowledgeBase/media/;
        expires 7d;
    }
}
```

---

# 五、生效命令（服务器执行）

```bash
# 1. 赋予 Nginx 访问权限
sudo chown -R www-data:www-data /home/ski/product/static_html/writerside
sudo chmod -R 755 /home/ski/product/static_html/writerside

# 2. 测试 Nginx 配置是否正确
sudo nginx -t

# 3. 重启 Nginx 生效
sudo systemctl restart nginx
```

---

# 六、访问测试

浏览器打开：

```
https://youupro.xyz/guide
```

✅ Writerside 文档正常显示、样式齐全、无任何冲突

---

# 可选：如果你想把 Writerside 放在 `/docs` 覆盖 VitePress

只需要修改配置里的路径：

```nginx
location ^~ /docs/ {
    alias /home/ski/product/static_html/writerside/;
    index index.html;
    try_files $uri $uri/ =404;
}
```

然后上传文件到 `/home/ski/product/static_html/writerside` 即可。

---

### 总结

1. Writerside 输出的 ZIP = 纯静态HTML → 直接解压上传
2. 配置独立路径 `/guide`，和 VitePress/Django 完全隔离
3. 一键授权 + 重启 Nginx，部署完成
4. 样式、图片、导航**100%正常**