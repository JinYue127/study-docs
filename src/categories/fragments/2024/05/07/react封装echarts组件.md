---
title: react封装echarts组件
author: JinYue
date: 2024/05/07 18:00
categories:
  - 杂碎逆袭史
tags:
  - 代码片段
  - Echarts
  - React
---

# react封装echarts组件

## test

```tsx
import {memo, useEffect, useRef} from "react";
import * as echarts from 'echarts';

interface EchartsBoxProps {
  options: echarts.EChartsOption;
}

function EchartsBox({options}: EchartsBoxProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const disposeChart = () => {
    chartInstanceRef.current?.dispose();
  };

  const renderChart = () => {
    chartInstanceRef.current = chartInstanceRef.current || echarts.init(chartRef.current!);
    chartInstanceRef.current.setOption(options);
  };

  const resizeHandler = () => {
    chartInstanceRef.current?.resize();
  };

  useEffect(() => {
    renderChart();
  }, [options]);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      disposeChart();
    };
  }, []);

  return <div style={{height: "100%", width: "100%"}} ref={chartRef}/>;
}

export default memo(EchartsBox);

```


