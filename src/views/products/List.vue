<template>
  <div class="product-list">
    <div class="header">
      <h2>商品管理</h2>
      <el-button type="primary" @click="router.push('/products/create')">
        <el-icon>
          <Plus/>
        </el-icon>
        创建商品
      </el-button>
    </div>

    <el-card>
      <!-- 修正：安全访问响应数据，先解构出 data 主体 -->
      <el-table :data="products" v-loading="isLoading" stripe>
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="name" label="商品名称"/>
        <el-table-column label="分类" width="120">
          <template #default="{ row: _row }">
            {{ _row.category?.name }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row: _row }">
            ¥{{ _row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80"/>
        <el-table-column prop="sales" label="销量" width="80"/>
        <el-table-column label="状态" width="100">
          <template #default="{ row: _row }">
            <el-tag :type="_row.is_on_sale ? 'success' : 'info'">
              {{ _row.is_on_sale ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row: _row }">
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import { computed} from 'vue';
import {useCommonProductsList} from '@/api';
import type {Product} from '@/api';
import {Plus} from '@element-plus/icons-vue';

const router = useRouter();
const {data, isLoading} = useCommonProductsList();

// 安全提取商品列表数据
const products = computed<Product[]>(() => {
  if (!data.value) return [];

  // 处理 orval 可能的响应结构
  const responseData = data.value as any;

  // 尝试多种可能的数据结构
  if (responseData.results) return responseData.results;
  if (responseData.data?.results) return responseData.data.results;
  if (Array.isArray(responseData)) return responseData;

  return [];
});
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>