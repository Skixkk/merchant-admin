# 根据你提供的实际项目目录结构，修改并优化了 GitHub Pages 部署配置文件

我根据你提供的**实际项目目录结构**，修改并优化了 GitHub Pages 部署配置文件，**100%适配你的路径**，直接复制使用即可：

---

## 修改后的完整配置文件

在你的项目根目录（`MERCHANT-ADMIN`）下创建文件：
`.github/workflows/deploy-vitepress.yml`，粘贴以下内容：

```yaml
# 专为你的 MERCHANT-ADMIN 项目定制的 VitePress 部署工作流
name: Deploy VitePress Docs to GitHub Pages

on:
  # 触发条件：推送到 main 分支（如果你的默认分支是 master，把下面的 main 改成 master）
  push:
    branches: [ main ]
  # 允许手动触发
  workflow_dispatch:

# 权限配置（必须，否则无法部署）
permissions:
  contents: read
  pages: write
  id-token: write

# 并发控制：防止同时部署多个版本
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建任务
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v5
        with:
          fetch-depth: 0 # 保留完整 Git 历史，用于 VitePress 的 lastUpdated 功能

      # 设置 Node.js 环境（版本用 20 LTS 更稳定，你也可以改成 24）
      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 20
          cache: npm # 缓存 npm 依赖，加速构建

      # 配置 GitHub Pages
      - name: Setup Pages
        uses: actions/configure-pages@v4

      # 安装依赖（根据你的 package.json 自动安装）
      - name: Install dependencies
        run: npm ci

      # 构建 VitePress 文档
      # 注意：确保你的 package.json 里有 "docs:build": "vitepress build docs" 这个脚本
      - name: Build VitePress docs
        run: npm run docs:build

      # 上传构建产物（路径完全匹配你的项目结构：docs/.vitepress/dist）
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # 部署任务
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build # 必须等构建成功后才部署
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 关键修改说明（完全适配你的项目）

### 1. 路径适配

根据你的目录结构：

```
MERCHANT-ADMIN/
└─ docs/
   ├─ .vitepress/
   │  └─ dist/  # 构建产物在这里
   └─ index.md
```

配置中已正确设置：

```yaml
path: docs/.vitepress/dist
```

### 2. 构建命令适配

确保你的项目根目录（`MERCHANT-ADMIN`）下的 `package.json` 里有这个脚本：

```json
{
  "scripts": {
    "docs:build": "vitepress build docs"
  }
}
```

如果没有，添加这一行，否则构建会失败。

### 3. 分支适配

- 如果你的默认分支是 `main`，无需修改；
- 如果是 `master`，把配置里的 `branches: [main]` 改成 `branches: [master]`。

---

## 使用步骤

1. 在项目根目录创建文件夹：`.github/workflows/`
2. 在里面新建文件：`deploy-vitepress.yml`，粘贴上面的配置
3. 确保 `package.json` 里有 `docs:build` 脚本
4. 把代码推送到 `main` 分支
5. 去 GitHub 仓库的 **Actions** 标签页，等待工作流运行完成
6. 运行成功后，你的文档会自动部署到：
   `https://<你的GitHub用户名>.github.io/<你的仓库名>/`

---

## 额外提醒

如果你的 VitePress 配置文件（`docs/.vitepress/config.ts`）里还没设置 `base`，记得加上：

```typescript
export default {
    base: '/<你的仓库名>/', // 比如你的仓库叫 merchant-admin，就填 '/merchant-admin/'
    // 其他配置...
}
```

这样部署后的样式和路径才会正常。

需要我帮你**检查或修改 VitePress 的 `config.ts` 配置**吗？