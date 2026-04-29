<template>
  <div class="category-list">
    <div class="header">
      <!-- 新增空占位div，保持flex布局，按钮居右不变 -->
      <div></div>
      <el-button type="primary" @click="handleCreate">
        <el-icon>
          <Plus/>
        </el-icon>
        创建分类
      </el-button>
    </div>

    <el-card>
      <!-- 添加空数据提示：暂无数据 -->
      <el-table :data="categories" v-loading="isLoading" stripe empty-text="暂无数据">
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="name" label="分类名称"/>
        <el-table-column prop="sort" label="排序" width="100"/>
        <el-table-column label="状态" width="100">
          <template #default="{ row: _row }">
            <el-tag :type="_row.is_show ? 'success' : 'info'">
              {{ _row.is_show ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="200">
          <template #default="{ row: _row }">
            {{ formatDate(_row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row: _row }">
            <el-button link type="primary" size="small" @click="handleEdit(_row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(_row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useRouter} from 'vue-router';
import {ElMessage, ElMessageBox} from 'element-plus';
import axios from 'axios'; // 直接导入 axios
import {Plus} from '@element-plus/icons-vue';

// 定义类型
interface Category {
  id: number;
  name: string;
  sort: number;
  is_show: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

const router = useRouter();
const categories = ref<Category[]>([]);
const isLoading = ref(false);

// 🔥 直接用 axios 测试
const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://freedom.localhost:8000/api/v1/common/categories/');
    console.log('直接 axios 请求返回:', response.data);
    categories.value = response.data.results || [];
  } catch (error) {
    console.error('请求失败:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});

// 格式化日期
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN');
};

// 创建分类
const handleCreate = () => {
  router.push('/categories/create');
};

// 编辑分类
const handleEdit = (category: Category) => {
  router.push(`/categories/edit/${category.id}`);
};

// 删除分类
const handleDelete = async (category: Category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${category.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    ElMessage.success('删除成功');
    fetchCategories();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};
</script>

<style scoped>
.category-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>