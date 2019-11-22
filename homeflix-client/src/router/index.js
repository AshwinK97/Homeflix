import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Video from '../views/Video.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/video/:id/:title',
    name: 'video',
    component: Video,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
