<template>
  <div id="echartsDom"></div>
</template>
<script>
import echarts from "echarts";
function isValidOption(option) {
  return (
    isObject(option) &&
    !isEmptyObject(option) &&
    hasSeriesKey(option) &&
    isSeriesArray(option) &&
    !isSeriesEmpty(option)
  );
}

function isObject(option) {
  return Object.prototype.isPrototypeOf(option);
}

function isEmptyObject(option) {
  return Object.keys(option).length === 0;
}

function hasSeriesKey(option) {
  return !!option["series"];
}

function isSeriesArray(option) {
  return Array.isArray(option["series"]);
}

function isSeriesEmpty(option) {
  return option["series"].length === 0;
}
export default {
  name: "echarts",
  props: {
    option: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      myEcharts: ""
    };
  },
  mounted() {
    //# 1. 获取一个用于挂在 echarts 的 DOM 元素
    let $echartsDOM = document.getElementById("echartsDom");
    //# 2. 初始化
    let myEcharts = echarts.init($echartsDOM);
    //# 3. 设置配置项    let option = {...}
    //# 4. 为 echarts 指定配置   myEcharts.setOption(option)
    this.myEcharts = myEcharts;
    this.checkAndSetOption();
  },
  watch: {
    option(option) {
      this.checkAndSetOption();
    }
  },
  methods: {
    checkAndSetOption() {
      let option = this.option; //配置等于父组件传过来的数据
      if (isValidOption(option)) {
        this.myEcharts.setOption(option); //渲染出来
        this.myEcharts.hideLoading(); //隐藏加载动画
      } else {
        this.myEcharts.showLoading(); //加载动画
      }
    }
  }
};
</script>
