<template>
  <el-card class="card">
      <!-- 面包屑 -->
  <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>

    <!-- 表格 -->
     <el-table
      border
      stripe
      :data="tableData"
      style="width: 100%; margin-top: 10px">
      <el-table-column
      type="index"
      width="60">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        label="层级">
        <template slot-scope="scope">
                  <!-- 注意 返回数据是字符串形式0 1 2 我们要给她加上引号 这里是自定义数据 需要模板-->
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载权限列表数据
    async loadData() {
      const response = await this.$http.get('rights/list');
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.tableData = response.data.data;
      } else {
        this.$message.error('msg');
      }
    }
  }
};
</script>

<style>

</style>
