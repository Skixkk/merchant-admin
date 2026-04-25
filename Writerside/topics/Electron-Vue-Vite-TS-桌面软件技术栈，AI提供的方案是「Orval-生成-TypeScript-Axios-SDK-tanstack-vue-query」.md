# Electron + Vue + Vite-TS 桌面软件技术栈，AI提供的方案是「Orval 生成 TypeScript Axios SDK + @tanstack/vue-query」

针对你的 **Electron + Vue + Vite-TS** 桌面软件技术栈，**最佳方案是「Orval 生成 TypeScript Axios SDK + @tanstack/vue-query」
**，既享受完整的类型安全，又拥有强大的数据缓存与状态管理能力，完美适配 Electron 桌面环境（支持 axios，无跨端限制）。

---

## 一、为什么选这个方案？

### Electron 环境的天然优势

Electron 基于 Chromium + Node.js，**完全支持 axios、fetch 等标准 Web API**，无需像 uni-app 那样受限于特定请求库，因此可以使用最现代的前端开发方案：

- ✅ **Orval**：专门为前端 TypeScript 设计，生成代码简洁优雅
- ✅ **TypeScript Axios**：类型安全，请求/响应全链路类型提示
- ✅ **@tanstack/vue-query**：强大的数据缓存、自动重连、状态同步，桌面应用体验更流畅

---

## 二、方案优势

| 特性                   | 说明                              |
|----------------------|---------------------------------|
| 🔒 全链路 TypeScript 类型 | 接口请求/响应、Vue Query hooks 全类型覆盖   |
| 🚀 强大的数据缓存           | Vue Query 自动缓存、去重、后台刷新，桌面应用响应更快 |
| 🎨 符合 Vue 3 习惯       | 组合式 API，代码简洁易读                  |
| 📦 无跨端限制             | 基于 axios，完美适配 Electron 环境       |
| 🔄 自动状态管理            | loading、error、success 状态自动处理    |

---

## 三、完整实现步骤

### 安装依赖

在你的 **Electron + Vue 项目根目录**打开 PowerShell 执行：

```bash
# 进入项目目录
cd your-electron-vue-project

# 安装核心依赖
npm install orval axios @tanstack/vue-query --save-dev
```

---

### 2. 复制后端的 `openapi.yaml`

把后端生成的 `openapi.yaml` 复制到 Electron 项目根目录。

---

### 3. 创建 Orval 配置文件 `orval.config.ts`

在项目根目录新建 `orval.config.ts`（**专门适配 Vue + Axios + Vue Query**）：

```typescript
import {defineConfig} from 'orval';

export default defineConfig({
    comeat: {
        input: {
            target: './openapi.yaml', // 你的 OpenAPI 文件路径
        },
        output: {
            // 输出目录
            target: './src/api/index.ts',
            // 生成器类型：Vue Query + Axios（完美适配你的技术栈）
            client: 'vue-query',
            // 拆分类型和 hooks
            mode: 'split',
            // 额外配置
            override: {
                // 自定义 Axios 实例
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

### 4. 生成 SDK

执行命令生成完整的 SDK：

```bash
npx orval
```

生成后，你的 `src/api/` 目录结构如下：

```
src/api/
├── index.ts              # 入口文件，导出所有类型和 hooks
├── mutator.ts            # 自定义 Axios 实例（可配置拦截器）
├── vue-query/            # 核心：Vue Query hooks
│   ├── common/           # 商家端 hooks
│   │   ├── useProductsList.ts
│   │   ├── useCategoriesCreate.ts
│   │   ├── useProductsUpdate.ts
│   │   └── ...
│   └── business/         # C端 hooks
│       ├── useOrdersCreate.ts
│       ├── useCustomersGet.ts
│       └── ...
└── types/                # 核心：TypeScript 类型定义
    ├── Product.ts
    ├── Category.ts
    ├── Order.ts
    └── ...
