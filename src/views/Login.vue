<template>
  <div class="login-page">
    <div class="login-card">
      <h3>商家后台登录</h3>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="70px">
        <el-form-item label="账号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              @click="handleLogin"
              :loading="loading"
              style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/stores/user'
import {ElMessage, ElForm} from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<InstanceType<typeof ElForm>>()

// 登录表单：修改为 phone 匹配后端 API
const form = ref({
  phone: '',
  password: ''
})

// 校验规则
const rules = ref({
  phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}]
})

const loading = ref(false)

// 登录提交
const handleLogin = async () => {
  await formRef.value?.validate()
  loading.value = true
  try {
    await userStore.login(form.value)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (err: any) {
    // 显示后端返回的错误信息
    ElMessage.error(err.response?.data?.msg || '账号或密码错误')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-card {
  width: 420px;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-card h3 {
  text-align: center;
  margin-bottom: 25px;
}
</style>