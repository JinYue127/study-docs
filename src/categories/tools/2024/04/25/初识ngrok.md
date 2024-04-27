---
title: 初识ngrok
author: JinYue
date: 2024/04/25 10:05
categories:
  - 工具四海谈
tags:
  - 内网穿透
---

# 初识 **ngrok**

> [ngrok](https://ngrok.com/docs/) 是一款开源的网络服务，能够为在本地运行的网络应用提供公开的、基于互联网的URL。这使得网络开发人员可以将自己正在开发的网页或者API暴露到互联网上，方便进行演示、测试和共享等。

## 快速入门(windows)

**step1:** `Install` 在管理员命令提示符下运行此命令。

```bash
scoop install ngrok
```

**Step 2:** 关联您的帐户
在终端中运行以下命令以安装 `authtoken` 并将 `ngrok` 代理连接到您的帐户。

```bash
ngrok config add-authtoken <TOKEN>
```

**Step 3:** 将应用上线
通过运行以下命令启动 ngrok。

```bash
ngrok http http://localhost:8080
```

我们假设您有一个正在侦听 `http://localhost:8080` 的 `Web` 应用程序。如果您的应用正在侦听其他 `URL`，请更改上述命令以匹配。
您将在终端中看到类似于以下控制台 `UI` 的内容。

```text
ngrok
Full request capture now available in your browser: https://ngrok.com/r/ti
Session Status                online
Account                       jinyue0127@gmail.com (Plan: Free)
Version                       3.9.0
Latency                       298ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://f2c6-123-185-223-165.ngrok-free.app -> http://localhost:5173
Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

在浏览器中打开转发 `URL`，您将看到 `Web` 应用程序。
![img](https://jiny127.oss-cn-hangzhou.aliyuncs.com/typora/img.png)
**Step 4:** 始终使用同一域
如果要在每次使用 `ngrok` 时都保持相同的 `URL`，请在仪表板上创建一个静态域，然后使用该 `--domain` 标志要求 `ngrok`
代理使用它。首先，停止 `Ctrl+C` ngrok，然后再次运行 ngrok：

```bash
ngrok http 8080 --domain jumpy-red-mollusk.ngrok-free.app
```

**Step 5:** 保护应用
您可能不希望每个人都能够访问您的应用程序。`Ngrok`
可以在不进行任何更改的情况下快速将身份验证添加到您的应用。如果您的 `Google` 帐户是 `alan@example.com`
，您可以通过运行 `ngrok` 来限制自己的访问：

```bash
ngrok http http://localhost:8080 --oauth=google --oauth-allow-email=alan@example.com
```

任何访问您的应用的人都会被提示使用 `Google` 登录，并且只允许您访问该应用程序。请记住，当您重新启动 `ngrok` 时，如果您未指定应用的
URL 已更改 `--domain` 的标志，请务必访问新的标志。
如果您没有 `Google` 帐户，或者想要更简单的身份验证形式，则可以使用用户名和密码来保护您的应用，如下所示：

```bash
ngrok http http://localhost:8080 --basic-auth 'username:a-very-secure-password'
```
