<template>
  <Layout>
    <div class="categories-list">
      <h1>分类管理</h1>
      <el-button type="primary" @click="handleAdd">新增分类</el-button>
      <el-table :data="tableData" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="name" label="分类名称" width="180"/>
        <el-table-column prop="sort" label="排序" width="100"/>
        <el-table-column prop="is_show" label="是否显示" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.is_show ? 'success' : 'info'">
              {{ scope.row.is_show ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件，根据PaginatedCategoryList结构实现 -->
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          style="margin-top: 20px; justify-content: flex-end"
          @current-change="handlePageChange"
      />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import Layout from '@/components/Layout.vue'
import {ElMessage, ElMessageBox} from 'element-plus'
// 基于OpenAPI规范，假设orval生成的common分类API hooks
import {useCommonCategoriesListQuery, useCommonCategoriesDestroyMutation} from '@/api/index.schemas'

interface Category {
  id: number
  name: string
  sort: number
  is_show: boolean
  created_at: string
  updated_at: string
  is_deleted: boolean
}

const tableData = ref<Category[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取分类列表，传入page参数
const {data: categoriesData, refetch} = useCommonCategoriesListQuery({
  page: currentPage.value
})

// 删除分类
const deleteMutation = useCommonCategoriesDestroyMutation()

const handleAdd = () => {
  ElMessage.info('新增功能待实现')
}

const handleEdit = (row: Category) => {
  ElMessage.info(`编辑功能待实现，当前编辑ID: ${row.id}`)
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteMutation.mutateAsync({id})
    ElMessage.success('删除成功')
    refetch()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  refetch()
}

// 监听数据变化更新表格
watch(categoriesData, (newData) => {
  if (newData?.results) {
    tableData.value = newData.results
    total.value = newData.count || 0
  }
}, {immediate: true})

onMounted(() => {
  refetch()
})
</script>

<style scoped>
.categories-list {
  padding: 20px;
}
</style>