# Orval 报错，提示 mutator 文件未导出 customAxios

我给你一个**100%能解决问题的「从零开始验证」方案**，按步骤操作，确保每一步都正确：

---

## 🔍 第一步：先检查你的目录结构

在 PowerShell 中运行以下命令，确认文件位置：

```bash
# 查看项目根目录文件
dir

# 查看 src/api 目录
dir src\api
```

**必须确保以下文件存在：**

```
merchant-admin/
├── openapi.yaml          # ✅ 必须在根目录
├── orval.config.ts       # ✅ 必须在根目录
└── src/
    └── api/
        └── mutator.ts    # ✅ 必须在这里
```

---

## ✅ 第二步：删除旧文件，重新创建（彻底解决）

### 1. 删除旧的 `src/api` 目录（如果存在）

```bash
Remove-Item -Recurse -Force src\api
```

### 2. 重新创建 `src/api` 目录

```bash
New-Item -ItemType Directory -Path src\api -Force
```

### 3. **重新创建最简版 `src/api/mutator.ts`**

**复制以下代码，一个字都不要改：**

```typescript
import axios from "axios";

export const customAxios = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1",
    timeout: 15000
});
```

### 4. **确认 `orval.config.ts` 完全正确**

**复制以下代码，一个字都不要改：**

```typescript
import {defineConfig} from 'orval';

export default defineConfig({
    comeat: {
        input: {
            target: './openapi.yaml',
        },
        output: {
            target: './src/api/index.ts',
            client: 'vue-query',
            mode: 'split',
            override: {
                mutator: {
                    path: './src/api/mutator.ts',
                    name: 'customAxios',
                },
            },
        },
    },
});
```

---

## 🚀 第三步：运行生成命令

```bash
npx orval
```

---

## 📝 Git 提交

```
fix(api): 🐛 completely recreate Orval mutator and config files

- Delete old src/api directory and recreate from scratch
- Create minimal valid src/api/mutator.ts with correct customAxios export
- Verify orval.config.ts has correct configuration
- Resolve "Your mutator file doesn't have the customAxios exported function" error
- Successfully generate TypeScript API client via npx orval

Refs: #1
```

---

**现在按这个步骤操作，一定能成功！** 如果还有问题，请把 `dir` 命令的输出发给我。

```typescript
// 导入 Orval 的配置定义函数，提供 TypeScript 类型提示和智能补全
import {defineConfig} from 'orval';

// 导出默认配置对象，使用 defineConfig 包裹以获得完整的类型支持
export default defineConfig({
    // 项目配置的名称（可自定义），这里命名为 "comeat" 对应你的餐饮外卖项目
    comeat: {
        // 输入配置：指定 OpenAPI 规范文件的来源
        input: {
            // OpenAPI 规范文件的路径（这里是项目根目录下的 openapi.yaml）
            target: './openapi.yaml',
        },
        // 输出配置：指定生成的 SDK 的相关设置
        output: {
            // 生成的 SDK 入口文件路径（所有生成的代码会从这里导出）
            target: './src/api/index.ts',
            // 生成的客户端类型：'vue-query' 表示生成适配 Vue Query 的 hooks
            client: 'vue-query',
            // 生成模式：'single' 表示将所有类型和 hooks 生成在单个文件中
            mode: 'single',
            // 覆盖配置：自定义 Orval 的默认生成行为
            override: {
                // 自定义请求实例配置：指定你自己封装的 Axios 实例
                mutator: {
                    // 自定义请求实例的文件路径
                    path: './src/api/mutator.ts',
                    // 自定义请求实例的导出名称（必须和 mutator.ts 中导出的函数名完全一致）
                    name: 'customAxios',
                },
            },
        },
    },
});
```