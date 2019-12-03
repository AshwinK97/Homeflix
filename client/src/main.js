import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

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
