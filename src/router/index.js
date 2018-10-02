import Vue from 'vue'
import Router from 'vue-router'
import carousel from '@/components/carousel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'carousel',
      component: carousel
    }
  ]
})
