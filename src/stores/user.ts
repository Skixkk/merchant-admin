// src/stores/user.ts
import {defineStore} from 'pinia'
import {ref} from 'vue'
import request from '@/utils/request'

// Token 存储键名
const TOKEN_KEY = 'merchant_admin_token'
const USER_INFO_KEY = 'merchant_admin_info'

// 定义后端登录返回类型
interface LoginResponse {
    token: string
    refresh: string
    user: {
        phone: string
        name: string
        role: string
    }
}

export const useUserStore = defineStore('user', () => {
    // 从 localStorage 读取初始状态（硬盘存储）
    const token = ref<string>(localStorage.getItem(TOKEN_KEY) || '')
    const userInfo = ref<any>(JSON.parse(localStorage.getItem(USER_INFO_KEY) || 'null'))

    // 登录
    const login = async (loginData: { phone: string; password: string }) => {
        // 🔥 修复：去掉重复的 /api/v1 前缀
        const res = await request.post<LoginResponse>('/tenants/tenant/auth/login/', loginData)

        // 保存 Token 到 Pinia 和 localStorage
        token.value = res.data.token // ✅ 原: res.token
        localStorage.setItem(TOKEN_KEY, res.data.token) // ✅ 原: res.token

        // 保存用户信息到 Pinia 和 localStorage
        userInfo.value = res.data.user // ✅ 原: res.user
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(res.data.user)) // ✅ 原: res.user

        return res
    }

    // 登出
    const logout = () => {
        token.value = ''
        userInfo.value = null
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_INFO_KEY)
    }

    return {
        token,
        userInfo,
        login,
        logout
    }
})