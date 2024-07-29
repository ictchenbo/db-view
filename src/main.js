import Vue from 'vue'
import ElementUI from 'element-ui'
//import DateFormatUtils from './components/js/commonutils'

import {ajaxGET, ajaxPUT, ajaxPOST, ajaxDELETE} from '@/components/js/httputils'
//import intercept from '@/components/js/http-intercept'

import ECharts from 'vue-echarts/components/ECharts'

Vue.component('e-chart', ECharts)

Vue.prototype.ajaxGET = ajaxGET
Vue.prototype.ajaxPUT = ajaxPUT
Vue.prototype.ajaxPOST= ajaxPOST
Vue.prototype.ajaxDELETE = ajaxDELETE
Vue.prototype.api = path => '/api'+path

Vue.use(ElementUI)

//Vue.use(DateFormatUtils)
//intercept()

import App from './App'
import router from './routers'

router.afterEach((to, from) => {
  
})

Vue.prototype.jump = function(path){
  router.redirect(path);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, //使用实例化的对象
  //store: store,  //全局使用store
  render: h => h(App)  //render 方法渲染根组件
})
