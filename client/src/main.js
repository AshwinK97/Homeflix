import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// All components can access the userId, used for various requests to the server
let globalData = new Vue({
  data: { $userId: '' }
});

// Allows the global data to be mutable
Vue.mixin({
  computed: {
    $userId: {
      get: function () { return globalData.$data.$userId },
      set: function (newUserId) { globalData.$data.$userId = newUserId; }
    }
  }
})

// Store the serve IP global, allowing devices on the same network to communicate with the server
// Immutable
Vue.prototype.$serverIP = window.location.hostname;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
