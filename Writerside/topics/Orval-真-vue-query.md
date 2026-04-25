# Orval 真 vue-query

我来分别详细讲解这两种生成方式的**完整使用流程**，结合你的外卖商家管理后台项目给出具体代码示例。

---

## 一、方式 1：`orval --input --output` 直接生成完整 SDK

### 特点

- 生成**单文件完整 SDK**，包含：类型定义 + axios 导入 + API 调用函数
- 无需配置文件，一行命令搞定
- 适合简单项目，快速上手

---

### 1. 生成命令

```bash
orval --input ./openapi.yaml --output ./src/api/index.ts --client axios
```

---

### 2. 生成后的文件结构

```
src/api/
└── index.ts  # 单文件包含所有内容
```

---

### 3. 生成的 `index.ts` 内容预览（简化版）

```typescript
// src/api/index.ts
import axios from 'axios';

// 生成的类型定义
export interface Category {
    readonly id: number;
    name: string;
    sort?: number;
    is_show?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
    readonly is_deleted: boolean;
}

export interface Product {
    readonly id: number;
    name: string;
    price: number;
    // ...
}

// 生成的 API 调用函数
export const categoryApi = {
    list: (config?: AxiosRequestConfig) => axios.get<Category[]>('/common/categories/', config),
    create: (data: any, config?: AxiosRequestConfig) => axios.post<Category>('/common/categories/', data, config),
};

export const productApi = {
    list: (config?: AxiosRequestConfig) => axios.get<Product[]>('/common/products/', config),
    // ...
};
```

---

### 4. 在 Vue 组件中使用

```vue

<template>
  <div class="category-list">
    <h2>分类列表</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">加载失败: {{ error }}</div>
    <ul v-else>
      <li v-for="cat in categories" :key="cat.id">{{ cat.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import {ref, onMounted} from 'vue';
  import {categoryApi, type Category} from '@/api';

  // 响应式数据
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref('');

  // 获取分类列表
  const fetchCategories = async () => {
    loading.value = true;
    try {
      const res = await categoryApi.list({
        baseURL: 'http://127.0.0.1:8000/api/v1',
      });
      categories.value = res.data;
    } catch (err) {
      error.value = '加载失败';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchCategories();
  });
</script>
```

---

## 二、方式 2：`npx orval` 生成类型文件（推荐，配合配置文件）

### 特点

- 基于 `orval.config.ts` 配置，**拆分类型和 API 函数**
- 支持生成 **Vue Query hooks**（你的项目配置了这个）
- 类型安全，开发体验好
- 适合复杂项目，长期维护

---

### 1. 确保 `orval.config.ts` 配置正确

```typescript
import {defineConfig} from 'orval';

export default defineConfig({
    comeat: {
        input: {target: './openapi.yaml'},
        output: {
            target: './src/api/index.ts',
            client: 'vue-query', // 生成 Vue Query hooks
            mode: 'split',       // 拆分类型和 API
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

### 2. 确保 `src/api/mutator.ts` 存在

```typescript
import axios from 'axios';

export const customAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    timeout: 15000,
});
```

---

### 3. 生成命令

```bash
npx orval
```

---

### 4. 生成后的文件结构

```
src/api/
├── index.ts              # 入口文件，导出所有内容
├── mutator.ts            # 你的自定义 axios 实例
├── index.schemas.ts      # 纯类型定义文件（拆分出来的）
└── vue-query/            # Vue Query hooks
    ├── common/
    │   ├── useCategoriesList.ts
    │   ├── useProductsList.ts
    │   └── ...
    └── business/
        └── ...
```

---

### 5. 生成的 `index.schemas.ts`（纯类型文件）

```typescript
// src/api/index.schemas.ts
export interface Category {
    readonly id: number;
    name: string;
    sort?: number;
    is_show?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
    readonly is_deleted: boolean;
}

export interface Product {
    readonly id: number;
    name: string;
    price: number;
    // ...
}
```

---

### 6. 在 Vue 组件中使用（配合 Vue Query）

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

  // 直接使用生成的 Vue Query hook
  const {data, isLoading, isError, error} = useProductsList();
</script>
```

---

## 三、两种方式对比

| 对比项       | 方式 1：`orval --input --output` | 方式 2：`npx orval`（推荐） |
|-----------|-------------------------------|----------------------|
| 配置文件      | 不需要                           | 需要 `orval.config.ts` |
| 文件结构      | 单文件                           | 拆分类型和 API            |
| Vue Query | 不支持                           | 原生支持                 |
| 自定义 axios | 需要手动配置                        | 支持 `mutator`         |
| 类型安全      | 有                             | 有，且更清晰               |
| 适用场景      | 简单项目、快速原型                     | 复杂项目、长期维护            |

---

## 四、推荐方案

**继续用方式 2：`npx orval`**，因为：

1. 你的项目已经配置了 `vue-query`，开发体验更好
2. 类型文件拆分清晰，便于管理
3. 支持自定义 axios 实例，可添加拦截器等
4. 符合现代前端开发最佳实践

---

现在你可以根据自己的需求选择合适的方式使用生成的 SDK 了！
