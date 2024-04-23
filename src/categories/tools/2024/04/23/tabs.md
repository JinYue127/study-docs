---
title: 选项卡
author: JinYue
date: 2024/04/23 11:43
categories:
 - 工具四海谈
tags:
 - Markdown
 - 选项卡
---

## 选项卡

### 具有非共享选择状态的选项卡

**输入**

```markdown
:::tabs
== tab a
a content
== tab b
b content
:::
```

**输出**
:::tabs
== tab a
a content
== tab b
b content
:::

### 具有共享选择状态的选项卡

**输入**

```markdown
:::tabs key:ab
== tab a
a content
== tab b
b content
:::

:::tabs key:ab
== tab a
a content 2
== tab b
b content 2
:::

```

**输出**
:::tabs key:ab
== tab a
a content
== tab b
b content
:::

:::tabs key:ab
== tab a
a content 2
== tab b
b content 2
:::
