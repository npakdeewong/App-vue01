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
  ,
  {
  path: '/add_customer',
  name: 'add_customer',
  component: () => import(/* webpackChunkName: "type" */ '../views/Add_customer.vue')
},
{
path: '/add_employees',
name: 'add_employees',
component: () => import(/* webpackChunkName: "type" */ '../views/Add_employees.vue'),
meta: { requiresAuth: true }
},
{
path: '/product',
name: 'product',
component: () => import(/* webpackChunkName: "type" */ '../views/Product.vue'),
meta: { requiresAuth: true }
},
{
path: '/product_api',
name: 'product_api',
component: () => import(/* webpackChunkName: "type" */ '../views/Product_api.vue'),
meta: { requiresAuth: true }
},
{
path: '/show_product',
name: 'show_product',
component: () => import(/* webpackChunkName: "type" */ '../views/Show_product.vue'),
meta: { requiresAuth: true }
},
{
path: '/customer_crud',
name: 'customer_crud',
component: () => import(/* webpackChunkName: "type" */ '../views/Customer_crud.vue'),
meta: { requiresAuth: true }
},
{
path: '/employees_crud',
name: 'employees_crud',
component: () => import(/* webpackChunkName: "type" */ '../views/Employees_crud.vue'),
meta: { requiresAuth: true }
},
{
path: '/student_crud',
name: 'student_crud',
component: () => import(/* webpackChunkName: "type" */ '../views/Student_crud.vue'),
meta: { requiresAuth: true }
},
{
path: '/type_crud',
name: 'type_crud',
component: () => import(/* webpackChunkName: "type" */ '../views/Type_crud.vue')
},
{
path: '/product_crud',
name: 'product_crud',
component: () => import(/* webpackChunkName: "type" */ '../views/Product_crud.vue'),
meta: { requiresAuth: true }
},
{
path: '/employees_crud_image',
name: 'employees_crud_image',
component: () => import(/* webpackChunkName: "type" */ '../views/Employees_crud_image.vue'),
meta: { requiresAuth: true }
},
{
path: '/Login',
name: 'Login',
component: () => import(/* webpackChunkName: "type" */ '../views/Login.vue'),

},
{
path: '/ProductDetail',
name: 'ProductDetail',
component: () => import(/* webpackChunkName: "type" */ '../views/ProductDetail.vue'),

}







]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

/* ✅ ROUTE GUARD */
router.beforeEach((to, from, next) => {

  const isLoggedIn = localStorage.getItem("adminLogin")

  // ถ้าหน้านั้นต้อง login แต่ยังไม่ login
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } 
  // ถ้า login แล้วแต่พยายามเข้าหน้า login
  else if (to.path === '/login' && isLoggedIn) {
    next('/')   // หรือ dashboard
  }
  else {
    next()
  }
});


export default router
