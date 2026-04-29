<template>
  <div class="product-list">
    <div class="header">
      <!-- 占位div保持按钮居右 -->
      <div></div>
      <el-button type="primary" @click="router.push('/products/create')">
        <el-icon><Plus/></el-icon>
        创建商品
      </el-button>
    </div>

    <el-card>
      <el-table :data="products" v-loading="isLoading" stripe empty-text="暂无数据">
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
            <!-- 编辑跳转 -->
            <el-button link type="primary" size="small" @click="handleEdit(_row)">编辑</el-button>
            <!-- 删除功能 -->
            <el-button link type="danger" size="small" @click="handleDelete(_row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {ref, onMounted} from 'vue';
import axios from 'axios';
import type {Product} from '@/api';
import {Plus} from '@element-plus/icons-vue';
// 导入必需依赖：弹窗 + Token认证
import { ElMessage, ElMessageBox } from 'element-plus';
import { getToken } from '@/utils/auth';

const router = useRouter();
const products = ref<Product[]>([]);
const isLoading = ref(false);

// 获取商品列表（修复401：添加请求头Token）
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://freedom.localhost:8000/api/v1/common/products/', {
      // 核心修复：携带登录Token
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    products.value = response.data.results || [];
  } catch (error) {
    console.error('请求失败:', error);
    ElMessage.error('获取商品列表失败，请登录后重试');
  } finally {
    isLoading.value = false;
  }
};

// 编辑商品：跳转到表单页
const handleEdit = (row: Product) => {
  router.push(`/products/edit/${row.id}`);
};

// 删除商品（带Token + 确认框）
const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm('确定删除该商品？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    // 删除请求携带Token
    await axios.delete(`http://freedom.localhost:8000/api/v1/common/products/${row.id}/`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    ElMessage.success('删除成功');
    fetchProducts(); // 刷新列表
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

onMounted(() => {
  fetchProducts();
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