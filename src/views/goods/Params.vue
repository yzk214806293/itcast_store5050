<template>
    <el-card class="card">
       <!-- 面包屑 -->
            <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>

       <!-- alert -->
      <el-alert
      style="margin-top: 10px; margin-bottom: 10px"
      :closable="false"
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon>
    </el-alert>

    <!-- 层级下拉框 -->
    <el-row>
      <el-col :span="24">
        请选择商品分类：
        <el-cascader
          :show-all-levels="false"
          expand-trigger="hover"
          :options="options"
          :props="{label: 'cat_name', value: 'cat_id'}"
          v-model="selectedOptions"
          @change="handleChange">
        </el-cascader>
      </el-col>
    </el-row>

    <!-- tab栏切换 activeTab绑定的是tab切换栏的当前点击的那个name值 -->
     {{ activeTab }}
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
          <el-button type="primary">添加动态参数</el-button>
        <el-table
          border
          stripe
          :data="dynamicParams"
          style="width: 100%">
            <!-- 动态参数数据可以点击三角号看到的内容 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
                 <!-- 具体的内容 这里展示的是 attr_vals的数据 但是下面给他变成数组就是params  直接v-for循环即可显示 但是下面给他转成了数组了 用scope.row.params 就可以访问到数据了-->
                 <!-- (scope.row.params,index) 第一项要删除的数据 第二项是(index)要删除的哪一项的id -->
          <el-tag
          :key="tag"
           v-for="(tag, index) in scope.row.params"
           closable
           @close="handleClose(scope.row.params,index,scope.row)">
           {{tag}}
          </el-tag>

         <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm(scope.row.params)"
          @blur="handleInputConfirm(scope.row.params,scope.row)"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

          </template>
          </el-table-column>

          <el-table-column
            type="index"
            width="60">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="商品参数"
            width="300">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
          <el-button type="primary">添加静态参数</el-button>
          <el-table
          border
          stripe
          :data="staticParams"
          style="width: 100%">
          <el-table-column
            type="index"
            width="60">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性值"
            width="300">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      activeTab: 'many', // activeTab绑定的是tab切换栏的当前点击的那个name值 这个要是设值的话 就是默任选择到哪个tab栏的身上
      dynamicParams: [], // 存储动态参数
      staticParams: [], // 储存静态参数
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    handleChange() { // 当改变下拉框内容的时候
    // 当下拉框内容选择的时候 展示动态参数
      this.loadParams();
    },
    handleClick(tab) { // 当进行tab栏切换的时候
      this.loadParams();
    },
    async loadOptions() { // 加载商品三级分类
      const response = await this.$http.get('categories?type=3');
      this.options = response.data.data;
    },
    // 加载动态参数和静态参数
    async loadParams() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类');
        return;
      }
      const response = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${this.activeTab}`);

      if (this.activeTab == 'many') {
      // 动态参数赋值
        this.dynamicParams = response.data.data;
        // "aa,bb,cc,ee" => [aa,bb,cc,ee] 这个是动态参数里面的一个（item.attr_vals）属性的数据格式 我们要改成数组形式 方便页面进行遍历 渲染
        this.dynamicParams.forEach((item) => {
          // item.attr_vals
          // 动态给item对象增加了一个属性params
          // item.params = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
          const arr = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');

          this.$set(item, 'params', arr);// 给item这个对象增加一个响应式的一个属性params ， arr是属性的值
        });
      } else {
        // 静态参数赋值
        this.staticParams = response.data.data;
      }
    },

    // 点击tag的关闭按钮的时候执行 就是具体数据项按钮的后面
    async handleClose(params, index, attr) {
      // 从数组中把当前项删除
      params.splice(index, 1);
      // 服务器发送请求
      // put categories/三级分类的id   selectedOptions /attributes/参数的id  就是版式 内存 cup主频 这些数据的id
      // 请求体  attr_name，attr_sel，attr_vals 这些数据也得发送出去     attr_vals: params.join(',') 这个是动态的数据 因为是数组 发送请求时要改成字符串格式
      const response = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`, {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: params.join(',')
      });
      // attr.attr_vals = params.join(',');

      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async handleInputConfirm(params, attr) { // params 接收scope.row.params
      let inputValue = this.inputValue; // 拿到文本框的值
      if (inputValue) { // 如果文本框有内容  把他追加到动态参数数组当中来
        params.push(inputValue);

        // 发送添加请求
        const response = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`, {
          attr_name: attr.attr_name,
          attr_sel: attr.attr_sel,
          attr_vals: params.join(',')
        });
          // attr.attr_vals = params.join(',');

        const { meta: { status, msg } } = response.data;
        if (status === 200) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    showInput() { // 当点击那个+ New Tag 这个按钮时
      this.inputVisible = true; // 显示添加的文本框
      this.$nextTick(_ => { // 点击时 自动获取文本框焦点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  }

};
</script>

<style scoped>
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
