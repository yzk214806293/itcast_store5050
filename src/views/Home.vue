<template>
  <el-container>
  <el-header>
      <el-row>
  <el-col :span="4">
      <img src="@/assets/logo.png">
  </el-col>
  <el-col class="middle" :span="19">
      <span>电商后台管理</span>
  </el-col>
 <el-col :span="1">
          <a class="logout" href="#" @click.prevent="handleLogout">退出</a>
   </el-col>
</el-row>
  </el-header>
  <el-container>
    <el-aside width="200px">
       <el-aside width="200px">
        <!-- 侧边栏 -->
        <el-menu
          :unique-opened="true"
          :router="true"
          style="height: 100%"
          default-active="0">
          <el-submenu v-for="level1 in menus"  :key="level1.id"  :index="level1.path">
            <!-- 显示的是父菜单的内容  动态生成 显示一条数据即可 利用循环-->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ level1.authName }}</span>
            </template>
            <!-- 菜单项 el-menu-item -->

            <el-menu-item  v-for="level2 in level1.children" :key="level2.id" :index="'/' + level2.path">
              <i class="el-icon-view"></i>
               {{ level2.authName }}
              </el-menu-item>
          </el-submenu>
            <!-- 因为动态生成 下面要注释掉 -->
           <!-- <el-submenu index="2">

            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="/roles"><i class="el-icon-view"></i>角色列表</el-menu-item>
            <el-menu-item index="/rights">权限管理</el-menu-item>
          </el-submenu>

           <el-submenu index="3">

            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>

            <el-menu-item index="3-1">商品列表</el-menu-item>
              <el-menu-item index="3-2">分类参数</el-menu-item>
                <el-menu-item index="3-3">商品分类</el-menu-item>
          </el-submenu> -->

        </el-menu>
      </el-aside>
    </el-aside>
    <el-main>
              <!-- 这个是home页面下的组件 就是中间的那个主要内容 -->
      <router-view></router-view>

    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      // 获取菜单数据
      menus: []
    };
  },
  created() {
    // 加载菜单数据
    this.loadMenus();
  },
  // 这里判断用户登录没登录 判断的依据是获取token

  // 1 判断 token  beforeCreate 只是初始化了一个实例 创建了实例  方法属性 还没被初始化 在这个函数就得判断token
  // 在页面没有加载出来就得判断有没有token
  beforeCreate() {
    const token = sessionStorage.getItem('token');// 获取token
    // 判断token是否存在不存在 如果不存在请先登录 跳回登录页面
    if (!token) {
      this.$message.warning('请先登录');
      this.$router.push('/login');
    }
  },
  methods: {
  // 退出功能
    handleLogout() {
      sessionStorage.clear();// 清除sessionStorage里面的token
      this.$message.success('退出成功');// 提示退出成功
      this.$router.push('/login');// 跳转到登录页面
    },
    // 加载菜单数据
    async loadMenus() {
      const response = await this.$http.get('menus');
      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        this.menus = response.data.data;
      }
    }

  }
};
</script>

<style>
.el-container {
    height: 100%;
}
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    /* text-align: center;
    line-height: 60px; */
    padding: 0;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    /* text-align: center; */
    height: 100%;

  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    /* text-align: center; */

  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .middle,.logout {
      text-align: center;
      line-height: 60px;
      font-size: 24px;
      color: blue;
      text-decoration: none;
  }

</style>
