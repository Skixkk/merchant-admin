// src/main.ts
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {QueryClient, VueQueryPlugin} from '@tanstack/vue-query'; // 修复：替换 QueryClientProvider 为 VueQueryPlugin
import axios from 'axios';

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
app.use(VueQueryPlugin, {client: queryClient}); // 修复：使用 VueQueryPlugin 替代 QueryClientProvider

app.mount('#app');