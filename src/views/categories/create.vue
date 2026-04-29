<template>
  <div class="category-create">
    <div class="header">
      <h2>创建分类</h2>
      <el-button @click="goBack">
        <el-icon>
          <Back/>
        </el-icon>
        返回列表
      </el-button>
    </div>

    <el-card style="max-width: 600px; margin: 0 auto">
      <!-- 分类创建表单 -->
      <el-form
          ref="formRef"
          :model="form"
          label-width="80px"
          style="margin-top: 20px"
      >
        <el-form-item
            label="分类名称"
            prop="name"
            :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]"
        >
          <el-input v-model="form.name" placeholder="请输入分类名称"/>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
              v-model="form.sort"
              :min="0"
              :max="32767"
              placeholder="请输入排序值"
              style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="是否显示" prop="is_show">
          <el-switch v-model="form.is_show" active-text="显示" inactive-text="隐藏"/>
        </el-form-item>

        <el-form-item style="text-align: center">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            确认创建
          </el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {Back} from '@element-plus/icons-vue'
import axios from 'axios'
// 导入token工具
import {getToken} from '@/utils/auth'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

// 表单数据
const form = ref({
  name: '',
  sort: 0,
  is_show: true
})

// 返回列表
const goBack = () => {
  router.push('/categories')
}

// 提交创建分类
const handleSubmit = async () => {
  const formEl = await formRef.value
  if (!formEl) return

  // 表单校验
  await formEl.validate()
  loading.value = true

  try {
    // 携带Token进行身份认证
    await axios.post('http://freedom.localhost:8000/api/v1/common/categories/', form.value, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })

    ElMessage.success('分类创建成功！')
    // 创建成功后返回列表
    goBack()
  } catch (error) {
    console.error('创建失败：', error)
    ElMessage.error('创建失败，请检查参数')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.category-create {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>