```

---

### 5. 配置自定义 Axios 实例

生成的 `src/api/mutator.ts` 可以自定义 Axios 配置（适配 Electron 环境）：

```typescript
// src/api/mutator.ts
import Axios, {AxiosError, AxiosRequestConfig} from 'axios';

// 创建自定义 Axios 实例
export const customAxios = Axios.create({
    // 你的后端 API 地址（Electron 中可直接访问本地/远程地址）
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
    timeout: 15000, // 桌面应用可设置稍长的超时时间
});

// 添加请求拦截器（自动添加 Token、租户信息等）
customAxios.interceptors.request.use(
    (config) => {
        // 从 Electron 的 localStorage 或 Node.js 的 fs 中获取 Token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // 如果是多租户场景，可添加租户 Header
        // config.headers['X-Tenant-ID'] = localStorage.getItem('tenantId');
        return config;
    },
    (error) => Promise.reject(error)
);

// 添加响应拦截器（统一处理错误、刷新 Token 等）
customAxios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // 统一错误处理（Electron 中可用 Electron 的 dialog 弹出错误提示）
        console.error('API Error:', error.response?.data || error.message);

        // 401 未授权：清除 Token 并跳转到登录页
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);
```

---

### 6. 配置 Vue Query Provider

在你的 Vue 项目入口文件（如 `src/main.ts`）中配置 Vue Query：

```typescript
// src/main.ts
import {createApp} from 'vue';
import App from './App.vue';
import {QueryClient, QueryClientProvider} from '@tanstack/vue-query';
import {VueQueryDevtools} from '@tanstack/vue-query-devtools';

// 创建 Query Client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 分钟内数据视为新鲜
            refetchOnWindowFocus: false, // Electron 桌面应用禁用窗口聚焦时自动刷新
            retry: 2, // 失败自动重试 2 次
        },
    },
});

const app = createApp(App);

// 挂载 Vue Query Provider
app.use(QueryClientProvider, {client: queryClient});

// 开发环境挂载 Vue Query Devtools
if (import.meta.env.DEV) {
    app.component('VueQueryDevtools', VueQueryDevtools);
}

app.mount('#app');
```

---

## 四、在 Vue 3 组件中使用（完整示例）

### 示例 ：商家端商品列表页（查询 + 缓存）

```html

<template>
    <div class="product-list">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading">
            <p>加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="isError" class="error">
            <p>加载失败: {{ error?.message }}</p>
            <button @click="refetch">重试</button>
        </div>

        <!-- 数据展示 -->
        <div v-else class="list">
            <div v-for="product in data" :key="product.id" class="product-card">
                <img :src="product.image" :alt="product.name" class="product-image"/>
                <div class="product-info">
                    <h3>{{ product.name }}</h3>
                    <p class="price">¥{{ product.price }}</p>
                    <p class="stock">库存: {{ product.stock }}</p>
                    <p class="sales">销量: {{ product.sales }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {useProductsList} from '@/api';

    // 直接调用生成的 Vue Query hook
    const {data, isLoading, isError, error, refetch} = useProductsList();
</script>

<style scoped>
    .product-list {
        padding: 20px;
    }

    .product-card {
        display: flex;
        gap: 15px;
        padding: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 8px;
    }

    .product-image {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 4px;
    }

    .price {
        color: #ff4500;
        font-weight: bold;
    }
</style>
```

---

### 示例 2：商家端创建商品页（Mutation + 状态更新）

```html

<template>
    <div class="create-product">
        <h2>创建商品</h2>

        <form @submit.prevent="handleSubmit">
            <div class="form-item">
                <label>商品名称</label>
                <input v-model="formData.name" type="text" required/>
            </div>

            <div class="form-item">
                <label>分类选择</label>
                <select v-model="formData.category_id" required>
                    <option value="">请选择分类</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                    </option>
                </select>
            </div>

            <div class="form-item">
                <label>价格</label>
                <input v-model.number="formData.price" type="number" step="0.01" required/>
            </div>

            <div class="form-item">
                <label>库存</label>
                <input v-model.number="formData.stock" type="number" required/>
            </div>

            <div class="form-item">
                <label>商品图片</label>
                <input v-model="formData.image" type="url" required/>
            </div>

            <button type="submit" :disabled="isPending">
                {{ isPending ? '创建中...' : '创建商品' }}
            </button>
        </form>

        <div v-if="isSuccess" class="success">
            商品创建成功！
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref, onMounted} from 'vue';
    import {useProductsCreate, useCategoriesList, useQueryClient} from '@/api';
    import type {ProductCreate} from '@/api/types';

    // 获取 Query Client 用于缓存更新
    const queryClient = useQueryClient();

    // 表单数据
    const formData = ref < ProductCreate > ({
        name: '',
        category_id: 0,
        price: 0,
        stock: 0,
        image: '',
    });

    // 获取分类列表（用于下拉选择）
    const {data: categories} = useCategoriesList();

    // 创建商品的 Mutation hook
    const {mutate: createProduct, isPending, isSuccess} = useProductsCreate({
        // 成功后的回调
        onSuccess: () => {
            // 刷新商品列表缓存（让列表页自动显示新商品）
            queryClient.invalidateQueries({queryKey: ['productsList']});
            // 重置表单
            formData.value = {name: '', category_id: 0, price: 0, stock: 0, image: ''};
        },
    });

    // 提交表单
    const handleSubmit = () => {
        createProduct({data: formData.value});
    };
