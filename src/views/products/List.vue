<template>
  <div class="product-list">
    <div class="header">
      <!-- 新增占位div，保持按钮居右 -->
      <div></div>
      <el-button type="primary" @click="router.push('/products/create')">
        <el-icon>
          <Plus/>
        </el-icon>
        创建商品
      </el-button>
    </div>

    <el-card>
      <!-- 添加空数据提示：暂无数据 -->
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
            <!-- 绑定编辑跳转事件 -->
            <el-button link type="primary" size="small" @click="handleEdit(_row)">编辑</el-button>
            <!-- 绑定删除事件 -->
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
// 导入弹窗工具 + Token认证
import {ElMessage, ElMessageBox} from 'element-plus';
import {getToken} from '@/utils/auth';

const router = useRouter();
const products = ref<Product[]>([]);
const isLoading = ref(false);

// 直接用 axios 测试
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://freedom.localhost:8000/api/v1/common/products/', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    products.value = response.data.results || [];
  } catch (error) {
    console.error('请求失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 编辑商品 - 跳转到编辑页面
const handleEdit = (row: Product) => {
  router.push(`/products/edit/${row.id}`);
};

// 删除商品 - 带确认框 + 接口请求
const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm(
        '确定要删除该商品吗？删除后将无法恢复！',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    );
    // 发送删除请求
    await axios.delete(`http://freedom.localhost:8000/api/v1/common/products/${row.id}/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    ElMessage.success('删除成功！');
    // 刷新列表
    fetchProducts();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败！');
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