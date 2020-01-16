import Vue from 'vue';
import VueRouter from 'vue-router';

// import components
import Index from '../components/Index';
import Profile from '../components/Profile';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import RegisterSuccess from '../components/Auth/RegisterSuccess';

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
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/register/register-success',
    name: 'register-success',
    component: RegisterSuccess,
    props: true
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
