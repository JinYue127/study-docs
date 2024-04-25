---
title: 使用 starship 统一 cmd, powershell, git bash 等样式
author: JinYue
date: 2024/04/25 14:05
categories:
  - 工具四海谈
tags:
  - 终端美化
---

# 使用 starship 统一 cmd, powershell, git bash 等样式

> [starship](https://starship.rs/zh-CN/)轻量、迅速、客制化的高颜值终端！

## starship 安装配置

推荐使用 `scoop` 安装, 安装命令:

```bash
scoop install starship
```

## 让 powershell 使用 starship 的样式

打开 `powershell` 的配置文件,`C:\Users\<用户名>\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` ,
**如果没有这个文件, 自己新建一个。**

将下面内容拷贝粘贴到配置文件中

```text
 # starship
Invoke-Expression (&starship init powershell)
```

## 让 cmd 使用 starship 的样式

首先需要下载 `clink`, clink 是一个增强 cmd 命令行编辑的软件

可以使用 scoop 安装, 安装命令 `scoop install clink` , 安装完 clink 之后, 默认会修改注册表, 然后在启动 cmd.exe
自动启动 clink (前提是 clink 加入到环境变量中) , 如果没有的话, 则需要手动 inject 一下, 假设 clink.exe
在你的 PATH 环境变量中找到, 执行 `clink autorun install` , 然后执行 `clink autorun show`

然后打开 cmd, 输入 clink info , 如下所示

![image-20240425141855708](https://jiny127.oss-cn-hangzhou.aliyuncs.com/typora/image-20240425141855708.png)
进入 `C:\Users\<用户名>\AppData\Local\clink` 文件夹, 然后创建` starship.lua` 文件, 往里面加入以下内容

```text
-- starship.lua
load(io.popen('starship init cmd'):read("*a"))()
```

## 让 git bash 使用 starship 的样式

在 `%HOMEPATH%` 指代的路径下 (可以在文件浏览器 explore.exe 地址栏中输入 %HOMEPATH%), 创建 `.bashrc` 文件, 将下面内容拷贝粘贴

```text
eval "$(starship init bash)"
```

## starship 配置文件内容

![starship](https://starship.rs/presets/img/pastel-powerline.png)
> 前置要求：在您的终端中安装并启用 [Nerd](https://www.nerdfonts.com/) 字体（示例使用 `Caskaydia Cove Nerd` 字体）

```toml
format = """
[](#9A348E)\
$os\
$username\
[](bg:#DA627D fg:#9A348E)\
$directory\
[](fg:#DA627D bg:#FCA17D)\
$git_branch\
$git_status\
[](fg:#FCA17D bg:#86BBD8)\
$c\
$elixir\
$elm\
$golang\
$gradle\
$haskell\
$java\
$julia\
$nodejs\
$nim\
$rust\
$scala\
[](fg:#86BBD8 bg:#06969A)\
$docker_context\
[](fg:#06969A bg:#33658A)\
$time\
[ ](fg:#33658A)\
"""

# Disable the blank line at the start of the prompt
# add_newline = false

# You can also replace your username with a neat symbol like   or disable this
# and use the os module below
[username]
show_always = true
style_user = "bg:#9A348E"
style_root = "bg:#9A348E"
format = '[$user ]($style)'
disabled = false

# An alternative to the username module which displays a symbol that
# represents the current operating system
[os]
style = "bg:#9A348E"
disabled = true # Disabled by default

[directory]
style = "bg:#DA627D"
format = "[ $path ]($style)"
truncation_length = 3
truncation_symbol = "…/"

# Here is how you can shorten some long paths by text replacement
# similar to mapped_locations in Oh My Posh:
[directory.substitutions]
"Documents" = "󰈙 "
"Downloads" = " "
"Music" = " "
"Pictures" = " "
# Keep in mind that the order matters. For example:
# "Important Documents" = " 󰈙 "
# will not be replaced, because "Documents" was already substituted before.
# So either put "Important Documents" before "Documents" or use the substituted version:
# "Important 󰈙 " = " 󰈙 "

[c]
symbol = " "
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[docker_context]
symbol = " "
style = "bg:#06969A"
format = '[ $symbol $context ]($style)'

[elixir]
symbol = " "
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[elm]
symbol = " "
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[git_branch]
symbol = ""
style = "bg:#FCA17D"
format = '[ $symbol $branch ]($style)'

[git_status]
style = "bg:#FCA17D"
format = '[$all_status$ahead_behind ]($style)'

[golang]
symbol = " "
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[gradle]
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[haskell]
symbol = " "
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[java]
symbol = " "
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[julia]
symbol = " "
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[nodejs]
symbol = ""
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[nim]
symbol = "󰆥 "
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[rust]
symbol = ""
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[scala]
symbol = " "
style = "bg:#86BBD8"
format = '[ $symbol ($version) ]($style)'

[time]
disabled = false
time_format = "%R" # Hour:Minute Format
style = "bg:#33658A"
format = '[ ♥ $time ]($style)'
```
