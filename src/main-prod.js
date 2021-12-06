import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$http = axios

//配置请求的根路径
axios.defaults.baseURL = 'https://liulongbin.top:8888/api/private/v1/'
//在request拦截器中,展示进度条
axios.interceptors.request.use(config =>{

    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

Vue.component('tree-table',TreeTable)
Vue.use(VueQuillEditor)
Vue.filter('dateFormat',function(originVal){
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2,'0')
    const d = (dt.getDate() + '').padStart(2,'0')
    const hh = (dt.getHours() + '').padStart(2,'0')
    const mm = (dt.getMinutes() + '').padStart(2,'0')
    const ss =(dt.getSeconds() +'').padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
