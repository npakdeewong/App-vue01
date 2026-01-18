import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/Customer',
    name: 'Customer',
    component: () => import(/* webpackChunkName: "about" */ '../views/Customer.vue')
  },
  {
    path: '/Contact',
    name: 'Comtact',
    component: () => import(/* webpackChunkName: "about" */ '../views/Contact.vue')
  },
    {
    path: '/type',
    name: 'tpye',
    component: () => import(/* webpackChunkName: "type" */ '../views/type.vue')
  }
  ,
    {
    path: '/employees',
    name: 'employees',
    component: () => import(/* webpackChunkName: "type" */ '../views/employees.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
