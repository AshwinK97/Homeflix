import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Video from '../views/Video.vue';
import SyncVideo from '../views/SyncVideo.vue';
import Upload from '../views/Upload.vue';

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
  },
  {
    path: '/video/:user/:id/:title',
    name: 'syncVideo',
    component: SyncVideo,
    props: true
  },
  {
    path: '/upload',
    name: 'upload',
    component: Upload
  }
]

const router = new VueRouter({
  routes
})

export default router
