# TODO

# 专为你的 MERCHANT-ADMIN 项目定制的 VitePress 部署工作流

name: Deploy VitePress Docs to GitHub Pages

on:

# 触发条件：推送到 main 分支（如果你的默认分支是 master，把下面的 main 改成 master）

push:
branches: [main]

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