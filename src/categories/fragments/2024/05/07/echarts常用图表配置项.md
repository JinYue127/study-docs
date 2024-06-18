---
title: echarts常用图表配置项
author: JinYue
date: 2024/05/07 18:00
categories:
  - 杂碎逆袭史
tags:
  - Echarts
  - 代码片段
---

# echarts常用图表配置项

## 饼图

### 示例

![example-pie](/study-docs/echarts/example-pie1.png)

### 配置项

```ts
const options: EChartsOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '0',
    left: '0',
    icon: "circle",
    type: 'scroll'
  },
  series: [
    {
      name: 'pieCharts',
      type: 'pie',
      radius: ['20%', '60%'],
      center: ['40%', '60%'],//调整图像的位置
      avoidLabelOverlap: false,
      padAngle: 2,
      label: {
        formatter: (params) => {
          // console.log(params, 'pp')
          // return `{circle|●}` + `${params.name}\n${params.value}\n\n`;
          return `{label|${params.name}}\n{value|${params.value.toLocaleString()}}\n\n`;
        },
        lineHeight: 15,
        rich: {
          circle: {
            height: 12, // 圆圈的大小，可根据需要调整
            width: 12,
            padding: [0, 0], // 确保圆圈紧凑，无额外边距
            borderRadius: '50%', // 确保形状为圆形
          },
          label: {
            color: '#595959',
            fontSize: 12,
            fontWeight: 400,
          },
          value: {
            color: '#8C8C8C',
            fontSize: 12,
            fontWeight: 400,
          }
        },
        padding: [0, -50]
      },
      labelLine: {
        length: 30,// 改变标示线的长度
        length2: 80,
        lineStyle: {
          color: '#DFDFDF',// 改变标示线的颜色
        },
      },
      data: [
        {value: 1048, name: '机制1'},
        {value: 735, name: '机制2'},
        {value: 580, name: '机制3'},
        {value: 484, name: '机制4'},
        {value: 300, name: '机制5'},
        {value: 1048, name: '机制6'},
        {value: 735, name: '机制7'},
        {value: 580, name: '机制8'},
        {value: 484, name: '机制9'},
        {value: 300, name: '机制10'}
      ]
    },
    {
      name: '招募人数占比',
      type: 'pie',
      radius: ['20%', '60%'],
      center: ['40%', '60%'],//调整图像的位置
      avoidLabelOverlap: false,
      padAngle: 2,
      label: {
        position: 'inner',
        formatter: "{d}%",
        color: '#fff',
        fontSize: 12,
        fontWeight: 500,
      },
      labelLine: {
        show: false
      },
      data: [
        {value: 1048, name: '机制1'},
        {value: 735, name: '机制2'},
        {value: 580, name: '机制3'},
        {value: 484, name: '机制4'},
        {value: 300, name: '机制5'},
        {value: 1048, name: '机制6'},
        {value: 735, name: '机制7'},
        {value: 580, name: '机制8'},
        {value: 484, name: '机制9'},
        {value: 300, name: '机制10'}
      ]
    }
  ]
};

```

## 柱状图

### 示例

![example-pie](/echarts/example-bar1.png)

### 配置项

```js
const options: EChartsOption = {
  grid: {
    left: 50,
    top: '5%',
    bottom: 24
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: true,
      lineStyle: {
        color: "#C9CDD4",
      }
    },
    axisLabel: {//x轴文字的配置
      show: true,
    },
    axisTick: {
      show: false // 不显示坐标轴刻度线
    },
    data: ['机制1', '机制2', '机制3', '机制4', '机制5', '机制6', '机制7', '机制8', '机制9', '机制10'],
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130, 0, 777, 8],
      type: 'bar',
      barWidth: 50,
      itemStyle: {
        color: '#355D96'
      },
      label: {
        show: true,
        position: 'top',
        formatter: (params) => {
          return `{value|${params.value.toLocaleString()}}`;
        },
        rich: {
          value: {
            padding: [5, 11, 2, 11],
            fontWeight: 400,
            fontSize: 12,
            color: 'rgba(0,0,0,0.88)',
            borderRadius: 3,
            backgroundColor: '#fff',
            // 阴影颜色
            shadowColor: 'rgba(0, 0, 0, 0.12)',
            // 阴影模糊程度
            shadowBlur: 6,
            // 阴影水平偏移
            shadowOffsetX: 0,
            // 阴影垂直偏移
            shadowOffsetY: 3,
          }
        },
      }
    }
  ]
};
```
