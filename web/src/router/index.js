import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import FormSignin from '@/components/FormSignin'
import HomeRouter from './home'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: HomeRouter
    }
  ]
})
