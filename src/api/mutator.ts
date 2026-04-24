import Axios from 'axios';

// 先创建一个基础的 Axios 实例导出
export const customAxios = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  timeout: 15000,
});
