import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false;
Vue.use(ElementUI);
import Router from 'vue-router'

import {postKeyValueRequest} from "./utils/app";
import {postRequest} from "./utils/app";
import {deleteRequest} from "./utils/app";
import {putRequest} from "./utils/app";
import {getRequest} from "./utils/app";
import {initMenu} from "./utils/menu";

Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;

// 前置守卫
router.beforeEach((to, from, next) => {
    // ...
    if (to.path === '/') {
    } else {
        initMenu(router, store);
    }
    next();
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

// 解决左侧菜单栏路由跳转报错1
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}