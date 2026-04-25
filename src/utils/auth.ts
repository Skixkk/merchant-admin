// src/utils/auth.ts
// Token 管理工具函数

const TOKEN_KEY = 'merchant_admin_token'

/**
 * 获取 Token
 */
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 移除 Token
 */
export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
}