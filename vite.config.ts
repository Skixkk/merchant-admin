// vite.config.ts
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // ✅ 修复1：使用新的 attributes 选项替代已弃用的 styleId
    cssInjectedByJsPlugin({
      attributes: {
        id: 'merchant-admin-style'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 500, // 恢复默认500KB警告阈值
    
    rolldownOptions: {
      output: {
        // ✅ 修复2：优化代码分割配置，彻底拆分超大chunk
        codeSplitting: {
          minSize: 10000, // 10KB
          maxSize: 250000, // 新增：单个chunk最大250KB，超过自动拆分
          
          groups: [
            // Vue 生态核心（优先级从高到低）
            {
              name: 'vue-core',
              test: /node_modules[\\/](vue|@vue)/,
              priority: 35,
              maxSize: 500000 // ✅ 单独给 vue-core 设置 500KB 上限，确保不会被拆分
            },
            {
              name: 'vue-router',
              test: /node_modules[\\/]vue-router/,
              priority: 32
            },
            {
              name: 'pinia',
              test: /node_modules[\\/]pinia/,
              priority: 30
            },
            
            // UI 组件库（最大的体积来源，必须单独拆分）
            {
              name: 'element-plus',
              test: /node_modules[\\/]element-plus/,
              priority: 28
            },
            {
              name: 'element-plus-icons',
              test: /node_modules[\\/]@element-plus/,
              priority: 26
            },
            
            // 工具库
            {
              name: 'axios',
              test: /node_modules[\\/](axios|qs)/,
              priority: 24
            },
            {
              name: 'utils',
              test: /node_modules[\\/](lodash|dayjs|echarts|nprogress)/,
              priority: 22
            },
            
            // 剩余第三方依赖
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10,
              maxSize: 250000 // 强制单个vendor chunk不超过250KB
            },
            
            // 公共业务代码
            {
              name: 'common',
              minShareCount: 2,
              minSize: 5000,
              priority: 5
            }
          ]
        },
        
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/index-[hash].css'
          }
          return 'assets/[name]-[hash][extname]'
        },
        
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/index-[hash].js'
      }
    }
  }
})