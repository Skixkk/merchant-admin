// src/api/mutator.ts（完善版）
import axios, { AxiosError } from 'axios';
import { ElMessage } from 'element-plus';
import { getToken, removeToken } from '@/utils/auth';
import router from '@/router';

export const customAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
});

// 请求拦截器（自动添加 Token）
customAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器（统一处理错误）
customAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      router.push('/login');
      ElMessage.error('登录已过期，请重新登录');
    } else {
      // 修正：添加类型断言解决 unknown 类型报错
      ElMessage.error((error.response?.data as any)?.message || '请求失败');
    }
    return Promise.reject(error);
  }
);