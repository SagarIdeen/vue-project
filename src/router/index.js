import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppLayout from '../layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/UserRegistration.vue'),
    },
    {
      path:'/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: '/product',
          name: 'product',
          component: () => import('../views/ProductView.vue'),
        },
        {
          path: '/cart',
          name: 'cart',
          component: () => import('../views/CartView.vue'),
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('../views/OrdersView.vue'),
        },
        {
          path: '/salesReturn',
          name: 'salesReturn',
          component: () => import('../views/SalesReturnView.vue'),
        },
        // Admin routes
        {
          path: '/adminDashboard',
          name: 'adminDashboard',
          component: () => import('../views/Admin/AdminDashboard.vue'),
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('../views/Admin/CategoryView.vue'),
        },
        {
          path: '/productAdmin',
          name: 'productAdmin',
          component: () => import('../views/Admin/ProductAdminView.vue'),
        },
        {
          path: '/reports',
          name: 'reports',
          component: () => import('../views/Admin/ReportsView.vue'),
        },
      ]
    },
  ]
})



router.beforeEach(async (to, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && localStorage.getItem("token_user") == null) {
      return '/login';
  }
});

export default router
