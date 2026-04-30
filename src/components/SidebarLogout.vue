<!-- src/components/SidebarLogout.vue -->
<template>
  <div class="sidebar-footer">
    <div class="user-info">
      <span class="user-name">{{ userStore.userInfo?.name }}</span>
    </div>
    <el-button type="text" class="logout-btn" @click="handleLogout">
      退出登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useUserStore} from '@/stores/user'
import {ElMessage, ElMessageBox} from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid #263445;
}

.user-info {
  margin-bottom: 10px;
}

.user-name {
  color: #fff;
  font-size: 14px;
}

.logout-btn {
  color: #bfcbd9;
  padding: 0;
  font-size: 14px;
}

.logout-btn:hover {
  color: #409eff;
}
</style>