<template>
    <e-card class="card">
       <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="商品添加"></my-breadcrumb>
       <!-- alert -->
      <el-alert
      style="margin-top: 10px; margin-bottom: 10px"
      :closable="false"
      title="添加商品信息"
      type="info"
      center
      show-icon>
      </el-alert>
     <!-- 步骤条 -->
    <el-steps
      :active="active"
      align-center
      finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
      <!-- tab切换栏  这里加一个表单的属性 因为一会要提交 比较的方便-->
      <el-form :label-position="top" label-width="80px" :model="formData">
       <el-tabs
      @tab-click="handleTabClick"
      tab-position="left"
      style="margin-top: 15px">
      <el-tab-pane label="基本信息">
        <el-form-item label="商品名称">
            <el-input v-model="formData.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
            <el-input v-model="formData.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
            <el-input v-model="formData.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
            <el-input v-model="formData.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
           <!-- 多级下拉框 -->
           {{ selectedOptions }}
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              :props="{ label: 'cat_name', value: 'cat_id', children: 'children' }"
              v-model="selectedOptions"
              @change="handleChange">
            </el-cascader>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
          <!-- 商品参数 动态参数 -->
          <el-form-item
            v-for="item in dynamicParams"
            :key="item.attr_id"
            :label="item.attr_name">
            {{ item.attr_vals }}
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                v-for="val in item.attr_vals"
                :key="val"
                border
                :label="val">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <!-- 商品属性 - 静态参数 -->
          <el-form-item
            v-for="item in staticParams"
            :key="item.attr_id"
            :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
                  <!-- 商品图片 -->
          <!--
            action是接口的地址，全部的地址  上传图片需要设置token 在请求头设置 在vue组件里面提供写一个headers 他是一个对象
           -->
          <el-upload
            action="http://localhost:8888/api/private/v1/upload"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="headers"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <el-button @click="handleAdd">添加商品</el-button>
                   <!-- 富文本编辑器 -->
          <quill-editor
          v-model="content"></quill-editor>
      </el-tab-pane>
   </el-tabs>
   </el-form>

    </e-card>
</template>

<script>
// 富文本编辑器需要的css和按需导入的东西
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

