import { createRouter, createWebHistory } from 'vue-router'
import Orders from '@/Pages/Orders.vue';
import Sales from '@/Pages/Sales.vue';
import Stocks from '@/Pages/Stocks.vue';
import Incomes from '@/Pages/Incomes.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/orders', component: Orders},
    {path: '/sales', component: Sales},
    {path: '/stocks', component: Stocks},
    {path: '/incomes', component: Incomes},
    {path: '/', redirect: '/orders'},
  ],
})

export default router
