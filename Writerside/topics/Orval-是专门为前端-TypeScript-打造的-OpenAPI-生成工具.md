# Orval 是专门为前端 TypeScript 打造的 OpenAPI 生成工具

**Orval 是专门为前端 TypeScript 打造的 OpenAPI 生成工具，比 OpenAPI Generator 更轻量、更贴合现代前端开发习惯，完美支持
React Query、SWR、Zod 等主流前端库**。

---

## 一、Orval vs OpenAPI Generator：为什么选 Orval？

| 对比维度  | Orval                    | OpenAPI Generator |
|-------|--------------------------|-------------------|
| 定位    | 专门为前端 TypeScript 设计      | 通用多语言生成工具         |
| 前端生态  | 原生支持 React Query、SWR、Zod | 需手动配置，支持有限        |
| 生成的代码 | 简洁、符合前端习惯、可直接用           | 代码较重、有很多模板代码      |
| 配置    | 简单的 `orval.config.ts`    | 命令行参数多，配置复杂       |
| 类型定义  | 精准、自动推断                  | 有时会有冗余类型          |
| 学习成本  | 极低，前端开发者一看就会             | 较高，需要了解多语言配置      |

**对于你的餐饮外卖项目，Orval 是前端 SDK 生成的首选！**

---

## 二、快速开始（3 步生成 SDK）

### 1. 安装 Orval

在你的项目根目录打开 PowerShell 执行：

```bash
# 进入项目根目录
cd D:\My_File\Product\Django_from_github\comeat_backend

# 初始化 package.json（如果还没有）
npm init -y

# 安装 Orval 相关依赖
npm install orval @tanstack/react-query axios --save-dev
```

---

### 2. 创建配置文件 `orval.config.ts`

在项目根目录新建 `orval.config.ts`，粘贴以下配置（**专门适配你的餐饮外卖项目**）：

```typescript
import {defineConfig} from 'orval';

export default defineConfig({
    // 你的 OpenAPI 规范文件路径
    comeat: {
        input: {
            target: './openapi.yaml',
        },
        // 输出配置
        output: {
            // 输出目录
            target: './frontend-sdk/src/index.ts',
            // 生成的 SDK 类型：这里选 react-query（最常用）
            client: 'react-query',
            // 生成 TypeScript 类型定义
            mode: 'split',
            // 输出目录
            override: {
                // 自定义生成器配置
                mutator: {
                    path: './frontend-sdk/src/mutator.ts',
                    name: 'customInstance',
                },
            },
        },
    },
});
```

---

### 生成 SDK

在 PowerShell 中执行：

```bash
# 生成 SDK
npx orval
```

**完成！** 你的 SDK 已经生成在 `frontend-sdk/` 目录下了。

---

## 三、生成后的目录结构

```
frontend-sdk/
├── src/
│   ├── index.ts              # 入口文件，导出所有类型和 hooks
│   ├── mutator.ts            # 自定义 Axios 实例（可配置拦截器）
│   ├── react-query/          # 核心：React Query hooks
│   │   ├── common/           # 商家端 hooks
│   │   │   ├── useProductsList.ts
│   │   │   ├── useCategoriesCreate.ts
│   │   │   └── ...
│   │   └── business/         # C端 hooks
│   │       ├── useOrdersCreate.ts
│   │       ├── useCustomersGet.ts
│   │       └── ...
│   └── types/                # 核心：TypeScript 类型定义
│       ├── Product.ts
│       ├── Category.ts
│       ├── Order.ts
│       └── ...
└── orval.config.ts           # 配置文件
```

---

## 四、前端使用示例（React + React Query）

### 1. 配置 React Query Provider

在你的 React 项目入口文件（如 `main.tsx`）中配置：

```tsx
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            {/* 你的应用组件 */}
            <ProductList/>
            {/* React Query 开发工具（可选） */}
            <ReactQueryDevtools/>
        </QueryClientProvider>
    );
}
```

---

