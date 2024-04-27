---
title: 初识Scoop
author: JinYue
date: 2024/04/25 13:38
categories:
  - 工具四海谈
tags:
  - 包管理工具
---

# 初识 **Scoop**

> [Scoop](https://github.com/ScoopInstaller/Scoop) 是一款适用于 `Windows` 平台的命令行软件（包）管理工具。
> 简单来说，就是可以通过命令行工具（`PowerShell`、`CMD` 等）实现软件（包）的安装管理等需求，通过简单的一行代码实现软件的下载、安装、卸载、更新等操作。

## 安装Scoop

在 `PowerShell` 中运行以下命令

```bash
iwr -useb get.scoop.sh | iex
```

它会将 `Scoop` 安装到其默认位置：
`C:\Users\<YOUR USERNAME>\scoop`
如果你需要更改默认的安装目录，则需要在执行以上命令前添加环境变量的定义，通过执行以下命令完成：

``` bash
$env:SCOOP='D:\Applications\Scoop'
[Environment]::SetEnvironmentVariable('SCOOP', $env:SCOOP, 'User')
```

其中目录 `D:\Applications\Scoop` 可根据自己的情况修改。

完成之后，相应位置就会生成一个 `scoop` 文件夹
简单解释下子目录中其他文件夹的含义：

- apps——所有通过scoop安装的软件都在里面。
- buckets——管理软件的仓库，用于记录哪些软件可以安装、更新等信息，默认添加main仓库，主要包含无需GUI的软件，可手动添加其他仓库或自建仓库，具体在推荐软件仓库中介绍。
- cache——软件下载后安装包暂存目录。
- persit——用于储存一些用户数据，不会随软件更新而替换。
- shims——用于软链接应用，使应用之间不会互相干扰，实际使用过程中无用户操作不必细究。

## Scoop常用命令

- search——搜索仓库中是否有相应软件。
- install——安装软件。
- uninstall——卸载软件。
- update——更新软件。可通过scoop update *更新所有已安装软件，或通过scoop update更新所有软件仓库资料及Scoop自身而不更新软件。
- hold——锁定软件阻止其更新。
- info——查询软件简要信息。
- home——打开浏览器进入软件官网。
