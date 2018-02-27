// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './vuex/store'

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(ElementUI)
Vue.use(Vuex)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
