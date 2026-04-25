# 启用 GitHub Pages

这个错误是因为你的 **GitHub 仓库还没有启用 GitHub Pages**，或者没有配置为使用 **GitHub Actions** 作为构建源。

---

## 🔧 完整修复步骤（按顺序操作）

### 第一步：在 GitHub 仓库中启用 Pages

1. 打开你的 GitHub 仓库
2. 点击顶部的 **Settings**（设置）
3. 在左侧菜单中找到 **Pages**（在 "Code and automation" 部分）
4. 在 **Build and deployment** 区域：
    - **Source**（源）选择：**GitHub Actions**（⚠️ 这是关键！）
    - 分支可以暂时不选，或者选 `main`
5. 点击 **Save**（保存）

---

### 第二步：修改 workflow 文件（确保分支正确）

检查你的 workflow 文件中的分支名称是否和你的默认分支一致：

```yaml
on:
  push:
    branches: [ main ]  # 如果你的默认分支是 master，改成 [master]
```

---

### 第三步：完整的修复后 workflow 文件

```yaml
# Sample workflow for building and deploying a VitePress site to GitHub Pages
name: Deploy VitePress site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: [ main ]  # 如果你的默认分支是 master，改成 [master]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 20  # 改成稳定版 Node 20（Node 24 太新可能有兼容性问题）
          cache: npm

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Install dependencies
        run: npm ci

      - name: Build with VitePress
        run: npm run docs:build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 📌 关键修改点说明

| 修改项                          | 原因                                                  |
|------------------------------|-----------------------------------------------------|
| **Source 设为 GitHub Actions** | 必须在仓库设置中手动选择，否则 `actions/configure-pages` 会报错       |
| **Node 版本改成 20**             | Node 24 太新，GitHub Actions 环境可能不完全兼容，用 LTS 版本 20 更稳定 |
| **确认分支名称**                   | 确保 `branches: [main]` 和你的仓库默认分支一致                   |

---

## ✅ 验证步骤

1. 完成上述设置后，重新推送代码到 `main` 分支
2. 打开仓库的 **Actions** 标签页，查看 workflow 运行状态
3. 运行成功后，你的网站会部署到：`https://<你的用户名>.github.io/<仓库名>/`

---

## 🚀 现在按步骤操作，先去仓库设置里启用 Pages 并选择 GitHub Actions 作为源！