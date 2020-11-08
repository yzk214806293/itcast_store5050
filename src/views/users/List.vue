<template>

  <el-card class="card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
      <!-- 搜索 -->
    <el-row class="row">
      <el-col :span="24">
        <!-- 搜索文本框 clearable 文本框后面的清除功能 -->
        <el-input
          clearable
          v-model="searchValue"
          style="width: 300px"
          placeholder="请输入内容">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <el-button @click="addUserDialogFormVisible = true" type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
        <!-- 表格  v-loading="loading"加载样式  :data="tableData"绑定表格  border表格边框-->
    <el-table
       v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <!-- prop绑定对象的属性  显示当前列的数据-->
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>

      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>

      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>

       <el-table-column
        label="时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtData('YYYY-MM-DD') }}
        </template>
      </el-table-column>

       <!-- prop="mg_state" 模板渲染就可以去掉了 因为现实开关按钮只能用模板 要不显示不了-->
      <el-table-column

        label="用户状态"
        width="80">
        <template slot-scope="scope">
          <!-- 让开关绑定当前用户的 mg_state属性 true就是用户可用状态 false就是用户不可用状态   我用v-model 把这个开关按钮和数据绑定在一起 我开关按钮进行变动 我的数据也会跟着变动的
           这里用户需要点击变化 更改状态 绑定一个change事件  这里传过去的值需要id和和状态传过去 但是太麻烦 直接把整个对象传过去-->
          <el-switch
            @change="handleChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">

          </el-switch>
           <!-- {{scope.row}} -->
        </template>
      </el-table-column>

        <el-table-column
        label="操作">

          <template slot-scope="scope">
          <!-- 通过scope.$index可以获取到当前行的索引 -->
          <!-- scope.row 当前这一行所绑定的数据对象
          { "id": 500, "role_name": "主管", "username": "admin", "create_time": 1486720211, "mobile": "12345678", "email": "adsfad@qq.com", "mg_state": true }
           -->
          <!-- {{ scope.row.id }} -->

           <!-- 修改用户操作的按钮的函数名 handleOpenEditDialog 需要把当前用户信息传过去 -->
           <!-- 删除用户操作的按钮的函数名 handleDelete 需要把当前用户id传过去 -->
           <!-- 分配角色操作的按钮的函数名  handleOpenSetRoleDialog 需要把当前用户信息传过去 -->
          <el-button @click="handleOpenEditDialog(scope.row)" size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger" icon="el-icon-delete" plain></el-button>
          <el-button @click="handleOpenSetRoleDialog(scope.row)" size="mini" type="success" icon="el-icon-check" plain></el-button>
        </template>
           </el-table-column>
    </el-table>

     <!-- 分页 -->
    <!--
      事件
      size-change 页容量发生改变的时候执行
      current-change 页码改变的时候执行

      属性
      current-page 当前页码
      page-sizes 分页选择器 里显示的内容
      page-size 默认当前的页容量
      layout 布局
      total 总条数
     -->
    <el-pagination
      style="margin-top: 15px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 3, 4, 5]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

        <!-- 添加用户的对话框 :rules="rules"绑定表单验证  prop="username" prop="password" 这个是下面的表单验证 绑定表单验证的属性名 和下面的规则属性名相同
        因为我输入不遵守正则也可以点击确定 进行数据的提交 这时我们想办法解决  ref="form" 表单验证的绑定 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisible" @close="handleClose">
      <el-form
      ref="form"
      :rules="rules"
      label-width="80px"
      :model="formData">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
     <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formData.email" auto-complete="off"></el-input>
      </el-form-item>
       <el-form-item label="电话">
        <el-input v-model="formData.mobile" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleAdd">确 定</el-button>
    </div>
  </el-dialog>

     <!-- 修改用户的对话框 -->
  <el-dialog title="修改用户" :visible.sync="editUserDialogFormVisible" @close="handleClose">
      <el-form
      label-width="80px"
      :model="formData">
      <!-- disabled 禁用 不能选 -->
      <el-form-item label="用户名">
        <el-input v-model="formData.username" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formData.email" auto-complete="off"></el-input>
      </el-form-item>
       <el-form-item label="电话">
        <el-input v-model="formData.mobile" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleEdit">确 定</el-button>
    </div>
  </el-dialog>

   <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogFormVisible" @close="handleClose">
      <el-form
      label-width="100px"
      :model="formData">
      <el-form-item label="用户名">
        {{ formData.username }}
      </el-form-item>

        <!-- 下拉框 currentRoleId让他的默认值为-1 也就是默认选择第一项（也就是默认选择到请选择）  value="-1" 就是id也就是 currentRoleId 里面的value变了  currentRoleId也跟着变化了 当我选择了其中某一个下拉框的具体数据时 value值和currentRoleId是一样的
               这个请选择 显示不出来 这是下面的绑定的value的值是字符串的-1  而currentRoleId下面给的是一个数值型的-1  这是我们需要吧绑定的数据改为数值型的-1 即可 在前面加上双引号-->
      <el-form-item label="请选择角色">
        <el-select v-model="currentRoleId">
          <el-option label="请选择" :value="-1" disabled> </el-option>
           <!-- <el-option label="大学" value="1"> </el-option>
            <el-option label="小学" value="2"> </el-option> -->

          <!-- 把数据进行循环遍历 options是所有的数据 是个数组  :key="item.id" 数据中的id  :label="item.roleName" 数据里面的的的名字  :value="item.id"也是数据id-->
        <el-option
         v-for="item in options"
         :key="item.id"
         :label="item.roleName"
         :value="item.id">
        </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
      <el-button @click="handleSetRole" type="primary">确 定</el-button>
    </div>
  </el-dialog>

  </el-card>
