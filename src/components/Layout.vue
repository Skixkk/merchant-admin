<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">Merchant</div>
      <nav class="nav">
        <router-link to="/dashboard" class="nav-item">数据总览</router-link>
        <router-link to="/categories" class="nav-item">分类管理</router-link>
        <router-link to="/products" class="nav-item">商品管理</router-link>
        <router-link to="/orders" class="nav-item">订单管理</router-link>
      </nav>
    </aside>
    <main class="main">
      <header class="header">
        <div class="header-title">{{ $route.meta.title }}</div>
      </header>
      <div class="content">
        <router-view/>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 布局组件
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #304156;
  color: #fff;
  padding: 20px 0;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}

.nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  color: #bfcbd9;
  text-decoration: none;
  padding: 12px 20px;
  transition: all 0.3s;
}

.nav-item:hover,
.nav-item.router-link-active {
  background-color: #263445;
  color: #409eff;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>