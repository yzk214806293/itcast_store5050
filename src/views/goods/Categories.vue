<template>
    <el-card class="card">
        <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
        <!-- 添加按钮 -->
        <el-button @click="handleOpenAddDialog" style="margin-top: 10px; margin-bottom: 10px" type="success" plain>添加分类</el-button>
    <!-- 表格 -->
     <el-table
     :height="530"
     border
    :data="tableData"
    stripe
    style="width: 100%">
    <!--
      treeKey 作用是设置每一项的唯一标识
      parentKey 可以点开 可以收起来
      levelKey 绑定到不同级别的属性
      indentSize 设置不同级别之间的缩进
      childKey：默认值是children， 标识子节点的属性
     -->
     <el-table-tree-column
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
       :indentSize="20"
      prop="cat_name"
      label="分类名称"
      width="300">
     </el-table-tree-column>
    <el-table-column
      prop="cat_level"
      label="级别"
      width="180">
      <template slot-scope="scope">
           <!-- 这里面的0 是服务器返回的0 也就是服务器返回的数值类型的0 不用加引号 不是字符串类型的 -->
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_leve1 === 1">二级</span>
          <span v-else-if="scope.row.cat_leve1 === 2">三级</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="cat_deleted"
      label="是否有效">
      <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效' : '有效' }}
      </template>
    </el-table-column>
    <el-table-column
      prop="cat_deleted"
      label="操作">
      <template slot-scope="scope">
        <el-button @click="handleOpenEditDialog(scope.row)" size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button @click="handleDelete(scope.row)" size="mini" type="danger" icon="el-icon-delete" plain></el-button>
      </template>
    </el-table-column>
  </el-table>

   <!-- 分页组件 @size-change页容量发送变化 val 页容量    通过他可以设置每页显示几条数据
                @current-change  当页码发送改变执行  val就是当前页码
               :current-page  pagenum 页码   :page-size=页容量  :total 总条数
       -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[9, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

   <!-- 添加的弹出对话框 -->
   <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
  <el-form label-width="80px" :model="form">
    <el-form-item label="分类名称">
      <el-input v-model="form.cat_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="父级分类">
      <!-- 多级下拉框
             expand-trigger 触发（展开）的事件
            options：提供展示的数据，是数组
            v-model 双向绑定，多级下拉框，绑定上的是多个值，数组  就是当前选中的那一项的id
            @change 选中项改变的时候执行
            change-on-select 选择任意一级菜单的选项
            props 对象，设置多级下拉框显示的属性，value对象的属性，子节点对应的属性 因为props里面显示的是对象 所以要在前面加上双引号 不加双引号默认的是字符串  label就是下拉框显示的数据内容  value 就是数据的id children 存子节点的对象名
      -->
      <!-- {{selectedOptions}}  可以查看数组的变化长度-->
       <el-cascader
    clearable
    change-on-select
    expand-trigger="hover"
    :options="options"
    :props="{
       label:'cat_name',
       value:'cat_id',
       children:'children',
    }"
    v-model="selectedOptions"
    @change="handleChange">
  </el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleAdd">确 定</el-button>
  </div>
</el-dialog>

   <!-- 编辑的对话框 -->
    <!-- 编辑的对话框 -->
    <el-dialog
      title="修改商品分类"
      :visible.sync="editDialogFormVisible">
      <el-form
        label-width="80px"
        :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>

    </el-card>
</template>

