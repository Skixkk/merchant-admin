# uni-app + Vue + Vite-TS 技术栈，最佳方案是「Orval 生成 TypeScript 类型定义 + 自定义封装 uni.request 请求层」

针对你的 **uni-app + Vue + Vite-TS** 技术栈，**最佳方案是「Orval 生成 TypeScript 类型定义 + 自定义封装 uni.request 请求层」
**，既保证类型安全，又完美适配 uni-app 跨端特性（小程序、H5、App 通用）。

---

## 一、为什么选这个方案？

### uni-app 的特殊限制

uni-app 的网络请求必须使用 `uni.request`（不是 axios/fetch），否则无法跨端兼容小程序、App。因此：

- ❌ OpenAPI Generator 的 `typescript-axios` 不适用（依赖 axios）
- ❌ Orval 的 `react-query`/`swr` 不适用（依赖 React/SWR 库）
- ✅ **Orval 生成类型 + 自定义 uni.request 封装** 是唯一完美适配方案

---

## 二、方案优势

| 特性                  | 说明                               |
|---------------------|----------------------------------|
| 🔒 完整 TypeScript 类型 | 接口请求/响应类型自动生成，编辑器全量补全            |
| 📱 完美跨端             | 基于 `uni.request` 封装，支持小程序、H5、App |
| 🎨 轻量无依赖            | 不引入额外第三方库，代码完全可控                 |
| ⚡ 符合 Vue 3 习惯       | 可配合 Vue 3 组合式 API 使用             |

---

## 三、完整实现步骤

### 1. 安装依赖

在你的 **uni-app 项目根目录**（不是后端项目）打开 PowerShell 执行：

```bash
# 进入 uni-app 项目目录
cd your-uniapp-project

# 初始化 package.json（如果还没有）
npm init -y

# 安装 Orval
npm install orval --save-dev
```

---

### 2. 复制后端的 `openapi.yaml`

把后端生成的 `openapi.yaml` 复制到 uni-app 项目根目录。

---

### 3. 创建 Orval 配置文件 `orval.config.ts`

在 uni-app 项目根目录新建 `orval.config.ts`：

```typescript
import {defineConfig} from 'orval';

export default defineConfig({
    comeat: {
        input: {
            target: './openapi.yaml', // 你的 OpenAPI 文件路径
        },
        output: {
            // 仅生成 TypeScript 类型定义（不生成 SDK 函数）
            target: './src/api/types/index.ts',
            mode: 'tags-split', // 按标签拆分类型（common/business 分离）
            client: 'fetch', // 仅用于生成类型，实际用 uni.request
            override: {
                // 禁用生成请求函数，只保留类型
                disableable: true,
            },
        },
    },
});
```

---

### 4. 生成类型定义

执行命令生成 TypeScript 类型：

```bash
npx orval
```

生成后，你的 `src/api/types/` 目录下会有完整的类型定义：

```
src/api/types/
├── common/          # 商家端类型
│   ├── Product.ts
│   ├── Category.ts
│   └── ...
├── business/        # C端类型
│   ├── Order.ts
│   ├── Customer.ts
│   └── ...
└── index.ts         # 类型入口文件
```

---

### 5. 自定义封装 uni.request 请求层

在 `src/api/` 目录下新建 `request.ts`，封装跨端请求：

```typescript
// src/api/request.ts
import type {AxiosRequestConfig} from 'axios'; // 仅用于类型兼容
import {getToken} from '@/utils/auth'; // 你的 token 获取工具

// 基础配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// 统一请求封装
export function request<T = any>(config: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    params?: any;
}): Promise<T> {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + config.url,
            method: config.method || 'GET',
            data: config.data,
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken() || ''}`, // 自动添加 token
            },
            success: (res: any) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data as T);
                } else {
                    uni.showToast({title: res.data.message || '请求失败', icon: 'none'});
                    reject(res.data);
                }
            },
            fail: (err) => {
                uni.showToast({title: '网络错误', icon: 'none'});
                reject(err);
            },
        });
    });
}
```

---

### 6. 按模块创建 API 函数

在 `src/api/` 目录下按商家端/C端创建模块文件，**使用生成的类型**：

#### （1）商家端 API：`src/api/common.ts`

```typescript
// src/api/common.ts
import {request} from './request';
import type {Product, Category, ProductCreate} from './types';

// ------------------------------
// 商品接口
// ------------------------------
export const productApi = {
    // 获取商品列表
    list: () => request<Product[]>({url: '/common/products/', method: 'GET'}),

    // 获取商品详情
    get: (id: number) => request<Product>({url: `/common/products/${id}/`, method: 'GET'}),

    // 创建商品
    create: (data: ProductCreate) => request<Product>({
        url: '/common/products/',
        method: 'POST',
        data
    }),

    // 更新商品
    update: (id: number, data: Partial<ProductCreate>) => request<Product>({
        url: `/common/products/${id}/`,
        method: 'PUT',
        data
    }),

    // 删除商品
    delete: (id: number) => request<void>({url: `/common/products/${id}/`, method: 'DELETE'}),
};

