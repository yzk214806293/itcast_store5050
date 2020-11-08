<template>
  <div class="login-wrap">

    <el-form
      class="login-form"
      label-position="right"
      label-width="80px"
      :model="formData">
      <h2>登陆</h2>
      <el-form-item label="手机号">   
       <input type="text" class="in1" v-model="formData.phone">
      </el-form-item>
      <el-form-item label="验证码">
        <input type="text" class="in2" v-model="formData.verify">
        <button class="btn3" @click="handlo">获取验证码</button>
      </el-form-item>
      <el-form-item>
          <el-button @click="handleLogin" class="login-btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

// 1 绑定文本框 √
// 2 给按钮注册事件，发送异步请求 √
// 3 登录成功，跳转/提示/记录token
export default {
  data() {
    return {
      formData: {
        phone: '',
        verify: ''
      }
    };
  },
  methods: {
    // 登录       之前写.then 的方式进行接收 promese的方式 .then((response) => {

    // })
    /* es7 中的方法：  现在的方法async 和 await
                   在方法名前加async  还有后面的代码改成
                   const response = await this.$http.post('login',this.formData);

                   */
    handlo() {
      this.$http
      .post('common/verify', this.formData)     
     .then((response) => {
       console.log(response);
       const status = response.status;
             if(status === 200) {
            
               alert('成功')
               
             }
     })
     .catch((err) => {
        console.log(err);
     })
                  },

    handleLogin() {
      this.$http
        .post('common/login', this.formData)
        .then((response) => {
          // console.log(response)
          // 判断登录是否成功
          // response -> data, status
          // response.data 服务器返回的数据  data, meta
          // response.data.meta.status

        //    response 返回数据样式 外边还有个data data里面是meta
        //    meta :
        //        msg:"用户名不存在"
        //        status:400

          // 不解构可以这么写 但是太麻烦
          // const status = response.data.meta.status;
          // const msg = response.data.meta.msg;

          // 获取 response.data中的meta中的 msg和status
          // const { meta: { msg, status } } = response.data;
          if (code === 0) {
            // 成功
            this.$message.success(message);// 插件
            // 登录页面记录token 记录到cookie里用 localStorage  或者session里用 sessionStorage  cookie不能跨域
            sessionStorage.setItem('token', response.token);

             this.$router.push('./home');// 跳转到  home页面
          } else {
            // 失败
            this.$message.error(message);// 插件
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.login-wrap {
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

}
 .login-form{
       width: 400px;
       background-color: #fff;
       width:356px;
       padding:  0 40px;
 }
 .login-wrap h2 {
   text-align: center;
 }
 .el-form .in1 {
   width: 220px;
   background-image: url(./wode.png) ;
   background-size: 14px 14px;
   background-repeat: no-repeat;
   background-position: 1px 1px;
   padding-left: 16px;
   box-sizing: border-box;
 }
 .el-form .in2 {
   width: 117px;
      background-image: url(./wode.png) ;
   background-size: 14px 14px;
   background-repeat: no-repeat;
   background-position: 1px 1px;
     padding-left: 16px;
 }
 .login-btn {
   background-color: #FA791A;
   height: 40px;
   width: 186px;
   text-align: center;
   color: #fff;
 }
.btn3 {
  background-color: #fff;
  border: 1px solid #FA791A;
  color: #FA791A;
}
</style>