<script>
// 配置tree grid局部组件
import ElTreeGrid from 'element-tree-grid';
export default {
  // 注册局部组件
  components: {
    'el-table-tree-column': ElTreeGrid
  },
  data() {
    return {
      tableData: [],
      // 分页数据 pagenum 默认显示第一页 也就是页码   pagesize 每页显示几条数据
      pagenum: 1,
      pagesize: 9,
      total: 0,
      // 控制添加对话框的显示与隐藏
      addDialogFormVisible: false,
      // 控制编辑对话框的显示与隐藏
      editDialogFormVisible: false,
      form: {
        cat_name: ''

      },
      options: [],
      selectedOptions: [],
      // 点击编辑按钮的时候，记录当前编辑的 分类对象
      currentCat: null

    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载商品分类数据
    async loadData() {
      const response = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);

      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        this.tableData = response.data.data.result;
        // 获取相应之后 设置total的值
        this.total = response.data.data.total;
      } else {
        this.$message.error(msg);
      }
    },
    // 分页方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) { // 1 当页码改变的时候 2 请求数据
      this.pagenum = val; // val是请求的当前页
      this.loadData(); // 然后请求数据 发送请求
      console.log(`当前页: ${val}`);
    },
    // 点击添加按钮 弹出对话框  加载多级下拉框的数据 发送请求 获取数据 存到options 这个数组当中 把数据放入下拉文本框中
    async handleOpenAddDialog() {
      this.addDialogFormVisible = true;
      const response = await this.$http.get('categories?type=2');
      this.options = response.data.data;
    },
    // 点击添加按钮 把数据发送给后端 进行添加操作
    // post categories.
    // 参数
    // cat_pid 添加的分类的父id
    // cat_name 分类的名称  - 绑定的文本框
    // cat_level 分类的层级0, 1, 2

    // cat_level  0 1 2   想要看selectedOptions他的值是怎么变化的 在上面用花括号表达出来 就可以看见数组的长度变化了
    // cat_level  this.selectedOptions.length === 0 -- 0  一级
    // cat_level  this.selectedOptions.length === 1 -- 1  二级
    // cat_level  this.selectedOptions.length === 2 -- 2  三级

    async handleAdd() {
      this.form.cat_level = this.selectedOptions.length;
      // cat_pid  一级分类 0    这个pid的情形是这样的  假如我选择了二级和三级的分类 数组会显示[15，20] 大家电 冰箱 就说明前面选中的这两个的id是多少 也就是pid是多少
      // cat_pid  二级分类 this.selectedOptions[0]
      // cat_pid  三级分类 this.selectedOptions[1]

      if (this.selectedOptions.length === 0) {
        // 添加一级分类
        this.form.cat_pid = 0;
      } else if (this.selectedOptions.length === 1) {
        // 添加一级分类
        this.form.cat_pid = this.selectedOptions[0];
      } else if (this.selectedOptions.length === 2) {
        // 添加三级分类的时候
        this.form.cat_pid = this.selectedOptions[1];
      }
      // 发送异步请求，添加商品分类
      const response = await this.$http.post('categories', this.form);
      const { meta: { msg, status } } = response.data;
      if (status === 201) {
        // 添加成功
        this.$message.success(msg);
        this.addDialogFormVisible = false;
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    },
    // 点击删除按钮
    async handleDelete(cat) {
      // cat 要删除的分类对象 删除提示
      try {
        await this.$confirm('确认要删除当前商品分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        // 带年纪完确认 发送异步请求 请求数据
        const response = await this.$http.delete(`categories/${cat.cat_id}`);
        const { meta: {msg, status }} = response.data;
        if (status === 200) {
          this.$message.success(msg);
          this.loadData();
        } else {
          this.$message.error(msg);
        }
      } catch (err) {
        // 点击了取消按钮执行
        alert('点击了取消');
      }
    },
    // 点击编辑按钮的时候
    handleOpenEditDialog(cat) {
      this.editDialogFormVisible = true;
      this.form.cat_name = cat.cat_name;// 让当前的数据放到文本框中
      this.currentCat = cat;// 记录当前的分类对象 因为下面的方法要进行使用
    },
    // 点击确定按钮，编辑分类数据
    async handleEdit() { // 把当前编辑的数据发送给后台 我们在这里取不到当前要修改的对象 但是上面的那个方法可以取到 我们在上面设置一个空的对象(currentCat) 方便哪个方法都能用this获取
      // put categories/:id   cat_name
      const response = await this.$http.put(`categories/${this.currentCat.cat_id}`, this.form);
      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        // 编辑成功
        this.$message.success(msg);
        this.editDialogFormVisible = false;
        // 更改了绑定的对象，界面不会刷新
        // this.currentCat = response.data.data;
        this.currentCat.cat_name = response.data.data.cat_name;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>

</style>
