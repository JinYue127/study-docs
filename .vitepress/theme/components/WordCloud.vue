<template>
  <div id="word-cloud-container"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
require('echarts-wordcloud');
import {onBeforeUnmount, onMounted} from "vue";

const props = defineProps({
  dataList: {
    type: Array,
    required: true,
    default: () => [],
  },
});

let chartInstance;

const initChart = () => {
  chartInstance = echarts.init(document.getElementById("word-cloud-container")) // 可以设置主题色'dark'
  const option = {
    tooltip: {
      show: true
    },
    series: [{
      //全局文本样式
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        // Color可以是一个回调函数或一个颜色字符串
        color: function () {
          // Random color
          return 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')';
        }
      },
      emphasis: {
        focus: 'self',

        textStyle: {
          // textShadowBlur: 10,
          // textShadowColor: '#333'
        }
      },
      gridSize: 20,

      //设置为true，允许文字部分在画布外绘制。
      //允许绘制大于画布大小的单词
      //从echarts-wordcloud@2.1.0开始支持此选项
      drawOutOfBound: false,

      //如果字体太大而无法显示文本，
      //是否收缩文本。如果将其设置为false，则文本将不渲染。如果设置为true，则文本将被缩小。
      //从echarts-wordcloud@2.1.0开始支持此选项
      shrinkToFit: true,

      // 执行布局动画。当有大量的单词时，关闭它会导致UI阻塞。
      layoutAnimation: true,
      type: 'wordCloud',
      rotationRange: [0, 0],
      textPadding: 0,
      shape: 'circle',
      width: '100%',
      height: '100%',
      sizeRange: [14, 35],
      data: props.dataList,
    }],
  };
  // 添加词的点击事件处理函数

  // chartInstance.on('click', function () {
  //   console.log('click')
  // });
  //随着屏幕大小调节图表
  window.addEventListener("resize", () => {
    chartInstance.resize();
  });
  chartInstance.setOption(option);
};

const disposeChart = () => {
  window.removeEventListener("resize", () => {
    chartInstance.resize();
  });
  chartInstance?.dispose()
}
onMounted(initChart);

onBeforeUnmount(disposeChart);
</script>

<style scoped>
</style>