</script>

<style scoped>
    .create-product {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
    }

    .form-item {
        margin-bottom: 15px;
    }

    .form-item label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .form-item input,
    .form-item select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    button {
        width: 100%;
        padding: 10px;
        background-color: #ff4500;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:disabled {
        background-color: #ccc;
    }

    .success {
        margin-top: 15px;
        padding: 10px;
        background-color: #d4edda;
        color: #155724;
        border-radius: 4px;
    }
</style>
```

---

## 五、进阶优化（Electron 专属） {id="electron_1"}

### 环境变量配置

在项目根目录创建 `.env` 和 `.env.production` 文件：

```text
# .env (开发环境)
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

```text
# .env.production (生产环境)
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

---

### 2. Electron 中使用 Node.js API 存储 Token

如果不想用 localStorage，可以用 Electron 的 `electron-store` 持久化存储 Token：

```bash
npm install electron-store
```

```typescript
// 在 mutator.ts 中使用
import Store from 'electron-store';

const store = new Store();

// 获取 Token
const token = store.get('token');
// 存储 Token
store.set('token', 'your-token-here');
```

---

## 六、Git 提交注释（Angular 规范）

```
feat(sdk): generate Vue Query + Axios SDK via Orval for Electron

Generate complete TypeScript SDK with Vue Query hooks and Axios client using Orval.
SDK includes full type safety, caching, automatic retries and error handling.
Perfectly adapted for Electron + Vue + Vite-TS desktop application.
Output directory: src/api/

Refs: #1
```

---

## 七、总结

| 问题        | 答案                                                      |
|-----------|---------------------------------------------------------|
| 最佳 SDK 方案 | Orval 生成 TypeScript Axios SDK + @tanstack/vue-query     |
| 为什么选这个方案  | 类型安全、缓存强大、符合 Vue 3 习惯、完美适配 Electron                     |
| 核心步骤      | 1. 安装依赖 2. 配置 Orval 3. 生成 SDK 4. 配置 Vue Query 5. 在组件中使用 |
| 类型支持      | 全链路 TypeScript 类型，编辑器自动补全                               |
| 缓存能力      | Vue Query 自动缓存、去重、后台刷新                                  |

**这个方案是 Electron + Vue + Vite-TS 桌面项目的黄金组合，既保证开发体验，又提供流畅的桌面应用性能！**