<template>
    <el-card class="card">
     <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>

    <!-- 按钮 -->
     <el-button style="margin-top: 10px; margin-bottom: 10px">添加角色</el-button>

     <!-- 表格 -->
    <el-table
      border
      stripe
      :data="tableData"
      style="width: 100%">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4">
              <!-- 显示一级权限的名字 @close="handleClose"删除标签的函数 -->
              <el-tag closable  @close="handleClose(scope.row, level1.id)">{{ level1.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
             <el-row v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <!-- 显示二级权限的名称 -->
                  <el-tag type="success" closable  @close="handleClose(scope.row, level2.id)">{{ level2.authName }}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                    <!-- 显示三级权限 -->
                    <el-tag class="level3" closable type="warning" v-for="level3 in level2.children" :key="level3.id"  @close="handleClose(scope.row, level3.id)">{{level3.authName}}</el-tag>
                </el-col>
             </el-row>
            </el-col>
          </el-row>

           <!-- 未分配权限 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">未分配权限</el-col>
          </el-row>

        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
          <el-button @click="handleOpenDialog(scope.row)" size="mini" type="success" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 点击分配角色弹出对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="dialogVisible">
        <!-- 弹出框里面显示的那棵树 -->
           <!--
        default-expand-all 默认展开所有节点
        show-checkbox 选择按钮
        data 绑定到树上的数据 [{}]
        props 告诉树上的节点要展示的属性是哪个，子节点对应的属性是哪个

        node-key="id"   如果要使用default-checked-keys，必须要设置tree的node-key给每一个节点设置一个唯一值
        default-checked-keys  设置树上的哪些节点被选中
        思路： 我们要想让树上某个节点被选中 首先设置一个node-key="id" 让树上某一个节点有一个唯一值  让树上哪一个节点被选中呢  使用:default-checked-keys 默认让哪一个节点被选中 让他等于一个数组
              这个数组里里面的值 也就是 node-key="id"对应的值 想让谁选中 就让谁的id放到这个 checkedKeys 这个数组当中来  下面进行变遍历 请查看下面的遍历注释
       -->
       <el-tree
        ref="tree"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedKeys"
        :data="data"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      // 控制对话框的显示与隐藏
      dialogVisible: false,
      // 绑定树的数据
      data: [],
      defaultProps: {
        label: 'authName', // 树上的节点绑定对象的属性
        children: 'children'// 对象的子节点绑定对象的属性
      },
      checkedKeys: [],
      // 记录当前角色的id 给个初始值为-1
      currentRoleId: -1
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载表格数据
    async loadData() {
      const response = await this.$http.get('roles');
      //  const { meta: { msg, status } } = response.data;
      //  if( status === 200) {
      //      this.tableData = response.data.data;
      //  }else {
      //      this.$message.error(msg);
      //  }

      // 上面的请求成功可以注释掉 因为MyHttp.js里面封装好了请求成功时 只需要写上请求成功之后做什么即可 那个页面都可以
      this.tableData = response.data.data;
    },
    // 删除当前角色对应的权限
    async handleClose(role, rightId) {
      // role 接受传过来 的当前行对应角色的对象
      // rightId 接受传过来 当前权限的id
      const response = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        // 删除权限成功
        this.$message.success(msg);
        // 这里要是刷新表格的话 用户体验不好
        // 只重新加载当前角色的权限列表
        role.children = response.data.data;
      } else {
        this.$message.error(msg);
      }
    },
    // 点击分配权限，显示对话框    role 接收当前角色对象的所有信息
    async handleOpenDialog(role) {
      this.dialogVisible = true;
      // 获取所有权限tree
      const response = await this.$http.get('rights/tree');
      this.data = response.data.data;

      // 设置当前角色所拥有的权限被选中（这里就是遍历出三级权限的id）
      // 要取当前角色所拥有的三级权限的id  这里定义一个arr这个数组存放三级id的地方 必须通过遍历能取到三级权限的id 再放到arr的数组中
      // 为什么要拿3级权限的id 因为我选中三级权限当中的某一个 上面的二级和一级也会选中 所以要取三级id的权限
      const arr = [];
      // 遍历一级权限
      role.children.forEach((level1) => {
        // 遍历二级权限
        level1.children.forEach((level2) => {
          level2.children.forEach((level3) => {
            arr.push(level3.id);
          });
        });
      });
      this.checkedKeys = arr; // 把存入的三级id的数组放到这个checkedKeys 这个数组当中

      // 记录当前角色的id
      this.currentRoleId = role.id; // 因为下面需要这个id
    },
    // 点击确定按钮 把用户选择的权限发送过去
    async handleSetRights() {
      // post roles/:roleId/rights  rids权限id列表，每个id使用,分割

      // 获取树上选中和半选的节点的id 返回的是一个数组 这是文档中的两个方法
      const arr1 = this.$refs.tree.getCheckedKeys();
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      // 把这两个数组合并成一个数组 利用解构的方法
      const arr = [...arr1, ...arr2];
      const rids = arr.join(','); // 数组里面以逗号的形式分割

      // 发送请求  因为是post请求 需要发送请求体 rids
      const response = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: rids
      });
      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        // 成功
        this.$message.success(msg);
        this.dialogVisible = false;// 对话框关闭
        this.loadData();// 刷新表格
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>

.level3 {
   margin-right: 5px;
  margin-bottom: 5px;
}
</style>
