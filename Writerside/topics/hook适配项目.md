# hook适配项目

```yaml
# Sample workflow for building and deploying a VitePress site to GitHub Pages
#
name: Deploy VitePress site to Pages

on:
  # Runs on pushes targeting the `main` branch. Change this to `master` if you're
  # using the `master` branch as the default branch.
  push:
    branches: [ main ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Force all JavaScript Actions to use Node 24 to resolve deprecation warnings
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
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
          fetch-depth: 0 # Not needed if lastUpdated is not enabled
      # - uses: pnpm/action-setup@v4 # Uncomment this block if you're using pnpm
      #   with:
      #     version: 9 # Not needed if you've set "packageManager" in package.json
      # - uses: oven-sh/setup-bun@v1 # Uncomment this if you're using Bun
      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm # or pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci # or pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: npm run docs:build # or pnpm docs:build / yarn docs:build / bun run docs:build
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

```
ci(workflow): 🔧 add FORCE_JAVASCRIPT_ACTIONS_TO_NODE24 env to resolve Node 20 deprecation warnings

- Add FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true environment variable at workflow level
- Force all JavaScript Actions (configure-pages, upload-artifact, etc.) to use Node 24
- Eliminate Node.js 20 deprecation warnings in GitHub Actions runs
- No changes to actual build and deployment logic
- All existing comments and configuration structure preserved

Refs: #1
```

## 加必填的 base 路径

### 1. 核心修复：VitePress 配置文件（仅添加必填的 base 路径，其余原有代码完全保留）

```typescript
// docs/.vitepress/config.ts （或 config.mts）
import {defineConfig} from 'vitepress'

export default defineConfig({
    // 👇 仅新增这一行，与仓库名完全一致，前后斜杠不可省略
    base: '/merchant-admin/',
    // 👇 以下你原有的所有配置、注释、主题配置完全不动
    title: 'Merchant Admin',
    description: 'Small and medium-sized food delivery SaaS platform',
    themeConfig: {
        // 你的原有主题配置，全部保留不修改
    }
})
```

---

### 2. 符合 Angular 规范的 Git Commit

```
fix(docs): 🐛 fix VitePress base path for GitHub Pages style loading

Add base: '/merchant-admin/' to VitePress config to match GitHub Pages subpath.
Fix CSS/JS static assets 404 error which caused page to render without UI styles.
No changes to existing content, theme configuration or build logic.

Fixes #1
```

---

### 问题根因说明

页面无样式只有纯文本，是因为 GitHub Pages 将站点部署在子路径 `/merchant-admin/`，而 VitePress 默认 `base: '/'`，导致浏览器去根路径加载
CSS/JS 资源，出现 404 错误。配置正确的 `base` 路径后，静态资源会从正确的子路径加载，UI 样式即可正常渲染。

修改后推送代码，等待 GitHub Actions 部署完成，刷新页面即可恢复正常样式。

看到了！根据你的目录结构，**实例 ID 是 `Guide`**（因为有 `Guide.tree` 文件），且目录名是 `WRITERSIDE`（大写）。

---

## ✅ 修正后的完整 workflow 配置

```yaml
name: Build documentation

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  contents: read
  id-token: write
  pages: write

env:
  # 👇 修正：实例 ID 是 Guide，目录名 WRITERSIDE
  INSTANCE: 'WRITERSIDE/Guide'
  # 👇 替换为 Writerside 官方最新稳定版本号
  DOCKER_VERSION: '241.18775'

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      artifact: ${{ steps.define-ids.outputs.artifact }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Define instance id and artifacts
        id: define-ids
        run: |
          INSTANCE=${INSTANCE#*/}
          INSTANCE_ID_UPPER=$(echo "$INSTANCE" | tr '[:lower:]' '[:upper:]')
          ARTIFACT="webHelp${INSTANCE_ID_UPPER}2-all.zip"

          echo "INSTANCE_ID_UPPER: $INSTANCE_ID_UPPER"
          echo "ARTIFACT: $ARTIFACT"

          echo "INSTANCE_ID_UPPER=$INSTANCE_ID_UPPER" >> $GITHUB_ENV
          echo "ARTIFACT=$ARTIFACT" >> $GITHUB_ENV
          echo "artifact=$ARTIFACT" >> $GITHUB_OUTPUT

      - name: Build docs using Writerside Docker builder
        uses: JetBrains/writerside-github-action@v4
        with:
          instance: ${{ env.INSTANCE }}
          docker-version: ${{ env.DOCKER_VERSION }}

      - name: Save artifact with build results
        uses: actions/upload-artifact@v4
        with:
          name: docs
          path: |
            artifacts/${{ steps.define-ids.outputs.artifact }}
            artifacts/report.json
          retention-days: 7

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v4
        with:
          name: docs
          path: artifacts

      - name: Test documentation
        uses: JetBrains/writerside-checker-action@v1
        with:
          instance: ${{ env.INSTANCE }}

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: [ build, test ]
    runs-on: ubuntu-latest
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v4
        with:
          name: docs
          path: artifacts

      - name: Unzip artifact
        run: unzip -O UTF-8 -qq "artifacts/${{ needs.build.outputs.artifact }}" -d dir

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Package and upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dir

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 📌 关键修正点

| 修正项                                | 原因                                                        |
|------------------------------------|-----------------------------------------------------------|
| **`INSTANCE: 'WRITERSIDE/Guide'`** | 你的目录名是 `WRITERSIDE`（大写），且实例 ID 是 `Guide`（对应 `Guide.tree`） |
| **删除了 Algolia 相关配置**               | 你的项目中没有 Algolia 配置，避免 workflow 失败                         |
| **`DOCKER_VERSION`**               | 记得替换为 Writerside 官方最新版本号                                  |

---

## 🚀 现在按以下步骤操作

1. 将上面的配置保存为 `.github/workflows/build-docs.yml`
2. 确认 `DOCKER_VERSION`
   是最新版本（可在 [Writerside 文档](https://www.jetbrains.com/help/writerside/github-actions.html) 查看）
3. 推送代码到 `main` 分支

需要我帮你生成 Git Commit 信息吗？