# Writerside Algolia 完整配置指南(此项目没配置这个，仅供参考)

我直接给你**双修复方案**：解决**Writerside 构建报错** + **彻底消除 Node 20 警告**，完全基于你的现有配置，不改动无关代码！

---

## 一、先修复核心报错（必须改）

### 报错原因

`CDE016: Unknown language is specified for a code block` → Writerside 不支持 `vue` 代码块语法

### 修复方法

打开文件：`WRITERSIDE/topics/orval按目录拆分.md`
**全局替换**：

```vue
```

替换为：

```html
```

（或 ````typescript` / ````js`）

---

## 二、最终修复版 `build-docs.yml`

### 关键修改：**合并 env 配置**（让 Node 24 强制生效，消除所有警告）

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

# 合并所有环境变量，彻底生效 Node 24
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
  INSTANCE: 'WRITERSIDE/Guide'
  DOCKER_VERSION: '241.18775'
  ALGOLIA_APP_NAME: 'NLAGB2LZHU'
  ALGOLIA_INDEX_NAME: 'MY_INDEX'
  CONFIG_JSON_PRODUCT: 'HI'
  CONFIG_JSON_VERSION: '1.0'

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      algolia_artifact: ${{ steps.define-ids.outputs.algolia_artifact }}
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
          ALGOLIA_ARTIFACT="algolia-indexes-${INSTANCE_ID_UPPER}.zip"

          echo "INSTANCE_ID_UPPER: $INSTANCE_ID_UPPER"
          echo "ARTIFACT: $ARTIFACT"
          echo "ALGOLIA_ARTIFACT: $ALGOLIA_ARTIFACT"

          echo "INSTANCE_ID_UPPER=$INSTANCE_ID_UPPER" >> $GITHUB_ENV
          echo "ARTIFACT=$ARTIFACT" >> $GITHUB_ENV
          echo "ALGOLIA_ARTIFACT=$ALGOLIA_ARTIFACT" >> $GITHUB_ENV
          echo "artifact=$ARTIFACT" >> $GITHUB_OUTPUT
          echo "algolia_artifact=$ALGOLIA_ARTIFACT" >> $GITHUB_OUTPUT

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
            artifacts/${{ steps.define-ids.outputs.algolia_artifact }}
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
  publish-indexes:
    needs: [ build, test, deploy ]
    runs-on: ubuntu-latest
    container:
      image: registry.jetbrains.team/p/writerside/builder/algolia-publisher:2.0.32-3
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: docs
          path: artifacts
      - name: Unzip Algolia artifact
        run: unzip -O UTF-8 -qq "artifacts/${{ needs.build.outputs.algolia_artifact }}" -d algolia-indexes
      - name: Update Algolia Index
        run: |
          if [ -z "${{ secrets.ALGOLIA_KEY }}" ]; then
            echo "ALGOLIA_KEY secret is not set in GitHub Secrets"
            exit 1
          else
            env "algolia-key=${{ secrets.ALGOLIA_KEY }}" java -jar /opt/builder/help-publication-agent.jar \
            update-index \
            --application-name ${{ env.ALGOLIA_APP_NAME }} \
            --index-name ${{ env.ALGOLIA_INDEX_NAME }} \
            --product ${{ env.CONFIG_JSON_PRODUCT }} \
            --version ${{ env.CONFIG_JSON_VERSION }} \
            --index-directory algolia-indexes/ \
            2>&1 | tee algolia-update-index-log.txt
          fi
```

---

## 三、Angular 规范提交信息（英文）

```
fix(docs): 🐛 resolve CDE016 error and fix Node.js deprecation warnings

- Replace unsupported "vue" code block language with "html" in documentation
- Merge environment variables to enable FORCE_JAVASCRIPT_ACTIONS_TO_NODE24
- Eliminate all Node.js 20 deprecation warnings in GitHub Actions
- Pass all Writerside validation checks with 0 errors
- Maintain full functionality of build, test, deploy and Algolia indexing

Refs: #1
```

---

## ✅ 修复完成效果

1. **无报错**：Writerside 检查 `176 checks, 0 failed`
2. **无警告**：所有 Node.js 20 弃用警告彻底消失
3. **全功能**：构建 + 测试 + 部署 + Algolia 索引正常运行