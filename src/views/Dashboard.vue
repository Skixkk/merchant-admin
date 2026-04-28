<template>
  <div class="dashboard">
    <div class="header">
      <h1>数据概览</h1>
      <el-button type="primary" @click="handleRefresh">
        <el-icon>
          <Refresh/>
        </el-icon>
        刷新数据
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409eff;">
              <el-icon :size="30"><Document/></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-label">订单总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67c23a;">
              <el-icon :size="30"><Money/></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.totalRevenue }}</div>
              <div class="stat-label">总销售额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6a23c;">
              <el-icon :size="30"><Box/></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalProducts }}</div>
              <div class="stat-label">商品数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f56c6c;">
              <el-icon :size="30"><User/></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">用户数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近订单 -->
    <el-row :gutter="20" class="content-section">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近订单</span>
              <el-button link type="primary" @click="goToOrders">查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentOrders" v-loading="isLoading" stripe>
            <el-table-column prop="id" label="订单ID" width="100"/>
            <el-table-column prop="order_no" label="订单号" width="180"/>
            <el-table-column prop="total_amount" label="金额" width="120">
              <template #default="{ row: _row }">
                ¥{{ _row.total_amount }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row: _row }">
                <el-tag :type="getStatusType(_row.status)">
                  {{ getStatusText(_row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180">
              <template #default="{ row: _row }">
                {{ formatDate(_row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Refresh, Document, Money, Box, User } from '@element-plus/icons-vue';
// 直接导入 axios，使用完整 URL 请求
import axios from 'axios';

const router = useRouter();
const isLoading = ref(false);

// 统计数据
const stats = ref({
  totalOrders: 0,
  totalRevenue: '0.00',
  totalProducts: 0,
  totalUsers: 0
});

// 最近订单
const recentOrders = ref<any[]>([]);

// 订单状态类型映射
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    'pending': 'warning',
    'paid': 'primary',
    'shipped': 'success',
    'completed': 'success',
    'cancelled': 'info',
    'refunded': 'danger'
  };
  return typeMap[status] || 'info';
};

// 订单状态文本映射
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    'pending': '待支付',
    'paid': '已支付',
    'shipped': '已发货',
    'completed': '已完成',
    'cancelled': '已取消',
    'refunded': '已退款'
  };
  return textMap[status] || status;
};

// 格式化日期
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN');
};

// 获取统计数据（模拟，实际项目中根据后端 API 调整）
const fetchStats = async () => {
  try {
    // 这里可以根据实际后端 API 调整
    // 暂时使用模拟数据
    stats.value = {
      totalOrders: 128,
      totalRevenue: '12580.50',
      totalProducts: 56,
      totalUsers: 89
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

// 获取最近订单 - 直接使用完整 URL
const fetchRecentOrders = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://freedom.localhost:8000/api/v1/business/orders/');
    recentOrders.value = (response.data.results || []).slice(0, 5); // 只显示最近 5 条
  } catch (error) {
    console.error('获取最近订单失败:', error);
    ElMessage.error('获取最近订单失败');
  } finally {
    isLoading.value = false;
  }
};

// 刷新所有数据
const handleRefresh = () => {
  fetchStats();
  fetchRecentOrders();
};

// 跳转到订单列表
const goToOrders = () => {
  router.push('/orders');
};

onMounted(() => {
  fetchStats();
  fetchRecentOrders();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.content-section {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>