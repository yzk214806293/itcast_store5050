<template>
    <el-card class="card">
 <!-- 面包屑 -->
    <my-breadcrumb level1="数据统计" level2="数据报表"></my-breadcrumb>

     <!-- 设置一个div 图表需要一个div -->
     <div ref="div" style="width: 800px; height: 600px"></div>
    </el-card>
</template>

<script>

import echarts from 'echarts';// 导入echarts图标

export default {

  async mounted() {
    //  1 初始化echarts实例
    const myChart = echarts.init(this.$refs.div); // this.$refs.div 就是获取dom元素 也就是那个div

    // 2 准备option   发送异步请求，获取图片数据 也就是图表的数据
    // reports/type/1
    const response = await this.$http.get('reports/type/1');

    let option = response.data.data; // 这个是图标的数据 直接放到option中 展示图表的基本功能 但是有一些功能的缺失 要把缺失的和这个基本的合并起来

    // 这个是图表缺失的一些功能
    const data = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }

    };
    // 要把缺失的和这个基本的合并起来  但是基本的那个 必须用let声明
    option = {...option, ...data};

    // 设置xAxis 中的 boundaryGap : false,
    option.xAxis[0].boundaryGap = false;

    // 2 准备option 这个是写死的图表展示
    //    const option = {
    //     xAxis: {
    //         type: 'category',
    //         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    //     },
    //     yAxis: {
    //         type: 'value'
    //     },
    //     series: [{
    //         data: [820, 932, 901, 934, 1290, 1330, 1320],
    //         type: 'bar'
    //     }]
    // };

    //  3 设置option 储存图表数据option
    myChart.setOption(option);
  }
};
</script>

<style>

</style>
