<template>
  <div class="dashboard">
    <h1>仪表盘</h1>
    <p>欢迎使用 Merchant Admin 管理后台</p>
  </div>
</template>

<script setup lang="ts">
// 仪表盘页面
import { getCommonCategoriesListQueryKey } from '@/api';

// 生成带分页参数的 Key
const queryKeyWithParams = getCommonCategoriesListQueryKey({ page: 2 });

console.log(queryKeyWithParams);
// 在任意组件的 <script setup> 中添加 进行测试
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)

</script>

<style scoped>
.dashboard {
  padding: 20px;
}
</style>