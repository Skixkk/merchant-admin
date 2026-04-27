import {createRouter, createWebHistory} from 'vue-router';
import type {RouteRecordRaw} from 'vue-router';
import {getToken} from '@/utils/auth';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/',
        component: () => import('@/components/Layout.vue'),
        redirect: '/dashboard',
        meta: {requiresAuth: true},
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/Dashboard.vue'),
                meta: {title: '仪表盘'},
            },
            {
                path: 'products',
                name: 'Products',
                component: () => import('@/views/products/List.vue'),
                meta: {title: '商品管理'},
            },
            {
                path: 'products/create',
                name: 'ProductCreate',
                component: () => import('@/views/products/Form.vue'),
                meta: {title: '创建商品'},
            },
            {
                path: 'orders',
                name: 'Orders',
                component: () => import('@/views/orders/List.vue'),
                meta: {title: '订单管理'},
            },
            {
                path: 'categories',
                name: 'Categories',
                component: () => import('@/views/categories/List.vue'),
                meta: {title: '分类管理'},
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫 - 移除未使用的 `from` 参数
router.beforeEach((to, _, next) => {
    const token = getToken();
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else if (to.path === '/login' && token) {
        next('/');
    } else {
        next();
    }
});

export default router;
