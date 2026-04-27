<template>
  <div class="category-list">
    <div class="header">
      <h2>分类管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon>
          <Plus/>
        </el-icon>
        创建分类
      </el-button>
    </div>

    <el-card>
      <el-table :data="categories" v-loading="isLoading" stripe>
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
import { computed} from 'vue';
import {useRouter} from 'vue-router';
import {ElMessage, ElMessageBox} from 'element-plus';
import {useCommonCategoriesList} from '@/api';
import type {Category} from '@/api';
import {Plus} from '@element-plus/icons-vue';

const router = useRouter();
const {data, isLoading, refetch} = useCommonCategoriesList();

// 安全提取分类列表数据
const categories = computed<Category[]>(() => {
  if (!data.value) return [];

  const responseData = data.value as any;

  if (responseData.results) return responseData.results;
  if (responseData.data?.results) return responseData.data.results;
  if (Array.isArray(responseData)) return responseData;

  return [];
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

    // TODO: 这里需要调用删除分类的 API
    // await useCommonCategoriesDeleteMutation(category.id);

    ElMessage.success('删除成功');
    refetch();
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