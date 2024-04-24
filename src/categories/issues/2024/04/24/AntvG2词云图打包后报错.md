---
title: AntvG2词云图打包后报错
author: JinYue
date: 2024/04/24 16:44
categories:
  - Bug万象集
tags:
  - AntvG2
  - build
---

# 解决 AntvG2词云图打包后报错

## 踩坑

在使用 `antvG2` 词云图图表进行 `build` 时，发现报错:

```text
Error [ERR_REQUIRE_ESM]: require() of ES Module
/home/project/node_modules/d3-interpolate/src/index.js from
/home/project/node_modules/@antv/g-base/lib/animate/timeline.js not supported.
```

## 解决办法

在 `package.json` 文件中添加下面的配置

```json
{
  "type": "module",
  "overrides": {
    "@antv/g-base": "0.5.11",
    "@antv/path-util": "2.0.15",
    "@antv/attr": "0.3.5"
  }
}

```
