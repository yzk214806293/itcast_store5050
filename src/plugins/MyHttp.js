import axios from 'axios';
import { Loading, Message } from 'element-ui';

const MyHttp = {};
// vue的插件 必须有一个公共的install方法
MyHttp.install = function(Vue) {
    // 设置baseURL
    axios.defaults.baseURL = 'https://dev.api.youyueting.cn/';

    // axios过滤器
    // Add a request interceptor
    // 添加请求的拦截器
    let loadingInstance = null; // 全局变量 加载提示
    axios.interceptors.request.use(function(config) {
        // Do something before request is sent
        // 在请求发送之前，添加请求头token
        // 如果当前请求的地址是/login的时候，不给请求头加token
        // console.log(config.headers);这个里面打印的只是基地址
        // console.log(config.url);//这个里面打印的是基地址 加上拼接好的各个组件拼接好的接口
        if (config.url !== 'login') {
            const token = sessionStorage.getItem('token');
            // 设置请求头
            config.headers.Authorization = token;
        }

        //   2 发送请求之前，显示loading 因为下面那个方法还用到loadingInstance 在上面定义全局变量
        loadingInstance = Loading.service();

        return config;
    }, function(error) {
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    // 添加响应的拦截器
    //axios.interceptors.response.use(function(response) {
    // 在数据返回时 隐藏加载提示
    //loadingInstance.close();
    //console.log(response);

    // 2. 统一处理获取响应数据，判断获取数据成功还是失败(后加入的)
    const { meta: { message, code } } = response.info;
    if (status === 200 || status === 201) {
        // 成功
    } else {
        // 失败
        Message.error(msg);
    }

    // Do something with response data
    //return response;
    //}, function(error) {
    // Do something with response error
    //return Promise.reject(error);
    //});

    Vue.prototype.$http = axios; // 添加原型对象
};

export default MyHttp;