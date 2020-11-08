// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// 导入elementui(后来导入的)
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';  因为这个elementui 的css 在cdn 打包操作后加载了不用加载本地的了
import '@/assets/css/index.css';

import MyHttp from '@/plugins/MyHttp'; // 导入自己封装的东西 axios

// 导入moment处理时间的
import moment from 'moment';

// 导入面包屑组件 我们对面包屑进行了封装
import MyBreadcrumb from '@/components/MyBreadcrumb';

// 过滤器，格式化日期字符串  //filter('过滤器名字', (要处理的数据,处理日期的格式)=>{ 处理数据 并且 return })
Vue.filter('fmtData', (value, fmtStr) => {
    return moment(value).format(fmtStr);
});

Vue.directive('focus', {
    inserted: function(v) {
        v.focus();
    }
});


// 全局注册面包屑 **组件**
Vue.component(MyBreadcrumb.name, MyBreadcrumb);

// 注册MyHttp**插件**
Vue.use(MyHttp);

// 注册elementui**插件**
Vue.use(ElementUI);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});