// ------------------------------
// 分类接口
// ------------------------------
export const categoryApi = {
    list: () => request<Category[]>({url: '/common/categories/', method: 'GET'}),
    create: (data: any) => request<Category>({url: '/common/categories/', method: 'POST', data}),
};
```

#### （2）C端 API：`src/api/business.ts`

```typescript
// src/api/business.ts
import {request} from './request';
import type {Order, OrderCreate, Customer} from './types';

// ------------------------------
// 订单接口
// ------------------------------
export const orderApi = {
    list: () => request<Order[]>({url: '/business/orders/', method: 'GET'}),
    create: (data: OrderCreate) => request<Order>({url: '/business/orders/', method: 'POST', data}),
    get: (id: number) => request<Order>({url: `/business/orders/${id}/`, method: 'GET'}),
};

// ------------------------------
// 用户接口
// ------------------------------
export const customerApi = {
    get: (id: number) => request<Customer>({url: `/business/customers/${id}/`, method: 'GET'}),
};
```

---

## 四、在 Vue 3 组件中使用

### 示例 ：商家端商品列表页

```html

<template>
    <view class="product-list">
        <view v-if="loading" class="loading">加载中...</view>
        <view v-else-if="error" class="error">{{ error }}</view>
        <view v-else class="list">
            <view v-for="product in products" :key="product.id" class="product-item">
                <image :src="product.image" mode="aspectFill" class="product-image"/>
                <view class="product-info">
                    <text class="product-name">{{ product.name }}</text>
                    <text class="product-price">¥{{ product.price }}</text>
                    <text class="product-stock">库存: {{ product.stock }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import {ref, onMounted} from 'vue';
    import {productApi} from '@/api/common';
    import type {Product} from '@/api/types';

    // 响应式数据
    const products = ref < Product[] > ([]);
    const loading = ref(false);
    const error = ref('');

    // 获取商品列表
    const fetchProducts = async () => {
        loading.value = true;
        error.value = '';
        try {
            // 类型自动推断！product 是 Product[] 类型
            products.value = await productApi.list();
        } catch (err) {
            error.value = '获取商品失败';
        } finally {
            loading.value = false;
        }
    };

    // 页面加载时调用
    onMounted(() => {
        fetchProducts();
    });
</script>

<style scoped>
    /* 样式省略 */
</style>
```

---

### 示例 2：C端创建订单页

```html

<template>
    <view class="create-order">
        <button @click="handleCreateOrder" :disabled="loading">
            {{ loading ? '创建中...' : '提交订单' }}
        </button>
    </view>
</template>

<script setup lang="ts">
    import {ref} from 'vue';
    import {orderApi} from '@/api/business';
    import type {OrderCreate} from '@/api/types';

    const loading = ref(false);

    // 创建订单
    const handleCreateOrder = async () => {
        loading.value = true;
        try {
            // 类型安全！orderData 必须符合 OrderCreate 类型
            const orderData: OrderCreate = {
                address: { /* 地址数据 */},
                remark: '不要辣',
            };
            const order = await orderApi.create(orderData);
            uni.showToast({title: '订单创建成功', icon: 'success'});
            // 跳转到订单详情页
            uni.navigateTo({url: `/pages/order/detail?id=${order.id}`});
        } catch (err) {
            uni.showToast({title: '订单创建失败', icon: 'none'});
        } finally {
            loading.value = false;
        }
    };
</script>
```

---

## 五、进阶优化（可选）

### 1. 配合 Vue Query 使用（缓存、自动重连）

uni-app 可以使用 `@tanstack/vue-query`，配合生成的类型使用：

```bash
npm install @tanstack/vue-query
```

```typescript
// 在组件中使用
import {useQuery} from '@tanstack/vue-query';
import {productApi} from '@/api/common';

const {data: products, isLoading, error} = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.list(),
});
```

---

### 2. 环境变量配置

在 uni-app 项目根目录创建 `.env` 文件：

```Text
# .env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## 六、Git 提交注释

```
feat(api): generate TypeScript types and implement uni-app request layer

Generate complete TypeScript type definitions via Orval from openapi.yaml.
Implement custom uni.request wrapper for cross-platform compatibility (miniprogram, H5, App).
Create modular API functions for both common (merchant) and business (customer) endpoints.

Refs: #1
```

---

## 七、总结

| 问题        | 答案                                             |
|-----------|------------------------------------------------|
| 最佳 SDK 方案 | Orval 生成类型 + 自定义 uni.request 封装                |
| 为什么       | 完美适配 uni-app 跨端，类型安全，代码可控                      |
| 核心步骤      | 1. Orval 生成类型 2. 封装 uni.request 3. 按模块写 API 函数 |
| 类型支持      | 全量 TypeScript 类型，编辑器自动补全                       |
| 跨端支持      | 支持小程序、H5、App                                   |

**这个方案是 uni-app + Vue + Vite-TS 项目的黄金组合，既保证开发体验，又完美适配跨端需求！**
