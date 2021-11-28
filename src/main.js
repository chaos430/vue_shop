import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$http = axios

//配置请求的根路径
axios.defaults.baseURL = 'https://liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config

})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
