import Vue from 'vue';
import VueRouter from 'vue-router';

// import components
import Index from '../components/Index';
// use VueRouter
Vue.use(VueRouter);

// define routes
const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/login',
    name: 'login'
  },
  {
    path: '/register',
    name: 'register'
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
