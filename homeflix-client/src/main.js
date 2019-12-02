import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Chat from 'vue-beautiful-chat'

Vue.config.productionTip = false
Vue.use(Chat);

let globalData = new Vue({
  data: { $userId: '' }
});

Vue.mixin({
  computed: {
    $userId: {
      get: function () { return globalData.$data.$userId },
      set: function (newUserId) { globalData.$data.$userId = newUserId; }
    }
  }
})

Vue.prototype.$serverIP = window.location.hostname;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
