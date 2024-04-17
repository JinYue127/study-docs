## 选项卡

### 具有非共享选择状态的选项卡

:::tabs
== tab a
a content
== tab b
b content
:::

```markdown
:::tabs
== tab a
a content
== tab b
b content
:::
```

### 具有共享选择状态的选项卡

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