### 2. 使用生成的 Hooks（商家端：获取商品列表）

```tsx
import {useProductsList} from '../comeat_backend/frontend-sdk';

function ProductList() {
    // 直接调用生成的 hook，自动处理 loading、error、缓存
    const {data: products, isLoading, error} = useProductsList();

    if (isLoading) return <div>加载中...</div>;
    if (error) return <div>加载失败: {error.message}</div>;

    return (
        <div>
            <h1>商品列表</h1>
            <ul>
                {products?.map((product) => (
                    <li key={product.id}>
                        {/* 自动补全 product.name、product.price 等字段 */}
                        <h3>{product.name}</h3>
                        <p>价格: ¥{product.price}</p>
                        <p>库存: {product.stock}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

---

### 3. 使用生成的 Hooks（C端：创建订单）

```tsx
import {useOrdersCreate} from '../comeat_backend/frontend-sdk';
import {useMutation} from '@tanstack/react-query';

function CreateOrder() {
    // 调用生成的 mutation hook
    const {mutate: createOrder, isLoading, isSuccess} = useOrdersCreate();

    const handleSubmit = (orderData: any) => {
        // 直接调用，自动处理请求
        createOrder({data: orderData});
    };

    if (isSuccess) return <div>订单创建成功！</div>;

    return (
        <div>
            <h1>创建订单</h1>
            <button onClick={() => handleSubmit({})} disabled={isLoading}>
                {isLoading ? '创建中...' : '提交订单'}
            </button>
        </div>
    );
}
```

---

## 五、常用配置选项

### 1. 生成 SWR 而不是 React Query

修改 `orval.config.ts`：

```typescript
export default defineConfig({
    comeat: {
        input: {target: './openapi.yaml'},
        output: {
            target: './frontend-sdk/src/index.ts',
            client: 'swr', // 改成 swr
            mode: 'split',
        },
    },
});
```

---

### 2. 生成 Zod 验证模式（前端数据验证）

修改 `orval.config.ts`：

```typescript
export default defineConfig({
    comeat: {
        input: {target: './openapi.yaml'},
        output: {
            target: './frontend-sdk/src/index.ts',
            client: 'react-query',
            mode: 'split',
            override: {
                zod: {
                    enabled: true, // 启用 Zod
                },
            },
        },
    },
});
```

---

### 3. 自定义 Axios 实例（添加拦截器）

生成的 `mutator.ts` 可以自定义 Axios 配置：

```typescript
import Axios, {AxiosError, AxiosRequestConfig} from 'axios';

// 创建自定义 Axios 实例
export const customInstance = Axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    timeout: 10000,
});

// 添加请求拦截器（自动添加 Token）
customInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 添加响应拦截器（统一处理错误）
customInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);
```

---

## 六、Orval 常用命令

```bash
# 生成 SDK
npx orval

# 监听文件变化，自动重新生成
npx orval --watch

# 清理生成的文件
npx orval --clean

# 查看帮助
npx orval --help
```

---

## 七、Git 提交注释（Angular 规范）

```
feat(sdk): generate TypeScript React Query SDK via Orval

Generate modern frontend SDK with React Query hooks and TypeScript type definitions using Orval.
SDK includes both common (merchant) and business (customer) APIs with full type safety and caching.
Output directory: frontend-sdk/

Refs: #1
```

---

## 八、总结

| 问题            | 答案                                              |
|---------------|-------------------------------------------------|
| Orval 是什么？    | 专门为前端 TypeScript 打造的 OpenAPI 生成工具               |
| 为什么选 Orval？   | 比 OpenAPI Generator 更轻量、更前端化、支持 React Query/SWR |
| 生成的 SDK 包含什么？ | React Query/SWR hooks + TypeScript 类型定义         |
| 怎么用？          | 3 步：安装 → 配置 → 生成，然后直接在 React 中调用 hooks          |

**Orval 是现代前端开发的首选 OpenAPI 生成工具，强烈推荐你使用！**