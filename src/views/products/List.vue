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
      <el-table :data="data" v-loading="isLoading" stripe>
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="name" label="商品名称"/>
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            {{ row.category?.name }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80"/>
        <el-table-column prop="sales" label="销量" width="80"/>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_on_sale ? 'success' : 'info'">
              {{ row.is_on_sale ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
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
import {useProductsList} from '@/api';
import {Plus} from '@element-plus/icons-vue';

const router = useRouter();
const {data, isLoading} = useProductsList();
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