</template>

<script>
export default {
  data() {
    return { // 假数据在prop上写上变量名就可以了 prop=“data”  prop=“name”  prop=“address”
      tableData: [],
      // 加载提示
      loading: true,
      // 分页数据
      pagenum: 1, // 页码
      pagesize: 2, // 页容量 每页显示几条
      total: 100, // 总数据条数
      searchValue: '', // 绑定搜索文本框
      addUserDialogFormVisible: false, // 控制添加用户对话框的显示或隐藏 默认在页面隐藏
      editUserDialogFormVisible: false, // 控制修改用户对话框的显示或隐藏 默认在页面隐藏
      setRoleDialogFormVisible: false, // 控制分配角色的弹框的的显示和隐藏 默认在页面隐藏
      formData: { // 绑定的添加用户的表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      currentRoleId: -1,
      options: [] // 绑定下拉框的数据

    };
  },
  created() {
    // 组建创建完毕，加载数据
    this.loadData();
  },
  methods: { // es7 可以写成 loadData前面加 aasync   const response = await this.$http.get('users?pagenum=1&pagesize=10');
    loadData() {
      this.$http
        .get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`)
        .then((response) => {
          this.loading = false;// 请求完数据 让加载提示结束

          // //这里要获取token 否则你没有权限访问数据
          // const token = sessionStorage.getItem('token');
          // //把token设置到请求头上才可以
          // this.$http.defaults.headers.common['Authorization'] = token; //固定写法 前面axios 就收this.$http 后面的token是token值

          /*              const { meta: { msg ,status} } = response.data;
             //判断获取数据是否ok
             if(status === 200) {
                 this.tableData =  response.data.data.users;

                 //设置总条数
                 this.total = response.data.data.total;
             } else {
                 this.$message.error(msg);
             } */

          // 上面的请求成功可以注释掉 因为MyHttp.js里面封装好了请求成功时 只需要写上请求成功之后做什么即可 那个页面都可以
          this.tableData = response.data.data.users;

          // 设置总条数
          this.total = response.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 分页相关方法
    handleSizeChange(val) { // 页容量发送变化 val 页容量    通过他可以设置每页显示几条数据
      this.pagesize = val;
      this.loadData();

      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) { // 当页码发送改变执行  val就是当前页码
      this.pagenum = val;

      this.loadData();// 当页码发生改变时 我要发送请求 获取请求当前页码的数据  val就是当前页码 我就可以调用上面的 loadData方法发送请求
      // 但是上面发送的过去的代码是 ${this.pagenum} 这个是第一页的代码 这时我们要把这个val当前页码赋值给this.pagenum
      // console.log(`当前页: ${val}`);
    },
    // 搜索功能
    handleSearch() {
      this.loadData(); // 搜索功能和展示数据一样 都得发送请求 这里直接调用即可
      // 只是少了 一个传给后台的一个参数 那就是用户所输入的内容 在发送时在后面拼一个 &query=${this.searchValue}
    },

    // 删除功能
    handleDelete(id) { // 接受id
      // 删除提示 插件
      this.$confirm('确定删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const response = await this.$http.delete(`users/${id}`);

        const { meta: { status, msg } } = response.data;
        if (status === 200) {
        // 删除成功
          this.$message.success(msg);
          // 如果是最后一页，并且只有一条数据，此时删除数据会有问题
          if (this.pagenum > 1 && this.tableData.length === 1) {
            this.pagenum--;// 这个判断是如果页码不是第一页的时候， 且数据的的长度为1的时候 也就是只有一条数据的时候
            // 让他删除完 显示上一页的数据 因为当前页只有一条数据 因为删除了 所以让他显示上一页有数据的页数值
          }
          // 刷新表格
          this.loadData();
        } else {
        // 删除失败
          this.$message.error(msg);
        }
      }).catch(() => {
        // 点击取消按钮执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 更改状态
    async handleChange(user) { // user接收对象
      const response = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      const { meta: { status, msg } } = response.data;

      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 添加用户
    handleAdd() {
    // 正则不正确也可以点击确认提交数据 要处理这个问题 在发送请求之前做一个表单验证 this.$refs.form获取form表单的DOM对象
      this.$refs.form.validate(async (valid) => {
        if (!valid) { // 如果表单验证失败
          this.$message.warn('验证失败');
          return;
        }
        // 验证成功时发送请求
        const response = await this.$http.post('users', this.formData);
        const { meta: { status, msg } } = response.data;
        if (status === 201) {
          this.$message.success(msg);// 提示添加成功
          this.loadData();// 刷新表格
          this.addUserDialogFormVisible = false;// 添加完关闭文本框
          this.formData = {};// 清空文本框
          // 遍历对象的所有属性，把属性对应的值设置为空 也可以实现清空文本框
        // for (let key in this.formData) {
        //   this.formData[key] = '';
        // }
        } else {
          this.$message.error(msg);
        }
      });
    },

    // 假如我点击了关闭文本框 没有点确认的时候 也得清除文本框
    handleClose() {
      for (let key in this.formData) {
        this.formData[key] = '';
      }
      // 当下拉框的那个表单选择完 之后 里面的内容要进行重置 也就是让默认他在在显示到请选择的那一项
      this.currentRoleId = -1;
    },
    // 修改用户信息
    handleOpenEditDialog(user) { // 接收用户数据
      // 让修改的对话框弹出
      this.editUserDialogFormVisible = true;
      // 设置formDate里面的值 因为修改用户 要把之前修改的信息填入带里面去 把用户所有的信息放入form表单中的每一项
      this.formData.username = user.username;
      this.formData.email = user.email;
      this.formData.mobile = user.mobile;
      this.formData.id = user.id; // 因为下面的点击确定按钮需要id 我们这里进行一个保留
    },
    // 点击确认按钮修改用户的信息
    async handleEdit() {
      // /users/:id  mobile  email
      const response = await this.$http.put(`/users/${this.formData.id}`, {
        email: this.formData.email,
        mobile: this.formData.mobile
      });

      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 成功
        // 关闭对话框
        this.editUserDialogFormVisible = false;
        // 刷新table
        this.loadData();
        // 提示
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 点击分配角色，打开分配角色的对话框
    async handleOpenSetRoleDialog(user) {
      this.setRoleDialogFormVisible = true;// 弹出提示框
      this.formData.username = user.username; // 用户名填入
      const response = await this.$http.get('roles'); // 发送请求
      this.options = response.data.data;// 获取所有数据 放到options这个数组当中

      // 设置当前用户默认的角色
      // console.log(user);
      // this.currentRoleId
      // 根据用户id，查询用户信息（找到当前用户对应的角色id）
      const res = await this.$http.get(`users/${user.id}`);
      // console.log(res.data);
      this.currentRoleId = res.data.data.rid;

      // 记录用户id 下面点击确认按钮时需要id
      this.formData.id = user.id;
    },
    // 打点击确定按钮设置用户角色 发送时需要用户id 因为id在上面能获取到
    async handleSetRole() {
      const response = await this.$http.put(`users/${this.formData.id}/role`, {rid: this.currentRoleId}); // 发送请求

      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        // 成功
        this.$message.success(msg);
        this.setRoleDialogFormVisible = false;
      } else {
        // 失败
        this.$message.error(msg);
      }
    }

  }
};
</script>

<style>
.card {
  height: 100%;
}
.row {
  margin-top: 15px;
  margin-bottom: 15px;
}

</style>