export default {
  // 注册一下富文本编辑器这个组件
  components: {
    quillEditor
  },
  data() {
    return {
      // 进度条默认第一个为0 就是选中第一个  点击进度条 点击第一个这个值会是1 以此类推
      active: 0,
      formData: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        // 用,分割的分类id列表
        goods_cat: '',
        // 储存图片路径的数组 也就是储存数据库的路径
        pics: [],
        goods_introduce: '', // 绑定的富文本框
        attrs: []
      },
      // 绑定多级下拉的数据 用props告诉下拉框具体要展示的是哪些数据
      options: [

      ],
      // 绑定下拉框中的option 也就是id值
      selectedOptions: [],
      // 存储动态参数
      dynamicParams: [],
      // 存储静态参数
      staticParams: [],
      // 给上传图片组件设置一个请求头的数据
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
    };
  },
  created() {
    // 组建创建完毕，加载多级下拉的分类数据
    this.loadOptions();
  },
  methods: {
    // 点击tab标签页的时候执行
    handleTabClick(tab) {
      // 被选中的标签 tab 实例
      // console.log(tab); 这个被选中的tab实例里面是有个index属性 也就是被选中的索引值 字符串类型
      // tab.index  当前tab页的索引-字符串类型
      this.active = tab.index - 0;

      // 如果当前的标签页选择的是 商品参数/商品属性 也就是index 等于 1 和 2时
      if (tab.index === '1' || tab.index === '2') {
        // 清空动态参数 和静态参数 因为你把三级分的那个下拉框给删除掉了 但是商品参数和商品属性还是会有的数据的 我们这里直接把静态参数的和动态参数的数据从数组中清除
        this.dynamicParams.length = 0;
        this.staticParams.length = 0;
        // 判断当前的多级下拉中是否选择了三级分类 这个判断是没有选择三级分类
        if (this.selectedOptions.length < 3) {
          this.$message.warning('请选择商品的三级分类');
        } else {
          // 加载商品参数 当选择三级分类的时候 加载商品参数 还要判断传过去的是静态参数还是动态参数  假如点击的是商品参数的时候 也就是要传的是动态参数也就是要传过去many 假如点击的是商品属性的话 要传过去的是静态参数 要传过去的是静态参数
          const sel = tab.index === '1' ? 'many' : 'only';
          this.loadParams(sel);
        }
      }
    },
    /*     ********* 注意 静态参数 和 动态参数 的接口问题 ***************
                        静态参数的接口是 categories/:id/attributes?sel=only 静态后面传的是only
                        动态参数的接口是 categories/:id/attributes?sel=many 动态后面传的是many
                        sel 就是判断接收的是 静态接口 还是 动态接口
                     ********************************************************************* */

    // 加载分类参数（动态参数和静态参数）这个id就在下拉框里也就是那个 selectedOptions 里面的id   也就是数组的第三项数据 this.selectedOptions[2] 的id
    async loadParams(sel) {
      const response = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`);

      if (sel === 'many') { // 如果加载动态参数
        this.dynamicParams = response.data.data; // 将动态参数的数据 放到储存这个保存这个动态数据的这个数据里
        // console.log(this.dynamicParams)//动态参数 要把这个动态参数以数组的形式展示出来 ，方便界面上去遍历 因为里面有个属性 存的是多个数据 以对象的形式 这个属性名是attr_vals:"aa,bb,cc,ee" 后面的是数据
        this.dynamicParams.forEach((item) => { // 循环遍历
          // "aa,bb,cc,ee" => [aa,bb,cc,ee]
          item.attr_vals = item.attr_vals.length === '' ? [] : item.attr_vals.split(',');// 如果这里没有数据的话 就是空数组 如果有数据的话 就用split切割成数组
        });
      } else { // 否则加载静态参数的话
        this.staticParams = response.data.data;
      }
    },
    // 加载多级下拉的分类数据
    async loadOptions() {
      const response = await this.$http.get('categories?type=3');
      this.options = response.data.data;
    },
    // 多级下拉选中的内容发生变化的时候执行
    handleChange() {
      // 判断当前选中的是否为3级分类 如果没有选择进行提示 &&(或者)
      if (this.selectedOptions.length !== 3 && this.selectedOptions.length !== 0) {
        // 提示
        this.$message.warning('请选择商品的三级分类');
        // 然后清楚内容 也就是清空数组
        this.selectedOptions.length = 0;
      }
    },
    // 图片上传成功时再给他进行移除执行的方法
    handleRemove(file, fileList) {
      //  console.log(file);
      //  console.log(fileList);
      // 假如用户不想上传了 把图片从formData.pics中移除 用splice进行移除  1.找到删除图片的在数组中的索引
      const index = this.formData.pics.findIndex((item) => {
        // findIndex 找的是满足条件的那一项的索引 返回的是布尔值true false  判断的是上传的哪一项的路径 item就是其中的哪一项 点上pic也就是上传的那个路径 让他等于移除的那个路径
        return item.pic === file.response.data.tmp_path;
        // if (item.pic === file.response.data.tmp_path) {
        //   return true;
        // }
      });
      this.formData.pics.splice(index, 1); // 进行移除的操作 index是当前所要移除的那一项的索引值 1是移除第一项的索引值
    },
    // 图片上传成功时进行操作的函数
    handleSuccess(response, file, fileList) {
    // 1  服务器返回的数据
      console.log(response);
      // 上传的文件对象
      // console.log(file);
      // 数组 ，包含了file
      // console.log(fileList);

      // 2 设置formData中的pics 写成下面的这种形式
      // "pics":[
      // {"pic":"/tmp_uploads/30f08d52c551ecb447277eae232304b8"}
      // ],

      this.formData.pics.push({ // 把图片的路径信息push到这个pics中 也就是储存图片的路径的位置
        pic: response.data.tmp_path
      });
    },
    // 添加商品
    async handleAdd() {
      // goods_cat 分类的id列表 数组 后台要求 要以，的形式进行分隔
      this.formData.goods_cat = this.selectedOptions.join(',');
      // attrs 分类参数 把静态参数的数据和动态参数的数据 改写成下面的格式 这时我们用到一个map方法 相当于一个foreach循环
      const arr1 = this.staticParams.map((item) => { // 静态参数
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
      });
      const arr2 = this.dynamicParams.map((item) => { // 动态参数
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(',')// 因为是动态参数 上面已经把动态参数这个数组里面的一个参数改成了以数组形式展开 也就是那个attr_vals的这个属性 我们在这里 变成字符串的形式
        };
      });
      // 再把这两个数组给他合并成一个数组
      this.formData.attrs = [...arr1, ...arr2];
      const response = await this.$http.post('goods', this.formData);
      const { meta: { status, msg } } = response.data;
      if (status === 201) {
        this.$message.success('添加商品成功');
        this.$router.push('/goods');
      } else {
        this.$message.error('添加商品失败');
      }

      // "attrs":[
      //   {
      //     "attr_id":15,
      //     "attr_value":"ddd"
      //   },
      //   {
      //     "attr_id":15,
      //     "attr_value":"eee"
      //   }
      // ]
    }

  }
};
</script>

<style>
/* 富文本编辑器的高度的样式 */
.ql-editor {
  height: 400px;
}
.el-step__title {
    /* 这个是step组件的样式，如果加上scoped之后不起作用，可以放到全局样式中 */
    font-size: 12px;
}
</style>
