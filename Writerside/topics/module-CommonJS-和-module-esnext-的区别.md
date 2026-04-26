# &quot;module&quot;: &quot;CommonJS&quot;, 和 &quot;module&quot;: &quot;esnext&quot;, 的区别

### 核心定义

`module` 是 TypeScript 中用于指定**编译后代码使用的模块系统**的核心配置，决定了 TS 如何处理模块的导入/导出语法。二者的核心本质差异如下：

- **`CommonJS`**：是 Node.js 早期（v12 之前）默认使用的**同步模块系统**，采用运行时加载机制，语法为 `require()` /
  `module.exports`，是 Node.js 生态的传统标准。
- **`ESNext`**：是 ECMAScript 官方定义的**静态模块系统**的最新动态集合，采用编译时解析机制，语法为 `import` / `export`
  ，是现代浏览器、Node.js 12+ 及 Vite/Webpack 等构建工具的原生标准。

---

### 核心差异对比表

| 对比维度             | `CommonJS`                                        | `ESNext`                                                                    |
|:-----------------|:--------------------------------------------------|:----------------------------------------------------------------------------|
| **语法关键字**        | 导入：`require()`<br>导出：`module.exports` / `exports` | 导入：`import ... from '...'`<br>导出：`export` / `export default`                |
| **加载时机**         | **同步加载**，运行时执行 `require()` 才加载模块                  | **静态加载**，编译时解析 `import`，提前加载模块；支持动态 `import()` 异步加载                         |
| **语法限制**         | `require()` 可放在任意位置（如条件语句、函数内）                    | `import` 必须放在文件顶层，不能在条件/函数内；动态 `import()` 可在任意位置                            |
| **导出特性**         | 导出**值的拷贝**，修改原模块值不影响已导入的值                         | 导出**值的引用**，修改原模块值会同步影响已导入的值                                                 |
| **适用环境**         | 主要用于 Node.js 环境（v12 之前默认，v12+ 仍兼容）                | 现代浏览器、Node.js 12+（需设置 `package.json` 中 `type: "module"`）、Vite/Webpack 等构建工具 |
| **编译输出**         | TS 编译后保留 `require()` / `module.exports` 语法        | TS 编译后保留 `import` / `export` 语法，交给构建工具或运行时处理                                |
| **Tree Shaking** | 不支持（同步加载难以静态分析）                                   | 原生支持（静态加载可在编译时分析未使用的代码并删除）                                                  |

---

### 关键细节补充

1. **语法示例对比**
   ```typescript
   // CommonJS 写法
   const fs = require('fs');
   module.exports = { name: 'test' };
   exports.age = 18;

   // ESNext 写法
   import fs from 'fs';
   export const name = 'test';
   export default { age: 18 };
   ```

2. **导出值的差异示例**
   ```typescript
   // module.ts (CommonJS)
   let count = 0;
   module.exports = { count, add: () => count++ };
   
   // main.ts (CommonJS)
   const mod = require('./module');
   console.log(mod.count); // 0
   mod.add();
   console.log(mod.count); // 0（拷贝值，未更新）
   ```
   ```typescript
   // module.ts (ESNext)
   export let count = 0;
   export const add = () => count++;
   
   // main.ts (ESNext)
   import { count, add } from './module';
   console.log(count); // 0
   add();
   console.log(count); // 1（引用值，已更新）
   ```

3. **与 Vite 的联动**
   你的项目是 Vue + Vite-TS，Vite 原生基于 ES 模块构建，设置 `module: "ESNext"` 可：
    - 直接利用 Vite 的 Tree Shaking 优化打包体积；
    - 支持热更新（HMR）等现代特性；
    - 无需额外转换，构建效率更高。

---

### 选型建议

| 场景                           | 推荐配置                          |
|:-----------------------------|:------------------------------|
| 纯 Node.js 后端项目（不使用构建工具）      | `CommonJS`（兼容 Node.js 传统生态）   |
| Vue/Vite/React/Webpack 等前端项目 | 优先 `ESNext`（原生支持构建工具优化）       |
| 多租户 SaaS 外卖商家后台（你的项目）        | `ESNext`（配合 Vite 提升构建效率和打包体积） |
