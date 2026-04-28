<template>
  <div class="order-list">
    <div class="header">
      <h2>订单管理</h2>
      <el-button type="primary" @click="handleRefresh">
        <el-icon>
          <Refresh/>
        </el-icon>
        刷新
      </el-button>
    </div>

    <el-card>
      <el-table :data="orders" v-loading="isLoading" stripe>
        <el-table-column prop="id" label="订单ID" width="100"/>
        <el-table-column prop="order_no" label="订单号" width="180"/>
        <el-table-column prop="total_amount" label="总金额" width="120">
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
        <el-table-column prop="address_snapshot" label="收货地址" min-width="250">
          <template #default="{ row: _row }">
            {{ _row.address_snapshot || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row: _row }">
            {{ formatDate(_row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row: _row }">
            <el-button link type="primary" size="small" @click="handleView(_row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(_row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
import axios from 'axios';

const router = useRouter();
const orders = ref<any[]>([]);
const isLoading = ref(false);

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

// 获取订单列表 - 直接使用完整 URL，完全不依赖 mutator.ts
const fetchOrders = async () => {
  isLoading.value = true;
  try {
    // 🔥 直接使用完整 URL，和你要求的方式完全一致
    const response = await axios.get('http://freedom.localhost:8000/api/v1/business/orders/');
    orders.value = response.data.results || [];
  } catch (error) {
    console.error('获取订单失败:', error);
    ElMessage.error('获取订单失败');
  } finally {
    isLoading.value = false;
  }
};

// 刷新订单列表
const handleRefresh = () => {
  fetchOrders();
};

// 查看订单详情
const handleView = (order: any) => {
  router.push(`/orders/view/${order.id}`);
};

// 编辑订单
const handleEdit = (order: any) => {
  router.push(`/orders/edit/${order.id}`);
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.order-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>