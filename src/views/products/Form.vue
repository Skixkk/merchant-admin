<!-- src/views/products/Form.vue -->
<template>
  <div class="product-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑商品' : '创建商品' }}</span>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商品分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%">
            <el-option
                v-for="cat in categories"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称"/>
        </el-form-item>
        <el-form-item label="主图URL" prop="image">
          <el-input v-model="form.image" placeholder="请输入图片URL"/>
        </el-form-item>
        <el-form-item label="售价" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="原价" prop="original_price">
          <el-input-number v-model="form.original_price" :min="0" :precision="2" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入商品描述"
          />
        </el-form-item>
        <el-form-item label="上架状态" prop="is_on_sale">
          <el-switch v-model="form.is_on_sale"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            提交
          </el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage, ElForm} from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()
const formRef = ref<InstanceType<typeof ElForm>>()

const isEdit = ref(false)
const loading = ref(false)
const categories = ref<any[]>([])

// 表单初始值
const form = ref({
  category_id: null as number | null,
  name: '',
  image: '',
  images: [],
  price: 0,
  original_price: 0,
  stock: 0,
  description: '',
  is_on_sale: true,
  sort: 0
})

// 表单验证规则
const rules = ref({
  category_id: [{required: true, message: '请选择分类', trigger: 'change'}],
  name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
  image: [
    {required: true, message: '请输入主图URL', trigger: 'blur'},
    {type: 'url', message: '请输入合法的URL', trigger: 'blur'}
  ],
  price: [{required: true, message: '请输入售价', trigger: 'blur'}]
})

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await request.get('/common/categories/')
    categories.value = res.data.results || res.data // ✅ 原: res.results || res
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  }
}

// 获取商品详情（编辑模式）
const fetchProduct = async (id: number) => {
  try {
    const res = await request.get(`/common/products/${id}/`)
    form.value = {
      ...res.data, // ✅ 原: 直接赋值 res
      category_id: res.data.category?.id // ✅ 原: res.category?.id
    }
  } catch (error) {
    ElMessage.error('获取商品详情失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  await formRef.value?.validate()
  loading.value = true
  try {
    if (isEdit.value) {
      // 编辑
      await request.put(`/common/products/${route.params.id}/`, form.value)
      ElMessage.success('更新成功')
    } else {
      // 创建
      await request.post('/common/products/', form.value)
      ElMessage.success('创建成功')
    }
    router.push('/products')
  } catch (error: any) {
    ElMessage.error(error.response?.data?.detail || '操作失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
  if (route.params.id) {
    isEdit.value = true
    fetchProduct(Number(route.params.id))
  }
})
</script>

<style scoped>
.product-form {
  padding: 20px;
}

.card-header {
  font-weight: 500;
}
</style>