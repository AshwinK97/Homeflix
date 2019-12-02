import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Chat from 'vue-beautiful-chat'

Vue.config.productionTip = false
Vue.use(Chat);

Vue.prototype.$userId = "Kaushal";
Vue.prototype.$serverIP = window.location.hostname;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
