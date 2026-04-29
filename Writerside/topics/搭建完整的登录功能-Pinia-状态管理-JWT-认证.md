# 搭建完整的登录功能 + Pinia 状态管理 + JWT 认证

我来带你**从零搭建完整的登录功能 + Pinia 状态管理 + JWT 认证**，完美适配你现有的商品/分类/订单页面，彻底解决 Token 无效、401
问题。

# 一、项目结构（新增/修改）

```
src/
├── stores/
│   └── user.ts       # Pinia 用户状态管理（核心）
├── utils/
│   ├── auth.ts       # Token 本地存储工具
│   └── request.ts    # Axios 统一请求拦截（自动带Token、处理401）
├── views/
│   └── Login.vue     # 登录页面
└── router/
    └── index.ts      # 添加路由守卫（登录校验）
```

---

# 二、第一步：安装依赖（如已安装可跳过）

```bash
npm install pinia axios
```

---

# 三、第二步：编写工具类

## 1. src/utils/auth.ts（Token 存储）

```typescript
// Token 键名
const TOKEN_KEY = 'merchant_token'

// 获取 Token
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY) || ''
}

// 设置 Token
export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
}

// 删除 Token
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
}
```

## 2. src/utils/request.ts（统一请求封装）

```typescript
import axios from 'axios'
import {getToken, removeToken} from './auth'
import {ElMessage} from 'element-plus'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
    baseURL: 'http://freedom.localhost:8000/api/v1',
    timeout: 5000
})

// 请求拦截：自动携带 Token
service.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截：处理 401 登录过期
service.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response?.status === 401) {
            ElMessage.error('登录已过期，请重新登录')
            removeToken()
            router.push('/login')
        } else {
            ElMessage.error(error.message || '请求失败')
        }
        return Promise.reject(error)
    }
)

export default service
```

---

# 四、第三步：Pinia 用户状态管理（核心）

## src/stores/user.ts

```typescript
import {defineStore} from 'pinia'
import {ref} from 'vue'
import request from '@/utils/request'
import {setToken, removeToken, getToken} from '@/utils/auth'

// 用户 Store
export const useUserStore = defineStore('user', () => {
    // 用户信息
    const userInfo = ref<any>(null)
    // Token
    const token = ref(getToken())

    // 登录
    const login = async (loginForm: { username: string; password: string }) => {
        try {
            // 后端登录接口（适配你的 Django JWT 接口）
            const res = await request.post('/user/login/', loginForm)
            // 保存 Token
            token.value = res.access
            setToken(res.access)
            // 获取用户信息
            await getUserInfo()
            return res
        } catch (err) {
            throw err
        }
    }

    // 获取用户信息
    const getUserInfo = async () => {
        const res = await request.get('/user/info/')
        userInfo.value = res
    }

    // 登出
    const logout = () => {
        userInfo.value = null
        token.value = ''
        removeToken()
    }

    return {
        userInfo,
        token,
        login,
        getUserInfo,
        logout
    }
})
```

---

# 五、第四步：登录页面

## src/views/Login.vue

```vue

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>商家后台登录</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" loading="loading" style="width: 100%">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {ref} from 'vue'
  import {useRouter} from 'vue-router'
  import {useUserStore} from '@/stores/user'
  import {ElMessage, ElForm} from 'element-plus'

  const router = useRouter()
  const userStore = useUserStore()
  const formRef = ref<InstanceType<typeof ElForm>>()

  // 登录表单
  const form = ref({
    username: '',
    password: ''
  })

  // 表单验证
  const rules = ref({
    username: [{required: true, message: '请输入账号', trigger: 'blur'}],
    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
  })

  // 登录状态
  const loading = ref(false)

  // 登录提交
  const handleLogin = async () => {
    await formRef.value?.validate()
    loading.value = true
    try {
      await userStore.login(form.value)
      ElMessage.success('登录成功')
      router.push('/dashboard') // 登录成功跳数据总览
    } catch (err) {
      ElMessage.error('账号或密码错误')
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .login-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f2f5;
  }

  .login-box {
    width: 400px;
    padding: 30px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .login-box h2 {
    text-align: center;
    margin-bottom: 30px;
  }
</style>
```

---

# 六、第五步：路由配置 + 登录守卫

## src/router/index.ts

```typescript
import {createRouter, createWebHistory} from 'vue-router'
import {getToken} from '@/utils/auth'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: {title: '登录'}
    },
    {
        path: '/',
        component: () => import('@/components/Layout.vue'),
        redirect: '/dashboard',
        meta: {requiresAuth: true}, // 需要登录
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/Dashboard.vue'),
                meta: {title: '数据总览'}
            },
            {
                path: 'categories',
                name: 'Categories',
                component: () => import('@/views/categories/List.vue'),
                meta: {title: '分类管理'}
            },
            {
                path: 'products',
                name: 'Products',
                component: () => import('@/views/products/List.vue'),
                meta: {title: '商品管理'}
            },
            {
                path: 'products/create',
                name: 'ProductCreate',
                component: () => import('@/views/products/Form.vue'),
                meta: {title: '创建商品'}
            },
            {
                path: 'products/edit/:id',
                name: 'ProductEdit',
                component: () => import('@/views/products/Form.vue'),
                meta: {title: '编辑商品'}
            },
            {
                path: 'orders',
                name: 'Orders',
                component: () => import('@/views/orders/List.vue'),
                meta: {title: '订单管理'}
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫：登录校验
router.beforeEach((to, from, next) => {
    const token = getToken()
    // 需要登录的页面
    if (to.meta.requiresAuth) {
        if (token) {
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})

export default router
```

---

# 七、第六步：**改造你所有旧页面（极简！）**

把之前所有页面（List.vue）里的 **手动 axios + 手动加 Token** 全部替换为 **统一 request**

### 示例：商品列表 src/views/products/List.vue

```typescript
// 替换旧的 axios
// import axios from 'axios'
import request from '@/utils/request'

// 获取商品列表（极简代码，自动带Token、处理401）
const fetchProducts = async () => {
    isLoading.value = true;
    try {
        const res = await request.get('/common/products/')
        products.value = res.results || []
    } catch (error) {
        console.error('请求失败:', error);
    } finally {
        isLoading.value = false;
    }
};
```

### 分类/订单页面 **完全一样修改**

1. 删除 `axios` 导入
2. 导入 `request from '@/utils/request'`
3. 把 `axios.get(...)` 改为 `request.get(...)`

---

# 七、第七步：挂载 Pinia（main.ts）

## src/main.ts

```typescript
import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.mount('#app')
```

---

# ✅ 最终功能总结

1. **登录功能**：账号密码登录，获取 JWT Token
2. **Pinia 管理**：全局存储用户信息 + Token
3. **自动认证**：所有请求自动携带 Token
4. **过期处理**：401 自动跳登录，清除无效 Token
5. **路由守卫**：未登录无法访问后台页面
6. **完美适配**：你现有的商品/分类/订单全部可用

---

# 🚀 使用流程

1. 运行项目 → 自动跳 `/login`
2. 输入账号密码 → 登录成功
3. 进入数据总览/商品管理 → **所有接口正常访问**
4. Token 过期 → 自动提示并跳回登录页