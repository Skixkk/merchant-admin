// src/api/mutator.ts
import axios from "axios";

// 严格匹配 orval 配置，仅保留核心导出
export const customAxios = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  timeout: 15000
});