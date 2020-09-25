import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  // router,
  // store,
  components: {
    App
  },
  render(h) {
    return h('App')
  }
})