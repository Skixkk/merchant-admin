# Orval单文件模式&amp;拆分模式

这两次生成的内容**完全不同**，核心原因是**运行方式和配置不同**，导致 Orval 执行了不同的生成逻辑。以下是详细对比：

---

## 🔍 核心差异对比

| 维度           | 第一次：`npx orval`（用配置文件）       | 第二次：`orval --input --output`（纯命令行）  |
|--------------|------------------------------|-------------------------------------|
| **运行依据**     | 读取 `orval.config.ts` 配置文件    | 仅使用命令行参数，无配置文件                      |
| **生成文件**     | `src/api/index.schemas.ts`   | `src/api/index.ts`                  |
| **内容性质**     | 纯类型定义文件（只有接口）                | 完整 SDK 文件（类型 + 工具类型 + axios 代码）     |
| **工具类型**     | 无（`IfEquals`/`WritableKeys`） | 有（Orval 自动注入的类型工具）                  |
| **axios 导入** | 无                            | 有（`import * as axios from 'axios'`） |

---

## 📝 具体内容差异分析

### 1. 第一次生成的 `index.schemas.ts`

**特点：只有纯业务类型定义**

```typescript
// 只有 Category 接口，无任何其他代码
export interface Category {
    readonly id: number;
    name: string;
    sort?: number;
    is_show?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
    readonly is_deleted: boolean;
}
```

**原因**：你的 `orval.config.ts` 中可能配置了 `mode: 'split'`，Orval 会把**类型定义**单独拆分到 `*.schemas.ts` 文件中。

---

### 2. 第二次生成的 `index.ts`

**特点：包含完整的 SDK 基础设施**

```typescript
// 1. 导入 axios
import * as axios from 'axios';
import type {AxiosRequestConfig, AxiosResponse} from 'axios';

// 2. Orval 自动注入的类型工具（来自你提供的 Stack Overflow 链接）
type IfEquals<X, Y, A = X, B = never> =
...
;
type WritableKeys<T> =
...
;

// （后面还会有生成的 API 调用函数，你没贴全）
```

**原因**：

- 纯命令行运行时，Orval 会生成**完整的单文件 SDK**，包含所有必需的基础设施
- 自动注入的 `IfEquals`/`WritableKeys` 是 Orval 内部用来处理 `readonly` 属性的工具类型（和你提供的 Stack Overflow 代码完全一致）

---

## 🎯 为什么会有这些不同？

| 差异点           | 原因                                                                     |
|---------------|------------------------------------------------------------------------|
| **工具类型的有无**   | 纯命令行生成完整 SDK 时，Orval 需要这些工具类型来处理 `readonly`/可选属性；配置文件拆分模式下，类型文件不需要这些工具 |
| **axios 的导入** | 纯命令行默认生成 axios 客户端代码；配置文件如果设置了 `override.mutator`，会用你自定义的 axios 实例     |
| **文件拆分**      | 配置文件的 `mode: 'split'` 会拆分类型和 API 函数；纯命令行默认 `mode: 'single'` 单文件        |

---

## ✅ 推荐使用方式

**继续用 `npx orval`（配置文件方式）**，因为：

1. 配置文件可以精确控制生成行为（`client: 'vue-query'`、`mutator` 等）
2. 拆分的 `*.schemas.ts` 更清晰，类型和业务逻辑分离
3. 符合你之前的项目规划（Vue Query + 自定义 axios 实例）

---

## 📌 总结

- **第一次**：配置文件驱动的「拆分模式」，生成纯类型文件
- **第二次**：纯命令行的「单文件模式」，生成完整 SDK（含工具类型和 axios）
- **推荐**：继续用 `npx orval`（配置文件方式），保持项目一致性