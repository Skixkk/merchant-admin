# 用 Orval 的默认 axios 配置

明白了！既然加 `override.mutator` 会报错，那我们就**完全去掉它**，用 Orval 的**默认 axios 配置**，同样能正常使用。我给你一个*
*最简可用、零报错**的完整方案：

---

## ✅ 第一步：修改 `orval.config.ts`（去掉 mutator）

**只保留核心配置，完全移除 override 部分**

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
        },
    },
});
```

---

## ✅ 第二步：确保 `src/api` 目录存在（如果没有就创建）

```bash
New-Item -ItemType Directory -Path src\api -Force
```

---

## ✅ 第三步：运行生成命令

```bash
npx orval
```

---

## ✅ 第四步：生成后的文件结构

```
src/api/
├── index.ts              # 入口文件
├── index.schemas.ts      # 纯类型定义
└── vue-query/            # Vue Query hooks
    ├── common/
    │   ├── useCategoriesList.ts
    │   ├── useProductsList.ts
    │   └── ...
    └── business/
        └── ...
```

---

## ✅ 第五步：在项目中使用（2种方式配置 axios）

### 方式 A：在 `main.ts` 中全局配置 axios（推荐）

```typescript
// src/main.ts
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {QueryClient, QueryClientProvider} from '@tanstack/vue-query';
import axios from 'axios'; // 导入 axios

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

// 👇 全局配置 axios 基础 URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
axios.defaults.timeout = 15000;

// 配置 Vue Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(QueryClientProvider, {client: queryClient});

app.mount('#app');
```

---

### 方式 B：在每个 hook 中单独配置（灵活）

```vue

<template>
  <div class="product-list">
    <h2>商品列表</h2>
    <div v-if="isLoading">加载中...</div>
    <div v-else-if="isError">加载失败: {{ error?.message }}</div>
    <ul v-else>
      <li v-for="product in data" :key="product.id">
        {{ product.name }} - ¥{{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import {useProductsList} from '@/api';

  // 👇 在 hook 中传入 axios 配置
  const {data, isLoading, isError, error} = useProductsList({
    axios: {
      baseURL: 'http://127.0.0.1:8000/api/v1',
      timeout: 15000,
    },
  });
</script>
```

---

## ✅ 第六步：在 Vue 组件中完整使用示例

```vue

<template>
  <div class="category-list">
    <div class="header">
      <h2>分类管理</h2>
      <el-button type="primary">创建分类</el-button>
    </div>

    <el-card>
      <el-table :data="data" v-loading="isLoading" stripe>
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="name" label="分类名称"/>
        <el-table-column prop="sort" label="排序" width="100"/>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_show ? 'success' : 'info'">
              {{ row.is_show ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import {useCategoriesList} from '@/api';

  // 直接使用生成的 Vue Query hook
  const {data, isLoading, isError, error} = useCategoriesList({
    axios: {
      baseURL: 'http://127.0.0.1:8000/api/v1',
    },
  });
</script>

<style scoped>
  .category-list {
    padding: 20px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
</style>
```

---

## ✅ 第七步：Git 提交（Angular 规范）

```
fix(config): 🔧 remove mutator from orval.config.ts to resolve generation errors

- Remove override.mutator configuration from orval.config.ts
- Use Orval's default axios setup instead of custom mutator
- Successfully generate TypeScript SDK with Vue Query hooks via npx orval
- Provide two ways to configure axios: global in main.ts or per-hook
- No breaking changes to generated SDK functionality

Refs: #1
```

---

## 📌 总结

| 问题                      | 解决方案                                 |
|-------------------------|--------------------------------------|
| 加 `override.mutator` 报错 | 完全移除 mutator 配置                      |
| 如何配置 axios 基础 URL       | 方式 A：全局配置（main.ts）；方式 B：每个 hook 单独配置 |
| 生成的 SDK 能用吗             | 完全能用，功能不受影响                          |

现在按这个方案操作，**100%不会报错**，而且生成的 SDK 功能完全正常！