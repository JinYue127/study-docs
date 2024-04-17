## Mermaid

它是一个基于 JavaScript 的图表绘制工具，可渲染 Markdown 启发的文本定义以动态创建和修改图表。

> 如果你熟悉 `Markdown`，那么学习 [Mermaid](https://mermaid.nodejs.cn/)  的语法 应该没有问题。

### 流程图

```mermaid
graph TD
;
    A --> B;
    A --> C;
    B --> D;
    C --> D;

```

### 时序图

```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice ->> John: Hello John, how are you?
    loop HealthCheck
        John ->> John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John -->> Alice: Great!
    John ->> Bob: How about you?
    Bob -->> John: Jolly good!

```

### 甘特图

```mermaid
gantt
    dateFormat YYYY-MM-DD
    title Adding GANTT diagram to mermaid
    excludes weekdays 2014-01-10

    section A section
        Completed task: done, des1, 2014-01-06, 2014-01-08
        Active task: active, des2, 2014-01-09, 3d
        Future task: des3, after des2, 5d
        Future task2: des4, after des3, 5d

```

### 类图

```mermaid
classDiagram
    Class01 <|-- AveryLongClass: Cool
    Class03 *-- Class04
    Class05 o-- Class06
    Class07 .. Class08
    Class09 --> C2: Where am i?
    Class09 --* C3
    Class09 --|> Class07
    Class07: equals()
    Class07: Object[] elementData
    Class01: size()
    Class01: int chimp
    Class01: int gorilla
    Class08 <--> C2: Cool label

```

### Git 图

```mermaid
    gitGraph
    commit
    commit
    branch develop
    commit
    commit
    commit
    checkout main
    commit
    commit

```

### 实体关系图

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER: places
    ORDER ||--|{ LINE-ITEM: contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS: uses


```

### 用户旅程图

```mermaid
journey
    title My working day
    section Go to work
        Make tea: 5: Me
        Go upstairs: 3: Me
        Do work: 1: Me, Cat
    section Go home
        Go downstairs: 5: Me
        Sit down: 5: Me

```

### 象限图

```mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]

```

### XY 图表

```mermaid
xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]

```

......
