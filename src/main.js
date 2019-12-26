import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);

import {postKeyValueRequest} from "./utils/app";
import {postRequest} from "./utils/app";
import {deleteRequest} from "./utils/app";
import {putRequest} from "./utils/app";
import {getRequest} from "./utils/app";

Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
