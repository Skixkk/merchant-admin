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
              <el-icon :size="30">
                <Document/>
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ isStatsLoading ? '正在加载中...' : (stats.totalOrders || '') }}</div>
              <div class="stat-label">订单总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 🔥 总销售额：Tooltip 包裹整列，鼠标悬浮卡片即显示 -->
      <!--  总销售额（Total Sales Revenue）是指所有出售商品或提供服务的销售额总和 -->
      <!-- 总销售额=已完成订单的实付金额的总和 所有已完成订单的实付金额相加的总收入 -->
      <el-tooltip content="总销售额 = 已完成订单的实付金额的总和" effect="dark" placement="top">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background: #67c23a;">
                <el-icon :size="30">
                  <Money/>
                </el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ isStatsLoading ? '正在加载中...' : (stats.totalRevenue ? `¥${stats.totalRevenue}` : '') }}</div>
                <div class="stat-label">总销售额</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-tooltip>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6a23c;">
              <el-icon :size="30">
                <Box/>
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ isStatsLoading ? '正在加载中...' : (stats.totalProducts || '') }}</div>
              <div class="stat-label">商品数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f56c6c;">
              <el-icon :size="30">
                <User/>
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ isStatsLoading ? '正在加载中...' : (stats.totalUsers || '') }}</div>
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
          <el-table :data="recentOrders" v-loading="isLoading" stripe border>
            <el-table-column prop="order_no" label="订单号" width="250" align="center"/>
            <el-table-column prop="total_amount" label="商品总价" width="120" align="center">
              <template #default="{ row }">¥{{ row.total_amount }}</template>
            </el-table-column>
            <el-table-column prop="coupon_amount" label="优惠金额" width="120" align="center">
              <template #default="{ row }">¥{{ row.coupon_amount }}</template>
            </el-table-column>
            <el-table-column prop="delivery_fee" label="配送费" width="120" align="center">
              <template #default="{ row }">¥{{ row.delivery_fee }}</template>
            </el-table-column>
            <el-table-column prop="pay_amount" label="实付金额" width="120" align="center">
              <template #default="{ row }">¥{{ row.pay_amount }}</template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="200" align="center">
              <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
            </el-table-column>
            <el-table-column prop="finish_time" label="完成时间" width="200" align="center">
              <template #default="{ row }">{{ row.finish_time ? formatDate(row.finish_time) : '-' }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import {Refresh, Document, Money, Box, User} from '@element-plus/icons-vue';
import axios from 'axios';

const router = useRouter();
const isLoading = ref(false);
// 统计数据加载状态（3s超时触发）
const isStatsLoading = ref(false);
let loadingTimer: number | null = null;

// 初始值设为空，默认不显示0
const stats = ref({
  totalOrders: '',
  totalRevenue: '',
  totalProducts: '',
  totalUsers: ''
});

const recentOrders = ref<any[]>([]);

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

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN');
};

const fetchStats = async () => {
  try {
    // 订单总数
    const orderItemsResponse = await axios.get('http://freedom.localhost:8000/api/v1/business/order-items/');
    // 用户总数
    const customersResponse = await axios.get('http://freedom.localhost:8000/api/v1/business/customers/');
    // 商品总数
    const productsResponse = await axios.get('http://freedom.localhost:8000/api/v1/common/products/');
    // 总销售额
    const salesResponse = await axios.get('http://freedom.localhost:8000/api/v1/business/statistics/total-sales/');

    stats.value = {
      totalOrders: orderItemsResponse.data.count || '',
      totalRevenue: salesResponse.data.total_sales?.toFixed(2) || '',
      totalProducts: productsResponse.data.count || '',
      totalUsers: customersResponse.data.count || ''
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    ElMessage.error('获取统计数据失败');
  } finally {
    // 清除定时器，关闭加载中状态
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      loadingTimer = null;
    }
    isStatsLoading.value = false;
  }
};

const fetchRecentOrders = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://freedom.localhost:8000/api/v1/business/orders/');
    recentOrders.value = (response.data.results || []).slice(0, 5);
  } catch (error) {
    console.error('获取最近订单失败:', error);
    ElMessage.error('获取最近订单失败');
  } finally {
    isLoading.value = false;
  }
};

const handleRefresh = () => {
  fetchStats();
  fetchRecentOrders();
};

const goToOrders = () => {
  router.push('/orders');
};

onMounted(() => {
  fetchStats();
  fetchRecentOrders();
});

// 组件销毁时清除定时器
onUnmounted(() => {
  if (loadingTimer) clearTimeout(loadingTimer);
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