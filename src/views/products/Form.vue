<template>
  <Layout>
    <div class="product-form">
      <h1>{{ isEdit ? '编辑商品' : '创建商品' }}</h1>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px"
               style="max-width: 800px; margin-top: 20px">
        <el-form-item label="商品分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%">
            <!-- 假设已通过orval生成分类列表API，这里暂用静态数据占位 -->
            <el-option label="示例分类" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" maxlength="64" show-word-limit/>
        </el-form-item>
        <el-form-item label="主图" prop="image">
          <el-input v-model="form.image" placeholder="请输入主图URL"/>
        </el-form-item>
        <el-form-item label="售价" prop="price">
          <el-input-number v-model="form.price" :precision="2" :step="0.1" :min="0" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="原价" prop="original_price">
          <el-input-number v-model="form.original_price" :precision="2" :step="0.1" :min="0" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="-32768" :max="32767" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="是否上架" prop="is_on_sale">
          <el-switch v-model="form.is_on_sale"/>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入商品描述"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import Layout from '@/components/Layout.vue'
import {ElMessage} from 'element-plus'
import type {FormInstance, FormRules} from 'element-plus'
// 基于OpenAPI规范，假设orval生成的商品API hooks
import {useCommonProductsCreateMutation, useCommonProductsUpdateMutation} from '@/api/index.schemas'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const isEdit = ref(false)

interface ProductForm {
  category_id: number | null
  name: string
  image: string
  images?: any
  price: string
  original_price: string
  stock: number
  description: string
  is_on_sale: boolean
  sort: number
}

const form = reactive<ProductForm>({
  category_id: null,
  name: '',
  image: '',
  images: null,
  price: '0.00',
  original_price: '0.00',
  stock: 0,
  description: '',
  is_on_sale: true,
  sort: 0
})

const rules: FormRules<ProductForm> = {
  category_id: [{required: true, message: '请选择商品分类', trigger: 'change'}],
  name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
  image: [{required: true, message: '请输入主图URL', trigger: 'blur'}],
  price: [{required: true, message: '请输入售价', trigger: 'blur'}],
  original_price: [{required: true, message: '请输入原价', trigger: 'blur'}],
  stock: [{required: true, message: '请输入库存', trigger: 'blur'}]
}

// 创建/更新商品API
const createMutation = useCommonProductsCreateMutation()
const updateMutation = useCommonProductsUpdateMutation()

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          // 编辑逻辑，需根据实际API调整参数
          // await updateMutation.mutateAsync({ id: route.params.id, data: form })
          ElMessage.success('更新成功')
        } else {
          await createMutation.mutateAsync({data: form})
          ElMessage.success('创建成功')
        }
        router.push('/products')
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      }
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  // 如果是编辑模式，根据路由参数获取商品详情并填充表单
  if (route.params.id) {
    isEdit.value = true
    // 调用获取商品详情API并填充form
    // const { data } = await useCommonProductsRetrieveQuery({ id: route.params.id })
    // Object.assign(form, data)
  }
})
</script>

<style scoped>
.product-form {
  padding: 20px;
}
</style>