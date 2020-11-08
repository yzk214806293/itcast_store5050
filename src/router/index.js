import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui'; // 下面我想写一个提示 因为this不是vue的实例 但是我们·想使用vue里面的提示 这里可以单独引用 按需引入

// 引入登录组件 @代表src的路径 前面的路径就不用写了 提升开发效率（自己写的）
// 1 @是src目录，在build的配置文件中配置的
//   @  webpack.base.conf 的第38行配置的

// 2 为什么可以省略掉.vue
// 加载一个模块的时候，如果省略后缀名，默认情况 先加载login.js，如果找不到再加载 login.json
// 默认的情况可以修改，在webpack.base.conf的35行配置
/* import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';

// 引入home里面主内容的组件 之前的写法
import Users from '@/views/users/List';

import Rights from '@/views/rights/Rights';

import Roles from '@/views/rights/Roles';

import { Message } from 'element-ui'; // 下面我想写一个提示 因为this不是vue的实例 但是我们·想使用vue里面的提示 这里可以单独引用 按需引入

import Categories from '@/views/goods/Categories';

import Goods from '@/views/goods/Goods'; // 商品管理的组件

import GoodsAdd from '@/views/goods/GoodsAdd'; // 添加商品的跳转组件

import Params from '@/views/goods/Params';

import Order from '@/views/order/Order'; // 订单管理组件

import Reports from '@/views/reports/Reports';
 */



//因为项目打包完 比较大 我们这里使用路由懒加载
// 引入home里面主内容的组件
const Login = () =>
    import ('@/views/Login.vue'); //登陆组件
const Home = () =>
    import ('@/views/Home.vue'); //主页面组件

const Users = () =>
    import ('@/views/users/List');

const Rights = () =>
    import ('@/views/rights/Rights');

const Roles = () =>
    import ('@/views/rights/Roles');

const Categories = () =>
    import ('@/views/goods/Categories');

const Goods = () =>
    import ('@/views/goods/Goods'); // 商品管理的组件

const GoodsAdd = () =>
    import ('@/views/goods/GoodsAdd'); // 添加商品的跳转组件

const Params = () =>
    import ('@/views/goods/Params');

const Order = () =>
    import ('@/views/order/Order'); // 订单管理组件

const Reports = () =>
    import ('@/views/reports/Reports');

Vue.use(Router); // 数据统计组件

// 之前的路由写法
// export default new Router({
//     routes: [
//         { path: '/', redirect: '/login' },
//         { name: 'login', path: '/login', component: Login },
//         {
//             name: 'home',
//             path: '/home',
//             component: Home,
//             children: [{
//                     name: 'users',
//                     path: '/users',
//                     component: Users
//                 },
//                 {
//                     name: 'rights',
//                     path: '/rights',
//                     component: Rights

//                 },
//                 {
//                     name: 'roles',
//                     path: '/roles',
//                     component: Roles
//                 }
//             ]
//         },

//     ]
// });
// 在这里我们要添加路由守卫 按照路由守卫文档中的写法 因为给路路由写方法 给路由一个变量 然后在导出路由 以前就直接导出路由了

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { name: 'login', path: '/login', component: Login },
        {
            name: 'home',
            path: '/home',
            component: Home,
            children: [{
                    name: 'users',
                    path: '/users',
                    component: Users
                },
                {
                    name: 'rights',
                    path: '/rights',
                    component: Rights

                },
                {
                    name: 'roles',
                    path: '/roles',
                    component: Roles
                },
                {
                    name: 'categories',
                    path: '/categories',
                    component: Categories
                },
                {
                    name: 'goods',
                    path: '/goods',
                    component: Goods

                },
                {
                    name: 'goodsadd',
                    path: '/goods/add',
                    component: GoodsAdd
                },
                {
                    name: 'params',
                    path: '/params',
                    component: Params
                },
                {
                    name: 'order',
                    path: '/orders',
                    component: Order
                },
                {
                    name: 'reports',
                    path: '/reports',
                    component: Reports
                }
            ]
        }

    ]
});
// 设置路由的前置守卫（路由跳转之前） 为什么要写路由守卫 因为加入页面token没有的话 就直接跳转到登陆页面 这里我们在home这个组件里面写的 但是哪个页面都得写一次 太麻烦 就需要设置全局的路由守卫解决
router.beforeEach((to, from, next) => {
    // 判断有没有token
    if (to.name === 'login') {
        next();
    } else {
        // 判断有没有token
        const token = sessionStorage.getItem('token');
        if (token) {
            next();
        } else {
            // 没有token，跳转到登录
            // this不是vue的实例
            // this.$router.push('/login');
            // 只有文件是.vue的时候才是vue的实例 这里我只要有路由对象就可以进行跳转 就是那个router 直接就可以跳转
            router.push('/login');
            // 提示
            // this不是vue的实例
            // this.$message.warning('请先登录');
            Message.warning('请先登录');
        }
    }
});

export default router; // 导出路由